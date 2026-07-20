// 1. CONNECT FIREBASE

// first always import the firebase modules you need from the CDN (Content Delivery Network) instead of downloading it to your computer
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 2. LOGIN FUNCTION   declare the variable loginBtn to get the button element with the id of loginBtn from the HTML document.by telling the document to go and bring in an ID called loginBtn from the button tag. This button will be used to trigger the login process when clicked.
const loginBtn = document.getElementById('loginBtn');

// This is the event listener for the login button. When the button is clicked, it will execute the function inside the parentheses. like listen to what happens next and when its clicked, then perform this functions
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // THIS IS THE "IF ELSE" PART - CHECK IF EMPTY FIRST AND THEN GIVE A RESPONSE
    // IF aALL FIELDS ARE EMPTY, THEN DISPLAY ALERT MESSAGE AND STOP THE FUNCTION FROM EXECUTING FURTHER
    if(email === "" || password === ""){
        alert("Please fill in all fields");
        return; // stop here
    }

// this is a firebase code to get the email and password from the input fields and check if they match any existing user in the firebase authentication database. If they match, it will log the user in and redirect them to the index.html page. If they don't match, it will display an error message.
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        // IF SUCCESS then display an alert message and redirect the user to the index.html page. The window.location.href is used to change the current URL to the specified URL, which in this case is "index.html". This will effectively redirect the user to the home page of the application after a successful login.
        alert("Login successful!");
        // REDIRECT ME TO THE LOGIN PAGE
        window.location.href = "login.html";
      })
      .catch((error) => {
        // IF ERROR / ELSE
        alert("Login failed: " + error.message);
      });



      
document.getElementById('forgotPassword').addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  
  if(!email){
    alert("Please enter your email first");
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
    alert("Password reset link sent to your email!");
  })
  .catch((error) => {
    alert(error.message);
  });
});
      
});