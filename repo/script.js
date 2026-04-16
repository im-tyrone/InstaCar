const catalogo = [
    { marca: "Audi", modello: "RS6", prezzo: "120.000€" },
    { marca: "Tesla", modello: "Model S", prezzo: "95.000€" },
    { marca: "Fiat", modello: "Panda 4x4", prezzo: "12.000€" },
    { marca: "Lamborghini", modello: "Urus", prezzo: "220.000€" }
];

const listaAuto = document.getElementById('lista-auto');

window.addEventListener('DOMContentLoaded', () => {

    listaAuto.innerHTML = '';

    catalogo.forEach(auto => {
        const card = document.createElement('div');
        card.classList.add('card-auto');

        card.innerHTML = `
            <h3>${auto.marca}</h3>
            <p>Modello: ${auto.modello}</p>
            <p><strong>Prezzo: ${auto.prezzo}</strong></p>
        `;

        listaAuto.appendChild(card);
    });
});