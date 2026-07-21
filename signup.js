// 1. CONNECT FIREBASE
// telling the browser to use firebase from the CDN (Content Delivery Network) instead of downloading it to your computer
// first always import the firebase modules you need from the CDN (Content Delivery Network) instead of downloading it to your computer
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
function sendOTP(email, password, firstName, lastName, username, dateofbirth, country, state, gender, fullPhone) {

    // this is to generate otp code...first declare the variable called otp inside the function
    const otp = Math.floor(100000 + Math.random() * 900000);  

    // this to to set a timer of when it should expire
const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now in milliseconds

//this to to set a timer of when it should expire in the database of when the code should expire if not it will expire immediately it was sent
localStorage.setItem('generatedOTP', otp);   // <-- this saves the OTP to the database 
localStorage.setItem('otpExpiry', expiryTime); // <-- And this saves the time in which the OTP was generated into the database

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
  firstName, lastName, username, dob, country, state, gender, email, fullPhone, password
}));


    // Only run if email sent successfully
    // SAVE EVERYTHING TO LOCALSTORAGE SO WE CAN USE IT AFTER OTP VERIFICATION
    localStorage.setItem('otpPurpose', 'signup');
    localStorage.setItem('signupEmail', email);
    localStorage.setItem('signupPassword', password);
    localStorage.setItem('signupFirstName', firstName);
    localStorage.setItem('signupLastName', lastName);
    localStorage.setItem('signupUsername', username);
    localStorage.setItem('signupDob', dateofbirth);
    localStorage.setItem('signupCountry', country);
    localStorage.setItem('signupState', state);
    localStorage.setItem('signupGender', gender);
    localStorage.setItem('signupPhone', fullPhone);
    localStorage.setItem('generatedOTP', otp);
    window.location.href = 'verifyOTP.html'; // Go to OTP page, NOT login
  })
.catch((err) => {
  alert("EmailJS Error: " + err.text); // this will tell us why it failed
  console.log(err);
});
}

document.getElementById('signupBtn').addEventListener('click', (e) => {
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

    // STEP 4: SEND OTP FIRST INSTEAD OF CREATING USER
    sendOTP(email, password, firstName, lastName, username, dateofbirth, country, state, gender, fullPhone);

})





// 3 CRITICAL CHANGES THAT FIX "BUTTON NOT CLICKING"
// Changed EmailJS.send to emailjs.send - EmailJS uses small e. Capital E will break everything.
// Moved sendOTP() function ABOVE the button click - so JS knows it exists before calling it.
// Removed async/await - because we aren't creating user yet. Less things to break.