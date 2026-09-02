const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.resetPasswordWithOTP = functions.https.onCall(async (data) => {
  const email = data && data.email;
  const newPassword = data && data.newPassword;

  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required');
  }

  if (!newPassword || newPassword.length < 6) {
    throw new functions.https.HttpsError('invalid-argument', 'New password must be at least 6 characters long');
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });

    return {
      success: true,
      message: 'Password updated successfully.'
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.sendPasswordReset = exports.resetPasswordWithOTP;