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

## 3. Configure the OTP EmailJS Template

The custom OTP flow sends the email through the EmailJS template configured in `functions/index.js`.

Open the EmailJS dashboard and select:

```text
Service: service_oo5adci
Template: template_sh4mbi3
```

Use these template variables:

```text
{{to_email}}
{{otp_code}}
```

Example subject:

```text
Your BooMeden verification code
```

Example message:

```text
Hello,

Your BooMeden password reset verification code is:

{{otp_code}}

This code expires in 5 minutes. If you did not request a password reset, you can ignore this email.

Regards,
The BooMeden Team
```

Remove any old Firebase reset-link text or `{{reset_link}}` variable from this template. The custom OTP flow must send a code, not a reset link.

Set the EmailJS sender name to `BooMeden` and use a professional reply-to address you control.

## 4. Deploy the Secure Custom OTP Functions

The custom OTP flow now uses three protected Cloud Functions:

```js
requestPasswordOtp
verifyPasswordOtp
confirmPasswordOtpReset
```

The server generates and hashes the OTP, sends it through EmailJS, verifies it, creates a short-lived reset ticket, and changes the password only after that ticket is valid.

This custom OTP flow requires Firebase Cloud Functions, so the Firebase project must use the Blaze plan. Functions still have a no-cost monthly allowance, but billing must be enabled.

From the project root, run:

```powershell
firebase login
firebase use boomer-431e6
firebase deploy --only functions:requestPasswordOtp,functions:verifyPasswordOtp,functions:confirmPasswordOtpReset
```

The old callable function was:

```text
resetPasswordWithOTP
```

If that old function was already deployed, remove it from Firebase Functions. It is no longer used.

Do not deploy the old function again.

## 5. Deploy Both Sides of the Flow

Deploy the Functions after upgrading the Firebase project to Blaze:

```powershell
firebase deploy --only functions:requestPasswordOtp,functions:verifyPasswordOtp,functions:confirmPasswordOtpReset
```

Then push the updated browser files and redeploy the Vercel project. The browser files include `auth/forgot.js`, `auth/resetpassword.js`, and their HTML files.

If the live site still sends a reset link after both deployments, open the live site's browser developer tools and confirm that `auth/forgot.js` contains `requestPasswordOtp` rather than `sendPasswordResetEmail`.

## 6. Deploy Firestore Rules Separately

From the project root, run:

```powershell
firebase login
firebase use boomer-431e6
firebase deploy --only firestore:rules
```

This deploys the rules only. It does not deploy the old password function.

## 7. Test Locally

1. Start the site with Live Server.
2. Open `auth/login.html`.
3. Click **Forgot Password**.
4. Enter the email address of an existing Firebase user.
5. Click **Send OTP**.
6. Enter the 6-digit OTP from your email.
7. Click **Verify OTP**.
8. Enter a new password on the reset page.
9. Confirm the new password.
10. Confirm the page says the password changed successfully.
11. Log in using the new password.

## 8. Test on Vercel

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
