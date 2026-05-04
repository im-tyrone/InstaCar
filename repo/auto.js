import { auth, db } from './firebase-config.js';
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function caricaDettaglio() {
    if (!id) {
        document.getElementById('titolo').innerText = "ID Annuncio mancante";
        return;
    }

    const docRef = doc(db, "annunci", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const auto = docSnap.data();

        // Riempimento testi
        document.getElementById('marca-modello').innerText = `${auto.marca} ${auto.modello}`;
        document.getElementById('prezzo-auto').innerText = `${auto.prezzo} €`;
        document.getElementById('dati-tecnici').innerText = `Anno: ${auto.anno} | KM: ${auto.km}`;
        document.getElementById('descrizione-auto').innerText = auto.descrizione;
        document.getElementById('email-venditore').innerText = auto.contatto || auto.email_venditore;

        // --- GESTIONE CAROSELLO IMMAGINI ---
        const containerImg = document.getElementById('contenitore-immagini');
        if (auto.immagini && auto.immagini.length > 0) {
            let indiceImmagine = 0;

            containerImg.innerHTML = `
                <div class="carousel-wrapper">
                    <button id="prev-img" class="carousel-btn">&#10094;</button>
                    <img id="main-img" src="${auto.immagini[0]}" alt="Immagine Auto">
                    <button id="next-img" class="carousel-btn">&#10095;</button>
                </div>
                <div id="contatore-img">1 / ${auto.immagini.length}</div>
            `;

            const imgElement = document.getElementById('main-img');
            const contatore = document.getElementById('contatore-img');

            document.getElementById('prev-img').onclick = () => {
                indiceImmagine = (indiceImmagine > 0) ? indiceImmagine - 1 : auto.immagini.length - 1;
                imgElement.src = auto.immagini[indiceImmagine];
                contatore.innerText = `${indiceImmagine + 1} / ${auto.immagini.length}`;
            };

            document.getElementById('next-img').onclick = () => {
                indiceImmagine = (indiceImmagine < auto.immagini.length - 1) ? indiceImmagine + 1 : 0;
                imgElement.src = auto.immagini[indiceImmagine];
                contatore.innerText = `${indiceImmagine + 1} / ${auto.immagini.length}`;
            };
        } else {
            containerImg.innerHTML = `<p style="color: gray;">Nessuna immagine disponibile</p>`;
        }

        // --- GESTIONE PROPRIETARIO VS COMPRATORE ---
        onAuthStateChanged(auth, (user) => {
            const box = document.getElementById('contatto-box');

            if (user && user.uid === auto.id_venditore) {
                // Se sono io il proprietario
                box.innerHTML = `
                    <p style="color:yellow; margin-bottom:10px;">Questo è il tuo annuncio</p>
                    <button id="elimina-annuncio" class="btn-normale" style="background:red; color:white;">Elimina Annuncio</button>
                `;
                document.getElementById('elimina-annuncio').onclick = async() => {
                    if (confirm("Sei sicuro di voler eliminare questo annuncio?")) {
                        await deleteDoc(docRef);
                        window.location.href = "annunci.html";
                    }
                };
            } else {
                // Se sono un compratore (o non loggato)
                const btnChat = document.createElement('button');
                btnChat.id = 'btn-chat';
                btnChat.className = 'btn-pubblica';
                btnChat.innerText = 'Inizia Chat';
                box.appendChild(document.createElement('br'));
                box.appendChild(btnChat);

                btnChat.addEventListener('click', () => {
                    if (!user) {
                        alert("Devi loggarti per iniziare una chat!");
                        window.location.href = "index.html";
                        return;
                    }
                    window.location.href = `chat.html?annuncio=${id}&venditore=${auto.id_venditore}&compratore=${user.uid}`;
                });
            }
        });
    } else {
        document.getElementById('titolo').innerText = "Annuncio non trovato";
    }
}

caricaDettaglio();