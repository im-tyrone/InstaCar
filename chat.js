import { auth, db } from './firebase-config.js';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const idAnnuncio = params.get('annuncio');
const idVenditore = params.get('venditore');
const idCompratore = params.get('compratore');

let utenteAttivo = null;

// 1. Controllo chi è loggato
onAuthStateChanged(auth, (user) => {
    if (user) {
        utenteAttivo = user;
        caricaInfoAnnuncio();
        ascoltaMessaggi(); 
    } else {
        alert("Devi accedere per visualizzare la chat.");
        window.location.href = "index.html";
    }
});

// 2. Carica l'anteprima dell'annuncio
async function caricaInfoAnnuncio() {
    const annuncioRef = doc(db, "annunci", idAnnuncio);
    const annuncioSnap = await getDoc(annuncioRef);
    
    if (annuncioSnap.exists()) {
        const auto = annuncioSnap.data();
        const container = document.getElementById('dettagli-mini-annuncio');
        container.innerHTML = `
            <img src="${auto.immagini ? auto.immagini[0] : ''}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid cyan;">
            <div>
                <div style="font-weight: bold; color: cyan; font-size: 1.1em;">${auto.marca} ${auto.modello}</div>
                <div style="font-size: 0.9em; color: #aaa;">${auto.prezzo} €</div>
            </div>
        `;
    }
}

// 3. Invio Messaggio
document.getElementById('form-messaggio').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('testo-msg');
    const testo = input.value.trim();
    if (!testo) return;

    input.value = '';

    // Determino chi è il destinatario
    const idDestinatario = (utenteAttivo.uid === idVenditore) ? idCompratore : idVenditore;

    try {
        await addDoc(collection(db, "messaggi"), {
            id_annuncio: idAnnuncio,
            id_venditore: idVenditore,
            id_compratore: idCompratore,
            mittente: utenteAttivo.uid,
            destinatario: idDestinatario,
            testo: testo,
            letto: false, // Inizializzato come non letto
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Errore invio:", error);
    }
});

// 4. Ricezione messaggi e gestione conferme di lettura
function ascoltaMessaggi() {
    const chatBox = document.getElementById('chat-box');
    const q = query(collection(db, "messaggi"), where("id_annuncio", "==", idAnnuncio));

    onSnapshot(q, (snapshot) => {
        let messaggi = [];
        
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const docId = docSnap.id;

            if (data.id_venditore === idVenditore && data.id_compratore === idCompratore) {
                messaggi.push({ id: docId, ...data });

                // SEGNALA COME LETTO: Se io sono il destinatario e il messaggio non è letto, lo aggiorno sul DB
                if (data.destinatario === utenteAttivo.uid && data.letto === false) {
                    updateDoc(doc(db, "messaggi", docId), { letto: true });
                }
            }
        });

        messaggi.sort((a, b) => {
            const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
            const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
            return timeA - timeB;
        });

        chatBox.innerHTML = '';
        messaggi.forEach((msg) => {
            const div = document.createElement('div');
            div.classList.add('msg');
            
            if (msg.mittente === utenteAttivo.uid) {
                div.classList.add('msg-mio');
                div.innerText = msg.testo;
                
                // Crea l'elemento per la conferma di lettura (Visualizzato)
                const statoLettura = document.createElement('span');
                statoLettura.classList.add('stato-lettura');
                statoLettura.innerText = msg.letto ? "✓✓ Visualizzato" : "✓ Inviato";
                div.appendChild(statoLettura);

            } else {
                div.classList.add('msg-altro');
                div.innerText = msg.testo;
            }
            
            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    });
}