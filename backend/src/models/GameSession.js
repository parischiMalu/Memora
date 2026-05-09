import { GameService } from '../services/GameService.js';
import { Player } from './Player.js';

/**
 * Representa uma partida em andamento.
 * Coordena o jogador, o tabuleiro gerado e o tempo da partida.
 */

export class GameSession {
    constructor(player, temaId, nivelId) {
        // Garante que apenas um jogador, e não o admin, possa iniciar uma partida
        if (!(player instanceof Player)) {
            throw new Error("Apenas jogadores podem iniciar uma partida.");
        }

        this.player = player;
        this.temaId = temaId;
        this.nivelId = nivelId;
        this.tabuleiro = GameService.gerarTabuleiro(temaId, nivelId); // embaralha as cartas quando inicia o GameSession
        this.inicio = Date.now();
        this.fim = null;
        this.tempoFinal = null;
        this.encerrada = false;
    }

    /**
     * Finaliza a partida: calcula o tempo decorrido e atualiza o recorde do jogador.
     * @returns {{ tempo: number, novoRecorde: boolean }}
     */
    finalizarPartida() {
        if (this.encerrada) {
            throw new Error("Esta partida já foi encerrada.");
        }

        this.fim = Date.now();
        this.tempoFinal = Math.floor((this.fim - this.inicio) / 1000); // converte para segundos
        this.encerrada  = true;

        // Avisa o Player para verificar e registrar um possível novo recorde
        // Passa temaId e nivelId para que o recorde seja salvo pela combinação tema+nível
        const novoRecorde = this.player.atualizarRecorde(this.temaId, this.nivelId, this.tempoFinal);

        return {
            tempo: this.tempoFinal,
            novoRecorde: novoRecorde
        };
    }
}