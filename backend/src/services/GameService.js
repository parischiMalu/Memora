// Implementa a classe responsável pela lógica do jogo

import { TEMAS } from '../mocks/temas.mock.js';
import { NIVEIS } from '../models/Configuracoes.js';

export class GameService {
    /**
     * Gera um novo tabuleiro embaralhado baseado no tema e dificuldade.
     * @param {number} temaId 
     * @param {number} nivelId 
     */
    static gerarTabuleiro(temaId, nivelId) {
        const tema = TEMAS.find(t => t.id === temaId);
        const nivel = NIVEIS[Object.keys(NIVEIS).find(key => NIVEIS[key].id === nivelId)];

        if (!tema || !nivel) {
            throw new Error("Tema ou Nível inválido.");
        }

        // 1. Seleciona a quantidade de cartas necessária para o nível (ex: 4 pares = 4 cartas)
        const cartasSelecionadas = tema.cartas.slice(0, nivel.pares);

        // 2. Duplica as cartas para formar pares
        let tabuleiro = [...cartasSelecionadas, ...cartasSelecionadas];

        // 3. Embaralhamento (Algoritmo Fisher-Yates)
        for (let i = tabuleiro.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tabuleiro[i], tabuleiro[j]] = [tabuleiro[j], tabuleiro[i]];
        }

        return tabuleiro;
    }
}