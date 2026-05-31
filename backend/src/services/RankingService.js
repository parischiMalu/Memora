import { jogadoresMock } from '../mocks/db.mock.js';
import { TEMAS } from '../mocks/temas.mock.js';

/**
 * Responsável por gerar o ranking de jogadores.
 * O ranking é focado estritamente no melhor tempo por tema.
 */
export class RankingService {

    /**
     * Retorna o ranking de um tema específico.
     * Filtra apenas jogadores que jogaram exatamente aquele tema.
     */
    static getRankingPorTema(temaId) {
        // Encontra o tema pelo id
        const tema  = TEMAS.find(t => t.id === temaId);

        // Lança um erro caso não tenha encontrado o tema.
        if (!tema)  throw new Error(`Tema ${temaId} não encontrado.`);

        // Escreve a chave
        const chave = `${temaId}`;

        const ranking = jogadoresMock

            // Filtra todos os jogadores que tem recordes nesse tema
            .filter(j => j.recordesPessoais[chave]?.melhorTempo != null)

            // Transforma cada jogador filtrado em um objeto contendo
            // apenas nome, melhorTempo e data
            .map(j => ({
                nome:        j.nome,
                melhorTempo: `${j.recordesPessoais[chave].melhorTempo}s`,
                data:        j.recordesPessoais[chave].data?.toLocaleDateString('pt-BR')
            }))
            
            // O sort compara dois jogadores por vez.
            // parseInt remove o "s" do tempo (ex: "12s" -> 12)
            // para que a ordenação seja feita numericamente.
            .sort((a, b) => parseInt(a.melhorTempo) - parseInt(b.melhorTempo));

        return { tema: tema.nome, ranking };
    }
}