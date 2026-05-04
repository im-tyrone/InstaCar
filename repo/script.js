// Riferimenti ai nuovi elementi HTML
const inputMarca = document.getElementById('filtro-marca');
const inputModello = document.getElementById('filtro-modello');
const inputPrezzo = document.getElementById('filtro-prezzo');

// Funzione principale per filtrare e mostrare gli annunci
function applicaFiltri(tuttiGliAnnunci) {
    const marca = inputMarca.value.toLowerCase();
    const modello = inputModello.value.toLowerCase();
    const prezzoMax = parseFloat(inputPrezzo.value) || Infinity;

    const filtrati = tuttiGliAnnunci.filter(auto => {
        const matchMarca = auto.marca.toLowerCase().includes(marca);
        const matchModello = auto.modello.toLowerCase().includes(modello);
        const matchPrezzo = parseFloat(auto.prezzo) <= prezzoMax;

        return matchMarca && matchModello && matchPrezzo;
    });

    renderizzaAnnunci(filtrati); // Questa è la tua funzione che disegna i div nel DOM
}

// Aggiungi gli event listener a tutti e tre gli input
[inputMarca, inputModello, inputPrezzo].forEach(input => {
    input.addEventListener('input', () => {
        // Qui chiamerai la tua logica di filtraggio esistente passandogli i nuovi valori
        applicaFiltri(listaOriginaleAnnunci);
    });
});