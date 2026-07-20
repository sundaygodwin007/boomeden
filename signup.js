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
    if(countryCode === "") errors.push("Email");
    if(phoneNumber === "") errors.push("PhoneNumber")
    if(password === "") errors.push("Password");

    // STEP 3: IF THE ERROR LIST IS NOT EMPTY, SHOW IT AND STOP

   if(errors.length > 0){ //this means if the empty boxes not filled are greater than 0...thats 1 and above then it should give back an error message
         alert("Please fill in: " + errors.join(", ")); // give an alert message of please fill in the value missing and the + means the values missing
        return; // STOP THE SIGNUP
    }

    try {
        // STEP 2: CREATE USER IN AUTH
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // STEP 3: SAVE TO FIRESTORE
        // THIS CODE SAVES ALL THIS DETAILS LISTED HERE TO THE FIREBASE STORE
        await setDoc(doc(db, "users", userCredential.user.uid), {
            firstName: firstName,
            lastName: lastName,
            username: username,
            dateofbirth: dateofbirth,
            country: country,
            state: state,
            gender: gender,
            email: email,
            phoneNumber: phoneNumber,
            countryCode: countryCode,
            createdAt: new Date(),
        });

        alert("SIGN UP SUCCESSFUL! WELCOME TO BOOMEDEN.");
        window.location.href = 'login.html'

    } catch (error) {
        alert("ERROR: " + error.message);
    }
});