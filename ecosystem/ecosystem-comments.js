// this runs when user clicks the comment icon
// it toggles the comment box and loads comments for that post
async function toggleComments(postId){
  const commentBox = document.getElementById(`comments-${postId}`);
  
  // if box is already open, close it
  if(commentBox.style.display === 'block'){
    commentBox.style.display = 'none';
    return;
  }
  
  // else open it and load comments
  commentBox.style.display = 'block';
  await loadComments(postId);
}

// this loads all comments for a post from Firestore and displays them
async function loadComments(postId){
  const commentsContainer = document.getElementById(`comments-list-${postId}`);
  commentsContainer.innerHTML = '<p style="padding:10px; font-size:14px;">Loading comments...</p>';

  try {
    // this gets comments subcollection under each post
    const snapshot = await db.collection('ecosystem_posts').doc(postId).collection('comments').orderBy('createdAt', 'desc').get();
    
    commentsContainer.innerHTML = '';
    
    // if no comments
    if(snapshot.empty){
      commentsContainer.innerHTML = '<p style="padding:10px; font-size:14px; color:gray;">No comments yet. Be the first!</p>';
      return;
    }
    
    // this loops through each comment and adds it to the page
    snapshot.forEach(doc => {
      const comment = doc.data();
      const commentEl = document.createElement('div');
      commentEl.style.padding = '8px';
      commentEl.style.borderBottom = '1px solid #eee';
      commentEl.innerHTML = `
        <strong>${comment.username || 'User'}</strong>
        <p style="margin:4px 0; font-size:14px;">${comment.text}</p>
        <small style="color:gray; font-size:12px;">${new Date(comment.createdAt?.toDate()).toLocaleString()}</small>
      `;
      commentsContainer.appendChild(commentEl);
    });
  } catch(err){
    console.log("COMMENT LOAD ERROR:", err.message);
    commentsContainer.innerHTML = `<p style="color:red;">Error loading comments</p>`;
  }
}

// this loads only the number of comments so the action row can show a count without opening the comment box.
async function loadCommentCount(postId){
  const commentCount = document.getElementById(`comment-count-${postId}`);
  if(!commentCount) return;

  try {
    // this reads the comments subcollection and counts the comments belonging to this post.
    const snapshot = await db.collection('ecosystem_posts').doc(postId).collection('comments').get();
    commentCount.innerText = snapshot.size;
  } catch(err){
    // this leaves the count at zero if the comment count cannot be loaded.
    console.log("COMMENT COUNT ERROR:", err.message);
  }
}

// this runs when user clicks "Post" button to submit a comment
async function postComment(postId){
  const input = document.getElementById(`comment-input-${postId}`);
  const text = input.value.trim();
  
  if(!text) return alert("Comment cannot be empty");
  
  // read the logged-in user from the browser storage.
  const userDataString = localStorage.getItem("boomedenUser");
  if(!userDataString) return alert("Please login first");
  
  const userData = JSON.parse(userDataString);
  
  try {
    // this adds the comment to the subcollection 'comments' under the post
    await db.collection('ecosystem_posts').doc(postId).collection('comments').add({
      text: text,
      userId: userData.uid,
      username: userData.name || 'Anonymous', // make sure you save name during signup
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // this clears the input after posting
    input.value = '';
    
    // this reloads comments so the new one shows instantly
    await loadComments(postId);

    // this refreshes the number beside the comment icon after a new comment is posted.
    await loadCommentCount(postId);
    
  } catch(err){
    alert("Comment error: " + err.message);
    console.log(err);
  }
}

// this makes functions global so HTML onclick can see them
window.toggleComments = toggleComments;
window.postComment = postComment;
// this makes the count function available to the post renderer.
window.loadCommentCount = loadCommentCount;






