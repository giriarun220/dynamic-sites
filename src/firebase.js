import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Use Vite Environment Variables for production readiness
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB...",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dynamic-website-8d3b9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dynamic-website-8d3b9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dynamic-website-8d3b9.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "853822770251", 
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
