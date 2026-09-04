// This line imports the Firebase app setup module.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// This line imports the Firebase authentication tools we need.
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// This comment marks the start of the Firebase setup section.
// This object stores the project details so the app knows which Firebase project it belongs to.
const firebaseConfig = {
  // This key is the public API key for connecting the app to Firebase.
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",

  // This tells Firebase which domain is allowed to use authentication.
  authDomain: "boomer-431e6.firebaseapp.com",

  // This is the project ID in Firebase.
  projectId: "boomer-431e6",

  // This is the bucket for uploaded files like images.
  storageBucket: "boomer-431e6.firebasestorage.app",

  // This ID helps Firebase know which app is sending messages.
  messagingSenderId: "481343133195",

  // This is the unique identifier for this web app.
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// This line starts Firebase for the page.
const app = initializeApp(firebaseConfig);

// This line creates the authentication object we will use to check login status.
const auth = getAuth(app);

// This line finds the create post box so we can show or hide it for guest users.
const createPostBox = document.getElementById('createPostBox');

// This line finds the guest banner so guests can see the sign-up message.
const guestBanner = document.getElementById('guestBanner');

// This line finds the mobile create post box when viewing on small screens.
const createPostBoxMobile = document.getElementById('createPostBoxMobile');

// This line finds the mobile guest banner so the same logic works on phones.
const guestBannerMobile = document.getElementById('guestBannerMobile');

// This line finds the #authBtn button from interlock.html so we can change it between Sign In and Log Out.
const authBtn = document.getElementById('authBtn') || document.querySelector('.btn-signin');

// This line finds every item that should appear only after login.
const loggedOnlyItems = document.querySelectorAll('.logged-only, .bottom-logged-only');

// This line reads the saved user from localStorage so the page can remember login state.
const fallbackUser = JSON.parse(localStorage.getItem('boomedenUser') || 'null');

// This function updates the layout depending on whether a user is logged in.
function updateGuestUi(user) {
  // This line turns the user object into a true/false value.
  const isLoggedIn = Boolean(user);

  // This line hides the desktop post composer for guests.
  if (createPostBox) createPostBox.style.display = isLoggedIn ? 'block' : 'none';

  // This line shows or hides the guest banner on desktop.
  if (guestBanner) guestBanner.style.display = isLoggedIn ? 'none' : 'block';

  // This line hides the mobile composer for guests.
  if (createPostBoxMobile) createPostBoxMobile.style.display = isLoggedIn ? 'block' : 'none';

  // This line shows or hides the guest banner on mobile.
  if (guestBannerMobile) guestBannerMobile.style.display = isLoggedIn ? 'none' : 'block';

  // This loop hides or shows items that should only appear after login.
  loggedOnlyItems.forEach((item) => {
    // This line sets each item to flex when signed in, and removes it when guest.
    item.style.display = isLoggedIn ? 'flex' : 'none';
  });

  // This condition changes the top button text to Log Out if the user is signed in.
  if (authBtn) {
    // This line changes the button label based on the login state.
    // this keeps the auth control visible so a signed-in user can log out and test the guest flow.
    authBtn.style.display = 'inline-flex';
    authBtn.textContent = isLoggedIn ? 'Log Out' : 'Sign In';
  }
}

// This line runs the UI update immediately using saved login data.
updateGuestUi(fallbackUser);

// This listener watches Firebase auth state and updates the page whenever login changes.
onAuthStateChanged(auth, (user) => {
  // This condition runs when a user is actually logged in.
  if (user) {
    // This line saves a lightweight version of the user to localStorage.
    localStorage.setItem('boomedenUser', JSON.stringify({
      // This stores the Firebase user ID.
      uid: user.uid,

      // This stores the email address for later use.
      email: user.email
    }));

    // This line updates the page using the logged-in user object.
    updateGuestUi(user);
  } else {
    // This block runs when no user is logged in.
    // This line shows the guest UI after Firebase confirms that no user is signed in.
    localStorage.removeItem('boomedenUser');
    updateGuestUi(null);
  }
});

// This function logs the user out of Firebase and clears their saved session.
async function handleLogout() {
  // This line checks if there is a signed-in user right now.
  const currentUser = auth.currentUser;

  // This condition runs only if the user is logged in.
  if (currentUser) {
    // This line signs the user out from Firebase.
    await signOut(auth);

    // This line removes the saved login from localStorage.
    localStorage.removeItem('boomedenUser');

    // This line refreshes the page so the guest view appears.
    window.location.reload();
  } else {
    // This block runs if no user is logged in.
    // It sends the visitor to the login screen.
    window.location.href = '../auth/login.html';
  }
}

// This condition only attaches the click event if the button exists.
if (authBtn) {
  // This line listens for a click and calls the logout function.
  authBtn.addEventListener('click', handleLogout);
}
