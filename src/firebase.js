// src/firebase.js

// Import the necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration (You get this from your Firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyDN3slQa3lzrTWWRd6qOsUPi7VHIKr6qBw",
    authDomain: "newproj-4c059.firebaseapp.com",
    databaseURL: "https://newproj-4c059-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "newproj-4c059",
    storageBucket: "newproj-4c059.appspot.com",
    messagingSenderId: "872195487749",
    appId: "1:872195487749:web:c571cb18044fd14516c46c",
    measurementId: "G-Y2CS506VXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore and export it
const provider = new GoogleAuthProvider();

export const getPlayerName = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data().name : "Unknown";
  };

export {  provider, signInWithPopup, signInWithEmailAndPassword };