// this connects the custom reset page to the same Firebase project as login and signup.
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// this starts Firebase Auth so the page can validate the secure reset link.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
const actionCode = params.get('oobCode');
// these selectors connect this script to the matching IDs in auth/resetpassword.html.
// if the form stops responding, check these IDs in that HTML file first.
const emailText = document.getElementById('emailText');
const resetButton = document.getElementById('reset');

// this checks the reset code before allowing the user to choose a new password.
if (mode !== 'resetPassword' || !actionCode) {
  emailText.textContent = 'This password reset link is invalid or incomplete.';
  resetButton.disabled = true;
} else {
  auth.verifyPasswordResetCode(actionCode)
    .then((email) => {
      emailText.textContent = `Resetting password for: ${email}`;
    })
    .catch(() => {
      emailText.textContent = 'This password reset link has expired or was already used.';
      resetButton.disabled = true;
    });
}

// this confirms the new password directly with Firebase after the reset code is verified.
resetButton.addEventListener('click', () => {
  // these two inputs are the password and confirmation fields from resetpassword.html.
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm').value;

  if (!actionCode || resetButton.disabled) return;
  if (password.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  resetButton.disabled = true;
  auth.confirmPasswordReset(actionCode, password)
    .then(() => {
      alert('Password changed successfully. Please log in.');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      resetButton.disabled = false;
      alert('Unable to change password: ' + error.message);
    });
});
