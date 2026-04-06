// Ponto de entrada do backend

import { Player } from './models/Player.js';
import { GameSession } from './models/GameSession.js';

// 1. Simula a criação de um jogador
const player = new Player("Seu Francisco");

// 2. Simula o início de uma partida (Tema 1, Nível 1)
const novaPartida = new GameSession(player, 1, 1);
console.log(`Tabuleiro gerado para ${player.nome}:`, novaPartida.tabuleiro);

// 3. Simula o fim da partida após 15 segundos
setTimeout(() => {
    const resultado = novaPartida.finalizarPartida();
    console.log(`Partida finalizada! Tempo: ${resultado.tempo}s. Novo Recorde? ${resultado.novoRecorde}`);
    console.table(player.recordesPessoais);
}, 2000); // Testando com 2 segundos para ser rápido