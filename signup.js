// 1. CONNECT FIREBASE
// telling the browser to use firebase from the CDN (Content Delivery Network) instead of downloading it to your computer
// first always import the firebase modules you need from the CDN (Content Delivery Network) instead of downloading it to your computer
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// this the configuration key in firebase, you can find it in your firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// declare the app and auth variables to connect to firebase by turning them on and off, like a light switch. This is necessary to use firebase authentication features.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// NOTE I ADDED THE STATES AND COUNTRY INSIDE THE (signBtn) button which i shouldnt have
// declared the states so that when a user selects a country, only the states of that country will be displayed in the state dropdown. This is done by creating an object where each key is a country and its value is an array of states.
  // This is an array of states in each country
const statesByCountry = {
  Nigeria: ["Akwa-Ibom","Lagos", "Abuja FCT", "Kano", "Rivers", "Oyo", "Delta", "Enugu", "Kaduna", "Ogun"],
  USA: ["California", "Texas", "New York", "Florida", "Illinois", "Ohio"],
  UK: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
  Ghana: ["Greater Accra", "Ashanti", "Western Region", "Northern Region"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta"]
};

// STEP 2: LISTEN FOR WHEN COUNTRY CHANGES and select the states of that country to display in the state dropdown. This is done by adding an event listener to the country dropdown that listens for a change event. When a change event occurs, it will get the selected country and then populate the state dropdown with the corresponding states from the statesByCountry object.
// DOCUMENT PLEASE LISTEN FOR AN EVENT CALLED CHANGE AND GET ME THE CURRENT ID OF THE VALUE INSERTED or // DOCUMENT PLEASE LISTEN FOR AN EVENT CALLED CHANGE ON THE COUNTRY DROPDOWN
// WHEN IT CHANGES, GET THE VALUE AND USE IT TO FILL THE STATE DROPDOWN
document.getElementById('country').addEventListener('change', function() {
    const selectedCountry = this.value; // e.g. "Nigeria"
    const stateDropdown = document.getElementById('state');

    // STEP 3: CLEAR THE OLD STATES FIRST BEFORE INPUTING A NEW STATE
    stateDropdown.innerHTML = '<option value="">Select State</option>';

    // STEP 4: IF A COUNTRY WAS PICKED, ADD ONLY ITS STATES
    if(selectedCountry && statesByCountry[selectedCountry]) {
        statesByCountry[selectedCountry].forEach(function(stateName) {
            const option = document.createElement('option');
            option.value = stateName;
            option.text = stateName;
            stateDropdown.appendChild(option); // Add it to the dropdown
        });
    }
});

// PUT sendOTP FUNCTION HERE SO IT'S AVAILABLE GLOBALLY
// added the OTP functio here so that the user gets an OTP code before signing in
function sendOTP(email, password, firstName, lastName, username, dateofbirth, country, state, gender, fullPhone, user) {

    // this is to generate otp code...first declare the variable called otp inside the function
    const otp = Math.floor(100000 + Math.random() * 900000);

    // this to set a timer of when it should expire
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now in milliseconds

  emailjs.send( // notice small e "emailjs" not "EmailJS"
    "service_oo5adci", // 1. SERVICE ID goes here ✅
    "template_sh4mbi3", // 2. TEMPLATE ID
    {
      to_email: email, // 3. USER'S EMAIL goes here ✅
      otp_code: otp // 4. THE OTP
    },
   "aWtF4GeY9bMwSDynC" // ✅ // 4. PUBLIC KEY only, no "YOUR_PUBLIC_KEY:"
  )
.then(() => {

// ALSO SAVE USER DATA TEMPORARILY SO WE CAN CREATE ACCOUNT AFTER OTP
localStorage.setItem('tempUserData', JSON.stringify({
  uid: user.uid, firstName, lastName, username, dob: dateofbirth, country, state, gender, email, fullPhone, password
}));

    // Only run if email sent successfully
    // SAVE EVERYTHING TO LOCALSTORAGE SO WE CAN USE IT AFTER OTP VERIFICATION
    localStorage.setItem('otpPurpose', 'signup');
    localStorage.setItem('signupEmail', email);
    localStorage.setItem('generatedOTP', otp);
    localStorage.setItem('otpExpiry', expiryTime);
    window.location.href = 'verifyOTP.html'; // Go to OTP page, NOT login
  })
.catch(async (err) => {
  // IF EMAIL FAILS, DELETE THE USER WE JUST CREATED
  await deleteDoc(doc(db, "users", user.uid));
  await user.delete();
  alert("EmailJS Error: " + err.text); // this will tell us why it failed
  console.log(err);
});
}

document.getElementById('signupBtn').addEventListener('click', async (e) => {
    e.preventDefault(); // Stops page from refreshing

    // STEP 1: DEFINE ALL VARIABLES - THIS WAS MISSING
    const firstName = document.getElementById('first').value;
    const lastName = document.getElementById('last').value;
    const username = document.getElementById('username').value;
    const dateofbirth = document.getElementById('dob').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;
    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value;
    const countryCode = document.getElementById('countryCode').value; // "+234"
    const phoneNumber = document.getElementById('phoneNumber').value; // "8012345678"
    const fullPhone = countryCode + phoneNumber; // "+2348012345678"

// signInWithPhoneNumber(auth, fullPhone) // Firebase uses this
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value;

    if(password!== confirmPassword ){
        alert("Passwords do not match");
        return;
    }

    const errors = []
    // STEP 2: CHECK EACH FIELD 1 BY 1 AND ADD TO THE LIST IF EMPTY... IT SHOULD RETURN AN ERROR MESSAGE IF ANY OF THE DETAILS IS MISSING
    // erros.push MEANS IT SHOULD RETURN BACK AN ERROR MESSAGE
    if(firstName === "") errors.push("First Name");
    if(lastName === "") errors.push("Last Name");
    if(username === "") errors.push("Username");
    if(dateofbirth === "") errors.push("Age");
    if(country === "") errors.push("Country");
    if(state === "") errors.push("State");
    if(gender === "") errors.push("Gender");
    if(email === "") errors.push("Email");
    if(countryCode === "") errors.push("Country Code");
    if(phoneNumber === "") errors.push("PhoneNumber")
    if(password === "") errors.push("Password");

    // STEP 3: IF THE ERROR LIST IS NOT EMPTY, SHOW IT AND STOP

   if(errors.length > 0){ //this means if the empty boxes not filled are greater than 0...thats 1 and above then it should give back an error message
         alert("Please fill in: " + errors.join(", ")); // give an alert message of please fill in the value missing and the + means the values missing
        return; // STOP THE SIGNUP
    }

// ===== THE REAL CHECK: TRY TO CREATE USER FIRST =====
try {
  // STEP 1: TRY TO CREATE USER IN FIREBASE AUTH
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // STEP 2: IF SUCCESS, CREATE TEMP DOC IN FIRESTORE
  await setDoc(doc(db, "users", user.uid), {
    email: email,
    isVerified: false // will update to true after OTP
  });

  // STEP 3: SEND OTP
  sendOTP(email, password, firstName, lastName, username, dateofbirth, country, state, gender, fullPhone, user);

} catch(error) {
  if(error.code === 'auth/email-already-in-use'){
    // THIS IS WHAT YOU WANTED: ALERT ON SIGNUP PAGE
    alert("Sorry, this email has already been used. Please login or reset password.");
  } else {
    alert("Error: " + error.message);
  }
  console.log(error);
}

});

// ===== ONLY RUN THIS CODE IF WE ARE ON verifyOTP.html =====
if(window.location.pathname.includes('verifyOTP.html')){

// VERIFY OTP FUNCTION - ADD THIS AT THE BOTTOM OF YOUR FILE
// THIS RUNS ON verifyOTP.html PAGE
async function verifyOTP() {
    const enteredOTP = document.getElementById('otpInput').value; // make sure your input has id="otpInput"

    // GET THE SAVED DATA FROM LOCALSTORAGE
    const savedOTP = localStorage.getItem('generatedOTP');
    const otpExpiry = localStorage.getItem('otpExpiry');
    const tempUserData = JSON.parse(localStorage.getItem('tempUserData'));

    // STEP 1: CHECK IF OTP EXPIRED
    if(Date.now() > otpExpiry){
        alert("OTP expired. Please signup again");
        localStorage.clear();
        window.location.href = 'signup.html';
        return;
    }

    // STEP 2: CHECK IF OTP MATCHES
    if(enteredOTP!= savedOTP){
        alert("Invalid OTP. Please try again");
        return;
    }

    // STEP 3: OTP CORRECT. NOW UPDATE USER DATA IN FIRESTORE
    try {
        await setDoc(doc(db, "users", tempUserData.uid), {
            uid: tempUserData.uid,
            firstName: tempUserData.firstName,
            lastName: tempUserData.lastName,
            username: tempUserData.username,
            email: tempUserData.email,
            dob: tempUserData.dob,
            country: tempUserData.country,
            state: tempUserData.state,
            gender: tempUserData.gender,
            phone: tempUserData.phone,
            createdAt: new Date(),
            isVerified: true,
            boomCredits: 0,
            boomScore: 0
        });

        // STEP 4: DELETE OTP FROM LOCALSTORAGE SO IT CAN'T BE REUSED
        localStorage.clear();

        // STEP 5: REDIRECT TO DASHBOARD
        alert("Account created successfully!");
        window.location.href = 'dashboard.html';

    } catch(error){
        alert("Error saving data: " + error.message);
        console.log(error);
    }
}

// ADD THIS LISTENER TO YOUR VERIFY BUTTON ON verifyOTP.html
document.getElementById('verifyBtn').addEventListener('click', verifyOTP);

}