// Recebe o tabuleiro do backend: ["🍎", "🍌", "🍎", "🍌", ...]
function renderizarTabuleiro(tabuleiro) {
    tabuleiro.forEach((carta, index) => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        cardEl.dataset.index = index;
        cardEl.dataset.valor = carta; // guarda o emoji no elemento

        cardEl.innerHTML = `
            <div class="card-inner">
                <div class="card-back">❓</div>
                <div class="card-front">${carta}</div>  <!-- emoji vai aqui -->
            </div>
        `;
        board.appendChild(cardEl);
    });
}