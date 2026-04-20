import { GameService } from '../services/GameService.js';

export class GameSession {
    constructor(player, temaId, nivelId) {
        this.player = player; // objeto da classe Player
        this.temaId = temaId;
        this.nivelId = nivelId;
        this.tabuleiro = GameService.gerarTabuleiro(temaId, nivelId); // Gera o tabuleiro
        this.inicio = Date.now();
        this.fim = null;
        this.tempoFinal = null;
    }

    finalizarPartida() {
        this.fim = Date.now();
        this.tempoFinal = Math.floor((this.fim - this.inicio) / 1000); // Converte para segundos
        
        // O objeto GameSession avisa o objeto Player para atualizar o recorde
        const foiRecorde = this.player.atualizarRecorde(this.nivelId, this.tempoFinal);
        
        return {
            tempo: this.tempoFinal,
            novoRecorde: foiRecorde
        };
    }
}