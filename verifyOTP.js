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
    const email = localStorage.getItem("resetEmail");

    // asked the document to get the element with the Id of verifyBtn (which is the Id name i gave the button) and perform the following function
    document.getElementById('verifyBtn').onclick = async function() {

      const purpose = localStorage.getItem("otpPurpose"); // Read the note

      // then ofcourse declared a variable called enteredOtp and then tell de document to get the element to get me the Id of otpInput (which is the input name i gave the input text) from the html document
      const enteredOtp = document.getElementById('otpInput').value;

      // if notOTP is entered it should show an alert saying enter OTP
      if(!enteredOtp){ alert("Enter OTP"); return; }

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
        const purpose = localStorage.getItem("otpPurpose");

        if(purpose === "signup"){
            // SIGNUP: go to dashboard
            window.location.href = "dashboard.html"; 
        } else {
            // FORGOT: go to reset password
            window.location.href = "reset-password.html"; 
        }// Next: let them set new password
        
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
  const email = localStorage.getItem("resetEmail");

  // if no email inputed then it should send an alert message of ("No email found. Go back to forgot page")
  if(!email){ alert("No email found. Go back to forgot page"); return; }

  // 1. GENERATE NEW OTP
  // declared a new variable called newOtp and used the math.floor to generate numbers below 100000 and used the +math.random to make the numbers random
  const newOtp = Math.floor(100000 + Math.random() * 900000);

  // declared a new variable called expiresAt and use the Date.now to make sure the time for the OPT sent doesnt exceed 5minutes and if it does then it should b expired
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes


  // 2. SAVE TO FIREBASE - overwrites the old one
  // this should save to firebase and overwrites the old otps there as the current one
  await db.collection("otps").doc(email).set({
    code: newOtp,
    expiresAt: expiresAt
  });

  // if successful then it should send an alert message saying new OTP sent to the name of the email
  alert("New OTP sent to " + email + " ✅");
  
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
