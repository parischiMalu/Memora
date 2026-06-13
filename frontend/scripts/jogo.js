

// importa o tema selecionado pelo usuário em tema.js
import { getTema, setOnTemaChange } from './tema.js'; 

const BACKEND = 'http://localhost:3000'; // URL do backend

// pega os elementos necessários do jogo.html
const grid = document.querySelector('.grid-jogo')
const seconds = document.getElementById('seconds');
const minutes = document.getElementById('minutes');
const modalParabens = document.querySelector('.fim-de-jogo');
const overlayEscuro = document.querySelector('.overlay-escuro');
const minFinal = document.getElementById('min-final');
const segFinal = document.getElementById('seg-final');
const tentativasFinal = document.getElementById('tentativas-final');
const btnReiniciar = document.querySelector('.reiniciar');

// variaveis globais 
let tentativas = 0;       // incrementa a cada par de cartas clicadas
let firstCard = '';       // recebe a primeira carta clicada
let secondCard = '';      // recebe a segunda carta clicada
let timer = null;         // inicia o timer vazio   
let totalSeconds = 0;     // controla o tempo total em segundos
let timerStarted = false; // garante que só começa uma vez

// Formata timer com 2 casas (5 -> "05")
const pad = (n) => String(n).padStart(2, '0');

// cria as um elemento que recebe como parâmetro o tipo de
// elemento html e adiciona um classname que tambem foi recebido 
// como parametro
const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;

    return element;
}

const resetTimer = () => {
    clearInterval(timer);
    timer = null;
    totalSeconds = 0;
    timerStarted = false;
    minutes.innerHTML = '00';
    seconds.innerHTML = '00';
};

const startTimer = () => {
    if (timerStarted){
        return;
    };
    timerStarted = true;

    timer = setInterval(() => {

        totalSeconds++;
        minutes.innerHTML = pad(Math.floor(totalSeconds/60));
        seconds.innerHTML = pad(totalSeconds % 60);

    }, 1000);
}


const checaEndGame = async () => {
    const disabledCards = document.querySelectorAll('.disabled-carta');

    if (disabledCards.length === 24){
        clearInterval(timer);

        const resposta = await fetch(`${BACKEND}/jogo/finalizar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL_JOGADOR })
        });

        const resultado = await resposta.json();

        minFinal.innerHTML = minutes.innerHTML;
        segFinal.innerHTML = seconds.innerHTML;
        tentativasFinal.innerHTML = tentativas;

        overlayEscuro.style.display = 'block';
        modalParabens.style.display = 'flex';
    }
};


const checaCartas = () => {
    const primeiraCarta = firstCard.getAttribute('nome-carta');
    const segundaCarta = secondCard.getAttribute('nome-carta');

    if (primeiraCarta === segundaCarta){
        
        firstCard.firstChild.classList.add('disabled-carta');
        secondCard.firstChild.classList.add('disabled-carta');

        firstCard = '';
        secondCard = '';
    
        checaEndGame();

    } else {

        setTimeout ( () => {
            firstCard.classList.remove('revela-carta');
            secondCard.classList.remove('revela-carta');

            firstCard = '';
            secondCard = '';
        }, 500);
        
    }
};


const revelaCarta = ({ target }) => {

    startTimer();

    if(target.parentNode.className.includes('revela-carta')){
        return;

    }
    if ( firstCard === ''){

        target.parentNode.classList.add('revela-carta');
        firstCard = target.parentNode;

    }
    else if ( secondCard === '') {

        target.parentNode.classList.add('revela-carta');
        secondCard = target.parentNode;
        tentativas++;
        checaCartas();
    }  
};



// chama a função cria elemento e manda as informações que faltam
const criaCarta = (item, slug) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('../assets/temas/${slug}/${item}.png')`;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revelaCarta);
    card.setAttribute('nome-carta', item);

    return card
};

// Reinicia ao clicar no botão
btnReiniciar.addEventListener('click', () => {
    overlayEscuro.style.display = 'none';
    modalParabens.style.display = 'none';
    loadGame();
});


const loadGame = async () => {

    // Limpa estado anterior
    grid.innerHTML = '';
    tentativas = 0;
    firstCard = '';
    secondCard = '';
    resetTimer();

    const tema = getTema(); // ve o tema atual

    const resposta = await fetch(`${BACKEND}/jogo/iniciar`, {
    method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL_JOGADOR, temaId: tema.temaId })
    });

    const dados = await resposta.json();

    dados.tabuleiro.forEach( (item) => {
        grid.appendChild(criaCarta(item, tema.slug));
    });
};

// Reinicia o jogo quando o usuário troca de tema
setOnTemaChange( () => loadGame());


loadGame();
