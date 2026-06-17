// src/services/GameService.js

/**
 * Implementa a classe responsável pela lógica do jogo.
 * Agora atua de forma pura: apenas recebe as cartas e embaralha.
 */
export class GameService {
  /**
   * Gera um novo tabuleiro embaralhado baseado nas cartas recebidas.
   * @param {string[]} cartas - Array com as cartas/emojis do banco de dados
   */
  static gerarTabuleiro(cartas) {
    // Se as cartas não foram repassadas corretamente, lança um erro
    if (!cartas || !Array.isArray(cartas) || cartas.length === 0) {
      throw new Error("Não é possível gerar o tabuleiro sem cartas válidas.");
    }

    // 1. Duplica as cartas para formar pares
    let tabuleiro = [...cartas, ...cartas];

    // 2. Embaralhamento com o algoritmo Fisher-Yates
    // Percorre o array de trás para frente
    for (let i = tabuleiro.length - 1; i > 0; i--) {
      // Math.random() gera um número aleatório com 0 <= número < 1
      const j = Math.floor(Math.random() * (i + 1));

      // Troca os elementos das posições i e j
      [tabuleiro[i], tabuleiro[j]] = [tabuleiro[j], tabuleiro[i]];
    }

    return tabuleiro;
  }
}
