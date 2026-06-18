// src/services/GameService.js

export class GameService {
  /**
   * Gera um novo tabuleiro embaralhado baseado nas cartas recebidas.
   * @param {string[]} cartas
   */
  static gerarTabuleiro(cartas) {
    // Se as cartas não foram repassadas corretamente, lança um erro
    if (!cartas || !Array.isArray(cartas) || cartas.length === 0) {
      throw new Error("Não é possível gerar o tabuleiro sem cartas válidas.");
    }

    // 1. Duplica as cartas para formar pares
    let tabuleiro = [...cartas, ...cartas];

    // 2. Embaralhamento com o algoritmo Fisher-Yates
    for (let i = tabuleiro.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      // Troca os elementos das posições i e j
      [tabuleiro[i], tabuleiro[j]] = [tabuleiro[j], tabuleiro[i]];
    }

    return tabuleiro;
  }
}
