// ==========================================================================
// BOOMEDEN MERCHANT STUDIO - CONTROLLER SCRIPT
// ==========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

let currentMerchantShopId = null;
let uploadedLogoDataUrl = ""; // Holds the local file converted to data string

document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      await checkMerchantShopStatus(user.uid);
    } else {
      await checkMerchantShopStatus('test-merchant-uid');
    }
  });
});

// Checks if logged-in user already has a registered shop
async function checkMerchantShopStatus(uid) {
  try {
    const snapshot = await db.collection('shops').where('ownerId', '==', uid).get();
    
    if (snapshot.empty) {
      document.getElementById('setupShopView').classList.remove('hidden');
      document.getElementById('dashboardView').classList.add('hidden');
    } else {
      const shopDoc = snapshot.docs[0];
      currentMerchantShopId = shopDoc.id;
      const shopData = shopDoc.data();

      document.getElementById('dashStoreName').textContent = shopData.shopName;
      document.getElementById('dashStoreLogo').src = shopData.logoUrl || 'https://i.imgur.com/placeholder-avatar.png';

      document.getElementById('setupShopView').classList.add('hidden');
      document.getElementById('dashboardView').classList.remove('hidden');

      loadMerchantInventory(currentMerchantShopId);
    }
  } catch (err) {
    console.error("Error checking shop status:", err);
  }
}

// Converts selected logo image file into a local data string for display and storage
function previewLogoFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  document.getElementById('logoFileName').textContent = file.name;

  const reader = new FileReader();
  reader.onload = function(uploadEvent) {
    uploadedLogoDataUrl = uploadEvent.target.result; // Data URL string ready for database
  };
  reader.readAsDataURL(file);
}

// --- 1. HANDLE CREATE SHOP WIZARD SUBMISSION ---
async function handleCreateShop(event) {
  event.preventDefault();
  
  const shopName = document.getElementById('shopNameInput').value.trim();
  const category = document.getElementById('shopCategoryInput').value;
  const ownerId = auth.currentUser ? auth.currentUser.uid : 'test-merchant-uid';

  if (!uploadedLogoDataUrl) {
    alert("Please select a logo image file.");
    return;
  }

  try {
    const docRef = await db.collection('shops').add({
      shopName,
      category,
      logoUrl: uploadedLogoDataUrl, // Saves local image string directly
      ownerId,
      rating: 5.0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    currentMerchantShopId = docRef.id;
    alert("Storefront successfully initialized!");
    checkMerchantShopStatus(ownerId);
  } catch (err) {
    console.error("Failed creating shop:", err);
    alert("Error creating store. Please check connection.");
  }
}

// --- 2. LOAD MERCHANT INVENTORY ---
async function loadMerchantInventory(shopId) {
  const gridContainer = document.getElementById('merchantInventoryGrid');
  gridContainer.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">Synchronizing inventory...</p>`;

  try {
    const snapshot = await db.collection('products').where('shopId', '==', shopId).get();
    gridContainer.innerHTML = '';

    if (snapshot.empty) {
      gridContainer.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">No inventory items published yet. Click "Add New Inventory Item" above.</p>`;
      return;
    }

    snapshot.forEach(doc => {
      const item = doc.data();
      gridContainer.innerHTML += `
        <div class="inventory-card">
          <img src="${item.imageUrl || 'https://via.placeholder.com/220x160?text=Product'}" alt="${item.name}" />
          <div class="inventory-card-body">
            <h4>${item.name}</h4>
            <div class="inventory-price">₦${Number(item.price).toLocaleString()}</div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading inventory:", err);
  }
}

// --- 3. PRODUCT UPLOAD MODAL & SUBMISSION ---
function openProductModal() {
  document.getElementById('productModal').classList.add('active');
  document.getElementById('productModalBackdrop').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.getElementById('productModalBackdrop').classList.remove('active');
}

async function handleAddProduct(event) {
  event.preventDefault();

  if (!currentMerchantShopId) {
    alert("Error: No active shop found.");
    return;
  }

  const name = document.getElementById('prodName').value.trim();
  const price = Number(document.getElementById('prodPrice').value);
  const category = document.getElementById('prodCategory').value;
  const imageUrl = document.getElementById('prodImage').value.trim();
  
  const shopDoc = await db.collection('shops').doc(currentMerchantShopId).get();
  const shopName = shopDoc.exists ? shopDoc.data().shopName : "Verified Partner";

  try {
    await db.collection('products').add({
      name,
      price,
      category,
      imageUrl,
      shopId: currentMerchantShopId,
      shopName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    closeProductModal();
    document.getElementById('addProductForm').reset();
    alert("Product published successfully to MarketHub!");
    loadMerchantInventory(currentMerchantShopId);
  } catch (err) {
    console.error("Failed publishing product:", err);
    alert("Failed to publish item.");
  }
}