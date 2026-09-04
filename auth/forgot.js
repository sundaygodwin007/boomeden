// this connects the forgot-password page to Firebase Auth's built-in secure reset email.
const firebaseConfig = {
  // this must match the Firebase config used by login.js and signup.js.
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// this starts Firebase Auth before the reset button below tries to send an email.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// this connects the script to the email input and button in auth/forgot.html.
const emailInput = document.getElementById('resetEmail');
const sendResetButton = document.getElementById('sendResetBtn');

// this sends a secure Firebase link that returns the user to the password form on this website.
sendResetButton.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email) {
    alert('Enter your email first.');
    return;
  }

  const actionCodeSettings = {
    url: `${window.location.origin}/auth/resetpassword.html`,
    handleCodeInApp: true
  };

  sendResetButton.disabled = true;
  try {
    await auth.sendPasswordResetEmail(email, actionCodeSettings);
    // this tells the user that Firebase sent the email and reminds them to check Spam before leaving the page.
    alert('Password reset email sent to ' + email + '. Please check your inbox and Spam folder.');

    // this replaces auth/forgot.html with login.html after the user dismisses the confirmation message.
    window.location.replace('login.html');
  } catch (error) {
    sendResetButton.disabled = false;
    // this shows the Firebase error code so the matching Console setting can be found quickly.
    alert(`Unable to send reset email.\nCode: ${error.code || 'unknown'}\nMessage: ${error.message}`);
  }
});
