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


import { db } from './firebase-config.js';
import { collection, query, where, onSnapshot, getDoc, doc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Funzione per caricare la lista delle chat nella Home
function caricaListaChat(user) {
    const listaChat = document.getElementById('lista-chat-attive');
    if (!listaChat) return;

    const q = query(collection(db, "messaggi"));

    onSnapshot(q, async(snapshot) => {
                const conversazioniMap = {};

                snapshot.forEach((msgDoc) => {
                    const m = msgDoc.data();
                    // Filtriamo: l'utente deve essere parte della chat
                    if (m.id_venditore === user.uid || m.id_compratore === user.uid) {
                        // Creiamo una chiave unica per la chat (annuncio + i due utenti)
                        const chatKey = `${m.id_annuncio}_${m.id_venditore}_${m.id_compratore}`;

                        if (!conversazioniMap[chatKey]) {
                            conversazioniMap[chatKey] = {
                                id_annuncio: m.id_annuncio,
                                id_venditore: m.id_venditore,
                                id_compratore: m.id_compratore,
                                ultimoMessaggio: m.testo,
                                nonLetti: 0
                            };
                        }
                        // Sistema Notifiche: conta messaggi dove io sono il destinatario e "letto" è false
                        if (m.destinatario === user.uid && m.letto === false) {
                            conversazioniMap[chatKey].nonLetti++;
                        }
                    }
                });

                listaChat.innerHTML = "";
                const keys = Object.keys(conversazioniMap);

                if (keys.length === 0) {
                    listaChat.innerHTML = "<p style='color:gray;'>Nessuna chat attiva.</p>";
                    return;
                }

                for (let key of keys) {
                    const chat = conversazioniMap[key];
                    const annuncioSnap = await getDoc(doc(db, "annunci", chat.id_annuncio));
                    const datiAnnuncio = annuncioSnap.exists() ? annuncioSnap.data() : { marca: "Annuncio", modello: "Eliminato" };

                    const chatItem = document.createElement('div');
                    chatItem.className = 'chat-item';
                    chatItem.innerHTML = `
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${datiAnnuncio.immagini ? datiAnnuncio.immagini[0] : ''}" style="width:50px; height:50px; border-radius:5px; object-fit:cover;">
                    <div>
                        <div style="font-weight:bold; color:cyan;">${datiAnnuncio.marca} ${datiAnnuncio.modello}</div>
                        <div style="font-size:0.8em; color:#bbb;">${chat.ultimoMessaggio.substring(0, 30)}...</div>
                    </div>
                </div>
                ${chat.nonLetti > 0 ? `<span class="badge-notifica">${chat.nonLetti}</span>` : ''}
            `;
            chatItem.onclick = () => {
                window.location.href = `chat.html?annuncio=${chat.id_annuncio}&venditore=${chat.id_venditore}&compratore=${chat.id_compratore}`;
            };
            listaChat.appendChild(chatItem);
        }
    });
}

onAuthStateChanged(auth, (user) => {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-logged');

    if (user) {
        authSection.style.display = 'none';
        userSection.style.display = 'block';
        document.getElementById('user-email-display').innerText = user.email;
        caricaListaChat(user);
    } else {
        authSection.style.display = 'block';
        userSection.style.display = 'none';
    }
});