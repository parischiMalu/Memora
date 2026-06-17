// src/app.js
import express from "express";
import cors from "cors"; // Importado
import { AuthService } from "./services/AuthService.js";
import { TemaService } from "./services/TemaService.js";
import { RankingService } from "./services/RankingService.js";
import { GameSession } from "./models/GameSession.js";

const app = express(); // 1º: Inicializa o app

// 2º: Configura Middlewares (A ordem aqui é importante)
app.use(cors()); // Libera o acesso para o frontend
app.use(express.json()); // Permite ler JSON

// ─────────────────────────────────────────────────────────────
// ROTA 1: CADASTRO DE JOGADOR
// ─────────────────────────────────────────────────────────────
app.post("/api/jogadores", async (req, res) => {
  try {
    const { nickname, email, senha } = req.body;
    const novoJogador = await AuthService.cadastrarJogador(
      nickname,
      email,
      senha,
    );
    res.status(201).json({
      mensagem: "Jogador cadastrado com sucesso!",
      jogador: novoJogador,
    });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// ROTA 2: LOGIN DE USUÁRIO
// ─────────────────────────────────────────────────────────────
app.post("/api/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuarioLogado = await AuthService.login(email, senha);
    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: usuarioLogado,
    });
  } catch (error) {
    res.status(401).json({ erro: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// ROTAS DE TEMAS (JOGOS)
// ─────────────────────────────────────────────────────────────

app.get("/api/temas", async (req, res) => {
  try {
    const temas = await TemaService.listarTemas();
    res.status(200).json(temas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.post("/api/temas", async (req, res) => {
  try {
    const { nome, cartas } = req.body;
    const novoTema = await TemaService.cadastrarTema(nome, cartas);
    res.status(201).json({
      mensagem: `Tema "${novoTema.nome}" cadastrado com sucesso!`,
      tema: novoTema,
    });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.delete("/api/temas/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const removido = await TemaService.removerTema(id);
    res.status(200).json({
      mensagem: "Tema removido com sucesso!",
      tema_removido: removido,
    });
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// ROTAS DE RANKING
// ─────────────────────────────────────────────────────────────

app.get("/api/ranking/:temaId", async (req, res) => {
  try {
    const temaId = parseInt(req.params.temaId, 10);
    const ranking = await RankingService.getRankingPorTema(temaId);
    res.status(200).json(ranking);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
});

app.get("/api/ranking", async (req, res) => {
  try {
    const rankingGeral = await RankingService.getRankingGeral();
    res.status(200).json(rankingGeral);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GERENCIADOR DE PARTIDAS (STATEFUL)
// ─────────────────────────────────────────────────────────────

const sessoesAtivas = new Map();

app.post("/api/partidas/iniciar", async (req, res) => {
  try {
    const { usuarioId, temaId, nivelId } = req.body;
    if (!usuarioId || !temaId || !nivelId) {
      return res
        .status(400)
        .json({ erro: "usuarioId, temaId e nivelId são obrigatórios." });
    }
    const tema = await TemaService.buscarPorId(temaId);
    const jogador = { id: usuarioId };
    const sessao = new GameSession(jogador, temaId, nivelId, tema.cartas);
    sessoesAtivas.set(usuarioId, sessao);

    res.status(200).json({
      mensagem: "Partida iniciada! O tempo está correndo.",
      tabuleiro: sessao.tabuleiro,
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.post("/api/partidas/finalizar", async (req, res) => {
  try {
    const { usuarioId, pontuacao } = req.body;
    if (!usuarioId) {
      return res.status(400).json({ erro: "usuarioId é obrigatório." });
    }
    const sessao = sessoesAtivas.get(usuarioId);
    if (!sessao) {
      return res.status(404).json({
        erro: "Nenhuma partida em andamento encontrada. Ela pode ter expirado.",
      });
    }
    const resultado = await sessao.finalizarPartida(pontuacao || 0);
    sessoesAtivas.delete(usuarioId);

    res.status(201).json({
      mensagem: "Partida finalizada e salva no banco!",
      ...resultado,
    });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao finalizar a partida.", detalhe: error.message });
  }
});

app.post("/api/partidas/cancelar", (req, res) => {
  const { usuarioId } = req.body;
  if (sessoesAtivas.has(usuarioId)) {
    sessoesAtivas.delete(usuarioId);
    return res
      .status(200)
      .json({ mensagem: "Partida cancelada. Memória liberada." });
  }
  res.status(404).json({ erro: "Nenhuma partida em andamento para cancelar." });
});

// ─────────────────────────────────────────────────────────────
// INICIALIZAÇÃO DO SERVIDOR
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API do Memora rodando na porta ${PORT}`);
  console.log(`👉 Cadastro: POST http://localhost:${PORT}/api/jogadores`);
  console.log(`👉 Login: POST http://localhost:${PORT}/api/login`);
});
