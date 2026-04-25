import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const listaAuto = document.getElementById('lista-auto');

async function caricaAnnunci() {
    if (!listaAuto) return;
    listaAuto.innerHTML = "<p>Caricamento...</p>";

    const querySnapshot = await getDocs(collection(db, "annunci"));
    listaAuto.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const auto = doc.data();
        const id = doc.id; // Usiamo l'ID di Firebase
        
        const card = document.createElement('div');
        card.classList.add('card-auto');
        card.innerHTML = `
            <img src="${auto.immagini[0]}" alt="${auto.marca}">
            <h3>${auto.marca}</h3>
            <p>${auto.modello}</p>
            <p><strong>${auto.prezzo}</strong></p>
        `;
        card.onclick = () => window.location.href = `auto.html?id=${id}`;
        listaAuto.appendChild(card);
    });
}

caricaAnnunci();