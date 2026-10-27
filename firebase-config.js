/*
 * Nivesh Firebase web app configuration.
 * Copy the Firebase config from Firebase Console > Project settings > Your apps > Web app.
 * These identifiers are not passwords, but do not place service-account private keys here.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBVezYo-OXLf6y6-0Xtnh7b7Y0RcaGGSaM",
  authDomain: "nivesh-1d768.firebaseapp.com",
  projectId: "nivesh-1d768",
  storageBucket: "nivesh-1d768.firebasestorage.app",
  messagingSenderId: "790372355115",
  appId: "1:790372355115:web:e6f9f76b7f4276e4d7ae6e"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.firebaseApp = firebase.app();
window.auth = firebase.auth();
window.db = firebase.firestore();


