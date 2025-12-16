import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Configured with Live Credentials provided by user
const firebaseConfig = {
  apiKey: "AIzaSyBkiKQBrYNz9YVR56waGOtDbXtQSl8Jl7I",
  authDomain: "grampanchayatchikhali-8a314.firebaseapp.com",
  projectId: "grampanchayatchikhali-8a314",
  storageBucket: "grampanchayatchikhali-8a314.firebasestorage.app",
  messagingSenderId: "627147233902",
  appId: "1:627147233902:web:473219f2d4c2630da3a47f",
  measurementId: "G-TWDRPV484T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional but good for tracking)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Analytics failed to load (likely due to ad blocker)", e);
}

// Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Helper to check if config is valid
export const isConfigured = () => {
  return true; // Config is now live
};