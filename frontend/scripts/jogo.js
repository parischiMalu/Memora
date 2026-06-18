import { getTema, setOnTemaChange } from "./tema.js";

const BACKEND = "http://localhost:3000/api"; 


const usuarioString = localStorage.getItem("usuarioLogado");


if (!usuarioString) {

  window.location.href = "index.html";
}


const USUARIO = JSON.parse(usuarioString);


const grid = document.querySelector(".grid-jogo");
const seconds = document.getElementById("seconds");
const minutes = document.getElementById("minutes");
const modalParabens = document.querySelector(".fim-de-jogo");
const overlayEscuro = document.querySelector(".overlay-escuro");
const minFinal = document.getElementById("min-final");
const segFinal = document.getElementById("seg-final");
const tentativasFinal = document.getElementById("tentativas-final");
const btnReiniciar = document.querySelector(".reiniciar");
const spanFimJogador = document.getElementById("fim-jogador");

// Variáveis globais
let tentativas = 0;
let firstCard = "";
let secondCard = "";
let timer = null;
let totalSeconds = 0;
let timerStarted = false;

const pad = (n) => String(n).padStart(2, "0");

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const resetTimer = () => {
  clearInterval(timer);
  timer = null;
  totalSeconds = 0;
  timerStarted = false;
  minutes.innerHTML = "00";
  seconds.innerHTML = "00";
};

const startTimer = () => {
  if (timerStarted) return;
  timerStarted = true;
  timer = setInterval(() => {
    totalSeconds++;
    minutes.innerHTML = pad(Math.floor(totalSeconds / 60));
    seconds.innerHTML = pad(totalSeconds % 60);
  }, 1000);
};

const checaEndGame = async () => {
  const disabledCards = document.querySelectorAll(".disabled-carta");
  const totalCartas = document.querySelectorAll(".card").length;

 
  if (disabledCards.length === totalCartas && totalCartas > 0) {
    clearInterval(timer);

    try {
    
      const resposta = await fetch(`${BACKEND}/partidas/finalizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: USUARIO.id,
          pontuacao: 100,
        }),
      });

      const resultado = await resposta.json();

      // 3. Usa o tempo OFICIAL retornado pelo backend (em segundos)
      const tempoOficial = resultado.tempo || totalSeconds;
      minFinal.innerHTML = pad(Math.floor(tempoOficial / 60));
      segFinal.innerHTML = pad(tempoOficial % 60);
      tentativasFinal.innerHTML = tentativas;

    
      if (resultado.novoRecorde) {
        console.log("🏆 Parabéns, um novo recorde!");
      }

      overlayEscuro.style.display = "block";
      spanFimJogador.innerHTML = `Parabéns, ${USUARIO.nickname}!`;
      modalParabens.style.display = "flex";
    } catch (erro) {
      console.error("Erro ao registrar a partida no banco:", erro);
    }
  }
};

const checaCartas = () => {
  const primeiraCarta = firstCard.getAttribute("nome-carta");
  const segundaCarta = secondCard.getAttribute("nome-carta");

  if (primeiraCarta === segundaCarta) {
    firstCard.firstChild.classList.add("disabled-carta");
    secondCard.firstChild.classList.add("disabled-carta");
    firstCard = "";
    secondCard = "";
    checaEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("revela-carta");
      secondCard.classList.remove("revela-carta");
      firstCard = "";
      secondCard = "";
    }, 500);
  }
};

const revelaCarta = ({ target }) => {
  startTimer();

  if (target.parentNode.className.includes("revela-carta")) return;

  if (firstCard === "") {
    target.parentNode.classList.add("revela-carta");
    firstCard = target.parentNode;
  } else if (secondCard === "") {
    target.parentNode.classList.add("revela-carta");
    secondCard = target.parentNode;
    tentativas++;
    checaCartas();
  }
};


const criaCarta = (item) => {
  const card = createElement("div", "card");
  const front = createElement("div", "face front");
  const back = createElement("div", "face back");

  
  front.innerHTML = item;
  front.style.display = "flex";
  front.style.justifyContent = "center";
  front.style.alignItems = "center";
  front.style.fontSize = "3rem";

  card.appendChild(front);
  card.appendChild(back);
  card.addEventListener("click", revelaCarta);
  card.setAttribute("nome-carta", item); 

  return card;
};

btnReiniciar.addEventListener("click", () => {
  overlayEscuro.style.display = "none";
  modalParabens.style.display = "none";
  loadGame();
});

const loadGame = async () => {
  // Reseta estado anterior da lógica
  tentativas = 0;
  firstCard = "";
  secondCard = "";
  resetTimer();

  const tema = getTema();

  try {
    const resposta = await fetch(`${BACKEND}/partidas/iniciar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId: USUARIO.id,
        temaId: tema.id || 1,
        nivelId: 1,
      }),
    });

    if (!resposta.ok) throw new Error("Falha ao iniciar jogo no servidor.");

    const dados = await resposta.json();

    grid.innerHTML = "";

    dados.tabuleiro.forEach((item) => {
      grid.appendChild(criaCarta(item));
    });
  } catch (erro) {
    console.error("Erro ao carregar o jogo:", erro);
    alert("Ocorreu um erro ao carregar as cartas. Tente reiniciar a página.");
  }
};

// Escuta os cliques na página inteira e verifica se foi no botão de sair
document.addEventListener("click", (evento) => {
  const botaoSair = evento.target.closest("#btn-sair");

  if (botaoSair) {
    evento.preventDefault();

    // Remove a chave correta do login
    localStorage.removeItem("usuarioLogado");

    window.location.href = "index.html";
  }
});

// Reinicia o jogo quando o usuário troca de tema
setOnTemaChange(() => loadGame());
