import { auth, db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

let utenteAttivo = null;
let arrayImmagini = [];

// Controllo autenticazione
onAuthStateChanged(auth, (user) => {
    if (user) {
        utenteAttivo = user;
        console.log("Utente pronto:", user.email);
    } else {
        alert("Attenzione: devi essere loggato per pubblicare.");
        window.location.href = 'index.html';
    }
});

// Gestione invio modulo
document.getElementById('car-form').addEventListener('submit', async(e) => {
    e.preventDefault();

    if (!utenteAttivo) {
        alert("Errore: Utente non identificato.");
        return;
    }

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
        creatoIl: serverTimestamp()
    };

    try {
        const docRef = await addDoc(collection(db, "annunci"), datiAuto);
        console.log("Successo! ID:", docRef.id);
        alert("Annuncio pubblicato con successo!");
        window.location.href = 'annunci.html';
    } catch (error) {
        console.error("Errore:", error);
        alert("Errore durante la pubblicazione: " + error.message);
    }
});

// Gestione anteprima immagini
document.getElementById('foto').addEventListener('change', function(e) {
    const previewArea = document.getElementById('preview-area');
    previewArea.innerHTML = '';
    arrayImmagini = [];

    const files = e.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imgData = event.target.result;
            arrayImmagini.push(imgData);

            const imgThumb = document.createElement('img');
            imgThumb.src = imgData;
            imgThumb.classList.add('gallery-img');
            imgThumb.style.width = "100px"; // Dimensione per l'anteprima
            imgThumb.style.margin = "5px";
            previewArea.appendChild(imgThumb);
        };
        reader.readAsDataURL(file);
    }
});