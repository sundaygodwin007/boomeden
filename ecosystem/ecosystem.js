// ===============================================
// SECTION 1: APP INITIALIZATION
// LINES: 1 - 1
// WHAT IT DOES: Waits for HTML to load before running anything
// WHY: Prevents errors if JS runs too early
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
// ===============================================
// IF ANYTHING BREAKS, CHECK THIS SECTION FIRST.
// IF A BUTTON DOES NOT NAVIGATE, CHECK:
// 1) the route names match the text in HTML exactly
// 2) the selector '.action-item' is finding the correct cards
// 3) the DOM is loaded before the script runs
// ===============================================
// SECTION 2: COLLECT ALL THE TOOLS WE NEED
// LINES: 2 - 3
// WHAT IT DOES: Grab buttons and search box from HTML and put them in variables
// WHY: So we don't have to search the DOM 10 times later
// ===============================================
const doorCards = document.querySelectorAll('.action-item'); // Gets ALL doors: Sidebar + Top 4 Cards
const searchInput = document.querySelector('.search-container input'); // Gets top search bar
const topNavLinks = document.querySelectorAll('.header-nav a'); // NEW: Grab top nav links too

// this finds the signup link so it can be shown to guests and hidden for signed-in users.
const signupLink = document.getElementById('signupLink');
const authBtn = document.getElementById('authBtn');

// this reads the same login record created by the login page.
const savedUser = localStorage.getItem('boomedenUser');

// this keeps both auth actions available so a signed-in user can test logout immediately.
if (signupLink) signupLink.style.display = savedUser ? 'none' : 'inline-flex';
if (authBtn) {
  authBtn.style.display = 'inline-flex';
  authBtn.textContent = savedUser ? 'Log Out' : 'Sign In';
}

// ===============================================
// IF ANYTHING BREAKS, CHECK THIS ROUTING MAP.
// IF THE PAGE DOES NOT MOVE TO ANOTHER PAGE, CHECK THAT:
// 1) the route key matches the text in the HTML exactly
// 2) the target path exists in the project
// 3) the button text is not different in case or spacing
// ===============================================
// SECTION 3: THE BRAIN - ROUTING MAP
// LINES: 4 - 18
// WHAT IT DOES: Dictionary that says "Button Name" → "Go to this page"
// WHY: Single Source of Truth. Change links here once, affects whole app
// RULE: The KEY must match the <span> or <h4> text in HTML 100%
// ===============================================
const routes = {

  // SIDEBAR DOORS - NOTE: 'skillhub' is lowercase to match your HTML
  'Ecosystem': '../ecosystem/ecosystem.html',
  'Home': '../interlock/interlock.html',
  'Loops': '../loops/loops.html',
  'Chat': '../chat/chat.html',
  'BooM AI': '../boom-ai/boom-ai.html',
  'Market': '../markethub/markethub.html',
  'Explore': '../explore/explore.html',
  'skillhub': '../skillhub/skillhub.html', // lowercase to match HTML

  // THE 4 TOP CARDS
  'Interlock': '../interlock/interlock.html',
  'AI Studio': '../boom-ai/boom-ai.html',
  'Creator Fund': '../creator-fund/creator-fund.html', // fixed: was.../
  'SkillHub': '../skillhub/skillhub.html',

  // NEW: TOP NAV LINKS - Must match <span> text in HTML exactly
  'TV': '../boom-tv/boom-tv.html',
  'Fund': '../creator-fund/creator-fund.html',

  // NEW: QUICK DIRECTORY BOTTOM LEFT PANEL - Add your real links here when ready
  'Community': '../community/community.html',
  'Live Rooms': '../live-rooms/live-rooms.html',
  'Events': '../events/events.html',
  'Analytics': '../analytics/analytics.html',
  'Dashboard': '../dashboard/dashboard.html',
  'Brand Directory': '../brand-directory/brand-directory.html'
};

// ===============================================
// SECTION 4: THE ENGINE - MAKES ALL DOORS CLICKABLE
// LINES: 19 - 56
// WHAT IT DOES: Loop through every.action-item and give it superpowers
// HOW: Click → Spinner → Wait 0.8s → Go to page OR Show Coming Soon
// WORKS FOR: Sidebar AND Top 4 Pulse Cards
// ===============================================
doorCards.forEach(card => {

  // LINE 22: Get name from <span> for sidebar OR <h4> for top cards
  const nameElement = card.querySelector('span') || card.querySelector('h4');
  if (!nameElement) return; // Safety check

  const doorName = nameElement.textContent.trim(); // Get the button name

  card.addEventListener('click', (e) => {
    e.preventDefault(); // Stop HTML link and onclick from working. We use JS instead

    card.classList.add('loading'); // Add loading state for CSS dim effect

    const icon = card.querySelector('i'); // Get the icon inside this card
    let originalIconClass = ''; // FIX: declare empty first
    if(icon){ // FIX: only run if icon exists
      originalIconClass = icon.className; // Save old icon so we can reset
      icon.className = 'fa-solid fa-spinner fa-spin'; // Change to spinner
    }

    setTimeout(() => { // Wait 0.8 seconds to feel premium
      const targetUrl = routes[doorName]; // Check if this door exists in our MAP

      if (targetUrl) { // If door exists
        window.location.href = targetUrl; // GO TO THE PAGE
      } else { // If door doesn't exist in MAP
        alert(`${doorName} is Coming Soon!`);
        if(icon){ icon.className = originalIconClass; } // FIX: only reset if icon exists
        card.classList.remove('loading'); // remove the dim/loading effect
      }
    }, 800);
  });
});

// ===============================================
// IF THE SEARCH BOX BREAKS, CHECK THIS SECTION.
// IF THE INPUT DOES NOT RESPOND, CHECK:
// 1) the search input exists in the HTML
// 2) the event listener is attached after DOMContentLoaded
// 3) the search box has been loaded before this script fires
// ===============================================
// SECTION 5: SEARCH BAR LOGIC
// LINES: 57 - 68
// WHAT IT DOES: When user presses Enter in search, show alert
// NOTE: This is V1. Week 3 we will connect to real database
// ===============================================
if (searchInput) { // Safety check in case search doesn't exist
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        searchInput.value = ''; // Clear the input
      }
    }
  });
}

// ===============================================
// SECTION 6: TOP NAV HIGHLIGHTER + CLICK ENGINE
// LINES: 69 - 76
// WHAT IT DOES: Automatically adds "active" class to current page in top nav AND makes it clickable
// WHY: So user knows "I am on Ecosystem page right now" AND uses the routes brain
// ===============================================
const currentPage = window.location.pathname.split('/').pop(); // Gets "ecosystem.html" from URL
topNavLinks.forEach(link => {
  // 1. Highlight active page
  if (link.getAttribute('href') && link.getAttribute('href').includes(currentPage)) {
    link.classList.add('active'); // Add blue highlight
  }

  // 2. NEW: Make top nav use the same brain as doorCards
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Stop default link
    const linkText = link.querySelector('span')? link.querySelector('span').textContent.trim() : link.textContent.trim(); // Get text from span OR direct
    const targetUrl = routes[linkText]; // Check brain

    if (targetUrl) { // If door exists
      window.location.href = targetUrl; // GO TO THE PAGE
    } else { // If door doesn't exist in MAP
      alert(`${linkText} is Coming Soon!`);
    }
  });
});

// ===============================================
// SECTION 7: CLOSING THE APP
// LINES: 77 - 77
// // this helps to redirect the boomtv channel at the top right panel to another page....
// // always declare a variable and give it a name then i used query selector cos its universal and can get both class name and Id
const startChannelBtn = document.querySelector('.btn-main');

// then i add an event-listener function so it listens to the event going on
if(startChannelBtn){ // ADDED SAFETY CHECK
  startChannelBtn.addEventListener('click', (e) => {
    e.preventDefault(); // ADDED: Stop default button behavior
    // then redirect
    window.location.href = '../boom-tv/boom-tv.html';
  });
}

// ===============================================
// ===============================================
// SECTION 8: CLOSING THE APP
// LINES: 77 - 77

}); // End of DOMContentLoaded

// ===============================================
// NOTES SECTION - YOUR LEARNING NOTES
// KEEP THESE. THIS IS YOUR CHEAT SHEET
// ===============================================
// LINE 2: querySelectorAll('.action-item') = Grabs all doors. Auto-scales to 10 doors
// LINE 4: routes = {} = The brain. Change links here only
// LINE 22: querySelector('span') || querySelector('h4') = Works for both sidebar and cards
// LINE 28-36: Spinner + setTimeout = Makes it feel premium, not cheap
// LINE 42: e.preventDefault() = Kills the old onclick="location.href='#'"