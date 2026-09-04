# BooMeden Firebase Password Reset Setup

This guide configures the custom password-reset flow used by:

- `auth/forgot.html`
- `auth/forgot.js`
- `auth/resetpassword.html`
- `auth/resetpassword.js`
- `functions/index.js`

## 1. Enable Email/Password Authentication

1. Open the Firebase Console.
2. Select the `boomer-431e6` project.
3. Open **Authentication**.
4. Open **Sign-in method**.
5. Select **Email/Password**.
6. Enable it.
7. Click **Save**.

The login and password-reset pages use Firebase Email/Password authentication.

## 2. Add Authorized Domains

1. In Firebase Console, open **Authentication**.
2. Open **Settings**.
3. Find **Authorized domains**.
4. Add these domains if they are not already listed:

```text
localhost
127.0.0.1
your-project.vercel.app
```

Replace `your-project.vercel.app` with the real Vercel domain. Add your custom domain too if BooMeden uses one.

The reset link created by `auth/forgot.js` returns the user to:

```text
/auth/resetpassword.html
```

Firebase will reject that return URL if its domain is not authorized.

## 3. Configure the Firebase Password Reset Email

The active flow uses Firebase Auth's built-in reset email. It does not require EmailJS, Cloud Functions, or the Blaze plan.

In Firebase Console, open **Authentication → Templates → Password reset** and customize the sender name, subject, and message.

The reset email returns users to `auth/resetpassword.html`, where they enter the new password on the BooMeden website.

## 4. Deploy Firestore Rules Separately

From the project root, run:

```powershell
firebase login
firebase use boomer-431e6
firebase deploy --only firestore:rules
```

This deploys the rules only. It does not deploy the old password function.

## 5. Test Locally

1. Start the site with Live Server.
2. Open `auth/login.html`.
3. Click **Forgot Password**.
4. Enter the email address of an existing Firebase user.
5. Click **Send Reset Email**.
6. Open the Firebase reset email.
7. Click its link and confirm it opens `auth/resetpassword.html`.
8. Enter a new password on the BooMeden page.
9. Confirm the new password.
10. Confirm the page says the password changed successfully.
11. Log in using the new password.

## 6. Test on Vercel

Repeat the same test using the deployed Vercel URL.

Also test in an incognito window to make sure the result does not depend on an old browser session.

## Troubleshooting

### The reset email does not arrive

Check:

- The email belongs to an existing Firebase Auth user.
- Email/Password sign-in is enabled.
- The email is not in spam.
- The Firebase Password reset template is saved.
- The browser console does not show a Firebase Auth error.

### The reset link opens an error page

Check:

- The Vercel domain is listed under Firebase Authorized domains.
- `auth/forgot.js` uses `/auth/resetpassword.html`.
- The deployed Vercel version contains the latest `auth/forgot.js`.

### The reset page says the link is invalid

Check:

- The link was not already used.
- The link has not expired.
- The URL still contains `mode=resetPassword`.
- The URL still contains `oobCode`.
- Firebase Auth is loaded before `auth/resetpassword.js`.

### The new password is rejected

Check:

- The password has at least 6 characters.
- Both password fields match.
- The reset link belongs to the same Firebase project as BooMeden.
