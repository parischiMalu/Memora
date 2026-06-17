// src/services/TemaService.js
import { pool } from "../config/db.js";

/**
 * Responsável por gerenciar os temas.
 * Agora integrado 100% ao PostgreSQL na tabela 'jogo'.
 */
export class TemaService {
  /**
   * Retorna todos os temas disponíveis no sistema.
   * @returns {Promise<object[]>}
   */
  static async listarTemas() {
    const query = "SELECT * FROM jogo ORDER BY id ASC";
    const resultado = await pool.query(query);

    // Mapeia o resultado para transformar o texto 'tipo_peca' de volta em um array de cartas
    return resultado.rows.map((jogo) => ({
      id: jogo.id,
      nome: jogo.nome,
      cartas: JSON.parse(jogo.tipo_peca),
    }));
  }

  /**
   * Busca um tema específico pelo seu ID.
   * @param {number} id
   * @returns {Promise<object>}
   */
  static async buscarPorId(id) {
    const query = "SELECT * FROM jogo WHERE id = $1";
    const resultado = await pool.query(query, [id]);
    const tema = resultado.rows[0];

    if (!tema) {
      throw new Error(`Tema com id ${id} não encontrado.`);
    }

    return {
      id: tema.id,
      nome: tema.nome,
      cartas: JSON.parse(tema.tipo_peca),
    };
  }

  /**
   * Cadastra um novo tema no sistema (ação de administrador).
   * Exige no mínimo 12 cartas.
   * @param {string} nome - Nome do tema
   * @param {string[]} cartas - Array com os emojis/identificadores das cartas
   * @returns {Promise<object>} - o novo tema criado
   */
  static async cadastrarTema(nome, cartas) {
    if (!nome || !cartas || !Array.isArray(cartas) || cartas.length < 12) {
      throw new Error(
        "O tema precisa de um nome e no mínimo 12 cartas em formato de lista.",
      );
    }

    // Converte o array de cartas para uma string JSON para caber na coluna TEXT
    const tipoPecaStr = JSON.stringify(cartas);

    const query = `
            INSERT INTO jogo (nome, tipo_peca) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
    const valores = [nome, tipoPecaStr];

    const resultado = await pool.query(query, valores);
    const novoTema = resultado.rows[0];

    return {
      id: novoTema.id,
      nome: novoTema.nome,
      cartas: JSON.parse(novoTema.tipo_peca),
    };
  }

  /**
   * Remove um tema pelo ID (ação de administrador).
   * @param {number} id
   * @returns {Promise<object>} - o tema que foi removido
   */
  static async removerTema(id) {
    const query = "DELETE FROM jogo WHERE id = $1 RETURNING *";
    const resultado = await pool.query(query, [id]);
    const removido = resultado.rows[0];

    if (!removido) {
      throw new Error(`Tema com id ${id} não encontrado.`);
    }

    return {
      id: removido.id,
      nome: removido.nome,
      cartas: JSON.parse(removido.tipo_peca),
    };
  }
}
