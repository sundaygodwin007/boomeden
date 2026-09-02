# BOOMEDEN SECURITY NOTES

## 1. What is usually safe to share

These values are usually public in a frontend web app and are not the same as a password:

- Firebase web config values such as:
  - apiKey
  - authDomain
  - projectId
  - storageBucket
  - messagingSenderId
  - appId
- EmailJS public service ID
- EmailJS template ID
- EmailJS public key

These are frontend-facing values. They are not the same as a secret backend token.

## 2. What is risky to share

Do not share or publish anything that contains:

- Firebase service account JSON
- Firebase Admin private key
- Cloud Functions secret values
- API tokens
- Private backend credentials
- any password or secret key stored in code or config

If you published code that contains any of these, rotate them immediately in the Firebase or EmailJS dashboard.

## 3. What the current app is doing

Your current app is a frontend-first prototype:

- the user signs up
- OTP is sent
- the page redirects to interlock
- the interlock page tries to detect whether the user is logged in

The main issue is that the user session is still partly controlled by browser storage, which is fine as a fallback, but the real source of truth should be Firebase Auth.

## 4. Important security truth

The biggest security risk in your current setup is not the Firebase web config itself.
The biggest risk is:

- weak Firestore rules
- trusting browser storage only
- exposing too much frontend logic publicly
- writing sensitive data from the browser without strict controls

## 5. Hardened Firestore rules

Use this as your first protected rule set:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow get: if request.auth != null && request.auth.uid == userId;
      allow create, update: if request.auth != null
        && request.auth.uid == userId
        && request.resource.data.uid == userId
        && request.resource.data.email is string
        && request.resource.data.isVerified is bool;
      allow delete: if false;
    }

    match /otps/{email} {
      allow create, update: if request.resource.data.code is number
        && request.resource.data.expiresAt is number;
      allow get: if request.auth != null && request.auth.token.email == email;
      allow delete: if false;
    }
  }
}
```

## 6. Best practice for the app flow

Use this order:

1. Sign up with Firebase Auth
2. Send OTP through EmailJS
3. Verify OTP
4. Save profile data only after correct OTP verification
5. Store a small logged-in session value locally only as a fallback
6. Let Firebase Auth be the real session manager
7. On interlock, read the Firebase auth state and hide the guest UI when a real user exists

## 7. What not to use for production

Avoid relying only on:

- localStorage for authentication
- plain frontend-only session flags
- direct browser writes to user-sensitive collections without strict rules

## 8. What to do before hosting publicly

Before real public hosting, make sure you have:

- Firebase Auth enabled
- Firestore rules deployed
- email OTP flow tested
- no secret keys committed to public code
- no private credentials in shared posts or public repositories
- a proper security review of all write operations

## 9. Best honest answer

Your code is not automatically unsafe just because you posted the frontend file publicly.
But the project is still in a prototype stage and should not be treated as fully production-safe yet.

It is okay to keep building, but do not host it for real public users until:

- the auth flow is fully Firebase Auth based
- Firestore rules are locked down
- no secrets are exposed
- all session behavior is tested properly

## 10. Final next step

Next, we should work on:

1. turning the interlock page into a true authenticated feed page
2. removing the top logout button from the main area for now
3. cleaning the auth/session flow one more time so it feels like a real app
4. preparing the app for a safer public launch path
