
// todas as variávreis relacionadas ao estado do jogo

const estado = {
    tabuleiro: [],
    pastaTema: '',
    cartasViradas: [],
    paresEncontrados: 0,
    totalPares: 0,
    bloqueio: false,
    tentativas: 0,
    timerSegundos: 0,
    timerInterval: null,
};

// pega os elementos do html relacionados ao jogo

const gridJogo = document.querySelector('.grid-jogo');
const timerElement = document.getElementById('timer');

function iniciarJogo() {
    // reseta o estado do jogo
    estado.tabuleiro = tabuleiro;
    estado.pastaTema = pastaTema;
    estado.cartasViradas = [];
    estado.paresEncontrados = 0;
    estado.totalPares = totalPares;
    estado.bloqueio = false;
    estado.tentativas = 0;
    
    // limpa o tabuleiro
    gridJogo.innerHTML = '';

    atualizarContadores();

    tabuleiro.forEach((carta, index) => {
        const cartaEl = criarCarta(carta, index);
        gridJogo.appendChild(cartaEl);
    });
    
    // ajusta o grid do tabuleiro com base no número de cartas
    // totalPares * 2 = número total de cartas
    ajustarGrid(totalPares * 2);

    iniciarTimer();
}

function criarCarta(carta, index) {
    const cartaEl = document.createElement('div');
    cartaEl.classList.add('carta');
    cartaEl.dataset.index = index; //guarda a posição para comparar depois
    
    const frente = document.createElement('div');
    frente.classList.add('frente');

    const verso = document.createElement('div');
    verso.classList.add('verso');
    
    //vai girar a carta para mostrar a imagem
    const inner = document.createElement('div');
    inner.classList.add('inner');

    const img = document.createElement('img');
    img.src = `../assets/temas/${estado.pastaTema}/${carta}.png`;
    img.alt = nomeCarta(carta);

    frente.appendChild(img);
    inner.appendChild(verso);
    inner.appendChild(frente);
    cartaEl.appendChild(inner);

    cartaEl.addEventListener('click', () => virarCarta(cartaEl, carta, index));

    return cartaEl;
}

function ClicarCarta(cartaEl, carta, index) {
    //ignora o clique se
    if (estado.bloqueio) return; // se o jogo estiver bloqueado (2 cartas viradas), não faz nada
    if (cartaEl.classList.contains('virada')) return;
    if (cartaEl.classList.contains('encontrada')) return;

    //quando carta é clicada add
    cartaEl.classList.add('virada');
    estado.cartasViradas.push({carta, index, cartaEl});

    if (estado.cartasViradas.length < 2) return; // espera a segunda carta ser virada
    estado.tentativas++;
    atualizarContadores();
    verificaPar();
}


function verificarPar() {
    const [primeira, segunda] = estado.cartasViradas;
 
    // As cartas são iguais se tiverem o mesmo nomeCarta
    const ehPar = primeira.nomeCarta === segunda.nomeCarta;
 
    if (ehPar) {
        // Marca as duas com a classe 'acertada' para nunca mais serem clicáveis
        primeira.elemento.classList.add('acertada');
        segunda.elemento.classList.add('acertada');
 
        // Limpa as cartas viradas
        estado.cartasViradas = [];
        estado.paresEncontrados++;
        atualizarContadores();
 
        // Verifica se o jogador completou o tabuleiro
        if (estado.paresEncontrados === estado.totalPares) {
            encerrarJogo();
        }
    } else {
        
        // Trava o tabuleiro para o jogador ver as cartas antes de virá-las de volta
        estado.travado = true;
 
        // Após 1 segundo, desvira as duas cartas e destrava o jogo
        setTimeout(() => {
            primeira.elemento.classList.remove('virada');
            segunda.elemento.classList.remove('virada');
            estado.cartasViradas = [];
            estado.travado = false;
        }, 1000); // 1 segundo de pausa para o jogador memorizar
    }
}

function iniciarTimer() {
    // Para qualquer timer anterior antes de iniciar um novo
    pararTimer();
 
    estado.timerSegundos = 0;
    timerElement.textContent = '0:00';
 
    // setInterval executa a função a cada 1000ms (1 segundo)
    // A referência fica em estado.timerInterval para parar depois
    estado.timerInterval = setInterval(() => {
        estado.timerSegundos++;
        timerElement.textContent = formatarTempo(estado.timerSegundos);
    }, 1000);
}
 
function pararTimer() {
    // clearInterval cancela o setInterval pelo id guardado
    if (estado.timerInterval) {
        clearInterval(estado.timerInterval);
        estado.timerInterval = null;
    }
}

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs    = segundos % 60;
    // padStart(2, '0') garante sempre 2 dígitos nos segundos: "1:05" em vez de "1:5"
    return `${minutos}:${String(segs).padStart(2, '0')}`;
}

function ajustarGrade(totalCartas) {
    let colunas;
 
    if (totalCartas <= 16) {
        colunas = 4;  // 4×4
    } else if (totalCartas <= 20) {
        colunas = 5;  // 5×4
    } else {
        colunas = 6;  // 6×4
    }
 
    // Define a propriedade CSS grid-template-columns diretamente no elemento
    // "repeat(4, 1fr)" cria 4 colunas de tamanho igual
    boardEl.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;
}

function encerrarJogo() {
    pararTimer();
    const evento = new CustomEvent('jogoEncerrado', {
        detail: {
            tempo:      estado.timerSegundos,
            tentativas: estado.tentativas,
            pares:      estado.totalPares
        }
    });
    document.dispatchEvent(evento);
}
 
window.iniciarJogo = iniciarJogo;