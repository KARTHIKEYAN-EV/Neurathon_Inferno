// 📄 frontend/src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC22vMh_WQlEtQJYcCKkfkvd9Zd-_LvYD8",
  authDomain: "neurathon-inferno.firebaseapp.com",
  projectId: "neurathon-inferno",
  storageBucket: "neurathon-inferno.firebasestorage.app",
  messagingSenderId: "132799361698",
  appId: "1:132799361698:web:9b7975dd21bea353061dfb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;