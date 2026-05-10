const TEMAS = {
    'Cornélio Procópio': 'cornelio',
    'Informática': 'informatica',
};

let temaSelecionado = 'informatica';
let onTemaChange = null;

const temaBtn = document.getElementById('tema-btn');
const temasMenu = document.getElementById('temas');

temaBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const aberto = temasMenu.style.display === 'block';
    temasMenu.style.display = aberto ? 'none' : 'block';
});

window.addEventListener('click', (event) => {
    if (!temasMenu.contains(event.target)) {
        temasMenu.style.display = 'none';
    }
});

temasMenu.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const nomeClicado = event.target.innerText.trim();
        const id = TEMAS[nomeClicado];

        if (id) { 
            temaSelecionado = id;
            temasMenu.style.display = 'none';
            console.log(`Tema selecionado: ${temaSelecionado}`);

            if (onTemaChange) onTemaChange(temaSelecionado);
        }
        console.log(temaSelecionado)
    }
});

export const getTema = () => temaSelecionado;

export const setOnTemaChange = (fn) => { onTemaChange = fn; };