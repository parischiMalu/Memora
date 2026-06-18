// src/models/GameSession.js
import { GameService } from "../services/GameService.js";
import { pool } from "../config/db.js";

/**
 * Representa uma partida em andamento.
 */
export class GameSession {
  constructor(jogador, temaId, nivelId, cartasDoTema) {
    if (!jogador || !jogador.id) {
      throw new Error(
        "Apenas jogadores logados e válidos podem iniciar uma partida.",
      );
    }

    this.jogador = jogador;
    this.temaId = temaId;
    this.nivelId = nivelId;

    // Passa as cartas prontas para o serviço embaralhar
    this.tabuleiro = GameService.gerarTabuleiro(cartasDoTema);

    this.inicio = Date.now();
    this.fim = null;
    this.tempoFinal = null;
    this.encerrada = false;
  }

  /**
   * Finaliza a partida: calcula o tempo decorrido, salva no PostgreSQL
   * @returns {Promise<{ tempo: number, novoRecorde: boolean }>}
   */
  async finalizarPartida(pontuacao = 0) {
    if (this.encerrada) {
      throw new Error("Esta partida já foi encerrada.");
    }

    this.fim = Date.now();
    this.tempoFinal = Math.floor((this.fim - this.inicio) / 1000);
    this.encerrada = true;

    // 1. Verifica o recorde atual do jogador no banco ANTES de salvar a nova partida
    const recordeQuery = `
            SELECT MIN(tempo_decorrido) AS melhor_tempo 
            FROM partida 
            WHERE usuario_id = $1 AND jogo_id = $2
        `;
    const recordeResult = await pool.query(recordeQuery, [
      this.jogador.id,
      this.temaId,
    ]);
    const recordeAntigo = recordeResult.rows[0].melhor_tempo;

    // 2. Registra a partida finalizada no banco de dados
    const insertQuery = `
            INSERT INTO partida (pontuacao, tempo_decorrido, jogo_id, usuario_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
    const valores = [pontuacao, this.tempoFinal, this.temaId, this.jogador.id];
    await pool.query(insertQuery, valores);

    // 3. Verifica se bateu o recorde
    const novoRecorde =
      recordeAntigo === null || this.tempoFinal < recordeAntigo;

    return {
      tempo: this.tempoFinal,
      novoRecorde,
    };
  }
}
