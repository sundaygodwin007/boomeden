// IF ANYTHING BREAKS, CHECK THIS SECTION FIRST.
// IF POSTS DO NOT SHOW OR LIKE DOES NOT WORK, CHECK:
// 1) Firebase is initialized correctly
// 2) the Firestore collection name matches the database collection
// 3) the HTML element with class 'feed-container' exists on the page
// this variable holds the Firestore database connection.
// we declare it outside the functions so both the post loader and the like button can use it.
let db;

// ===============================================
// PANEL 1: PAGE START + FIREBASE CONNECTION
// HTML CONNECTION: ecosystem.html loads this file after the Firebase scripts.
// IF THIS PANEL BREAKS: check the Firebase script order in ecosystem.html first.
// ===============================================

// this runs only when the page is fully loaded.
// after that, we can safely read the page and add content to it.
document.addEventListener('DOMContentLoaded', () => {

// FIREBASE SETUP
// these are the Firebase credentials for this project.
// they connect this page to the Firebase database.
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// this starts Firebase once.
// if the app is already started, the catch block will handle that error.
try {
  firebase.initializeApp(firebaseConfig);
  console.log("FIREBASE INIT OK"); // TEST 3
} catch(e) {
  console.log("FIREBASE INIT ERROR:", e.message); // Will say "already exists" if double init
}

// IF POSTS DON'T LOAD, CHECK THIS LINE.
// IF FIRESTORE RETURNS NOTHING, CHECK THE COLLECTION NAME AND THE DATABASE RULES.
// this creates the Firestore database object we will use to read and write posts.
db = firebase.firestore();

// ===============================================
// PANEL 2: USER PROFILE PANEL
// HTML CONNECTION: #userHandle in ecosystem.html receives the logged-in user's name.
// IF THIS PANEL BREAKS: check #userHandle and the users/{uid} Firestore document.
// ===============================================

// this starts Firebase Auth on the page so Firestore requests include the current user's login token.
const ecosystemAuth = firebase.auth();

// this finds the username heading from ecosystem.html so the hardcoded @godwin9 text can become dynamic.
const userHandle = document.getElementById('userHandle');

// this loads the signed-in user's own profile document and displays the best available name.
async function loadLoggedInUserName(user) {
  if (!userHandle ||!user) return;

  try {
    const userSnapshot = await db.collection('users').doc(user.uid).get();
    const profile = userSnapshot.exists? userSnapshot.data() : {};
    // const displayName = profile.username || profile.firstName || user.email.split('@')[0];
    userHandle.textContent = `@${displayName}`;
  } catch (error) {
    // if the profile read fails, the email prefix still gives the user a useful label.
    userHandle.textContent = `@${user.email.split('@')[0]}`;
    console.log('PROFILE NAME LOAD ERROR:', error.message);
  }
}

// ===============================================
// PANEL 3: SIGN-IN AND LOGOUT CONTROL
// HTML CONNECTION: #authBtn in ecosystem.html changes between Sign In and Log Out.
// IF THIS PANEL BREAKS: check #authBtn and Firebase Auth state first.
// ===============================================

// this connects the #authBtn link from ecosystem.html to the live Firebase login state.
const ecosystemAuthBtn = document.getElementById('authBtn');

// this changes the button into a real logout control after Firebase confirms the user is signed in.
ecosystemAuth.onAuthStateChanged((user) => {
  if (user) {
    // this updates the #userHandle element after Firebase confirms the current session.
    loadLoggedInUserName(user);
    localStorage.setItem('boomedenUser', JSON.stringify({ uid: user.uid, email: user.email }));
    if (ecosystemAuthBtn) {
      ecosystemAuthBtn.style.display = 'inline-flex';
      ecosystemAuthBtn.textContent = 'Log Out';
    }
  } else {
    // this resets the sidebar label when Firebase confirms that no user is signed in.
    if (userHandle) userHandle.textContent = '@user';
    localStorage.removeItem('boomedenUser');
    if (ecosystemAuthBtn) {
      ecosystemAuthBtn.style.display = 'inline-flex';
      ecosystemAuthBtn.textContent = 'Sign In';
    }
  }
});

// this signs out the user who clicked #authBtn, then reloads ecosystem.html so guest controls appear again.
if (ecosystemAuthBtn) {
  ecosystemAuthBtn.addEventListener('click', async (event) => {
    if (!firebase.auth().currentUser) return;
    event.preventDefault();
    await ecosystemAuth.signOut();
    window.location.reload();
  });
}

// ===============================================
// PANEL 4: FEED CONTAINER
// HTML CONNECTION:.feed-container in ecosystem.html receives every Firestore post card.
// IF THIS PANEL BREAKS: check the.feed-container class and the posts collection name.
// ===============================================

// this finds the place on the page where the posts will be shown.
// this is the main feed container.
const feedContainer = document.querySelector('.feed-container');

// this function loadPosts() is responsible for fetching posts from the Firestore database and displaying them in the feedContainer. It logs the start of the process, retrieves the posts collection, and handles both success and error cases.
// ===============================================
// PANEL 5: POST CARD CREATION
// HTML CONNECTION: each generated.dashboard-card contains one post and its actions.
// IF THIS PANEL BREAKS: check the post fields and the card.innerHTML block below.
// ===============================================

function loadPosts() {

  // this logs "FIREBASE LOAD POSTS START" to the console, indicating that the process of loading posts from Firestore has begun. This is useful for debugging and tracking the flow of the application.
  // if images disappear, this collection must match the collection that stores imageUrl.
  db.collection('posts').get() // REMOVED orderBy for now
.then(async snapshot => { // CHANGED: made then async

    // this clears the inner HTML of the feedContainer, effectively removing any existing posts or content. This ensures that when new posts are loaded, they replace any old content rather than appending to it.
    feedContainer.innerHTML = '';

    // if there are no posts in Firestore, show a simple message to the user.
    if(snapshot.size === 0){
      // this sets the inner HTML of feedContainer to a paragraph element with padding and red text, informing the user that no posts were found in the "posts" collection. This provides feedback to the user when there are no posts to display.
      feedContainer.innerHTML = '<p style="padding:20px; color:red">No posts found in "posts" collection</p>';
      return;
    }

    // CHANGED: use for...of instead of forEach so await works properly
    for (const doc of snapshot.docs) {

      // this gets the post details from the database.
      // we also save the document id so we can identify this post later.
      const post = doc.data();
      post.id = doc.id; // ADD THIS LINE

      // CHANGED: Variables to handle retweet display
      let displayPost = post;
      let retweetHeader = '';

      // CHANGED: If this is a retweet, fetch the original post data
      if (post.type === 'retweet') {
        const originalSnap = await db.collection('posts').doc(post.originalPostId).get();
        if (originalSnap.exists) {
          displayPost = originalSnap.data();
          displayPost.id = originalSnap.id;
          retweetHeader = `<div style="font-size:12px; color:gray; margin-bottom:8px;">
            <i class="fa-solid fa-retweet"></i> ${post.retweetedByName} Retweeted
          </div>`;
        }
      }

      // this logs the title of the post being loaded to the console. It helps in debugging and tracking which posts are being processed and displayed on the page.
      console.log("Loading post:", displayPost.title);

      // this creates one card box for this post.
      // the card will hold the image, title, description, and actions.
      const card = document.createElement('div');

      // CHANGED: added id to card so we can scroll to it from share link
      card.id = `post-${displayPost.id}`;

      // this checks whether this specific post was liked before the page refreshed.
      // we save the liked status in localStorage so the icon can stay red after a reload.
      // Firestore remains the source of truth so one user's cache cannot affect another user.
      const savedUser = JSON.parse(localStorage.getItem('boomedenUser') || 'null');
      const isLikedSaved = Boolean(savedUser?.uid && (displayPost.likedBy || []).includes(savedUser.uid));

      // this keeps the count visible after refresh by reading the same post document that receives new likes.
      const displayLikeCount = displayPost.likes || 0;

      // these values decide whether the heart should be filled red or plain black on reload.
      const likeIconClass = isLikedSaved? 'fa-solid text-red-500' : 'fa-regular';
      const likeIconColor = isLikedSaved? 'red' : 'black';

      // ===============================================
      // PANEL 6: POST ACTIONS AND COMMENTS
      // HTML CONNECTION: #post-actions, #like, #like-count, and #comments IDs are created below.
      // IF THIS PANEL BREAKS: check that every generated post ID is used consistently.
      // ===============================================

      // this sets the class name of the newly created card div to "dashboard-card". This class can be used for styling the card with CSS, ensuring that all post cards have a consistent appearance.
      card.className = 'dashboard-card';

      // this sets the bottom margin of the card to 20 pixels, providing spacing between consecutive post cards in the feed. This improves the visual layout and readability of the content.
      card.style.marginBottom = '20px';

      // IF THE LIKE ICON DOES NOT CLICK OR DOES NOT MATCH THE STATE, CHECK THIS BLOCK.
      // IF THE HTML IDS DO NOT MATCH THE CLICK HANDLER, THE BUTTON WILL NOT UPDATE.
      // this sets the inner HTML of the card to include the post's image, category, title, description, and action buttons. The image is displayed with a width of 100% and rounded corners. The category is shown in a div, followed by the title in an h3 element and the description in a paragraph. The action buttons are represented with icons for like, comment, retweet, share, and bookmark.

card.innerHTML = `
  ${retweetHeader}
  <img src="${displayPost.imageUrl}" style="width:100%; border-radius:8px;">

  <div class="category">${displayPost.category}</div>
  <h3>${displayPost.title}</h3>
  <p>${displayPost.description}</p>
  <button class="view-interlock-btn" type="button" onclick="window.location.href='../interlock/interlock.html'">
    <i class="fa-solid fa-arrow-up-right-from-square"></i>
    <span>View in Interlock</span>
  </button>

  <!-- UPDATED ACTION ROW -->
  <div id="post-actions-${displayPost.id}" style="display:flex; align-items:center; gap:16px; margin-top:12px;">

    <div class="post-action-btn like-btn" onclick="likePost('${displayPost.id}')" style="display:flex; align-items:center; gap:6px; cursor:pointer">
      <i class="fa-heart ${likeIconClass}" id="like-${displayPost.id}" style="color:${likeIconColor};"></i>
      <span id="like-count-${displayPost.id}">${displayLikeCount}</span>
    </div>

    <div class="post-action-btn comment-btn" onclick="toggleComments('${displayPost.id}')" style="display:flex; align-items:center; gap:6px; cursor:pointer">
      <i class="fa-regular fa-comment"></i>
      <span id="comment-count-${displayPost.id}">0</span>
    </div>

    <!-- ADD DATA-ID + CLASS TO THESE 3 -->
    <div class="post-action-btn retweet-btn" data-id="${displayPost.id}" onclick="handleRetweet('${displayPost.id}')" style="display:flex; align-items:center; gap:6px; cursor:pointer">
      <i class="fa-solid fa-retweet"></i> <span>${displayPost.retweets || 0}</span>
    </div>

    <div class="post-action-btn share-btn" data-id="${displayPost.id}" style="display:flex; align-items:center; gap:6px; cursor:pointer">
      <i class="fa-regular fa-share-from-square"></i> <span>Share</span>
    </div>

    <div class="post-action-btn save-btn" data-id="${displayPost.id}" onclick="handleSave('${displayPost.id}', this)" style="display:flex; align-items:center; gap:6px; cursor:pointer">
      <i class="fa-regular fa-bookmark"></i>
    </div>
  </div>

  <div id="comments-${displayPost.id}" style="display:none; margin-top:10px; border-top:1px solid #ddd; padding-top:10px;">
    <div id="comments-list-${displayPost.id}"></div>
    <div style="display:flex; gap:8px; margin-top:8px;">
      <input type="text" id="comment-input-${displayPost.id}" placeholder="Write a comment..." style="flex:1; padding:8px; border:1px solid #ccc; border-radius:6px;">
      <button onclick="postComment('${displayPost.id}')" style="padding:8px 12px; border:none; background:black; color:white; border-radius:6px; cursor:pointer;">Post</button>
    </div>
  </div>
`;

      // ===============================================
      // PANEL 7: IMAGE LIKE CONTROL
      // HTML CONNECTION: the generated post image calls likePost() when clicked.
      // IF THIS PANEL BREAKS: check the image selector and likePost() in ecosystem-like.js.
      // ===============================================

      // IF THE IMAGE DOES NOT LIKE OR UNLIKE, CHECK THIS SECTION.
      // IF THE CLICK IS NOT BINDING, CHECK THE image selector and the post ID.
      // this lets the user tap on the image to like or unlike the post.
      // this makes the image act like a like button too.
      const postImage = card.querySelector('img');
      postImage.style.cursor = 'pointer';
      postImage.addEventListener('click', () => likePost(displayPost.id));

      // this keeps all action icons close together but still gives them a bit of breathing room.
      const actionRow = card.querySelector(`#post-actions-${displayPost.id}`);
      actionRow.style.display = 'flex';
      actionRow.style.alignItems = 'center';
      actionRow.style.justifyContent = 'flex-start';
      actionRow.style.gap = '10px';
      actionRow.style.marginTop = '8px';

      // this appends the newly created card element to the feedContainer, making it part of the DOM and visible on the page. This allows users to see the post content that was dynamically loaded from Firestore.
      feedContainer.appendChild(card);

      // this asks Firestore for the current number of comments after the comment-count element is on the page.
      // CHANGED: use displayPost.id so retweets show original comment count
      if (typeof loadCommentCount === 'function') loadCommentCount(displayPost.id);
    }
  })

  // ===============================================
  // PANEL 8: FEED ERROR DISPLAY
  // HTML CONNECTION: errors are written into.feed-container in ecosystem.html.
  // IF THIS PANEL BREAKS: check the browser console and Firestore rules.
  // ===============================================

  // this catch block handles any errors that occur during the process of loading posts from Firestore. If an error is encountered, it logs the error code and message to the console for debugging purposes and updates the feedContainer's inner HTML to display an error message to the user.
.catch(err => {

    // this logs the error code and message to the console, providing detailed information about what went wrong during the Firestore query. This is useful for developers to diagnose issues with the database connection or query execution.
    console.log("FIREBASE CATCH ERROR:", err.code, err.message); // THIS IS THE KEY

    // this sets the inner HTML of the feedContainer to display an error message that includes the error message from the catch block. This informs the user that an error occurred while trying to load posts, providing feedback on the issue.
    feedContainer.innerHTML = `ERROR: ${err.message}`;
  });
}

// this calls the loadPosts() function to initiate the process of fetching and displaying posts from Firestore when the DOM content is fully loaded. This ensures that the posts are loaded and displayed as soon as the page is ready for interaction.
loadPosts();
});