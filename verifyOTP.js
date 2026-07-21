// Firebase Setup
  //  same firebase configuration that i only get from firebase
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

    // declared a variable called email and asked it to get Item from the local store using the localStorage.getItem ("resetEmail")
    // FIXED: Now check if it's signup or forgot first
    const purpose = localStorage.getItem("otpPurpose");
    const email = purpose === "signup" ? localStorage.getItem("signupEmail") : localStorage.getItem("resetEmail");

    // asked the document to get the element with the Id of verifyBtn (which is the Id name i gave the button) and perform the following function
    document.getElementById('verifyBtn').onclick = async function() {

const enteredOtp = document.getElementById('otpInput').value;

// if notOTP is entered it should show an alert saying enter OTP
if(!enteredOtp){ alert("Enter OTP"); return; }

// ===== NEW: CHECK IF THIS IS SIGNUP FIRST =====
if(purpose === "signup"){
  const realOTP = localStorage.getItem('generatedOTP'); // check for the generated otp for sign up in the database
  const expiryTime = localStorage.getItem('otpExpiry'); //  check for the expiry time of the otp in the database
  
// if the otp has expired then display an alert that says this OTP Expired. Please request a new one.
  if(Date.now() > expiryTime){
    alert("OTP Expired. Please request a new one.");
    return;
  }
  
  // if the otp inputed by the user corresponds to the one in the database the display an alert message saying OTP Verified! ✅
  if(enteredOtp == realOTP){
    alert("OTP Verified! ✅");
    // CREATE ACCOUNT IN FIREBASE HERE BEFORE REDIRECT
    try {
      const tempUser = JSON.parse(localStorage.getItem('tempUserData'));
      // added check to prevent crash if tempUser is null
      if(!tempUser){ alert("No user data found. Go back to signup"); return; }
      
      await db.collection("users").doc(tempUser.email).set(tempUser);
      localStorage.removeItem('tempUserData'); // clear temp data
      localStorage.removeItem('generatedOTP');
      localStorage.removeItem('otpExpiry');
      
      // takes the user to the dashboard after signup is complete
      window.location.href = "dashboard.html"; 
    } catch(error) {
      alert("Error saving account: " + error.message);
    }
  } else {
    alert("Wrong OTP. Try again.");
  }
  return; // THIS STOPS IT FROM RUNNING FIREBASE CODE BELOW
}
// ===== END NEW CODE =====

      // declared a variable called doc and ask it to crosscheck the database to see if the OTP correspond or exist
      const doc = await db.collection("otps").doc(email).get();
      
      // if it doesnt exist or has expired then send an alert of OTP expired or not found
      if(!doc.exists){ alert("OTP Expired or Not Found"); return; }

      // declared a variable called data
      const data = doc.data();
      
      // if the current time is greater/morethan the current time of the data
      if(Date.now() > data.expiresAt){

        // send an alert message saying OTP Expired. please request a new one
        alert("OTP Expired. Please request a new one.");
        return;
      }

      // if the data from the firebase correspond with the current OTP and time is within the 5minutes
      if(data.code == enteredOtp){

        // display an alert saying OTP verified
        alert("OTP Verified! ✅");
       // CHECK IF THIS WAS FOR SIGNUP OR FORGOT
        // removed duplicate signup check here because we already handled it above
        // FORGOT: go to reset password
        window.location.href = "reset-password.html"; 
        
      } else {
        
        // if it doesnt correspond then display an alert saying wrong OTP
        alert("Wrong OTP. Try again.");
      }

    }

  // declared a variable here giving it let because the countdowntimer do change
  let countdownTimer;

  // document should get me the element with the Id name of resendBtn which i gave it in the HTML document and perform the function givin to it
document.getElementById('resendBtn').onclick = async function() {

  // declared a variable called email and asked it to get the item called resetEmail from the local firebase database
  // FIXED: Get correct email based on purpose
  const purpose = localStorage.getItem("otpPurpose");
  const email = purpose === "signup" ? localStorage.getItem("signupEmail") : localStorage.getItem("resetEmail");

  // if no email inputed then it should send an alert message of ("No email found. Go back to forgot page")
  if(!email){ alert("No email found. Go back to forgot page"); return; }

  // 1. GENERATE NEW OTP
  // declared a new variable called newOtp and used the math.floor to generate numbers below 100000 and used the +math.random to make the numbers random
  const newOtp = Math.floor(100000 + Math.random() * 900000);

  // declared a new variable called expiresAt and use the Date.now to make sure the time for the OPT sent doesnt exceed 5minutes and if it does then it should b expired
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // FIXED: If signup, resend via EmailJS. If forgot, resend via Firebase
  if(purpose === "signup"){
    emailjs.send(
      "service_oo5adci",
      "template_sh4mbi3",
      { to_email: email, otp_code: newOtp },
      "aWtF4GeY9bMwSDynC"
    ).then(() => {
      localStorage.setItem('generatedOTP', newOtp);  // this shoud check for the new generated otp in the database if it corresponds
      localStorage.setItem('otpExpiry', expiresAt); // this should check for the expiry time of the otp in the database
      alert("New OTP sent to " + email + " ✅"); // display succes alert that says otp sent to the user email
    }).catch((err) => alert("Email Error: " + err.text));
  } else {
    // 2. SAVE TO FIREBASE - overwrites the old one
    // this should save to firebase and overwrites the old otps there as the current one
    await db.collection("otps").doc(email).set({
      code: newOtp,
      expiresAt: expiresAt
    });
    alert("New OTP sent to " + email + " ✅");
  }
  
  // 3. START 30 SECOND COUNTDOWN
  // this should start the count dont before you can request for a new code
  startCountdown(30);
}

// it should execute this functions called startCountdown
function startCountdown(seconds) {

  // declared a variable called btn and asked the document to get the element with the Id called resendBtn from the Html document
  const btn = document.getElementById('resendBtn');

  // declared a variable called countEl and asked the document to get the element from the html document with the Id called countdown
  const countdownEl = document.getElementById('countdown');
  btn.disabled = true; // disable button
  
  // Declared the variable called timeLeft and used let cos the Variable is changing
  let timeLeft = seconds;
  countdownEl.innerText = `(${timeLeft}s)`;
  
  countdownTimer = setInterval(() => {
    timeLeft--;
    countdownEl.innerText = `(${timeLeft}s)`;
    
    // if the time is less than 0 it should display the button again
    if(timeLeft <= 0){
      clearInterval(countdownTimer);
      btn.disabled = false; // enable button again
      countdownEl.innerText = "";
    }
  }, 1000);
}

// Start countdown automatically when page loads so they can't spam immediately
startCountdown(30);