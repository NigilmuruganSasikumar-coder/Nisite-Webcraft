// ==========================================
// OFFBEAT Parcel Management
// database.js
// Firebase Firestore
// ==========================================

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

// Firestore
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==========================================
// Firebase Configuration
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyBu6khcwHzolEjPfFov8DabhbFAV8L_uwA",
    authDomain: "offbeat-history.firebaseapp.com",
    projectId: "offbeat-history",
    storageBucket: "offbeat-history.firebasestorage.app",
    messagingSenderId: "768477848078",
    appId: "1:768477848078:web:ec8d4c0ebdfd7ef40fd25f",
    measurementId: "G-5QZ1C3WBMS"

};

// ==========================================
// Initialize Firebase
// ==========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ==========================================
// Export
// ==========================================

export {
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
};