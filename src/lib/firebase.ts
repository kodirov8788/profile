import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWXDvOhHfz7wwNS2YRxIjJh8rEnn-DWOc",
  authDomain: "profile-167df.firebaseapp.com",
  projectId: "profile-167df",
  storageBucket: "profile-167df.firebasestorage.app",
  messagingSenderId: "29979722821",
  appId: "1:29979722821:web:ee5e2a25c6919d83998f2c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
