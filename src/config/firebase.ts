import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBKzJhwoCXUUvwMgnEgob2iG5b3oobVIfQ",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "rizumu-50f7c.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "rizumu-50f7c",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "rizumu-50f7c.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "757998642379",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:757998642379:web:7572464982756621d1674e",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Z2MNN4QJ7P",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return {
    user: result.user,
    idToken,
  };
};

export default app;
