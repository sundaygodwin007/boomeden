/* ===========================================
   GLOBAL.JS - BOOMEDEN SLIDE SYSTEM
   Job: Load any module HTML file and slide it in from the right
   Used by: Every sidebar button click
   =========================================== */

/**
 * FUNCTION 1: openPage
 * Purpose: Fetch a html file and slide it in on top of dashboard
 * @param {string} url  - The path to the html file. Ex: 'modules/skills.html'
 * @param {string} name - The name to show in topbar. Ex: 'Skills Hub'
 */
function openPage(url, name) {
  
  // STEP 1: CLEAN UP - Remove any old page that is already open
  // We don't want 2 pages stacked on top of each other
  const oldPage = document.querySelector('.page-slide');
  if (oldPage) {
    oldPage.remove(); // Delete it from the DOM
  }

  // STEP 2: CREATE THE CONTAINER
  // We create an empty div in memory. This will be our sliding page
  const page = document.createElement('div'); 
  page.className = 'page-slide'; // Give it the CSS class that makes it fixed + off-screen right
  
  // Add this new empty div to the <body>. It's invisible for now because transform: translateX(100%)
  document.body.appendChild(page); 

  // STEP 3: LOAD THE CONTENT
  // Use "fetch" to go and get the content of skills.html, chat.html etc
  fetch(url) // 1. Go get the file
    .then(response => response.text()) // 2. Convert the file to plain text/html
    .then(htmlContent => { 
      // 3. Put that html inside our new div
      page.innerHTML = htmlContent; 
      
      // 4. WAIT 10ms, then add "active" class. 
      // Why wait? So the browser first renders it off-screen, THEN animates it in. Makes slide smooth
      setTimeout(() => {
        page.classList.add('active'); // CSS: transform goes from 100% to 0
      }, 10);
    })
    .catch(error => {
      console.error('Error loading page:', error);
      page.innerHTML = '<h1>Error: Page not found</h1>'; // Show error if file doesn't exist
    });

  // STEP 4: UPDATE THE TOPBAR
  // Change "Command Center" to "← Skills Hub"
  // We also add a back button that calls closePage() when clicked
  document.querySelector('.top-center').innerHTML = 
    `<span class="back-btn" onclick="closePage()">←</span> ${name}`;
}

/**
 * FUNCTION 2: closePage
 * Purpose: Slide the current page out and delete it
 */
function closePage() {
  // 1. Find the currently open slide page
  const page = document.querySelector('.page-slide');
  
  if (page) {
    // 2. Remove "active" class first. This triggers CSS to slide it back to translateX(100%)
    page.classList.remove('active'); 
    
    // 3. WAIT 350ms = length of CSS transition. 
    // Then delete it completely from the DOM so it doesn't stay in memory
    setTimeout(() => {
      page.remove(); 
    }, 350); 
  }

  // 4. Reset topbar back to "Command Center"
  document.querySelector('.top-center').innerText = 'Command Center';
}