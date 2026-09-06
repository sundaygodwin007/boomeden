// declared a variable here called currentShareUrl and used it to store the URL for sharing
let currentShareUrl = '';

// created a function here called closeSharePopup so the popup can be closed when the user clicks outside of it or on the close button
window.closeSharePopup = function() {
  document.getElementById('share-popup').style.display = 'none';
}

// created another function here called copyShareLink that alert linked copied when the user clicks on the copy link icon
window.copyShareLink = async function() {
  await navigator.clipboard.writeText(currentShareUrl);
  alert('Link copied!');
  closeSharePopup();
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.post-action-btn');
  if (!btn) return;
  const postId = btn.dataset.id;
  if (!postId) return;

  // SHARE POPUP HANDLER
  // created an if statement here saying if the clicked button is the share button, then handle the share functionality
  if (btn.classList.contains('share-btn')) {

    // declared a variable here asking called url so it will copy the url and the Id of the post
    const url = `${window.location.origin}/ecosystem.html?post=${postId}`;
    currentShareUrl = url;

    // Fill the links
    // this get the document with the specific Id's and added the social media links to them and also attach the post url to it
    document.getElementById('share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(url)}`;
    document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;

    // Try native share first. If it fails, show our popup
    if (navigator.share) {
      try {
        await navigator.share({ title: 'BooMeden', text: 'Check this post', url });
      } catch {
        document.getElementById('share-popup').style.display = 'flex';
      }
    } else {
      document.getElementById('share-popup').style.display = 'flex';
    }

    return; // stop here so we don't run retweet/save too
  }
});