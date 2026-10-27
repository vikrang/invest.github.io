# Nivesh — Firebase shared-cloud deployment

This project turns the uploaded standalone Nivesh HTML investment register into a hosted app with Google sign-in and a single shared Firestore portfolio. The existing investment/profile/income screens and backup/restore workflow are retained; **data is now saved to the shared cloud document**, not browser local storage.

## Security model

- Google Authentication handles sign-in. No Gmail passwords are collected or stored by this app.
- `firestore.rules` is the security boundary. Only the exact verified email addresses listed in `isApproved()` can read/write the shared portfolio and its history.
- All approved users share `shared/nivesh`. Any approved user can edit, restore backups, or restore history, so only approve people you trust.
- All other Firestore paths are denied. Client-side checks are not relied on for authorization.
- The Firebase web config in `firebase-config.js` is a public app identifier, **not** an admin credential. Never add service-account private keys or private API secrets to the HTML.
- This app does not encrypt investment data end-to-end. Firestore uses Google-managed encryption at rest/in transit. Secure your Google/Firebase project with MFA and tightly controlled project-owner access.

## One-time setup

### 1. Create a Firebase project
1. Open https://console.firebase.google.com/ and create a project.
2. In **Build → Authentication → Sign-in method**, enable **Google**.
3. In **Authentication → Settings → Authorized domains**, ensure your Firebase Hosting domain is present.
4. In **Build → Firestore Database**, create a database in production mode. Choose a region appropriate for your requirements and data-residency considerations. Firestore region choices are important; choose before creating the database.

### 2. Register a web app and configure it
1. In Project settings → General → Your apps, add a **Web app**.
2. Copy the Firebase web configuration.
3. Edit `firebase-config.js` and replace every `PASTE_...` / `YOUR_PROJECT_ID` placeholder with the exact values from the Firebase Console. Keep the `window.NIVESH_FIREBASE_CONFIG` property names as shown.

### 3. Set the allowed Gmail accounts (mandatory)
1. Open `firestore.rules`.
2. Replace `"replace-with-approved@gmail.com"` with the exact approved Gmail address(es), for example:
   ```text
   "owner@gmail.com",
   "familymember@gmail.com"
   ```
   Addresses are case-sensitive in rule string matching; use the same canonical lowercase email shown by Google sign-in. Remove the placeholder. Do not use a wildcard or allow everyone.
3. The allowlist in `firestore.rules` is the actual server-enforced authorization. Adding a person only to the HTML/config does not grant access.
4. If you later need to add/remove an address, edit and redeploy the rules. Access is revoked by the rules even if the person previously signed in.

### 4. Install Firebase CLI on Windows
Install Node.js LTS from https://nodejs.org/ if needed. Then open PowerShell in this project folder and run:
```powershell
npm install -g firebase-tools
firebase login
```
Choose the Google account that owns the Firebase project.

### 5. Set the project and deploy
Edit `.firebaserc`, replacing `YOUR_PROJECT_ID` with your actual Firebase project ID, then run:
```powershell
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes,hosting
```
If `firebase use --add` asks you to choose a project, select the project you created. Firebase Hosting prints the live URL after deployment.

You can test the hosting preview first with:
```powershell
firebase emulators:start
```
For local emulation, Firebase CLI emulator setup may prompt you to install/select Hosting, Authentication and Firestore emulators. Production authorization must still be tested against deployed rules.

## First launch and existing data

1. Open the hosted URL.
2. Sign in with an allowlisted Google account.
3. The first approved sign-in initializes an empty shared portfolio. If your old standalone file already has data in its browser, use its **Tools → Back up** first, then in the new hosted app use **Tools → Restore** to import that JSON. Restore replaces the shared portfolio for everyone; the app makes a history snapshot first.
4. Verify profiles, investments, income, maturity calculations, and totals before relying on the shared copy.

## Ongoing use and operational cautions

- Everyone on the allowlist sees and can edit the same portfolio. There is no per-user private area or view-only role in this Option A build.
- A backup JSON contains personal/financial data. Store it in an encrypted, access-controlled location and delete temporary copies securely.
- The app creates a cloud history entry before a manual restore; history is not a complete per-keystroke audit log. Anyone approved can restore prior snapshots.
- Concurrent editing by two users at the same time can result in the later save replacing the earlier save. For simultaneous multi-user editing, add transaction-based version checks/locking and conflict UI before production use.
- Data access and Firebase usage may incur charges depending on usage and pricing. Set budget alerts and review Firebase pricing.
- This conversion preserves the standalone app's current market-data lookups, which may still depend on third-party endpoints and browser availability. It does not add a private server/API for market quotes.
- Consider having a security professional review the rules and the deployment before storing sensitive client or third-party financial data.

## Files
- `index.html` — Nivesh app, updated for Google sign-in and Firestore storage.
- `firebase-config.js` — your Firebase web app config placeholders.
- `firestore.rules` — server-enforced Gmail allowlist and deny-by-default rules.
- `firebase.json`, `firestore.indexes.json`, `.firebaserc` — Firebase deployment configuration.
