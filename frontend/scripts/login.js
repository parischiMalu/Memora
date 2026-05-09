
const emailInput = document.getElementById('usuario');
const senhaInput = document.getElementById('senha');
const olhoBtn = document.getElementById('olho-btn');
const olhoImg = document.getElementById('olho-img');
const msgElement = document.getElementById('mensagem');

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarMensagem(texto, tipo = '') {
    msgElement.textContent = texto;
    msgElement.className = 'mensagem visivel ' + tipo;

    msgElement._timer = setTimeout(() => {
        msgElement.className = 'mensagem';
    }, 3000);
}

senhaInput.addEventListener('input', () => {
    const temTexto = senhaInput.value.length > 0;

    olhoBtn.style.display = temTexto ? 'flex' : 'none';

    if (!temTexto) {
        senhaInput.type = 'password';
        olhoImg.src = '../assets/images/icon/olhosfechados.svg';
    }
});

olhoBtn.addEventListener('click', () => {
    const oculto = senhaInput.type === 'password';

    senhaInput.type = oculto ? 'text' : 'password';

    olhoImg.src = oculto
        ? '../assets/images/icon/olhosabertos.svg'
        : '../assets/images/icon/olhosfechados.svg';
});

function abrirModal(id) {
    document.getElementById(id)?.classList.add('aberto');
}

function fecharModal(id) {
    document.getElementById(id)?.classList.remove('aberto');
}

document.getElementById('btn-cadastro')
?.addEventListener('click', () => abrirModal('modal-cadastro'));

document.getElementById('fechar-cadastro')
?.addEventListener('click', () => fecharModal('modal-cadastro'));

document.getElementById('modal-cadastro')
?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-cadastro') {
        fecharModal('modal-cadastro');
    }
});

document.getElementById('btn-criar')
?.addEventListener('click', async () => {

    const nome = document.getElementById('novo-usuario').value.trim();
    const email = document.getElementById('novo-email').value.trim();
    const senha = document.getElementById('nova-senha').value;
    const confirma = document.getElementById('confirmar-senha').value;

    if (!nome || !email || !senha || !confirma) {
        return mostrarMensagem('Preencha todos os campos.', 'erro');
    }

    if (!validarEmail(email)) {
        return mostrarMensagem('E-mail inválido.', 'erro');
    }

    if (senha.length < 6) {
        return mostrarMensagem('Senha muito curta.', 'erro');
    }

    if (senha !== confirma) {
        return mostrarMensagem('As senhas não coincidem.', 'erro');
    }

    try {
        await cadastrar(nome, email, senha);
        mostrarMensagem('Conta criada com sucesso!');
        fecharModal('modal-cadastro');
    } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
    }
});

document.getElementById('btn-entrar')
?.addEventListener('click', async () => {

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!email || !senha) {
        return mostrarMensagem('Preencha e-mail e senha.', 'erro');
    }

    if (!validarEmail(email)) {
        return mostrarMensagem('E-mail inválido.', 'erro');
    }

    if (senha.length < 6) {
        return mostrarMensagem('Senha inválida.', 'erro');
    }

    try {
        await login(email, senha);
        mostrarMensagem('Login realizado com sucesso!');
        setTimeout(() => {
            window.location.href = '../pages/jogo.html';
        }, 1200);
    } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
    }
});
