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

    if (user) {
        authSection.style.display = 'none';
        userSection.style.display = 'block';
        document.getElementById('user-email-display').innerText = user.email;
    } else {
        authSection.style.display = 'block';
        userSection.style.display = 'none';
    }
});

// Logout
btnLogout.addEventListener('click', () => signOut(auth));