// declared a function here called handleSave to handle save/unsave logic
window.handleSave = async function(postId, btn) {
  const user = firebase.auth().currentUser;
  if (!user) { showGuestGate(); return; }
  const saveId = `${user.uid}_${postId}`;
  const saveRef = db.collection('savedPosts').doc(saveId);
  const snap = await saveRef.get();
  const icon = btn.querySelector('i');

  if (snap.exists) {
    await saveRef.delete();
    icon.className = 'fa-regular fa-bookmark';
  } else {
    await saveRef.set({ userId: user.uid, postId, savedAt: firebase.firestore.FieldValue.serverTimestamp() });
    icon.className = 'fa-solid fa-bookmark';
  }
}