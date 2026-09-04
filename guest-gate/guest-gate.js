// this file controls the shared login and signup popup for visitors who are not signed in.
(function () {
  // this checks the same browser session record created by the existing login flow.
  function hasLoggedInUser() {
    return Boolean(localStorage.getItem('boomedenUser'));
  }

  // this builds the popup only when a guest tries to use a protected action.
  function showGuestGate() {
    if (document.querySelector('.guest-gate')) return;

    const overlay = document.createElement('div');
    overlay.className = 'guest-gate';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'guest-gate-title');

    overlay.innerHTML = `
      <div class="guest-gate-card">
        <button class="guest-gate-close" type="button" aria-label="Close">&times;</button>
        <div class="guest-gate-badge">B</div>
        <h2 id="guest-gate-title">Join BooMeden</h2>
        <p>Sign in to continue exploring modules, engaging with posts, and building your place in the ecosystem.</p>
        <div class="guest-gate-actions">
          <a class="guest-gate-login" href="../auth/login.html">Log In</a>
          <a class="guest-gate-signup" href="../auth/index.signup.html">Sign Up</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // this closes the popup when the visitor uses the top-right X button.
    overlay.querySelector('.guest-gate-close').addEventListener('click', () => overlay.remove());

    // this also closes the popup when the visitor clicks the shaded area outside the card.
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) overlay.remove();
    });
  }

  // this identifies buttons, links, modules, and feed actions that require an account.
  function isProtectedAction(target) {
    return target.closest([
      '#authBtn',
      '#signupLink',
      '.header-nav a',
      '.action-item',
      '.profile-link',
      '.profile-top-right',
      '.side-menu a',
      '.nav-group a',
      '.floating-bottom-nav a',
      '.view-interlock-btn',
      '.post-action-btn',
      '.btn-main',
      '.btn-follow'
    ].join(','));
  }

  // this runs before the existing page click handlers so guests see the popup instead of a broken route or like request.
  document.addEventListener('click', (event) => {
    if (hasLoggedInUser()) return;

    const protectedAction = isProtectedAction(event.target);
    if (!protectedAction) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    showGuestGate();
  }, true);
})();
