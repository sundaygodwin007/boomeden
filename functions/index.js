const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// this old callable reset path is intentionally disabled because password changes must use Firebase's verified reset email flow.
exports.resetPasswordWithOTP = functions.https.onCall(() => {
  throw new functions.https.HttpsError(
    'failed-precondition',
    'Use the Firebase password reset email flow.'
  );
});

// this keeps older clients from reaching an unsafe password-changing endpoint.
exports.sendPasswordReset = exports.resetPasswordWithOTP;