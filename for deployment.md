# BooMeden Deployment Checklist

## Before deployment

- Run the site locally with Live Server.
- Test the root URL on a narrow mobile viewport and a wide desktop viewport.
- Confirm mobile opens Interlock and desktop opens Ecosystem.
- Test signup, signup OTP verification, login, logout, Firebase password-reset email, and the guest popup.
- Add the deployed Vercel domain and local development domain to Firebase Authentication Authorized domains.
- Test feed loading, search, likes, comments, profile access, and dashboard access.
- Test the same flows in a normal browser and an incognito window.
- Check that guests cannot create comments or likes without signing in.

## Firestore rules

The root Firebase configuration now points to `firestore.rules`.

The root `index.html` is a local entry shim. The responsive redirect lives in `deployment/index.html`, and the Vercel root rewrite points `/` to that file. `vercel.json` must remain at the project root because Vercel reads deployment configuration there.

```powershell
firebase login
firebase use boomer-431e6
firebase deploy --only firestore:rules
```

After deployment, confirm in the Firebase Console that the new rules are active.

## Vercel deployment

- Push the latest changes to Git.
- Deploy the repository through Vercel.
- Open the deployed root URL, not only a local Live Server URL.
- Use `Ctrl + F5` or an incognito window after deployment to avoid an old cached page.
- Confirm `/ecosystem` opens Ecosystem and `/interlock` opens Interlock.

## Production blockers to resolve

- Move signup OTP generation and verification into a trusted Cloud Function before public launch. Browser code and localStorage must not be treated as a secure OTP authority.
- The forgot-password flow now uses Firebase Auth's built-in reset email and does not require Cloud Functions or the Blaze plan.
- Do not deploy the disabled legacy password-reset callable unless it is removed completely.
- Review rate limits and abuse protection for EmailJS and Firebase writes.
- Add monitoring for failed authentication, Firestore permission errors, and failed page loads.
- Keep a Git backup and test a Vercel preview deployment before changing production.

## Final launch test

1. Create a fresh test account.
2. Verify the OTP and complete the profile.
3. Log out and confirm the guest popup returns.
4. Log in again and confirm protected actions work.
5. Like and comment on a post, then refresh and repeat in another browser session.
6. Verify that one user cannot edit another user's profile or comment.