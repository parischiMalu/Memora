import { Usuarios } from "./Usuarios.js";
import { TEMAS } from "../mocks/temas.mock.js";

export class Player extends Usuarios {
  // Chama o constructor da classe Usuario,
  constructor(nome, email, senhaTexto) {
    super(nome, email, senhaTexto, "jogador");

    this.recordesPessoais = {};
    this.totalPartidasConcluidas = 0;
  }

  /**
   * Atualiza o recorde pessoal do jogador se o tempo atual for o melhor.
   * @param {number} temaId
   * @param {number} tempoGasto
   * @returns {boolean}
   */
  atualizarRecorde(temaId, tempoGasto, tentativas) {
    const chave = `${temaId}`;
    const registroAtual = this.recordesPessoais[chave];
    const recordeAtual = registroAtual?.melhorTempo ?? null;

    // Verifica se é a primeira partida ou se o tempo atual supera o recorde anterior
    if (recordeAtual === null || tempoGasto < recordeAtual) {
      const tema = TEMAS.find((t) => t.id === temaId);

      // Salva o novo recorde
      this.recordesPessoais[chave] = {
        melhorTempo: tempoGasto,
        melhorTentativas: tentativas,
        nomeTema: tema?.nome ?? `Tema ${temaId}`,
        data: new Date(),
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
      ...super.getResumo(),
      totalPartidasConcluidas: this.totalPartidasConcluidas,
      recordesPessoais: this.recordesPessoais,
    };
  }
}
