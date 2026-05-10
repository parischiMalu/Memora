import { jogadoresMock } from '../mocks/db.mock.js';
import { NIVEIS } from '../models/Configuracoes.js';
import { TEMAS } from '../mocks/temas.mock.js';

/**
 * Responsável por gerar o ranking de jogadores.
 * O ranking é focado estritamente no melhor tempo por tema + nível.
 */
export class RankingService {

    /**
     * Retorna o ranking de uma combinação específica de tema + nivel.
     * Filtra apenas jogadores que jogaram aquela combinação exata.
     */
    static getRankingPorTema(temaId /*, nivelId*/) {
        // Encontra o tema pelo id
        const tema  = TEMAS.find(t => t.id === temaId);

        // Encontra o nivel pelo id
        //const nivel = Object.values(NIVEIS).find(n => n.id === nivelId);

        // Lança um erro caso não tenha encontrado o tema ou o nivel
        if (!tema)  throw new Error(`Tema ${temaId} não encontrado.`);
        //if (!nivel) throw new Error(`Nível ${nivelId} não encontrado.`);

        // Escreve a combinação da chave
        const chave = `${temaId}`;

        const ranking = jogadoresMock
            .filter(j => j.recordesPessoais[chave]?.melhorTempo != null)
            .map(j => ({
                nome:        j.nome,
                melhorTempo: `${j.recordesPessoais[chave].melhorTempo}s`,
                data:        j.recordesPessoais[chave].data?.toLocaleDateString('pt-BR')
            }))
            .sort((a, b) => parseInt(a.melhorTempo) - parseInt(b.melhorTempo));

        return { tema: tema.nome, /*nivel: nivel.nome,*/ ranking };
    }

    /**
     * Retorna o ranking geral agrupado por todas as combinações
     * de tema + nível existentes.
     */

    /*static getRankingGeral() {
        const chavesUnicas = new Set(
            jogadoresMock.flatMap(j => Object.keys(j.recordesPessoais))
        );

        return [...chavesUnicas].map(chave => {
            const [temaId, nivelId] = chave.split('-').map(Number);
            return RankingService.getRankingPorTemaENivel(temaId, nivelId);
        });
    }*/
}