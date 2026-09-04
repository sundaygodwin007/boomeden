// this connects the custom reset page to the secure server-side OTP reset function.
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// this starts Firebase Functions so password changes are checked by the trusted backend.
firebase.initializeApp(firebaseConfig);
const functions = firebase.functions();
const confirmPasswordOtpReset = functions.httpsCallable('confirmPasswordOtpReset');

// these values were created by forgot.js after the server verified the OTP.
const resetTicket = localStorage.getItem('passwordResetTicket');
const resetEmail = localStorage.getItem('passwordResetEmail');
const emailText = document.getElementById('emailText');
const resetButton = document.getElementById('reset');
const loadingText = document.getElementById('loading');

// this connects the reset form inputs to the IDs in auth/resetpassword.html.
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');

// this prevents a visitor from opening the page directly without first verifying an OTP.
if (!resetTicket || !resetEmail) {
  emailText.textContent = 'This password reset session is invalid or expired.';
  resetButton.disabled = true;
} else {
  emailText.textContent = `Resetting password for: ${resetEmail}`;
}

// this submits the new password together with the one-time server ticket.
resetButton.addEventListener('click', async () => {
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;

  if (!resetTicket) return;
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
    await confirmPasswordOtpReset({ ticket: resetTicket, newPassword: password });
    localStorage.removeItem('passwordResetTicket');
    localStorage.removeItem('passwordResetEmail');
    alert('Password changed successfully. Please log in.');
    window.location.href = 'login.html';
  } catch (error) {
    resetButton.disabled = false;
    loadingText.style.display = 'none';
    alert(error.message || 'Unable to change password.');
  }
});
