import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace these with your actual Firebase config keys from the console
const firebaseConfig = {
  apiKey: "AIzaSyB...", // REPLACE THIS
  authDomain: "dynamic-website-8d3b9.firebaseapp.com",
  projectId: "dynamic-website-8d3b9",
  storageBucket: "dynamic-website-8d3b9.appspot.com",
  messagingSenderId: "853822770251", 
  appId: "..." // REPLACE THIS
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
