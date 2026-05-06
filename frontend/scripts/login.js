/* ==========================================================================
   LOGIN.JS 
   ========================================================================== */

import { login, cadastrar } from './api.js'; //Importa as funções de comunicação do api.js

/* --- REFERÊNCIAS AO DOM*/
const emailInput      = document.getElementById('usuario');      // Input de e-mail principal
const senhaInput      = document.getElementById('senha');        // Input de senha principal
const olhoBtn         = document.getElementById('olho-btn');     // Botão de mostrar senha
const olhoImg         = document.getElementById('olho-img');     // Ícone do olho
const inputEsqueceu   = document.getElementById('input-esqueceu'); // Input do modal de recuperação
const msgElement      = document.getElementById('mensagem');      // Elemento do Toast
//Captura os elementos do HTML (caixas de texto, botões) para que o JS possa "mexer" neles, ou seja, cria 
// "atalhos" para os elementos da tela. Em vez de o JS procurar o input toda vez que você clica no botão, 
// ele já deixa guardado na memória. 


/* --- UTILITÁRIOS --- */

// Validação de formato de e-mail (Regex (expressão regular))
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); //checa 
    // se texto tem formato de e-mail (algo@algo.com)
    // retorna um valor Booleano, true se Se o texto 
    // parecer um e-mail (ex: fulano@provedor.com) e
    //false se faltar o @, se tiver espaços ou se não tiver ponto

}

// Exibição de mensagens (Toast)
function mostrarMensagem(texto, tipo = '') { //Cria o "Toast" (balãozinho).
    if (!msgElement) return;
    msgElement.textContent = texto; // Coloca o texto no balão
    msgElement.className = 'mensagem visivel ' + tipo; // Adiciona classes CSS para animar e colorir
    clearTimeout(msgElement._timer); // Se já havia um timer rodando, cancela (evita bugs)
    msgElement._timer = setTimeout(() => {
        msgElement.className = 'mensagem'; // Após 3 segundos, remove a classe 'visivel' e o balão some
    }, 3000);
}

/* --- INTERAÇÕES DE UI --- */

// Toggle do Olho: Mostra/Esconde senha + Acessibilidade (ALT)
/* --- INTERAÇÕES DE UI --- */
if (olhoBtn && senhaInput && olhoImg) {
    olhoBtn.addEventListener('click', () => {
        // Verifica se o tipo atual é password
        const isPassword = senhaInput.type === 'password';
        
        // Inverte o tipo
        senhaInput.type = isPassword ? 'text' : 'password';
        
        // Se mudou para texto, mostra o olho ABERTO. Se mudou para password, mostra FECHADO.
        olhoImg.src = isPassword  // Troca a imagem do olho
            ? '../assets/images/icon/olhosabertos.svg' 
            : '../assets/images/icon/olhosfechados.svg';

        
        // Atualiza o texto de acessibilidade
        olhoImg.alt = isPassword ? 'Ocultar senha' : 'Mostrar senha';
    });
}

// Funções de Modal (modal =  janela pop-up,janelas flutuantes (nesse caso: 'Esqueci Senha' e 'Cadastro') )
function abrirModal(id) {
    const modal = document.getElementById(id); //Procura esse modal no HTML.
    if (modal) modal.classList.add('aberto'); // Adiciona a classe CSS que tem o display: flex ou opacity: 1, 
    // fazendo ele aparecer.
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('aberto');
} //Faz o oposto: remove a classe 'aberto', escondendo o modal.

// Fechar modais ao clicar fora (forEach) 
['modal-esqueceu', 'modal-cadastro'].forEach(id => { //Cria uma lista com os IDs que queremos monitorar. Para 
// cada ID na lista, ele adiciona um "ouvinte" de clique.
    const modal = document.getElementById(id); //Procura o elemento no HTML usando o ID da vez.
    if (modal) { //Verifica se ele realmente existe
        modal.addEventListener('click', (e) => { //quando você clica em qualquer lugar, o JavaScript gera um objeto de evento 
        // chamado e. Dentro dele, o e.target diz exatamente em qual "peça" do HTML o seu dedo (ou mouse) tocou;
            if (e.target === modal) fecharModal(id);
        }); //checa se você clicou no fundo escuro (o overlay). Se você clicar dentro do card branco, o e.target será o 
        // card, não o modal completo, então a janela não fecha.
    }
});

/* --- LÓGICA DE RECUPERAÇÃO --- */
const btnEnviar = document.getElementById('btn-enviar'); //Pega o botão "Enviar" do modal de esqueci senha.
if (btnEnviar) { //Só executa o código se o botão existir na página
    btnEnviar.addEventListener('click', () => {
        if (!inputEsqueceu) return;
        const email = inputEsqueceu.value.trim(); //Pega o e-mail digitado e remove espaços inúteis.

        if (!email) return mostrarMensagem('Informe o e-mail.', 'erro'); //Se estiver vazio, mostra erro e para (return)
        if (!validarEmail(email)) return mostrarMensagem('E-mail inválido.', 'erro'); //ver se o e-mail é válido.

        mostrarMensagem('Instruções enviadas para o e-mail!');
        fecharModal('modal-esqueceu');
        inputEsqueceu.value = '';
    }); //Mostra a mensagem de sucesso, fecha o modal e limpa o campo (value = '').
}

/* --- LÓGICA DE CADASTRO --- */
const btnCriar = document.getElementById('btn-criar'); //Cria uma variável (um apelido) para o botão de enviar 
// do modal de recuperação
if (btnCriar) { //Verifica se o botão realmente foi encontrado na página
    btnCriar.addEventListener('click', async () => { //Adiciona um "ouvido atento" ao botão. Quando ocorrer 
    // um 'click', ele executa a função dentro das chaves.
        const nome     = document.getElementById('novo-usuario').value.trim();
        const email    = document.getElementById('novo-email').value.trim();
        const senha    = document.getElementById('nova-senha').value;
        const confirma = document.getElementById('confirmar-senha').value;
        //Localiza cada campo de entrada, lê o que foi digitado (value) e, no caso do nome e e-mail, remove 
        // espaços vazios acidentais no início e fim (trim()).

        if (!nome || !email || !senha || !confirma) { //Verifica se qualquer um dos campos está vazio.
            return mostrarMensagem('Preencha todos os campos.', 'erro');
        }
        if (!validarEmail(email)) { //Executa a função Regex para checar o formato
            return mostrarMensagem('E-mail inválido.', 'erro'); 
        }
        if (senha.length < 6) { //Verifica se a string da senha tem menos de 6 letras/números.
            return mostrarMensagem('A senha deve ter pelo menos 6 caracteres.', 'erro');
        }
        if (senha !== confirma) { //Compara se o conteúdo da primeira senha é diferente (!==) da segunda
            return mostrarMensagem('As senhas não coincidem.', 'erro');
        }

        try {
            await cadastrar(nome, email, senha); //O try abre um bloco de tentativa. O await chama a 
            // função do arquivo api.js e pausa a execução até que o servidor responda "OK" ou "Erro".
            //(a resposta do servidor não é instantânea; o código precisa esperar a confirmação do banco de dados)
            mostrarMensagem('Conta criada com sucesso!');
            fecharModal('modal-cadastro'); //Se o cadastrar deu certo, exibe o balão verde e fecha a janela de cadastro
            
            ['novo-usuario', 'novo-email', 'nova-senha', 'confirmar-senha'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            }); // Limpa campos se eles existirem
        } catch (erro) { //Se qualquer erro acontecer dentro do bloco try (ex: e-mail já existe, servidor offline), 
        // o código pula imediatamente para cá
            mostrarMensagem(erro.message, 'erro');
        }
    });
}

/* --- LÓGICA DE LOGIN --- */
const btnEntrar = document.getElementById('btn-entrar'); //Busca no HTML o botão que possui o ID btn-entrar.
if (btnEntrar) { //Verifica se o botão foi realmente encontrado
    btnEntrar.addEventListener('click', async () => { //Adiciona o evento de clique. O async avisa que essa função vai 
    // realizar uma comunicação com servidor que exige espera.
        if (!emailInput || !senhaInput) return; //Checa se os campos de input de e-mail e senha estão presentes na memória

        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        //Captura o texto atual dos campos. No e-mail, remove os espaços vazios laterais com .trim().
        
        
        // Validações de entrada
        if (!email || !senha) {
            return mostrarMensagem('Preencha e-mail e senha.', 'erro');
        } //Se um dos dois estiver vazio, exibe o balão de erro e encerra a função com o return.
        if (!validarEmail(email)) {
            return mostrarMensagem('E-mail inválido.', 'erro');
        } //Chama a função de Regex para ver se o e-mail tem o formato esperado
        if (senha.length < 6) {
            return mostrarMensagem('Senha inválida (mín. 6 caracteres).', 'erro');
        } //Conta os caracteres da senha digitada.

        try {
            await login(email, senha); //try inicia a tentativa de login. O await faz o código "congelar" nesta linha até que 
            // o arquivo api.js volte com uma resposta do servidor.
            mostrarMensagem('Login realizado com sucesso!'); //Exibe o Toast de sucesso (toast = são notificações rápidas, 
            // não intrusivas e automáticas para feedbacks simples)
            setTimeout(() => {
                window.location.href = 'jogo.html';
            }, 1200); //Espera 1200 milissegundos (1.2 segundos) e então muda a página do navegador
        } catch (erro) { 
            // Capturamos tanto erros do backend quanto erros de rede do api.js
            mostrarMensagem(erro.message, 'erro');
        }
    });

    /* --- LISTENERS PARA ABRIR/FECHAR MODAIS --- */
    //garante que o HTML esteja pronto antes de ligar os botões secundários
    document.addEventListener('DOMContentLoaded', () => { //Aguarda o navegador terminar de montar todo o esqueleto (DOM) da página.
    
    // Abrir Esqueci Senha (Tenta achar o botão de "Esqueci Senha". Se achar (?.), liga ele à função de abrir o modal.)
    document.getElementById('btn-esqueceu')?.addEventListener('click', () => abrirModal('modal-esqueceu'));
    
    // Abrir Cadastro
    document.getElementById('btn-cadastro')?.addEventListener('click', () => abrirModal('modal-cadastro'));

    // Fechar Esqueci Senha (Liga o botão de fechar (o "X" ou "Cancelar") à função que esconde o modal)
    document.getElementById('fechar-esqueceu')?.addEventListener('click', () => fecharModal('modal-esqueceu'));

    // Fechar Cadastro
    document.getElementById('fechar-cadastro')?.addEventListener('click', () => fecharModal('modal-cadastro'));
});
}