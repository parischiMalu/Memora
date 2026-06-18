

const BACKEND = "http://localhost:3000/api"; // URL da sua API

const temaBtn = document.getElementById("tema-btn");
const temasMenu = document.getElementById("temas");

let cacheTemas = []; 
let temaSelecionado = { id: 1, nome: "Carregando..." }; 
let onTemaChange = null;


temaBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const aberto = temasMenu.style.display === "block";
  temasMenu.style.display = aberto ? "none" : "block";
});

window.addEventListener("click", (event) => {
  if (!temasMenu.contains(event.target)) {
    temasMenu.style.display = "none";
  }
});


temasMenu.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const idClicado = parseInt(event.target.dataset.id, 10);

    
    const tema = cacheTemas.find((t) => t.id === idClicado);

    if (tema) {
      temaSelecionado = tema;
      temasMenu.style.display = "none";

      // Notifica o jogo.js que o tema mudou para carregar o novo tabuleiro
      if (onTemaChange) onTemaChange(temaSelecionado);
    }
    console.log("Tema selecionado atualmente:", temaSelecionado);
  }
});

async function carregarTemasDoBanco() {
  try {
    const resposta = await fetch(`${BACKEND}/temas`);
    if (!resposta.ok) throw new Error("Erro ao consultar a API de temas.");

    cacheTemas = await resposta.json(); // Recebe a lista do Postgres

    
    temasMenu.innerHTML = "";

    
    cacheTemas.forEach((tema) => {
      const li = document.createElement("li");
      li.textContent = tema.nome;
      li.dataset.id = tema.id; // Guarda o ID do banco de dados no elemento HTML
      temasMenu.appendChild(li);
    });

    // Se houver temas cadastrados, define o primeiro como o padrão do jogo
    if (cacheTemas.length > 0) {
      temaSelecionado = cacheTemas[0];

      // Dispara o gatilho para o jogo.js iniciar o tabuleiro do primeiro tema automaticamente
      if (onTemaChange) onTemaChange(temaSelecionado);
    }
  } catch (erro) {
    console.error("Falha ao inicializar os temas do banco de dados:", erro);
  }
}

carregarTemasDoBanco();

export const getTema = () => temaSelecionado;

export const setOnTemaChange = (fn) => {
  onTemaChange = fn;
};
