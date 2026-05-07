import { GameService } from "../../backend/src/services/GameService";

const grid = document.querySelector('.grid-jogo')

// const info = [
//     'Arquivos',
//     'Cadeira',
//     'Chrome',
//     'Configurações',
//     'CPU',
//     'Fone',
//     'Impressora',
//     'Monitor',
//     'Mouse',
//     'Roteador',
//     'Teclado',
//     'Webcam',
// ];


// cria as um elemento que recebe como parâmetro o tipo de
// elemento html e adiciona um classname que tambem foi recebido 
// como parametro
const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;

    return element;
}

// chama a função cria elemento e manda as informações que faltam
const criaCarta = (item) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('../assets/temas/informatica/${item}.png')`;

    card.appendChild(front);
    card.appendChild(back);

    return card
}


const loadGame = (temaId) => {
    const duplicateInfo = [...info, ...info];

    const tabuleiro = GameService.gerarTabuleiro(temaId);

    tabuleiro.forEach((item) => {
        const card = criaCarta(item);
        grid.appendChild(card);
    })
}


loadGame(2);