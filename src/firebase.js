import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZwXBoFVtC9QSkS5Dm28eCvgu17kuK1wM",
    authDomain: "out-break-26.firebaseapp.com",
    databaseURL: "https://out-break-26-default-rtdb.firebaseio.com",
    projectId: "out-break-26",
    storageBucket: "out-break-26.firebasestorage.app",
    messagingSenderId: "1046610696291",
    appId: "1:1046610696291:web:44319301fcbfe0bc0fc056",
    measurementId: "G-PBH4VC7MY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Keeping RTDB for legacy/backup if needed, but primary will switch to Firestore
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, database, firestore, storage };
