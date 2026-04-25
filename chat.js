import { auth, db } from './firebase-config.js';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Estraiamo i dati dall'indirizzo URL
const params = new URLSearchParams(window.location.search);
const idAnnuncio = params.get('annuncio');
const idVenditore = params.get('venditore');
const idCompratore = params.get('compratore');

let utenteAttivo = null;

// 1. Controllo chi è loggato
onAuthStateChanged(auth, (user) => {
    if (user) {
        utenteAttivo = user;
        ascoltaMessaggi(); // Se sei loggato, avvia la ricezione in tempo reale
    } else {
        alert("Devi accedere per visualizzare la chat.");
        window.location.href = "index.html";
    }
});

// 2. Funzione per INVIARE un nuovo messaggio
document.getElementById('form-messaggio').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('testo-msg');
    const testo = input.value.trim();
    if (!testo) return;

    input.value = ''; // Pulisce la barra subito dopo aver premuto invio

    try {
        // Salviamo il messaggio in una nuova collezione chiamata "messaggi"
        await addDoc(collection(db, "messaggi"), {
            id_annuncio: idAnnuncio,
            id_venditore: idVenditore,
            id_compratore: idCompratore,
            mittente: utenteAttivo.uid, // Chi ha scritto materialmente questo messaggio
            testo: testo,
            timestamp: serverTimestamp() // Orario esatto del server
        });
    } catch (error) {
        console.error("Errore invio:", error);
    }
});

// 3. Funzione per RICEVERE i messaggi (La magia del Real-Time)
function ascoltaMessaggi() {
    const chatBox = document.getElementById('chat-box');
    
    // Filtriamo il database: prendiamo solo i messaggi di QUESTA auto
    const q = query(
        collection(db, "messaggi"), 
        where("id_annuncio", "==", idAnnuncio)
    );

    // onSnapshot ascolta i cambiamenti. Se nel DB si aggiunge un messaggio, questo codice si riavvia da solo.
    onSnapshot(q, (snapshot) => {
        let messaggi = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            // Controllo extra: è davvero la chat tra QUESTO compratore e QUESTO venditore?
            if (data.id_venditore === idVenditore && data.id_compratore === idCompratore) {
                messaggi.push(data);
            }
        });

        // Riordiniamo i messaggi dal più vecchio al più nuovo usando il timestamp
        messaggi.sort((a, b) => {
            const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
            const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
            return timeA - timeB;
        });

        // Svuotiamo il box e ridisegniamo tutti i messaggi
        chatBox.innerHTML = '';
        messaggi.forEach((msg) => {
            const div = document.createElement('div');
            div.classList.add('msg');
            
            // Applichiamo i colori giusti: è mio o dell'altro utente?
            if (msg.mittente === utenteAttivo.uid) {
                div.classList.add('msg-mio');
            } else {
                div.classList.add('msg-altro');
            }
            
            div.innerText = msg.testo;
            chatBox.appendChild(div);
        });

        // Scrolla automaticamente la vista in basso all'ultimo messaggio
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}
