import { auth, db } from './firebase-config.js';
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const idAnnuncio = params.get('id');

async function caricaDettaglio() {
    const box = document.getElementById('contatto-box');
    if (!idAnnuncio) return;

    try {
        const docRef = doc(db, "annunci", idAnnuncio);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const auto = docSnap.data();

            // 1. Riempimento dati base
            document.getElementById('marca-modello').innerText = (auto.marca || "") + " " + (auto.modello || "");
            document.getElementById('prezzo-auto').innerText = (auto.prezzo || "") + " €";
            document.getElementById('dati-tecnici').innerText = "Anno: " + auto.anno + " | KM: " + auto.km;
            document.getElementById('descrizione-auto').innerText = auto.descrizione || "";

            // 2. Immagine
            const containerImg = document.getElementById('contenitore-immagini');
            if (auto.immagini && auto.immagini.length > 0) {
                containerImg.innerHTML = `<img src="${auto.immagini[0]}" style="max-width:100%; border-radius:10px; border:2px solid cyan;">`;
            }

            // 3. LOGICA PULSANTE (Metodo delegato)
            onAuthStateChanged(auth, (user) => {
                if (user && user.uid === auto.id_venditore) {
                    box.innerHTML = `<button id="btn-elimina" class="btn-pubblica" style="background:red; width:100%;">ELIMINA ANNUNCIO</button>`;
                    document.getElementById('btn-elimina').onclick = async() => {
                        if (confirm("Eliminare?")) { await deleteDoc(docRef);
                            window.location.href = "annunci.html"; }
                    };
                } else {
                    // Creiamo il pulsante come stringa HTML
                    box.innerHTML = `<button id="btn-chat-final" class="btn-pubblica" style="width:100%; cursor:pointer;">INIZIA CHAT</button>`;

                    // Funzione di reindirizzamento forzata
                    const avviaChat = () => {
                        if (!user) {
                            alert("Devi loggarti per chattare!");
                            window.location.href = "index.html";
                            return;
                        }

                        const venditore = auto.id_venditore;
                        const compratore = user.uid;

                        if (!venditore) {
                            alert("Errore: questo annuncio non ha un ID venditore valido.");
                            console.error("Campo id_venditore mancante nel documento Firestore");
                            return;
                        }

                        const urlChat = `chat.html?annuncio=${idAnnuncio}&venditore=${venditore}&compratore=${compratore}`;
                        console.log("Reindirizzamento a:", urlChat);
                        window.location.assign(urlChat); // Utilizziamo assign per forzare il browser
                    };

                    // Agganciamo l'evento con un timeout di 100ms per dare tempo al DOM di svegliarsi
                    setTimeout(() => {
                        const btn = document.getElementById('btn-chat-final');
                        if (btn) {
                            btn.onclick = avviaChat;
                        }
                    }, 100);
                }
            });

        } else {
            box.innerHTML = "Annuncio non trovato.";
        }
    } catch (error) {
        console.error("Errore Generale:", error);
    }
}

caricaDettaglio();