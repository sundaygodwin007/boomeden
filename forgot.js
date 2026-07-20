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
const db = firebase.firestore();




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
  
  // 1. Generate 6 digit OTP ONCE
  // declared a variable called otp and used the javascript code called math.floor to generate a number below and also math.random to generate a random number
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("Generated OTP: " + otp); // for testing
  
  // 2. Send Email FIRST using EmailJS
  // i used the emailjs.send and also ( added the codes i got from emailjs inside the bracket) and then called the email and otp variables
emailjs.send("service_oo5adci", "template_sh4mbi3", {
    to_email: email,
    otp_code: otp
  }).then(() => {
    
    // 3. If email sent successfully, THEN save to Firebase
    // this is to save the otp to the firebase with the date and time 
    return db.collection("otps").doc(email).set({
      code: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000 // 5 mins
    });

    // after saving then perform this function
  }).then(function() {
    alert("OTP Sent to " + email);
    localStorage.setItem("resetEmail", email); 
    localStorage.setItem("boomedOTP", otp); // for quick check 
    window.location.href = "verifyOTP.html";

    // if not successful perform this function
  }).catch(function(error) {
    alert("Error: " + error.message)
  })

}




