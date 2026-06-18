// =========================================================
// 1. COMUNICAÇÃO COM A API (BACKEND)
// =========================================================

// URL base do seu servidor backend (onde a API está rodando)
const API_URL = "http://localhost:3000/api";

/**
 * Envia os dados de cadastro para a API
 */
async function cadastrar(nome, email, senha) {
  const resposta = await fetch(`${API_URL}/jogadores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname: nome,
      email: email,
      senha: senha,
    }),
  });

  const dados = await resposta.json();

  // Se o status HTTP não for de sucesso (200-299), lança o erro enviado pela API
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao realizar o cadastro.");
  }

  return dados;
}

/**
 * Envia as credenciais de login para a API e armazena os dados do usuário
 */
async function login(email, senha) {
  const resposta = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      senha: senha,
    }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao realizar o login.");
  }

  // Salva as informações do usuário logado para usar na tela do jogo
  localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

  return dados;
}

// =========================================================
// 2. LÓGICA DE INTERFACE E VALIDAÇÕES (SEU CÓDIGO)
// =========================================================

const emailInput = document.getElementById("usuario");
const senhaInput = document.getElementById("senha");
const olhoBtn = document.getElementById("olho-btn");
const olhoImg = document.getElementById("olho-img");
const msgElement = document.getElementById("mensagem");

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarMensagem(texto, tipo = "") {
  msgElement.textContent = texto;
  msgElement.className = "mensagem visivel " + tipo;

  msgElement._timer = setTimeout(() => {
    msgElement.className = "mensagem";
  }, 3000);
}

senhaInput.addEventListener("input", () => {
  const temTexto = senhaInput.value.length > 0;

  olhoBtn.style.display = temTexto ? "flex" : "none";

  if (!temTexto) {
    senhaInput.type = "password";
    olhoImg.src = "../assets/images/icon/olhosfechados.svg";
  }
});

olhoBtn.addEventListener("click", () => {
  const oculto = senhaInput.type === "password";

  senhaInput.type = oculto ? "text" : "password";

  olhoImg.src = oculto
    ? "../assets/images/icon/olhosabertos.svg"
    : "../assets/images/icon/olhosfechados.svg";
});

function abrirModal(id) {
  document.getElementById(id)?.classList.add("aberto");
}

function fecharModal(id) {
  document.getElementById(id)?.classList.remove("aberto");
}

document
  .getElementById("btn-cadastro")
  ?.addEventListener("click", () => abrirModal("modal-cadastro"));

document
  .getElementById("fechar-cadastro")
  ?.addEventListener("click", () => fecharModal("modal-cadastro"));

document.getElementById("modal-cadastro")?.addEventListener("click", (e) => {
  if (e.target.id === "modal-cadastro") {
    fecharModal("modal-cadastro");
  }
});

document.getElementById("btn-criar")?.addEventListener("click", async () => {
  const nome = document.getElementById("novo-usuario").value.trim();
  const email = document.getElementById("novo-email").value.trim();
  const senha = document.getElementById("nova-senha").value;
  const confirma = document.getElementById("confirmar-senha").value;

  if (!nome || !email || !senha || !confirma) {
    return mostrarMensagem("Preencha todos os campos.", "erro");
  }

  if (!validarEmail(email)) {
    return mostrarMensagem("E-mail inválido.", "erro");
  }

  if (senha.length < 6) {
    return mostrarMensagem("Senha muito curta.", "erro");
  }

  if (senha !== confirma) {
    return mostrarMensagem("As senhas não coincidem.", "erro");
  }

  try {
    await cadastrar(nome, email, senha);
    mostrarMensagem("Conta criada com sucesso!", "sucesso");
    fecharModal("modal-cadastro");

    // Limpa os campos após criar com sucesso
    document.getElementById("novo-usuario").value = "";
    document.getElementById("novo-email").value = "";
    document.getElementById("nova-senha").value = "";
    document.getElementById("confirmar-senha").value = "";
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
});

document.getElementById("btn-entrar")?.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email || !senha) {
    return mostrarMensagem("Preencha e-mail e senha.", "erro");
  }

  if (!validarEmail(email)) {
    return mostrarMensagem("E-mail inválido.", "erro");
  }

  if (senha.length < 6) {
    return mostrarMensagem("Senha inválida.", "erro");
  }

  try {
    await login(email, senha);
    mostrarMensagem("Login realizado com sucesso!", "sucesso");
    setTimeout(() => {
      window.location.href = "../pages/jogo.html";
    }, 1200);
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
});
