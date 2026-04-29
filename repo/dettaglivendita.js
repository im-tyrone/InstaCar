import { auth, db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

let utenteAttivo = null;
let arrayImmagini = []; // Assicurati di avere la tua logica che riempie questo array

// 1. Controlliamo se l'utente è loggato appena entra nella pagina
onAuthStateChanged(auth, (user) => {
    if (user) {
        utenteAttivo = user;
        console.log("Utente pronto per pubblicare:", user.email);
    } else {
        alert("Attenzione: devi essere loggato per pubblicare. Verrai reindirizzato al login.");
        window.location.href = 'index.html';
    }
});

// Gestione Invio Modulo
document.getElementById('car-form').addEventListener('submit', async(e) => {
    e.preventDefault();

    if (!utenteAttivo) {
        alert("Errore: Utente non identificato. Prova a rifare il login.");
        return;
    }

    // Recupero i dati dai tuoi input (controlla che gli ID siano giusti!)
    const datiAuto = {
        id_venditore: utenteAttivo.uid,
        email_venditore: utenteAttivo.email,
        marca: document.getElementById('marca').value,
        modello: document.getElementById('modello').value,
        prezzo: document.getElementById('prezzo').value,
        km: document.getElementById('km').value,
        anno: document.getElementById('anno').value,
        descrizione: document.getElementById('descrizione').value,
        immagini: arrayImmagini,
        creatoIl: serverTimestamp() // Aggiunge data e ora precise del server
    };

    console.log("Tentativo di invio dati:", datiAuto);

    try {
        // "annunci" è il nome della collezione su Firestore
        const docRef = await addDoc(collection(db, "annunci"), datiAuto);
        console.log("Successo! ID Documento:", docRef.id);
        alert("Annuncio pubblicato con successo!");
        window.location.href = 'annunci.html';
    } catch (error) {
        console.error("Errore durante la pubblicazione:", error);
        alert("Errore Firestore: " + error.message);
    }
});

// --- Qui puoi rimettere la tua funzione per leggere le foto ---
// Esempio rapido per popolare arrayImmagini:
document.getElementById('foto').addEventListener('change', function(e) {
    const files = e.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
            arrayImmagini.push(event.target.result); // Base64
        };
        reader.readAsDataURL(file);
    }
});