// this connects the forgot-password HTML controls to the secure Firebase Functions OTP flow.
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// this starts Firebase Auth and Functions before the buttons below try to call the backend.
firebase.initializeApp(firebaseConfig);
const functions = firebase.functions();
const requestPasswordOtp = functions.httpsCallable('requestPasswordOtp');
const verifyPasswordOtp = functions.httpsCallable('verifyPasswordOtp');

// these selectors connect this script to the matching controls in auth/forgot.html.
const emailInput = document.getElementById('resetEmail');
const sendOtpButton = document.getElementById('sendOtpBtn');
const otpStep = document.getElementById('otpStep');
const otpInput = document.getElementById('resetOtp');
const verifyOtpButton = document.getElementById('verifyOtpBtn');

// this asks the server to create and email a one-time code without exposing the code to the browser.
sendOtpButton.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email) {
    alert('Enter your email first.');
    return;
  }

  sendOtpButton.disabled = true;
  try {
    await requestPasswordOtp({ email });
    otpStep.style.display = 'block';
    alert('If that account exists, a verification code has been sent.');
  } catch (error) {
    alert(error.message || 'Unable to send the verification code.');
    sendOtpButton.disabled = false;
  }
});

// this verifies the OTP on the server and passes a short-lived ticket to the password page.
verifyOtpButton.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const otp = otpInput.value.trim();
  if (!otp || otp.length !== 6) {
    alert('Enter the 6 digit verification code.');
    return;
  }

  verifyOtpButton.disabled = true;
  try {
    const result = await verifyPasswordOtp({ email, otp });
    localStorage.setItem('passwordResetTicket', result.data.ticket);
    localStorage.setItem('passwordResetEmail', email);
    window.location.href = 'resetpassword.html';
  } catch (error) {
    alert(error.message || 'The verification code could not be confirmed.');
    verifyOtpButton.disabled = false;
  }
});
