const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");
admin.initializeApp();

const db = admin.firestore();
const emailServiceId = "service_oo5adci";
const emailTemplateId = "template_sh4mbi3";
const emailPublicKey = "aWtF4GeY9bMwSDynC";

// this creates a one-way value so the real OTP is never stored in Firestore.
function hashValue(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// this prevents unlimited OTP requests and keeps the custom reset flow server-controlled.
exports.requestPasswordOtp = functions.https.onCall(async (data) => {
  const email = String(data?.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new functions.https.HttpsError("invalid-argument", "Enter a valid email address.");
  }

  const genericResponse = { message: "If that account exists, a verification code has been sent." };
  let user;
  try {
    user = await admin.auth().getUserByEmail(email);
  } catch (error) {
    return genericResponse;
  }

  const requestRef = db.collection("password_reset_requests").doc(hashValue(email));
  const currentRequest = await requestRef.get();
  if (currentRequest.exists) {
    const lastSentAt = currentRequest.data().lastSentAt || 0;
    if (Date.now() - lastSentAt < 60 * 1000) {
      throw new functions.https.HttpsError("resource-exhausted", "Please wait before requesting another code.");
    }
  }

  const otp = String(crypto.randomInt(100000, 1000000));
  await requestRef.set({
    email,
    uid: user.uid,
    otpHash: hashValue(otp),
    expiresAt: Date.now() + 5 * 60 * 1000,
    lastSentAt: Date.now(),
    attempts: 0
  });

  const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: emailServiceId,
      template_id: emailTemplateId,
      user_id: emailPublicKey,
      template_params: { to_email: email, otp_code: otp }
    })
  });

  if (!emailResponse.ok) {
    await requestRef.delete();
    throw new functions.https.HttpsError("internal", "The verification email could not be sent.");
  }

  return genericResponse;
});

// this verifies the OTP on the server and returns a short-lived one-time reset ticket.
exports.verifyPasswordOtp = functions.https.onCall(async (data) => {
  const email = String(data?.email || "").trim().toLowerCase();
  const otp = String(data?.otp || "").trim();
  const requestRef = db.collection("password_reset_requests").doc(hashValue(email));
  const requestSnapshot = await requestRef.get();
  const request = requestSnapshot.data();

  if (!requestSnapshot.exists || request.expiresAt < Date.now()) {
    throw new functions.https.HttpsError("deadline-exceeded", "This code has expired. Request a new one.");
  }
  if ((request.attempts || 0) >= 5) {
    throw new functions.https.HttpsError("resource-exhausted", "Too many attempts. Request a new code.");
  }
  if (hashValue(otp) !== request.otpHash) {
    await requestRef.update({ attempts: (request.attempts || 0) + 1 });
    throw new functions.https.HttpsError("unauthenticated", "That verification code is incorrect.");
  }

  const ticket = crypto.randomBytes(32).toString("hex");
  await db.collection("password_reset_tickets").doc(hashValue(ticket)).set({
    uid: request.uid,
    email,
    expiresAt: Date.now() + 10 * 60 * 1000
  });
  await requestRef.delete();
  return { ticket };
});

// this changes the password only when the server has already issued a valid reset ticket.
exports.confirmPasswordOtpReset = functions.https.onCall(async (data) => {
  const ticket = String(data?.ticket || "");
  const newPassword = String(data?.newPassword || "");
  if (newPassword.length < 6) {
    throw new functions.https.HttpsError("invalid-argument", "Password must be at least 6 characters long.");
  }

  const ticketRef = db.collection("password_reset_tickets").doc(hashValue(ticket));
  const ticketSnapshot = await ticketRef.get();
  const resetTicket = ticketSnapshot.data();
  if (!ticketSnapshot.exists || resetTicket.expiresAt < Date.now()) {
    throw new functions.https.HttpsError("unauthenticated", "This reset session has expired.");
  }

  await admin.auth().updateUser(resetTicket.uid, { password: newPassword });
  await ticketRef.delete();
  return { success: true };
});