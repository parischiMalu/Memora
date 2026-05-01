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
        // Busca o tema pelo id, retorna undefined se não encontrado
        const tema = TEMAS.find(t => t.id === temaId);

        // Converte NIVEIS em um array com os valores do objeto e busca o primeiro nível cujo id 
        // seja igual ao nivelId, retorna undefined caso não encontrado
        const nivel = Object.values(NIVEIS).find(n => n.id === nivelId);

        // Se o tema ou o nivel não foram encontrados (undefined), lance um erro
        if (!tema || !nivel) {
            throw new Error("Tema ou Nível inválido.");
        }

        // 1. Seleciona a quantidade de cartas necessária para o nível (ex: 4 pares = 4 cartas)
        // O slice copia uma parte de um array sem alterar o original, 
        // exemplo: pegue as cartas do índice 0 até nivel.pares (sem incluir o final)
        const cartasSelecionadas = tema.cartas.slice(0, nivel.pares);

        // 2. Duplica as cartas para formar pares
        let tabuleiro = [...cartasSelecionadas, ...cartasSelecionadas];

        // 3. Embaralhamento com o algoritmo Fisher-Yates
        // Percorre o array de trás para frente
        for (let i = tabuleiro.length - 1; i > 0; i--) {

            // Math.random() gera um número aleatório com 0 <= número < 1 (ex: 0.456)
            // Multiplicando por (i + 1), obtemos um número entre 0 e i + 1 (ex: 0.456 * (i = 2) = 1.368)
            // Math.floor() arredonda para baixo, garantindo um número inteiro entre 0 e i (ex: 1)
            const j = Math.floor(Math.random() * (i + 1));

            // Troca os elementos das posições i e j
            // Isso move o elemento atual para uma posição aleatória do array
            [tabuleiro[i], tabuleiro[j]] = [tabuleiro[j], tabuleiro[i]];
        }

        return tabuleiro;
    }
}