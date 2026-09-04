// forgot.js
// Firebase config
// this is a firebase configuration you only get from firebase....
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();




/* 
========== OLD CODE - BROKEN ==========
const firebaseConfig = {...}
firebase.initializeApp(firebaseConfig);
...all your old code here...
emailjs.send("service_oo5adci", "28akoui", {...})

*/





// ONLY ONE CLICK EVENT
// what i said here is document listen to the event called click and get me the id from the html document called sendOtpBtn then perform the following functions
document.getElementById('sendOtpBtn').onclick = function() {

  // declared a variable called email and tell document to get element with the ID called resetEmail
  const email = document.getElementById('resetEmail').value;
  if(!email){ 
    alert("Enter email"); 
    return; 
  }
  
  // this sends a secure reset link that returns the user to your own password page.
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/resetpassword.html`,
    handleCodeInApp: true
  };

  auth.sendPasswordResetEmail(email, actionCodeSettings)
    .then(function() {
      alert("Password reset link sent to " + email);
      window.location.href = "login.html";
    })
    .catch(function(error) {
      alert("Unable to send reset link: " + error.message);
    });

}




