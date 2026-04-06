// Classe Player 

export class Player {
    constructor(nome) {
        this.nome = nome;
        this.dataCadastro = new Date();
        
        // Estrutura para o ranking: tempo mínimo (em segundos) por nível
        this.recordesPessoais = {
            1: { melhorTempo: null, data: null }, // Fácil
            2: { melhorTempo: null, data: null }, // Médio
            3: { melhorTempo: null, data: null }  // Difícil
        };

        this.totalPartidasConcluidas = 0;
    }

    /**
     * Tenta atualizar o recorde de um nível específico.
     * @param {number} nivelId - ID do nível (1, 2 ou 3)
     * @param {number} tempoGasto - Tempo final da partida em segundos
     * @returns {boolean} - Retorna true se um novo recorde foi batido
     */

    atualizarRecorde(nivelId, tempoGasto) {
        const recordeAtual = this.recordesPessoais[nivelId].melhorTempo;

        if (recordeAtual === null || tempoGasto < recordeAtual) {
            this.recordesPessoais[nivelId].melhorTempo = tempoGasto;
            this.recordesPessoais[nivelId].data = new Date();
            this.totalPartidasConcluidas++;
            return true;
        }
        
        this.totalPartidasConcluidas++;
        return false;
    }
}