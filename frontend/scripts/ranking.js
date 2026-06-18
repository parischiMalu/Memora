const BACKEND = "http://localhost:3000/api";

const rankingLista = document.getElementById("ranking-lista");
const rankingVazio = document.getElementById("ranking-vazio");
const rankingNome = document.getElementById("ranking-nome");


const usuarioString = localStorage.getItem("usuarioLogado");


const USUARIO = JSON.parse(usuarioString);


const formatarTempo = (tempoString) => {
  const segundos = parseInt(tempoString.replace("s", ""), 10);
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(m)}:${pad(s)}`;
};


const criaItem = (registro, posicao) => {
  // Distribui medalhas para o top 3
  const medal =
    posicao === 1
      ? "🥇"
      : posicao === 2
        ? "🥈"
        : posicao === 3
          ? "🥉"
          : `${posicao}º`;


  const isUsuarioAtual = registro.nome === USUARIO.nickname;
  const destaqueClasse = isUsuarioAtual
    ? 'style="background-color: #e8f5e9; font-weight: bold;"'
    : "";

  return `
        <li class="record-item" ${destaqueClasse}>
            <span class="record-posicao">${medal}</span>
            <span class="record-tema">${registro.nome}</span> <span class="record-tempo">⏱ ${formatarTempo(registro.melhorTempo)}</span>
            <span class="record-data">${registro.data}</span>
        </li>
    `;
};


const carregarRanking = async () => {
  try {
    // Atualiza o título
    rankingNome.textContent = "Ranking Global dos Temas";

    // Busca a lista completa diretamente do PostgreSQL
    const resposta = await fetch(`${BACKEND}/ranking`);

    if (!resposta.ok) {
      throw new Error("Falha ao buscar ranking no servidor.");
    }

    const rankingGeral = await resposta.json(); // Array de temas com seus rankings

    // Se o banco ainda não tiver nenhuma partida finalizada
    if (!rankingGeral || rankingGeral.length === 0) {
      rankingVazio.style.display = "block";
      return;
    }

    let htmlFinal = "";

    // Percorre cada tema (ex: "Animais", "Informática") e monta a lista de líderes
    rankingGeral.forEach((grupo) => {
      // Só exibe o tema se alguém já tiver jogado ele
      if (grupo.ranking.length > 0) {
        htmlFinal += `
                    <div class="ranking-grupo" style="margin-bottom: 2rem;">
                        <h3 style="color: #4a4a4a; border-bottom: 2px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">
                            ${grupo.tema}
                        </h3>
                        <ul class="record-lista" style="list-style: none; padding: 0;">
                            ${grupo.ranking.map((r, index) => criaItem(r, index + 1)).join("")}
                        </ul>
                    </div>
                `;
      }
    });

    
    if (htmlFinal === "") {
      rankingVazio.style.display = "block";
    } else {
      rankingVazio.style.display = "none";
      rankingLista.innerHTML = htmlFinal;
    }
  } catch (erro) {
    console.error("Erro no ranking:", erro);
    rankingLista.innerHTML = `<p class="ranking-erro">Não foi possível carregar as pontuações no momento.</p>`;
  }
};

carregarRanking();
