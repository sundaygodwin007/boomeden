# FIREBASE DEPLOYMENT CHECKLIST

## 1. Confirm Firebase project identity

- Make sure the signup page, login page, and OTP page all use the same Firebase project.
- Your current project appears to be a single Firebase project, so this part is already consistent.
- Do not mix different Firebase configs in different pages unless you are intentionally connecting to different projects.

## 2. Confirm Firebase Auth is enabled

Before public hosting:

- Open the Firebase Console
- Go to Authentication
- Enable Email/Password sign-in
- Confirm that the signup and login pages are using the same Firebase app configuration

## 3. Deploy Firestore rules

Use the Firestore rules from the project file:

- [firestore.rules](firestore.rules)

Important:

- Publish the rules in the Firebase Console
- Make sure the rules are active before you test real users

## 4. Test the OTP flow

You should verify that all of these work correctly:

- user signs up
- OTP is sent
- OTP is entered correctly
- OTP is verified successfully
- user profile data is saved after successful verification
- user is redirected to the correct page

## 5. Confirm the app is using Firebase Auth as the real session source

Your project should treat Firebase Auth as the main session truth.

Use this rule of thumb:

- Firebase Auth is the real logged-in state
- localStorage is only a small fallback helper
- the interlock page should read the live Firebase auth state and hide guest UI when the user is authenticated

## 6. Check for public secrets

Before hosting publicly, search your codebase for:

- service account keys
- admin private keys
- private API tokens
- backend secrets
- credentials in shared posts or public repos

If you find any of those, rotate them immediately.

## 7. Review all write operations

Before hosting publicly, make sure that:

- users can only write to their own user profile document
- OTP data is only writable in the intended way
- public users cannot update other users' records
- unauthorized users cannot create arbitrary documents

## 8. Only host publicly after these checks pass

You should only host publicly when all of the following are true:

- Firebase Auth is enabled
- Firestore rules are deployed
- the OTP flow works end-to-end
- no secrets are exposed in public code
- the auth state is correctly tied to a real Firebase session
- your write protections are tested

## 9. Final honest answer

This project is not automatically unsafe just because the frontend file was posted publicly.
But it is still a prototype-stage app and should not be treated as fully production-safe yet.

You can keep building it, but do not host it for real public users until the checklist above is completed.
