// this listen to the even called DOMContentLoaded which means the HTML page is fully loaded and ready to be manipulated by JavaScript. It ensures that the code inside this function runs only after the page is ready.
document.addEventListener('DOMContentLoaded', () => {

// FIREBASE SETUP
// this is my real firebase keys, you can find them in your firebase project settings. This is necessary to connect to the Firebase database and use its features like authentication and Firestore.
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

// this try-catch block attempts to initialize the Firebase app with the provided configuration. If it succeeds, it logs "FIREBASE INIT OK" to the console. If it fails (for example, if Firebase has already been initialized), it catches the error and logs "FIREBASE INIT ERROR" along with the error message.
try {
  firebase.initializeApp(firebaseConfig);
  console.log("FIREBASE INIT OK"); // TEST 3
} catch(e) {
  console.log("FIREBASE INIT ERROR:", e.message); // Will say "already exists" if double init
}

// this gets the Firestore database instance from the initialized Firebase app. It allows you to interact with the Firestore database, such as reading and writing data.
const db = firebase.firestore();

// this selects the HTML element with the class "feed-container" and assigns it to the variable feedContainer. This is where the posts will be displayed on the page.
// its also called the DOM manipulation which means changing the HTML page using JavaScript. The querySelector method is used to find the first element that matches the specified CSS selector.
const feedContainer = document.querySelector('.feed-container');

// this function loadPosts() is responsible for fetching posts from the Firestore database and displaying them in the feedContainer. It logs the start of the process, retrieves the posts collection, and handles both success and error cases.
function loadPosts() {

  // this logs "FIREBASE LOAD POSTS START" to the console, indicating that the process of loading posts from Firestore has begun. This is useful for debugging and tracking the flow of the application.
  db.collection('posts').get() // REMOVED orderBy for now
  .then(snapshot => {
    
    // this clears the inner HTML of the feedContainer, effectively removing any existing posts or content. This ensures that when new posts are loaded, they replace any old content rather than appending to it.
    feedContainer.innerHTML = ''; 
    
    // this checks if the snapshot (the result of the Firestore query) is empty, meaning no posts were found in the "posts" collection. If it is empty, it sets the inner HTML of feedContainer to display a message indicating that no posts were found and returns early from the function.
    if(snapshot.size === 0){
      // this sets the inner HTML of feedContainer to a paragraph element with padding and red text, informing the user that no posts were found in the "posts" collection. This provides feedback to the user when there are no posts to display.
      feedContainer.innerHTML = '<p style="padding:20px; color:red">No posts found in "posts" collection</p>';
      return;
    }

    // this loops through each document in the snapshot (each post retrieved from Firestore). For each document, it extracts the post data and creates a new HTML card element to display the post's information, including image, category, title, description, and action buttons. Each card is then appended to the feedContainer.
    snapshot.forEach(doc => {

      // this retrieves the data of the current document (post) as a JavaScript object. The doc.data() method returns the fields of the document, allowing access to properties like title, description, imageUrl, and category.
      const post = doc.data();

      // this logs the title of the post being loaded to the console. It helps in debugging and tracking which posts are being processed and displayed on the page.
      console.log("Loading post:", post.title);
      
      // this creates a new div element to represent a post card. It sets the class name to "dashboard-card" and applies some margin styling. The inner HTML of the card is populated with the post's image, category, title, description, and action buttons (like, comment, retweet, share, bookmark). Finally, the card is appended to the feedContainer, making it visible on the page.
      // this manipulates the DOM by creating new elements and inserting them into the existing HTML structure. It allows dynamic content to be displayed based on the data retrieved from Firestore.
      const card = document.createElement('div');

      // this sets the class name of the newly created card div to "dashboard-card". This class can be used for styling the card with CSS, ensuring that all post cards have a consistent appearance.
      card.className = 'dashboard-card';

      // this sets the bottom margin of the card to 20 pixels, providing spacing between consecutive post cards in the feed. This improves the visual layout and readability of the content.
      card.style.marginBottom = '20px';

      // this sets the inner HTML of the card to include the post's image, category, title, description, and action buttons. The image is displayed with a width of 100% and rounded corners. The category is shown in a div, followed by the title in an h3 element and the description in a paragraph. The action buttons are represented with icons for like, comment, retweet, share, and bookmark.
      card.innerHTML = `
        <img src="${post.imageUrl}" style="width:100%; border-radius:8px;">

        <div class="category">${post.category}</div>
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div class="post-actions">
          <div class="post-action-btn"><i class="fa-regular fa-heart"></i> 0</div>
          <div class="post-action-btn"><i class="fa-regular fa-comment"></i> 0</div>
          <div class="post-action-btn"><i class="fa-solid fa-retweet"></i> 0</div>
          <div class="post-action-btn"><i class="fa-regular fa-share-from-square"></i></div>
          <div class="post-action-btn"><i class="fa-regular fa-bookmark"></i></div>
        </div>
      `;

      // this appends the newly created card element to the feedContainer, making it part of the DOM and visible on the page. This allows users to see the post content that was dynamically loaded from Firestore.
      feedContainer.appendChild(card);
    });
  })

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