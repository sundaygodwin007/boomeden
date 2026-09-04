// this prevents a post from being liked twice while the first request is still running.
const likeLock = new Set();

// this function runs whenever the user clicks like.
// it reads the logged-in user, checks the current likes, and updates the database.
async function likePost(postId){
  try {
    // this stops a double tap or double click from sending the same like request twice.
    if (likeLock.has(postId)) return;
    likeLock.add(postId);

    // read the logged-in user from the browser storage.
    const userDataString = localStorage.getItem("boomedenUser");
    if(!userDataString) return alert("Please login first");
    
    const userData = JSON.parse(userDataString);
    const userId = userData.uid;

    // this points to the exact post in Firestore.
    // this uses the same post collection used by the feed loader.
    const postRef = db.collection("posts").doc(postId);
    const likeBtn = document.getElementById(`like-${postId}`);
    const likeCount = document.getElementById(`like-count-${postId}`);

    // this makes sure the heart button and count exist before we try to update them.
    if (!likeBtn || !likeCount) return;

    // get the current like count and the list of users who liked it.
    const docSnap = await postRef.get();
    let currentLikes = 0;
    let likedBy = [];

    if(docSnap.exists){
      currentLikes = docSnap.data().likes || 0;
      likedBy = docSnap.data().likedBy || [];
    }

    // check whether this logged-in user already liked this post.
    const isLiked = likedBy.includes(userId);
    
    if(isLiked) {
      // if already liked, remove the like.
      // this makes the heart empty again.
      currentLikes -= 1;
      likedBy = likedBy.filter(id => id !== userId);
      
      await postRef.set({ likes: currentLikes, likedBy: likedBy }, {merge: true});

      // this saves the false state so the heart goes back to normal after refresh.
      localStorage.setItem(`liked-${postId}`, 'false');
      // this saves the updated count so the number is still visible after reload.
      localStorage.setItem(`like-count-${postId}`, currentLikes.toString());

      likeBtn.classList.remove("fa-solid", "text-red-500"); 
      likeBtn.classList.add("fa-regular");
      likeBtn.style.color = "black"; // for non-tailwind
      
      likeCount.innerText = currentLikes;
    } else {
      // if not liked yet, add the like.
      // this fills the heart and increases the count.
      currentLikes += 1;
      likedBy.push(userId);
      
      await postRef.set({ likes: currentLikes, likedBy: likedBy }, {merge: true});

      // this saves the true state so the heart stays filled after the page refreshes.
      localStorage.setItem(`liked-${postId}`, 'true');
      // this saves the updated count so the number remains on the screen after reload.
      localStorage.setItem(`like-count-${postId}`, currentLikes.toString());

      likeBtn.classList.remove("fa-regular");
      likeBtn.classList.add("fa-solid", "text-red-500");
      likeBtn.style.color = "red"; // for non-tailwind
      
      likeCount.innerText = currentLikes;
    }
  } catch(err) {
    alert("Like error: " + err.message)
    console.log(err)
  } finally {
    // this releases the lock so the user can click again after the request finishes.
    likeLock.delete(postId);
  }
}
