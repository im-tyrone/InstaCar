import { auth } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Riferimenti agli elementi HTML
const btnLogin = document.getElementById('btn-login');
const btnReg = document.getElementById('btn-registrati');
const btnLogout = document.getElementById('btn-logout');

// Funzione Registrazione
if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        const email = document.getElementById('email-login').value;
        const pass = document.getElementById('pass-login').value;
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => alert("Login effettuato!"))
            .catch(err => alert("Errore: " + err.message));
    });
}

if (btnReg) {
    btnReg.addEventListener('click', () => {
        const email = document.getElementById('email-login').value;
        const pass = document.getElementById('pass-login').value;
        createUserWithEmailAndPassword(auth, email, pass)
            .then(() => alert("Registrato!"))
            .catch(err => alert("Errore: " + err.message));
    });
}
// Gestione visibilità (Loggato vs Non Loggato)
onAuthStateChanged(auth, (user) => {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-logged');
});

// Logout
btnLogout.addEventListener('click', () => signOut(auth));


import { db } from './firebase-config.js';
// Modifica la parte esistente di onAuthStateChanged in auth.js per chiamare la funzione
// Gestione Reindirizzamento e Visibilità
onAuthStateChanged(auth, (user) => {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-logged');

    if (user) {
        // Se l'utente è loggato...

        // 1. Se nella pagina ci sono i contenitori, gestisci la visibilità
        if (authSection) authSection.style.display = 'none';
        if (userSection) {
            userSection.style.display = 'block';
            const emailDisplay = document.getElementById('user-email-display');
            if (emailDisplay) emailDisplay.innerText = user.email;
        }

        // 2. Carica le chat se la funzione esiste
        caricaListaChat(user);

        // 3. REINDIRIZZAMENTO: Se l'utente è sulla pagina di login, mandalo alla index
        // Controlliamo se l'URL attuale contiene "login" o il nome della tua pagina di login
        if (window.location.pathname.includes("login.html") || window.location.pathname.endsWith("/")) {
            window.location.href = 'index.html';
        }
    } else {
        // Se l'utente NON è loggato
        if (authSection) authSection.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
    }
});