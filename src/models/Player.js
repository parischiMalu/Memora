import { Usuarios } from './Usuarios.js';
import { TEMAS } from '../mocks/temas.mock.js';
import { NIVEIS } from './Configuracoes.js';

/**
 * Representa um jogador do sistema.
 * Herda login e autenticação de Usuario (classe pai).
 * Adiciona a lógica de recordes e controle de partidas.
 */

export class Player extends Usuarios {
    // Chama o constructor da classe Usuario,
    // definindo automaticamente o tipo como 'jogador'
    constructor(nome, email, senhaTexto) {
        super(nome, email, senhaTexto, 'jogador');

        /**
         * Armazena o melhor tempo por combinação de tema + NÍVEL.
         * A chave é gerada no formato "temaId-nivelId" (ex: "1-2" = Frutas Médio).
         * Isso permite que o jogador tenha um recorde separado para cada tema/id.
         *
         * Exemplo:
         *   {"1-1": { melhorTempo: 45, nomeTema: "Frutas", nomeNivel: "Iniciante", data: Date },
         *   "2-1": { melhorTempo: 30, nomeTema: "Animais", nomeNivel: "Iniciante", data: Date }}
         */
        this.recordesPessoais = {};

        this.totalPartidasConcluidas = 0;
    }

    /**
     * Tenta atualizar o recorde de uma combinação tema + nível.
     * O recorde só é atualizado se o novo tempo for menor que o anterior.
     * @param {number} temaId    - ID do tema jogado
     * @param {number} nivelId   - ID do nível jogado (1, 2 ou 3)
     * @param {number} tempoGasto - Tempo final da partida em segundos
     * @returns {boolean} - true se um novo recorde foi registrado
     */
    atualizarRecorde(temaId, nivelId, tempoGasto) {
        const chave = `${temaId}-${nivelId}`; // ex: "1-2" = Frutas Médio

        const registroAtual = this.recordesPessoais[chave];
        const recordeAtual  = registroAtual?.melhorTempo ?? null;

        if (recordeAtual === null || tempoGasto < recordeAtual) {
            // Busca os nomes do tema e nível para guardar junto ao recorde

            // Arrow function (=>) é uma forma curta de escrever função.
            // Aqui é equivalente a function(t) { return t.id === temaId; }
            const tema  = TEMAS.find(t => t.id === temaId);
            const nivel = Object.values(NIVEIS).find(n => n.id === nivelId);

            this.recordesPessoais[chave] = {
                melhorTempo: tempoGasto,
                // ?. evita erro se for undefined | ?? define valor padrão (null)
                nomeTema:  tema?.nome  ?? `Tema ${temaId}`,
                nomeNivel: nivel?.nome ?? `Nível ${nivelId}`,
                data: new Date()
            };

            this.totalPartidasConcluidas++;
            return true; // novo recorde
        }

        this.totalPartidasConcluidas++;
        return false;
    }

    /**
     * Sobrescreve getResumo() para incluir os recordes do jogador.
     */
    getResumo() {
        return {
            // ... copia os dados do objeto retornado pelo pai
            ...super.getResumo(), // aproveita nome, email, role, dataCadastro
            totalPartidasConcluidas: this.totalPartidasConcluidas,
            recordesPessoais: this.recordesPessoais
        };
    }
}