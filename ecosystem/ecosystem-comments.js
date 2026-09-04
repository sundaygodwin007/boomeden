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
    const snapshot = await db.collection('posts').doc(postId).collection('comments').orderBy('createdAt', 'desc').get();
    
    commentsContainer.innerHTML = '';
    
    // if no comments
    if(snapshot.empty){
      commentsContainer.innerHTML = '<p style="padding:10px; font-size:14px; color:gray;">No comments yet. Be the first!</p>';
      return;
    }
    
    // this shows only the first two comments inside the post card.
    snapshot.docs.slice(0, 2).forEach(doc => {
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

    // this adds a button only when the post has more than two comments.
    if(snapshot.size > 2){
      const viewMoreButton = document.createElement('button');
      viewMoreButton.innerText = 'View more comments';
      viewMoreButton.style.cssText = 'margin:12px 0 2px; padding:9px 14px; border:1px solid #d7dee8; border-radius:7px; background:white; color:#1d4ed8; font-weight:600; cursor:pointer;';
      // this changes the text and border color while the pointer is over the button.
      viewMoreButton.addEventListener('mouseenter', () => {
        viewMoreButton.style.color = '#1e40af';
        viewMoreButton.style.borderColor = '#93c5fd';
        viewMoreButton.style.backgroundColor = '#eff6ff';
      });
      // this returns the button to its normal style when the pointer leaves it.
      viewMoreButton.addEventListener('mouseleave', () => {
        viewMoreButton.style.color = '#1d4ed8';
        viewMoreButton.style.borderColor = '#d7dee8';
        viewMoreButton.style.backgroundColor = 'white';
      });
      viewMoreButton.addEventListener('click', () => openCommentsModal(postId));
      commentsContainer.appendChild(viewMoreButton);
    }
  } catch(err){
    console.log("COMMENT LOAD ERROR:", err.message);
    commentsContainer.innerHTML = `<p style="color:red;">Error loading comments</p>`;
  }
}

// this creates a modal that displays every comment without making the post card too tall.
async function openCommentsModal(postId){
  let modal = document.getElementById('all-comments-modal');

  // this creates the modal once and reuses it for every post.
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'all-comments-modal';
    modal.style.cssText = 'display:none; position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.55); padding:24px;';
    modal.innerHTML = `
      <div style="max-width:560px; max-height:80vh; overflow:auto; margin:5vh auto; padding:20px; border-radius:10px; background:white;">
        <button id="close-comments-modal" style="float:right; border:0; background:transparent; font-size:22px; cursor:pointer;">&times;</button>
        <h3>All comments</h3>
        <div id="all-comments-list"></div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('close-comments-modal').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  const allCommentsList = document.getElementById('all-comments-list');
  allCommentsList.innerHTML = '<p>Loading comments...</p>';
  modal.style.display = 'block';

  try {
    // this gets every comment for the selected post for the modal view.
    const snapshot = await db.collection('posts').doc(postId).collection('comments').orderBy('createdAt', 'desc').get();
    allCommentsList.innerHTML = '';

    // this places every comment inside the modal instead of the small post preview.
    snapshot.forEach(doc => {
      const comment = doc.data();
      const commentEl = document.createElement('div');
      commentEl.style.cssText = 'padding:10px 0; border-bottom:1px solid #eee;';
      commentEl.innerHTML = `<strong>${comment.username || 'User'}</strong><p style="margin:4px 0;">${comment.text}</p>`;
      allCommentsList.appendChild(commentEl);
    });
  } catch(err){
    // this shows a useful message if the full comment list cannot be loaded.
    allCommentsList.innerHTML = '<p style="color:red;">Error loading comments</p>';
    console.log("ALL COMMENTS ERROR:", err.message);
  }
}

// this loads only the number of comments so the action row can show a count without opening the comment box.
async function loadCommentCount(postId){
  const commentCount = document.getElementById(`comment-count-${postId}`);
  if(!commentCount) return;

  try {
    // this reads the comments subcollection and counts the comments belonging to this post.
    const snapshot = await db.collection('posts').doc(postId).collection('comments').get();
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
    await db.collection('posts').doc(postId).collection('comments').add({
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
// this makes the full comments modal available to the preview button.
window.openCommentsModal = openCommentsModal;






