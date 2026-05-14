import { Usuarios } from './Usuarios.js';
import { TEMAS } from '../mocks/temas.mock.js';
//import { NIVEIS } from './Configuracoes.js';

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

        this.recordesPessoais = {};
        this.totalPartidasConcluidas = 0;
    }

    /**
     * Atualiza o recorde pessoal do jogador se o tempo atual for o melhor.
     * @param {number} temaId - ID do tema jogado.
     * @param {number} tempoGasto - Tempo de conclusão em segundos.
     * @returns {boolean} - Retorna true se um novo recorde foi estabelecido.
     */
    atualizarRecorde(temaId, tempoGasto) {
        const chave = `${temaId}`;
        const registroAtual = this.recordesPessoais[chave];
        const recordeAtual = registroAtual?.melhorTempo ?? null;

        // Verifica se é a primeira partida ou se o tempo atual supera o recorde anterior
        if (recordeAtual === null || tempoGasto < recordeAtual) {
            const tema = TEMAS.find(t => t.id === temaId);

            // Salva o novo recorde
            this.recordesPessoais[chave] = {
                melhorTempo: tempoGasto,
                nomeTema: tema?.nome ?? `Tema ${temaId}`,
                data: new Date()
            };

            this.totalPartidasConcluidas++;
            return true;
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