const TEMAS = {
    'Cornélio Procópio': {slug:'cornelio', temaId:1},
    'Informática': {slug:'informatica', temaId:2},
};

let temaSelecionado = { slug:'cornelio', temaId:1}; // valor padrão
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
        const tema = TEMAS[nomeClicado];

        if (tema) { 
            temaSelecionado = tema;
            temasMenu.style.display = 'none';

            if (onTemaChange) onTemaChange(temaSelecionado);
        }
        console.log(temaSelecionado)
    }
});

export const getTema = () => temaSelecionado;

export const setOnTemaChange = (fn) => { onTemaChange = fn; };