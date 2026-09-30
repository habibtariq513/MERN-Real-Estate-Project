// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-56661.firebaseapp.com",
  projectId: "mern-estate-56661",
  storageBucket: "mern-estate-56661.firebasestorage.app",
  messagingSenderId: "768886110380",
  appId: "1:768886110380:web:3b036e183a7865629fc709"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);