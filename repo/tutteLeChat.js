import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, query, onSnapshot, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        caricaCentroMessaggi(user);
    } else {
        window.location.href = "index.html";
    }
});

async function caricaCentroMessaggi(user) {
    const contenitore = document.getElementById('lista-completa-chat');
    const q = query(collection(db, "messaggi"));

    onSnapshot(q, async(snapshot) => {
                const conversazioniMap = {};

                snapshot.forEach((msgDoc) => {
                    const m = msgDoc.data();
                    if (m.id_venditore === user.uid || m.id_compratore === user.uid) {
                        const chatKey = `${m.id_annuncio}_${m.id_venditore}_${m.id_compratore}`;
                        if (!conversazioniMap[chatKey]) {
                            // Identifichiamo l'ID dell'altra persona
                            const idAltroUtente = (user.uid === m.id_venditore) ? m.id_compratore : m.id_venditore;

                            conversazioniMap[chatKey] = {
                                id_annuncio: m.id_annuncio,
                                id_venditore: m.id_venditore,
                                id_compratore: m.id_compratore,
                                id_altro: idAltroUtente,
                                nonLetti: 0
                            };
                        }
                        if (m.destinatario === user.uid && m.letto === false) {
                            conversazioniMap[chatKey].nonLetti++;
                        }
                    }
                });

                contenitore.innerHTML = "";

                for (let key in conversazioniMap) {
                    const chat = conversazioniMap[key];

                    // 1. Recupero dati Annuncio (per la foto)
                    const annuncioSnap = await getDoc(doc(db, "annunci", chat.id_annuncio));
                    const datiAnnuncio = annuncioSnap.exists() ? annuncioSnap.data() : { immagini: [] };

                    // 2. Recupero dati dell'altra persona (per il nome/email)
                    // Nota: assumendo che tu abbia una collezione "utenti" o usando i dati dell'annuncio se venditore
                    let nomeVisualizzato = "Utente";
                    if (chat.id_altro === datiAnnuncio.id_venditore) {
                        nomeVisualizzato = datiAnnuncio.contatto || datiAnnuncio.email_venditore || "Venditore";
                    } else {
                        // Se l'altro è il compratore, mostriamo un'etichetta generica o cerchiamo nel DB
                        nomeVisualizzato = "Compratore (" + chat.id_altro.substring(0, 5) + "...)";
                    }

                    // Creazione elemento grafico
                    const chatLink = document.createElement('div');
                    chatLink.className = 'chat-item-link';

                    chatLink.innerHTML = `
                <img src="${datiAnnuncio.immagini && datiAnnuncio.immagini[0] ? datiAnnuncio.immagini[0] : 'placeholder.png'}" class="chat-img-piccola">
                <div style="flex-grow: 1;">
                    <div class="chat-nome-utente">${nomeVisualizzato}</div>
                    <div style="font-size: 0.8em; color: gray;">Oggetto: ${datiAnnuncio.marca} ${datiAnnuncio.modello}</div>
                </div>
                ${chat.nonLetti > 0 ? `<span class="badge-notifica">${chat.nonLetti}</span>` : ''}
            `;
            
            chatLink.onclick = () => {
                window.location.href = `chat.html?annuncio=${chat.id_annuncio}&venditore=${chat.id_venditore}&compratore=${chat.id_compratore}`;
            };
            
            contenitore.appendChild(chatLink);
        }
    });
}