# IMPORTANT

## What you must understand before hosting

### 1. This is a frontend-first app
Your app is built with:

- HTML pages for the UI
- JavaScript files for the logic
- Firebase for authentication and database access
- EmailJS for OTP email sending

That means the browser is handling part of the flow, so security must be protected carefully.

### 2. The real security source should be Firebase Auth
Your app should treat Firebase Auth as the main login system.

Use this idea:

- Firebase Auth = real login state
- localStorage = small fallback helper only
- Do not rely only on localStorage for real protection

### 3. Your Firestore rules must be locked down
Before public hosting, the database must be protected so only the correct user can read or update their own data.

The main protection rule is:

- user can only access their own profile document
- OTP data should be limited and controlled
- no public write access to sensitive data

### 4. Do not share secrets publicly
Do not post or share:

- Firebase Admin private keys
- service account JSON files
- Cloud Function secrets
- backend tokens
- private credentials

Frontend public values such as Firebase web config and EmailJS public IDs are usually not the main problem, but they should still be handled carefully.

### 5. Your app is not fully production-safe yet
It is safe enough for learning, testing, and internal prototypes.

It is not yet fully ready for real public users until:

- Firebase Auth is enabled
- Firestore rules are deployed
- OTP flow works end-to-end
- the session state is confirmed through Firebase Auth
- no secrets are exposed publicly

### 6. The next major work
The next important work is:

- make signup/login/OTP/interlock use one clean auth flow
- hide the guest UI correctly for logged-in users
- keep the logout button out of the main view for now
- prepare the app for safer public hosting later

## What you do not need to memorize

You do not need to write every line of code into your notebook.

You only need to understand these things:

1. Which page starts the process
2. Which JavaScript file handles the logic
3. What data is stored in localStorage
4. Which Firebase service is used
5. Which page the app redirects to next
6. Which page decides if the user is a guest or logged-in

That is enough for now.
