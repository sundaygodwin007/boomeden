// 1. CONNECT FIREBASE

// first always import the firebase modules you need from the CDN (Content Delivery Network) instead of downloading it to your computer
// This import initializes the Firebase app so the page can connect to Firebase Authentication.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// This import brings in the auth functions needed for email/password login and for enabling browser session persistence.
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Declare this configuration key in firebase, you can find it in your firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// declare the app and auth variables to connect to firebase by turning them on and off, like a light switch. This is necessary to use firebase authentication features.
// This line creates the Firebase application instance from the config object above.
const app = initializeApp(firebaseConfig);
// This line creates the authentication service object used for email/password login.
const auth = getAuth(app);

// 2. LOGIN FUNCTION   declare the variable loginBtn to get the button element with the id of loginBtn from the HTML document.by telling the document to go and bring in an ID called loginBtn from the button tag. This button will be used to trigger the login process when clicked.
// This line grabs the login button element from the HTML page so a click event can be attached to it.
const loginBtn = document.getElementById('loginBtn');

// This is the event listener for the login button. When the button is clicked, it will execute the function inside the parentheses. like listen to what happens next and when its clicked, then perform this functions
// This event runs when the user clicks the login button and starts the authentication flow.
loginBtn.addEventListener('click', async () => {
    // Read the email value entered by the user in the login form.
    const email = document.getElementById('loginEmail').value;
    // Read the password value entered by the user in the login form.
    const password = document.getElementById('loginPassword').value;

    // THIS IS THE "IF ELSE" PART - CHECK IF EMPTY FIRST AND THEN GIVE A RESPONSE
    // IF aALL FIELDS ARE EMPTY, THEN DISPLAY ALERT MESSAGE AND STOP THE FUNCTION FROM EXECUTING FURTHER
    if(email === "" || password === ""){
        alert("Please fill in all fields");
        return; // stop here
    }

// this is a firebase code to get the email and password from the input fields and check if they match any existing user in the firebase authentication database. If they match, it will log the user in and redirect them to the index.html page. If they don't match, it will display an error message.
// This line tells Firebase to keep the browser session active after the page reloads, so the user does not have to log in again immediately.
await setPersistence(auth, browserLocalPersistence);

// This line asks Firebase to verify the email and password entered by the user.
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Extract the signed-in user object returned by Firebase.
        const user = userCredential.user;

        // Save the current user data in local storage so the interlock page can use it as a fallback session while Firebase auth restores the live session.
        localStorage.setItem('boomedenUser', JSON.stringify({
          uid: user.uid,
          email: user.email
        }));

        // IF SUCCESS then display an alert message and redirect the user to the index.html page. The window.location.href is used to change the current URL to the specified URL, which in this case is "index.html". This will effectively redirect the user to the home page of the application after a successful login.
        alert("Login successful!");


        // REDIRECT ME TO THE LOGIN PAGE
        // check if its a mobile device or a desktop device the person is logging in from 

              if(window.innerWidth < 768){ // if its a mobile device the direct the person straight to the interlock page
        window.location.href = "../interlock/interlock.html"; 

         // if its not a mobile then direct the person to the dashboard
      }else{
        window.location.href = "../ecosystem/ecosystem.html"; 
      }
      })
      .catch((error) => {
        // IF ERROR / ELSE
        alert("Login failed: " + error.message);
      });
}); // <-- ADDED: This closes the login function

      
document.getElementById('forgotPassword').addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value; // CHANGED: was 'email'
  
  if(!email){
    alert("Please enter your email first");
    return;
  }

  // CHANGED: Just redirect to forgot password page. No email sending here
  window.location.href = "forgot.html";
});