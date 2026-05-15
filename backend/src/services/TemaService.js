import { TEMAS } from '../mocks/temas.mock.js';

/**
 * Responsável por gerenciar os temas.
 * 
 * Utiliza por enquanto o array temas do mock.
 */

export class TemaService {
    // Métodos static são usados porque não dependem de um objeto específico,
    // podendo ser chamados diretamente pela classe, como TemaService.listarTemas() por exemplo.
    /**
     * Retorna todos os temas disponíveis no sistema.
     * @returns {object[]}
     */
    static listarTemas() {
        return TEMAS;
    }

    /**
     * Busca um tema específico pelo seu ID.
     * @param {number} id
     * @returns {object}
     */
    static buscarPorId(id) {
        // A cada item t presente na lista TEMAS me retorne aquele em que t.id é 
        // exatamente igual ao id que eu te dei
        const tema = TEMAS.find(t => t.id === id);

        //Se o find não encontrar, então tema = undefined e !undefined = true,
        //nesse caso lança o erro de id não encontrado 
        if (!tema) {
            throw new Error(`Tema com id ${id} não encontrado.`);
        }

        // Retorna o tema se encontrado
        return tema;
    }

    /**
     * Exige 12 cartas
     * @param {string}   nome   - Nome do tema 
     * @param {string[]} cartas - Array com os emojis/identificadores das cartas
     * @returns {object} - o novo tema criado
     */
    static cadastrarTema(nome, cartas) {
        // Se nome passado não existe ou se as cartas não existem ou 
        // se a quantidade da lista de cartas for diferente de 12, lance um erro
        if (!nome || !cartas || cartas.length !== 12) {
            throw new Error("O tema precisa de um nome e 12 cartas.");
        }

        // Gera um ID único baseado no maior ID existente
        // Se TEMAS.lenght for maior que 0 me retorne o maior valor (Math.max()) de id do array passado + 1,
        // onde (...TEMAS.map(t => t.id)) retorna todos os id de TEMAS, caso contrário retorne 1
        const novoId = TEMAS.length > 0 ? Math.max(...TEMAS.map(t => t.id)) + 1 : 1;

        // Cria o novo tema
        const novoTema = { id: novoId, nome, cartas };

        // Joga o novo tema para o banco temporário (TEMAS)
        TEMAS.push(novoTema);

        // Retorna o novoTema
        return novoTema;
    }

    /**
     * @param {number} id
     * @returns {object} - o tema que foi removido
     */
    static removerTema(id) {
        // TEMAS.findIndex(t => t.id === id) diz para cada elemento t no array TEMAS retorne o índice onde
        // t.id é exatamente igual ao id que eu te passei, retorne -1 se não encontrar
        const index = TEMAS.findIndex(t => t.id === id);

        // Se o índice não for encontrado (findIndex retorna -1 nesse caso), lance um erro
        if (index === -1) throw new Error(`Tema com id ${id} não encontrado.`);

        // splice remove um item na posição do index (alterando o array original)
        // e retorna um array com o item removido,
        const resultado = TEMAS.splice(index, 1);
        const removido = resultado[0];
        
        // Retorna o elemento removido
        return removido

    }
}