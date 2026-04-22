const catalogoBase = [
    { marca: "Audi", modello: "RS6", prezzo: "120.000€", immagini: ["rs6.png"], descrizione: "V8 Biturbo." },
    { marca: "Tesla", modello: "Model S", prezzo: "95.000€", immagini: ["models.png"], descrizione: "Elettrica pura." },
    { marca: "Fiat", modello: "Panda 4x4", prezzo: "12.000€", immagini: ["panda4x4.png"], descrizione: "Inarrestabile." },
    { marca: "Lamborghini", modello: "Urus", prezzo: "220.000€", immagini: ["urus.png"], descrizione: "SUV estremo." }
];

function caricaCatalogoCompleto() {
    const autoUtente = JSON.parse(localStorage.getItem('auto_utente')) || [];
    return [...catalogoBase, ...autoUtente];
}

const listaAuto = document.getElementById('lista-auto');

if (listaAuto) {
    const catalogo = caricaCatalogoCompleto();
    listaAuto.innerHTML = '';

    catalogo.forEach((auto, index) => {
        const card = document.createElement('div');
        card.classList.add('card-auto');
        card.innerHTML = `
            <img src="${auto.immagini[0]}" alt="${auto.marca}">
            <h3>${auto.marca}</h3>
            <p>${auto.modello}</p>
            <p><strong>${auto.prezzo}</strong></p>
        `;
        card.onclick = () => window.location.href = `auto.html?id=${index}`;
        listaAuto.appendChild(card);
    });
}