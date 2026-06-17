// src/services/RankingService.js
import { pool } from "../config/db.js";

/**
 * Responsável por gerar o ranking de jogadores integrado ao PostgreSQL.
 * O ranking é focado estritamente no melhor tempo por tema (jogo).
 */
export class RankingService {
  /**
   * Retorna o ranking de um tema específico.
   * Filtra apenas jogadores que jogaram aquele tema e pega o melhor tempo de cada um.
   * @param {number} temaId
   * @returns {Promise<object>}
   */
  static async getRankingPorTema(temaId) {
    // 1. Verifica se o tema existe e pega o nome dele
    const temaQuery = "SELECT nome FROM jogo WHERE id = $1";
    const temaResult = await pool.query(temaQuery, [temaId]);

    if (temaResult.rows.length === 0) {
      throw new Error(`Tema com id ${temaId} não encontrado.`);
    }
    const nomeTema = temaResult.rows[0].nome;

    // 2. Busca o melhor tempo de cada jogador neste tema usando DISTINCT ON
    const rankingQuery = `
            WITH MelhoresTempos AS (
                SELECT DISTINCT ON (usuario_id) 
                    usuario_id, 
                    tempo_decorrido, 
                    data_jogada
                FROM partida
                WHERE jogo_id = $1
                ORDER BY usuario_id, tempo_decorrido ASC
            )
            SELECT 
                u.nickname AS nome,
                m.tempo_decorrido AS "melhorTempo",
                m.data_jogada AS data
            FROM MelhoresTempos m
            JOIN usuario u ON m.usuario_id = u.id
            ORDER BY m.tempo_decorrido ASC;
        `;

    const rankingResult = await pool.query(rankingQuery, [temaId]);

    // 3. Formata a resposta para manter o padrão (adicionando o 's' no tempo e formatando a data)
    const rankingFormatado = rankingResult.rows.map((r) => ({
      nome: r.nome,
      melhorTempo: `${r.melhorTempo}s`,
      data: new Date(r.data).toLocaleDateString("pt-BR"),
    }));

    return { tema: nomeTema, ranking: rankingFormatado };
  }

  /**
   * Retorna o ranking geral agrupado por todos os temas jogados.
   * @returns {Promise<object[]>}
   */
  static async getRankingGeral() {
    // Pega todos os IDs de jogos que já possuem pelo menos uma partida registrada
    const jogosJogadosQuery = "SELECT DISTINCT jogo_id FROM partida";
    const jogosResult = await pool.query(jogosJogadosQuery);

    const rankingGeral = [];

    // Para cada jogo que já foi jogado, busca o ranking e adiciona à lista
    for (let linha of jogosResult.rows) {
      const rankingDoTema = await RankingService.getRankingPorTema(
        linha.jogo_id,
      );
      rankingGeral.push(rankingDoTema);
    }

    return rankingGeral;
  }
}
