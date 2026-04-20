// Definiamo le 4 auto di base
const autoDefault = [{
        marca: "Fiat",
        modello: "Panda",
        carburante: "Benzina",
        proprietari: 2,
        prezzo: 5000,
        immagine: "https://upload.wikimedia.org/wikipedia/commons/e/e6/2012_Fiat_Panda_Easy_1.2_Front.jpg",
        descrizione: "L'intramontabile Panda, economica e indistruttibile."
    },
    {
        marca: "Tesla",
        modello: "Model S",
        carburante: "Elettrico",
        proprietari: 1,
        prezzo: 85000,
        immagine: "https://upload.wikimedia.org/wikipedia/commons/1/14/2018_Tesla_Model_S_75D_Front.jpg",
        descrizione: "Tecnologia pura, accelerazione da urlo e zero emissioni."
    },
    {
        marca: "Audi",
        modello: "RS6",
        carburante: "Benzina",
        proprietari: 1,
        prezzo: 130000,
        immagine: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Audi_RS6_Avant_C8_IMG_3514.jpg",
        descrizione: "Familiare fuori, supercar dentro. 600 CV di pura potenza."
    },
    {
        marca: "Lamborghini",
        modello: "Urus",
        carburante: "Benzina",
        proprietari: 1,
        prezzo: 250000,
        immagine: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Lamborghini_Urus_IMG_1416.jpg",
        descrizione: "Il SUV più veloce del mondo, l'anima di una Huracan in un corpo maestoso."
    }
];

// Carichiamo dal localStorage, se è vuoto usiamo le autoDefault
let catalogo = JSON.parse(localStorage.getItem('auto_salvate')) || autoDefault;

// Funzione per mostrare le auto
function renderizzaAuto(filtroMarca = '', filtroModello = '', filtroPrezzo = Infinity) {
    const listaAuto = document.getElementById('lista-auto');
    if (!listaAuto) return;
    listaAuto.innerHTML = '';

    catalogo.forEach((auto, index) => {
        // Logica filtri
        if (auto.marca.toLowerCase().includes(filtroMarca.toLowerCase()) &&
            auto.modello.toLowerCase().includes(filtroModello.toLowerCase()) &&
            Number(auto.prezzo) <= filtroPrezzo) {

            const card = document.createElement('div');
            card.classList.add('card-auto');
            card.innerHTML = `
                <img src="${auto.immagine}" alt="${auto.marca}">
                <div class="card-info">
                    <h3>${auto.marca} ${auto.modello}</h3>
                    <p>Carburante: ${auto.carburante}</p>
                    <p class="prezzo">${Number(auto.prezzo).toLocaleString()} €</p>
                </div>
            `;
            card.onclick = () => window.location.href = `auto.html?id=${index}`;
            listaAuto.appendChild(card);
        }
    });
}

// Funzione Compra (Rimuove l'auto e aggiorna il localStorage)
function compraAuto(id) {
    if (confirm("Vuoi procedere all'acquisto? L'annuncio sparirà dal catalogo.")) {
        catalogo.splice(id, 1); // Rimuove l'elemento
        localStorage.setItem('auto_salvate', JSON.stringify(catalogo)); // Salva lo stato vuoto o aggiornato
        window.location.href = 'annunci.html';
    }
}

// Gestione Form Vendita
document.addEventListener('DOMContentLoaded', () => {
    renderizzaAuto();

    // Filtri
    const btnCerca = document.getElementById('btn-cerca');
    if (btnCerca) {
        btnCerca.onclick = () => {
            const m = document.getElementById('filter-marca').value;
            const mod = document.getElementById('filter-modello').value;
            const p = document.getElementById('filter-prezzo').value || Infinity;
            renderizzaAuto(m, mod, p);
        };
    }

    const formVendita = document.getElementById('form-vendita');
    if (formVendita) {
        formVendita.onsubmit = function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('v-img');
            const reader = new FileReader();

            reader.onload = function() {
                const nuovaAuto = {
                    marca: document.getElementById('v-marca').value,
                    modello: document.getElementById('v-modello').value,
                    carburante: document.getElementById('v-carburante').value,
                    proprietari: document.getElementById('v-proprietari').value,
                    prezzo: document.getElementById('v-prezzo').value,
                    descrizione: document.getElementById('v-desc').value,
                    immagine: reader.result
                };
                catalogo.push(nuovaAuto);
                localStorage.setItem('auto_salvate', JSON.stringify(catalogo));
                alert("Annuncio pubblicato!");
                window.location.href = 'annunci.html';
            };
            reader.readAsDataURL(fileInput.files[0]);
        };
    }
});