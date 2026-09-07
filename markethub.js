// ==========================================================================
// BOOMEDEN MARKETHUB PRO - APP CONTROLLER SCRIPT
// ==========================================================================

// ADDED MY FIREBASE KEYS
const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
};

// TURNING ON MY FIREBASE
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// DECLARED A VARIABLE CALLED DB AND ASSIGNED IT TO FIREBASE FIRESTORE is the Firestore variable that acts as the bridge to read and write your product and shop collections.
const db = firebase.firestore();

// ALSO DECLARED VARIABLES AND ASSIGNED THEIR VALUES.....WHY THE REST ARE NULL IS BECAUSE THERE ARE NO ACTIVE NEGOTIATIONS AND DONT WANNA DO HARD CODING and also keep track of dynamic user interactions like active negotiations and live media streams
let activeNegotiationItem = null;
let mediaStream = null;
let currentCaptureMode = 'photo'; // 'photo' or 'video' a value called photo so it can be called upon 
let mediaRecorder = null;
let recordedChunks = []; //

// tells the document to listen to an even called DOMContentLoaded which means the content should load first before runnin the codes
document.addEventListener("DOMContentLoaded", () => {
  loadTopMerchants();  //this should all the items in the top merchants collection from my firestore and display them on the page
  loadCatalog('all'); //this should load all the items in the catalog collection from my firestore and display them on the page
});

// ==========================================================================
// LIVE CAMERA STREAM & AI VISUAL SCAN CONTROLLER
// ==========================================================================
// created a function called openCameraScanner that will open the camera scanner modal when called
function openCameraScanner() {
  document.getElementById('scanModal').classList.add('active'); // gets the element with ID scanModal and adds the 'active' class to make it visible
  document.getElementById('scanModalBackdrop').classList.add('active'); // gets the element with ID scanModalBackdrop and adds the 'active' class to dim the background
}

// created a function called closeCameraScanner that will close the camera scanner modal when called
function closeScanModal() {
  document.getElementById('scanModal').classList.remove('active'); // removes the 'active' class from scanModal to hide it when dismissed
  document.getElementById('scanModalBackdrop').classList.remove('active'); // removes the 'active' class from scanModalBackdrop to clear the dark background overlay
}

// Opens live hardware camera stream directly in browser viewfinder
// This function is called when the user wants to start capturing media (photo or video) using their device's camera. It requests access to the camera and microphone (if video mode is selected) and displays the live feed in a modal.
async function startLiveCameraStream(mode) {
  closeScanModal();
  currentCaptureMode = mode;
  
  const modal = document.getElementById('liveCameraModal'); // declared a variable and get the element with the Id of liveCameraModal from the html and gave it a name modal so we can use it later
  const videoElem = document.getElementById('liveVideoElement'); // declared a variable and get the element with the Id of liveVideoElement from the html and gave it a name videoElem so we can use it later
  const titleElem = document.getElementById('cameraModeTitle'); // declared a variable and get the element with the Id of cameraModeTitle from the html and gave it a name titleElem so we can use it later
  const shutterLabel = document.getElementById('shutterLabel'); // declared a variable and get the element with the Id of shutterLabel from the html and gave it a name shutterLabel so we can use it later

// Manipulates the DOM: If the mode is 'photo', it displays "Snap Live Product Photo". Otherwise (for video), it displays "Record Live Video Clip".
titleElem.textContent = mode === 'photo' ? "Snap Live Product Photo" : "Record Live Video Clip"; 

// Manipulates the DOM: Changes the button text to "Snap Photo" if in photo mode, or "Start Recording" if in video mode.
shutterLabel.textContent = mode === 'photo' ? "Snap Photo" : "Start Recording";
  modal.classList.add('active'); //added the active modal to it to show its active when clicked

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: mode === 'video'
    });
    videoElem.srcObject = mediaStream;
  } catch (err) {
    console.error("Camera access denied or unavailable:", err);
    alert("Unable to access camera. Please allow camera permissions or use 'Upload from Folder'.");
    closeLiveCameraStream();
  }
}

// Closes and stops camera hardware stream tracks
function closeLiveCameraStream() {
  const modal = document.getElementById('liveCameraModal');
  modal.classList.remove('active');

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  recordedChunks = [];
}

// Captures photo frame or handles video clip recording
function captureLiveMedia() {
  const videoElem = document.getElementById('liveVideoElement');
  const canvas = document.getElementById('captureCanvas');

  if (currentCaptureMode === 'photo') {
    // Snap high-res photo frame from video stream
    canvas.width = videoElem.videoWidth || 1280;
    canvas.height = videoElem.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const file = new File([blob], "live-product-snap.jpg", { type: "image/jpeg" });
      closeLiveCameraStream();
      processCapturedFile(file, "Live Photo Capture");
    }, 'image/jpeg', 0.9);

  } else {
    // Video clip handling
    const shutterLabel = document.getElementById('shutterLabel');
    const shutterBtn = document.getElementById('shutterBtn');

    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      recordedChunks = [];
      try {
        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
      } catch (e) {
        mediaRecorder = new MediaRecorder(mediaStream); // Fallback codec
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const file = new File([blob], "live-product-clip.webm", { type: "video/webm" });
        closeLiveCameraStream();
        processCapturedFile(file, "Live Video Recording");
      };

      mediaRecorder.start();
      shutterLabel.textContent = "Stop & Analyze";
      shutterBtn.style.background = "#ef4444";
      shutterBtn.style.color = "white";
    } else {
      mediaRecorder.stop();
      shutterBtn.style.background = "white";
      shutterBtn.style.color = "var(--text-main)";
    }
  }
}

// Fallback folder select trigger
function triggerFolderSelect() {
  closeScanModal();
  document.getElementById('folder-file-input').click();
}

function handleFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;
  processCapturedFile(file, file.name || "File Upload");
  event.target.value = '';
}

// Unified AI processing screen runner
async function processCapturedFile(file, sourceLabel) {
  const isVideo = file.type.startsWith('video');
  const container = document.getElementById('product-grid-container');
  
  document.getElementById('grid-title').textContent = "Boom AI Visual Search Results";
  document.getElementById('result-count').textContent = `Analyzing ${sourceLabel}...`;
  
  container.innerHTML = `
    <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px;">
      <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color:var(--primary-accent); margin-bottom:16px;"></i>
      <h4 style="font-size:16px; margin-bottom:4px;">Processing ${isVideo ? 'Video Frame Signatures' : 'Visual Vector Signature'}</h4>
      <p style="color:var(--text-muted); font-size:13px;">Extracting patterns from your ${sourceLabel.toLowerCase()} & searching live vendor network...</p>
    </div>
  `;

  setTimeout(() => {
    loadCatalog('all');
  }, 2000);
}

// ==========================================================================
// FIRESTORE DATA LOADERS (MERCHANTS & CATALOG)
// ==========================================================================

async function loadTopMerchants() {
  const container = document.getElementById('top-shops-container');
  try {
    const snapshot = await db.collection('shops').orderBy('rating', 'desc').limit(8).get();
    container.innerHTML = '';

    if (snapshot.empty) {
      container.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">No active merchants found.</p>`;
      return;
    }

    snapshot.forEach(doc => {
      const shop = doc.data();
      container.innerHTML += `
        <div class="merchant-card">
          <img src="${shop.logoUrl || 'https://i.imgur.com/placeholder-avatar.png'}" alt="${shop.shopName}" />
          <h4>${shop.shopName}</h4>
          <div class="merchant-rating"><i class="fa-solid fa-star"></i> ${shop.rating || 5.0}</div>
          <button class="btn-view-merchant" onclick="viewMerchant('${doc.id}')">View Store</button>
        </div>
      `;
    });
  } catch (err) {
    console.error("Failed loading merchants:", err);
  }
}

async function loadCatalog(category = 'all', searchQuery = '') {
  const container = document.getElementById('product-grid-container');
  
  try {
    let query = db.collection('products');
    if (category !== 'all') {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.limit(20).get();
    container.innerHTML = '';

    if (snapshot.empty) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:var(--text-muted);"><p>No items available in this segment.</p></div>`;
      document.getElementById('result-count').textContent = `0 listings available`;
      return;
    }

    let validCount = 0;
    snapshot.forEach(doc => {
      const item = doc.data();
      
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      validCount++;

      container.innerHTML += `
        <div class="product-card">
          <img src="${item.imageUrl || 'https://via.placeholder.com/250x200?text=Inventory'}" alt="${item.name}" />
          <div class="product-card-body">
            <h4>${item.name}</h4>
            <div class="product-shop-ref">Merchant: ${item.shopName || 'Verified Partner'}</div>
            <div class="product-card-footer">
              <div class="product-price">₦${Number(item.price).toLocaleString()}</div>
              <button class="btn-chat-deal" onclick="openChatDrawer('${item.shopId}', '${doc.id}', '${item.name}', ${item.price}, '${item.imageUrl || ''}')">
                <i class="fa-regular fa-comments"></i> Negotiate
              </button>
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById('grid-title').textContent = category === 'all' ? 'Marketplace Inventory' : `${category.charAt(0).toUpperCase() + category.slice(1)} Portfolio`;
    document.getElementById('result-count').textContent = `${validCount} verified active items`;
  } catch (err) {
    console.error("Failed loading catalog:", err);
  }
}

// ==========================================================================
// FILTERS & SEARCH
// ==========================================================================

function filterProducts(category, event) {
  document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  loadCatalog(category);
}

function handleTextSearch(event) {
  const query = event.target.value.trim();
  loadCatalog('all', query);
}

// ==========================================================================
// CHAT & NEGOTIATION DRAWER
// ==========================================================================

function openChatDrawer(shopId, productId, title, price, imageUrl) {
  activeNegotiationItem = { shopId, productId, title, price };
  
  document.getElementById('chatMerchantName').textContent = `Vendor (${shopId.substring(0,6)})`;
  document.getElementById('chatMerchantAvatar').src = 'https://i.imgur.com/placeholder-avatar.png';
  
  document.getElementById('chatProductContext').innerHTML = `
    <img src="${imageUrl || 'https://via.placeholder.com/50'}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;" />
    <div style="font-size:12px;">
      <div style="font-weight:600;">${title}</div>
      <div style="color:var(--primary-accent); font-weight:700;">₦${Number(price).toLocaleString()}</div>
    </div>
  `;

  const chatHistory = document.getElementById('chatHistory');
  chatHistory.innerHTML = `
    <div class="chat-bubble">Hello! I am inquiring about the listing <strong>${title}</strong> priced at ₦${Number(price).toLocaleString()}.</div>
  `;

  document.getElementById('offerText').textContent = `Accept direct merchant offer for ₦${Number(price).toLocaleString()}?`;
  document.getElementById('offerBubble').classList.remove('hidden');

  document.getElementById('chatDrawer').classList.add('active');
  document.getElementById('chatDrawerBackdrop').classList.add('active');
}

function closeChatDrawer() {
  document.getElementById('chatDrawer').classList.remove('active');
  document.getElementById('chatDrawerBackdrop').classList.remove('active');
}

function respondToOffer(isAccepted) {
  const chatHistory = document.getElementById('chatHistory');
  const offerBubble = document.getElementById('offerBubble');

  if (isAccepted) {
    chatHistory.innerHTML += `
      <div class="chat-bubble user">Offer accepted! ₦${Number(activeNegotiationItem.price).toLocaleString()} routed securely into escrow.</div>
    `;
    offerBubble.classList.add('hidden');
  } else {
    chatHistory.innerHTML += `
      <div class="chat-bubble user">Offer declined. Proposing a custom counter-offer.</div>
    `;
    offerBubble.classList.add('hidden');
  }
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const chatHistory = document.getElementById('chatHistory');
  chatHistory.innerHTML += `<div class="chat-bubble user">${text}</div>`;
  input.value = '';
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function handleChatKey(event) {
  if (event.key === 'Enter') sendMessage();
}

// ==========================================================================
// GENERAL ACTION MODAL PLACEHOLDERS
// ==========================================================================

function openCreateShopModal() { alert("Initializing Merchant Onboarding Wizard..."); }
function openShopDirectory() { alert("Loading Verified Merchant Directory..."); }
function openEscrowInfo() { alert("Displaying BooMeden Secure Escrow Guidelines."); }
function openFilterModal() { alert("Advanced Filter Modal (Radius, Delivery, Price Bands)"); }
function openCart() { alert("Shopping cart is empty."); }
function toggleWishlist() { alert("Wishlist updated."); }
function viewMerchant(id) { alert("Opening Merchant Profile: " + id); }