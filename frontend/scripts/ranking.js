const BACKEND = 'http://localhost:3000';

const rankingLista = document.getElementById('ranking-lista');
const rankingVazio = document.getElementById('ranking-vazio');
const rankingNome = document.getElementById('ranking-nome');


// Redireciona se não estiver logado
const email = 'maria@email.com';
// const email = sessionStorage.getItem('emailJogador');
// if (!email) window.location.href = '../frontend/index.html';

const pad = (n) => String(n).padStart(2, '0');

const formatarTempo = (segundos) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${pad(m)}:${pad(s)}`;
};

const criaItem = (registro, posicao) => {
    const medal = posicao === 1 ? '🥇' : posicao === 2 ? '🥈' : '🥉';

    return `
        <li class="record-item">
            <span class="record-posicao">${medal}</span>
            <span class="record-tema">${registro.nomeTema}</span>
            <span class="record-tempo">⏱ ${formatarTempo(registro.melhorTempo)}</span>
            <span class="record-tentativas">🎯 ${registro.melhorTentativas ?? '—'} tent.</span>
            <span class="record-data">${new Date(registro.data).toLocaleDateString('pt-BR')}</span>
        </li>
    `;
};

const carregarRanking = async () => {
try {
        // query param em vez de path param
        const resposta = await fetch(`${BACKEND}/jogadores?email=${encodeURIComponent(email)}`);

        // Jogador ainda não existe no banco
        if (resposta.status === 404) {
            rankingNome.textContent = email;
            rankingVazio.style.display = 'block';
            return;
        }

        const dados = await resposta.json();
        rankingNome.textContent = `Jogador: ${dados.nome}`;

        const recordes = Object.values(dados.recordesPessoais ?? {});

        if (recordes.length === 0) {
            rankingVazio.style.display = 'block';
            return;
        }

        // Ordena por menor tempo, empate desempata por tentativas
        const ordenado = recordes.sort((a, b) => {
            if (a.melhorTempo !== b.melhorTempo) return a.melhorTempo - b.melhorTempo;
            return (a.melhorTentativas ?? 0) - (b.melhorTentativas ?? 0);
        });

        rankingLista.innerHTML = `<ul class="record-lista">
            ${ordenado.map((r, i) => criaItem(r, i + 1)).join('')}
        </ul>`;

    } catch (erro) {
        rankingLista.innerHTML = `<p class="ranking-erro">Não foi possível carregar o histórico.</p>`;
    }
};

carregarRanking();