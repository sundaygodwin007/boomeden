# Boomeden Auth Flow Understanding

This file explains the JavaScript logic in the auth system in a simple, beginner-friendly way.

---

## 1) Login flow

File: auth/login.js

### What happens in order?

1. The page loads.
2. It grabs the login button from the HTML.
3. When the user clicks the button, the code reads the email and password.
4. It checks if the fields are empty.
5. If empty, it shows an alert and stops.
6. If filled, it calls Firebase Authentication.
7. If the email and password are valid, Firebase signs the user in.
8. The app saves the user in localStorage.
9. It redirects the user to the interlock page.

### Why localStorage?

Because the app wants to remember the user even before Firebase finishes loading the full auth session. This is a fallback so the app still knows who the user is.

### Important JavaScript idea

This is a promise-based flow:

- signInWithEmailAndPassword(auth, email, password)
- then ... success
- catch ... error

This means:
- try to sign in
- if it works, run success code
- if it fails, run error code

### Example explanation

```js
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    localStorage.setItem('boomedenUser', JSON.stringify({
      uid: user.uid,
      email: user.email
    }));
    window.location.href = '../interlock/interlock.html';
  })
  .catch((error) => {
    alert('Login failed: ' + error.message);
  });
```

This says:
- if sign-in works, save the user and go to the app
- if sign-in fails, show the Firebase error

---

## 2) Interlock page logic

File: interlock/interlock.js

This page decides whether the user is a guest or a logged-in user.

### It does this:

1. Initialize Firebase.
2. Get the auth object.
3. Listen for auth state changes using onAuthStateChanged.
4. If a user exists:
   - show the post area
   - hide guest banner
5. If no user exists:
   - show guest banner
   - hide create-post section

### Why this is important?

The app must know whether to show the normal home feed or the guest feed.

### Example

```js
onAuthStateChanged(auth, (user) => {
  if (user) {
    updateGuestUi(user);
  } else {
    updateGuestUi(fallbackUser);
  }
});
```

This means:
- Firebase is constantly checking the session
- whenever the login state changes, the UI updates

---

## 3) Reset password flow

Files:
- auth/resetpassword.js
- functions/index.js

### What happens in order?

1. The user enters a new password.
2. The page checks that both fields are filled.
3. It checks that the passwords match.
4. It calls the Cloud Function.
5. The backend finds the user by email.
6. The backend updates the password.
7. The page alerts success.
8. The user is redirected to interlock.

### Why a Cloud Function?

Because updating passwords from the frontend is unsafe and not best practice.

The backend is trusted and can securely update Firebase Auth users.

### Example

```js
await resetPasswordWithOTP({
  email: userEmail,
  newPassword: newPassword
});
```

This is the frontend calling the backend function.

### Backend side

```js
exports.resetPasswordWithOTP = functions.https.onCall(async (data) => {
  const email = data.email;
  const newPassword = data.newPassword;

  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().updateUser(user.uid, {
    password: newPassword
  });
});
```

This means:
- take email and new password
- find the Firebase user
- update the password

---

## 4) Profile page logic

File: profile/profile.js

This file loads the current user’s details and fills the profile UI.

### It does this:

1. Initializes Firebase
2. Reads the current auth user
3. Fills in the profile name and email
4. Shows a default username and phone if needed
5. Adds logout behavior

### Example

```js
onAuthStateChanged(auth, (user) => {
  if (user) {
    setProfileData(user);
  } else {
    setProfileData(fallbackUser);
  }
});
```

That means the profile page always tries to match the current Firebase session.

### Logout logic

```js
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  localStorage.removeItem('boomedenUser');
  window.location.href = '../auth/login.html';
});
```

This means:
- sign the user out
- clear local saved user
- send them back to login

---

## 5) Why the login and auth flow works together

The system works because every page shares the same idea:

- Firebase holds the real live login state
- localStorage stores a quick fallback snapshot
- the app checks auth state before showing protected UI

This is the pattern:

- login page signs in
- interlock page reads session
- profile page reads session
- logout clears the session

---

## 6) Main problem we fixed

The reset password system had a mismatch:

- the frontend called one Cloud Function name
- the backend exported a different name

Because of that, the request did not match correctly.

We fixed this by making both sides match:

- frontend: resetPasswordWithOTP
- backend: resetPasswordWithOTP

---

## 7) Final takeaway

The auth system is not random code. It follows a clear pattern:

- collect user input
- validate it
- send it to Firebase or backend
- store fallback user info
- redirect based on result
- show/hide UI based on login state

This is the full idea behind the app’s auth flow.

---

## 8) Simple memory phrase

If you forget the flow, remember this:

Input -> Validate -> Firebase -> Save session -> Redirect -> Update UI

That is the whole app auth flow in one line.

## 9. Do not stress about every line
You are not expected to memorize every line of code.

You only need to remember:
- what each file is responsible for
- what data is being received
- where the data is saved
- where the user is redirected next
