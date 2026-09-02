  // DEBUG NOTE: If anything breaks, check 3 places first - 1. HTML IDs match the JS, 2. firebase.js file path is correct, 3. Console for red errors

// LINE 3-5: Bring in Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// SECTION 1: FIREBASE SETUP
// LINE 8-13: Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
};

// LINE 15-7: Start Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// SECTION 2: SHOW USER DATA
// LINE 20-30: Check who is logged in and show their name + email
onAuthStateChanged(auth, (user) => {
  if(user){
    const name = user.email.split('@')[0];
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = user.email;
  } else {
    // No one logged in
    window.location.href = "/login.html"; // send back to login
  }
});

// SECTION 3: LOGOUT BUTTON
// LINE 33-38: When logout button is clicked, sign user out and send to login
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "/login.html"; // send back to login
  });
});
    
    
    // TEMP JS FOR DROPDOWN - you can move this to profile.js later
    document.querySelectorAll('.setting-header').forEach(header => {
      header.addEventListener('click', () => {
        const dropdown = header.parentElement;
        dropdown.classList.toggle('active');
      });
    });