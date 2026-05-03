const tema = document.getElementById('tema-btn');
const temasMenu = document.getElementById('temas');

tema.addEventListener('click', () => {
    event.stopPropagation();
    const aberto = temasMenu.style.display === 'block';
    temasMenu.style.display = aberto ? 'none' : 'block';
});

window.addEventListener('click', (event) => {
    const clicouMenu = temasMenu.contains(event.target);
    if (!clicouMenu) {
        temasMenu.style.display = 'none';
    }
});

temasMenu.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const temaSelecionado = event.target.innerText;;
        console.log(`Tema selecionado: ${temaSelecionado}`);
    }
});