import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Configured with Live Credentials provided by user
const firebaseConfig = {
  apiKey: "AIzaSyAjsFYYegR3pcS2Jxe4VKwu3swGB5m1rbA",
  authDomain: "grampanchayat-chikhali-175095.firebaseapp.com",
  projectId: "grampanchayat-chikhali-175095",
  storageBucket: "grampanchayat-chikhali-175095.appspot.com",
  messagingSenderId: "911265701412",
  appId: "1:911265701412:web:587e5d7565dbe8f0c902b1",
  measurementId: "G-4SPEJT6BCW"
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
