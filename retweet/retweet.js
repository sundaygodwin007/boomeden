// declared a function here called handleRetweet to handle retweet logic
window.handleRetweet = async function(postId) {
  const user = firebase.auth().currentUser;
  if (!user) { showGuestGate(); return; }

  const postRef = db.collection('posts').doc(postId);

  // 1. Create the retweet post
  await db.collection('posts').add({
    type: 'retweet',
    originalPostId: postId,
    retweetedBy: user.uid,
    retweetedByName: user.displayName || 'Anonymous',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  // 2. CHANGED: Increase the retweet count on the original post
  await postRef.update({
    retweets: firebase.firestore.FieldValue.increment(1)
  });

  alert('Retweeted!');
  loadPosts(); // refresh to show new count
}