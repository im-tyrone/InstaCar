import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCa8c6Qm3wvBxN3HhXvf0KA79mURr-q4ZE",
    authDomain: "instacar-1.firebaseapp.com",
    projectId: "instacar-1",
    storageBucket: "instacar-1.firebasestorage.app",
    messagingSenderId: "856292956618",
    appId: "1:856292956618:web:e2d7513f147f5fc1915733",
    measurementId: "G-70WBXQS48K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);