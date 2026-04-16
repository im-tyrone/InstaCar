const catalogo = [
    { 
        marca: "Audi", 
        modello: "RS6", 
        prezzo: "120.000€", 
        immagine: "rs6.png",
        descrizione: "Motore V8 biturbo, 600 CV." 
    },
    { 
        marca: "Tesla", 
        modello: "Model S", 
        prezzo: "95.000€", 
        immagine: "models.png", 
        descrizione: "Berlina elettrica ad alte prestazioni." 
    },
    { 
        marca: "Fiat", 
        modello: "Panda 4x4", 
        prezzo: "12.000€", 
        immagine: "panda4x4.png", 
        descrizione: "L'intramontabile fuoristrada compatto." 
    },
    { 
        marca: "Lamborghini", 
        modello: "Urus", 
        prezzo: "220.000€", 
        immagine: "urus.png", 
        descrizione: "Il SUV più estremo di sempre." 
    }
];

const listaAuto = document.getElementById('lista-auto');

window.addEventListener('DOMContentLoaded', () => {
    if (!listaAuto) return;

    listaAuto.innerHTML = '';

    catalogo.forEach((auto, index) => {
        const card = document.createElement('div');
        card.classList.add('card-auto');

        // Aggiungiamo il tag img prima del titolo
        card.innerHTML = `
            <img src="${auto.immagine}" alt="${auto.marca} ${auto.modello}">
            <h3>${auto.marca}</h3>
            <p>Modello: ${auto.modello}</p>
            <p><strong>Prezzo: ${auto.prezzo}</strong></p>
        `;

        card.addEventListener('click', () => {
            window.location.href = `auto.html?id=${index}`;
        });

        listaAuto.appendChild(card);
    });
});