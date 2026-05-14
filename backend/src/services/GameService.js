// Implementa a classe responsável pela lógica do jogo

import { TEMAS } from '../mocks/temas.mock.js';

export class GameService {
    /**
     * Gera um tabuleiro embaralhado para uma partida.
     * @param {number} temaId - Identificador único do tema.
     * @returns {Array} Array de cartas duplicadas e embaralhadas.
     */
    static gerarTabuleiro(temaId) {
        // Busca o tema pelo id, retorna undefined se não encontrado
        const tema = TEMAS.find(t => t.id === temaId);

        // Se o tema não foi encontrado (undefined), lance um erro
        if (!tema) {
            throw new Error("Tema inválido.");
        }

        // Duplicação: Cria pares a partir da lista completa de cartas do tema
        let tabuleiro = [...tema.cartas, ...tema.cartas];

        // Embaralhamento com o algoritmo Fisher-Yates
        // Percorre o array de trás para frente
        for (let i = tabuleiro.length - 1; i > 0; i--) {

            // Math.random() gera um número aleatório com 0 <= número < 1 (ex: 0.456)
            // Multiplicando por (i + 1), obtemos um número entre 0 e i + 1 (ex: 0.456 * (i = 2) = 1.368)
            // Math.floor() arredonda para baixo, garantindo um número inteiro entre 0 e i (ex: 1)
            const j = Math.floor(Math.random() * (i + 1));

            // Troca os elementos nas posições i e j
            [tabuleiro[i], tabuleiro[j]] = [tabuleiro[j], tabuleiro[i]];
        }

        return tabuleiro;
    }
}