import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
// import { getFunctions, useEmulator as useFunctionsEmulator } from 'firebase/functions';

// Replace these with your Firebase configuration details
const firebaseConfig = {
    apiKey: "AIzaSyCJ9ins28-rDTZEjVUEkF1ingltj6uJ7WU",
    authDomain: "button-logger-pwa.firebaseapp.com",
    databaseURL: "https://button-logger-pwa-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "button-logger-pwa",
    storageBucket: "button-logger-pwa.appspot.com",
    messagingSenderId: "207552862849",
    appId: "1:207552862849:web:914a4f348527ffc4220b80",
    measurementId: "G-CT4C5XBCVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
const auth = getAuth(app); // Using the modular function
const db = getFirestore(app); // Using the modular function
const functions = getFunctions(app); // Using the modular function`

// Use emulator if in development, this is critical but don't fully get it
if (window.location.hostname === "localhost") {

    // For Firestore
    connectFirestoreEmulator(db, "localhost", 8080);

    // For Authentication
    connectAuthEmulator(auth, "http://localhost:9099");

    // For Cloud Functions (if you're using it)
    connectFunctionsEmulator(functions, "localhost", 5001);

    // For Storage
    // connectStorageEmulator(storage, "localhost", 9199);

    // For Firebase Realtime Database (if you're using it)
    // const realDb = getDatabase(app);
    // connectDatabaseEmulator(realDb, "localhost", 9000);
  }

export { auth, db };