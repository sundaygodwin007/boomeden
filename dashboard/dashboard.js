// DEBUG NOTE: If anything breaks, check 3 places first - 1. HTML IDs/classes match the JS, 2. firebase.js file path is correct, 3. Console for red errors

// LINE 1-2: Bring in Firebase
// this is used to import details from firebase....this must be the first code that must me at the top
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// SECTION 1: FIREBASE SETUP
// LINE 3-7: Firebase configuration
// LINE 2: Your Firebase project address. Get this from Firebase Console
// this is my firebase project details so it tells what database storage to use and what project to use
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
};

// LINE 8-9: Start Firebase
// this is used to start the firebase so u declare a variable called app and then write the remaing code
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// SECTION 2: CHECK USER + DISPLAY NAME
// LINE 10-25: Check who is logged in and show their name
// this is used to checked who is logged in and show their name on the dashboard page
onAuthStateChanged(auth, (user) => {
  if(user){

    // We found the user!
    // this is the DOM manipulation...declared a variable called nameSpan and asked it to get the element with the Id of userName from the HTML document. This is used to display the name of the user on the dashboard page.
    const nameSpan = document.getElementById('userName'); // find the <span>
    const name = user.email.split('@')[0]; // get "allroundsuccess21" from email? this is used to get the user email logged in and take everything before @

    // line 48 to 58 is the dom manipulation
    // this is the DOM manipulation which the name apperars in the HTML span
    document.getElementById('userName').textContent = name;

  } else {
    // No one logged in
    window.location.href = "/login.html"; // send back to login
  }
});

// SECTION 3: AVATAR CLICK -> PROFILE PAGE
// LINE 26-28: Make avatar clickable
// telling the document to get the element with the Id of userAvatar and listen to the click function and when the user clicks on the avatar it will redirect to the profile.html page
document.getElementById('userAvatar').addEventListener('click', () => {
  // redirect to profile.html when the avatar is clicked
  window.location.href = '../profile/profile.html';
});

// SECTION 4: DASHBOARD CARDS NAVIGATION

// LINE 29-33: GET THE INTERLOCK CARD FROM THE DASHBOARD
// declared a variable called interlockCard and asked it to get the element with the class of interlock-card from the HTML document. This is used to display the interlock card on the dashboard page.
// use querySelector not getElement cos querySelector is universal and can locate any either Id, class or tags and not just a particular element
// we used.interlock-card because we used querySelector and not getElement so we have to tell it if we are getting a class or Id
const interlockCard = document.querySelector('.interlock-card');

// LINE 34-37: LISTEN FOR WHEN SOMEONE CLICKS THE INTERLOCK CARD
// Gave it a function next cos thats the next thing to do after declaration by telling it to listen to the event called click and perform the function given to it
interlockCard.addEventListener('click', function() {
    // LINE 3: WHEN THE CARD IS CLICKED, REDIRECT TO THE INTERLOCK PAGE
    window.location.href = '../interlock/interlock.html';// used../interlock/interlock.html to locate the html of interlock inside the interlock folder
});

// SECTION 5: GET THE CHAT CARD FROM THE DASHBOARD
// LINE 38-42: declared a variable called chatcard and asked it to get the element with the class of chat-card from the HTML document. This is used to display the chat card on the dashboard page.
// use querySelector not getElement cos querySelector is universal and can locate any either Id, class or tags and not just a particular element
// we used.chatcard because we used querySelector and not getElement so we have to tell it if we are getting a class or Id
const chatCard = document.querySelector('.chat-card');

// LINE 43-46: LISTEN FOR WHEN SOMEONE CLICKS THE CHAT CARD
chatCard.addEventListener('click', function() {
    // LINE 3: WHEN THE CARD IS CLICKED, REDIRECT TO THE CHAT-CARD PAGE
    window.location.href = '../chat/chat.html';// used../chat/chat.html to locate the html of chat inside the chat folder
});

// SECTION 6: GET THE MARKETHUB CARD FROM THE DASHBOARD
// LINE 47-51: declared a variable called markethubCard and asked it to get the element with the class of markethub-card from the HTML document. This is used to display the markethub card on the dashboard page.
// use querySelector not getElement cos querySelector is universal and can locate any either Id, class or tags and not just a particular element
// we used.markethubCard because we used querySelector and not getElement so we have to tell it if we are getting a class or Id
const markethubCard = document.querySelector('.markethub-card');

// LINE 52-55: LISTEN FOR WHEN SOMEONE CLICKS THE MARKETHUB CARD
markethubCard.addEventListener('click', function() {
    // LINE 3: WHEN THE CARD IS CLICKED, REDIRECT TO THE MARKET-HUB PAGE
    window.location.href = '../markethub/markethub.html';// used../markethub/markethub.html to locate the html of markethub inside the markethub folder
});

// SECTION 7: GET THE CLASSROOM CARD FROM THE DASHBOARD
// LINE 56-60: declared a variable called classroomCard and asked it to get the element with the class of classroom-card from the HTML document. This is used to display the classroom card on the dashboard page.
// use querySelector not getElement cos querySelector is universal and can locate any either Id, class or tags and not just a particular element
// we used.classroom because we used querySelector and not getElement so we have to tell it if we are getting a class or Id
const classroomCard = document.querySelector('.classroom-card');

// LINE 61-64: LISTEN FOR WHEN SOMEONE CLICKS THE CLASSROOM-CARD CARD
classroomCard.addEventListener('click', function() {
    // LINE 3: WHEN THE CARD IS CLICKED, REDIRECT TO THE CLASSROOM PAGE
    window.location.href = '../classroom/classroom.html';// used../classroom/classroom.html to locate the html of classroom inside the classroom folder
});

// SECTION 8: GET THE SKILL-HUB CARD FROM THE DASHBOARD
// LINE 65-69: declared a variable called Skill-hub and asked it to get the element with the class of skillhub-card from the HTML document. This is used to display the skillhub card on the dashboard page.
// use querySelector not getElement cos querySelector is universal and can locate any either Id, class or tags and not just a particular element
// we used.skillhub-card because we used querySelector and not getElement so we have to tell it if we are getting a class or Id
const skillhubCard = document.querySelector('.skillhub-card');

// LINE 70-73: LISTEN FOR WHEN SOMEONE CLICKS THE SKILLHUB CARD
skillhubCard.addEventListener('click', function() {
    // LINE 3: WHEN THE CARD IS CLICKED, REDIRECT TO THE SKILLHUB PAGE
    window.location.href = '../skillhub/skillhub.html';// used../skillhub/skillhub.html to locate the html of skillhub inside the skillhub folder
});

// SECTION 9: GET THE BOOMAI CARD FROM THE DASHBOARD
// LINE 74-78: declared a variable called boomai-card and asked it to get the element with the class of boomai-card from the HTML document. This is used to display the boomai card on the dashboard page.
// use querySelector not getElement cos querySelector is universal and can locate any either Id, class or tags and not just a particular element
// we used.boomai-card because we used querySelector and not getElement so we have to tell it if we are getting a class or Id
const boomaiCard = document.querySelector('.boomai-card');

// LINE 79-82: LISTEN FOR WHEN SOMEONE CLICKS THE BOOMAI CARD
boomaiCard.addEventListener('click', function() {
    // LINE 3: WHEN THE CARD IS CLICKED, REDIRECT TO THE BoomAI PAGE
    window.location.href = '../boomai/boomai.html';// used../boomai/boomai.html to locate the html of skillhub inside the skillhub folder
});