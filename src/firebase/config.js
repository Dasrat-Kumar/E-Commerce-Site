// Firebase setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu03aZYHQz4_4rftxiAFvLPXJULMqqaqM",
  authDomain: "e-commerce-bdee7.firebaseapp.com",
  projectId: "e-commerce-bdee7",
  storageBucket: "e-commerce-bdee7.firebasestorage.app",
  messagingSenderId: "166814341319",
  appId: "1:166814341319:web:fe872ddab6364028a006e2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
