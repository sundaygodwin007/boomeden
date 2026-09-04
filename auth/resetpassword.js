// this connects the custom password page to Firebase Auth's verified reset email code.
const firebaseConfig = {
  // this must match the Firebase config used by login.js and signup.js.
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// this starts Firebase Auth so the page can validate the reset link before changing a password.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
const actionCode = params.get('oobCode');

// these selectors connect this script to the matching IDs in auth/resetpassword.html.
const emailText = document.getElementById('emailText');
const resetButton = document.getElementById('reset');
const loadingText = document.getElementById('loading');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');

// this checks the Firebase reset code before enabling the password form.
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

// this confirms the new password on this website after Firebase verifies the email link.
resetButton.addEventListener('click', async () => {
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;

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
  loadingText.style.display = 'block';
  try {
    await auth.confirmPasswordReset(actionCode, password);
    alert('Password changed successfully. Please log in.');
    window.location.href = 'login.html';
  } catch (error) {
    resetButton.disabled = false;
    loadingText.style.display = 'none';
    alert('Unable to change password: ' + error.message);
  }
});
