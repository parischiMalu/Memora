import { TEMAS } from '../mocks/temas.mock.js';

/**
 * Responsável por gerenciar os temas.
 * Funcionalidades de cadastro e remoção são exclusivas do administrador.
 * 
 * Utiliza por enquanto o array temas do mock.
 */

export class TemaService {

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
        const tema = TEMAS.find(t => t.id === id);
        if (!tema) throw new Error(`Tema com id ${id} não encontrado.`);
        return tema;
    }

    /**
     * Cadastra um novo tema no sistema (ação de administrador).
     * Exige no mínimo 12 cartas
     * @param {string}   nome   - Nome do tema 
     * @param {string[]} cartas - Array com os emojis/identificadores das cartas
     * @returns {object} - o novo tema criado
     */
    static cadastrarTema(nome, cartas) {
        if (!nome || !cartas || cartas.length < 12) {
            throw new Error("O tema precisa de um nome e no mínimo 12 cartas.");
        }

        // Gera um ID único baseado no maior ID existente
        const novoId = TEMAS.length > 0 ? Math.max(...TEMAS.map(t => t.id)) + 1 : 1;
        const novoTema = { id: novoId, nome, cartas };

        TEMAS.push(novoTema);
        return novoTema;
    }

    /**
     * Remove um tema pelo ID (ação de administrador).
     * @param {number} id
     * @returns {object} - o tema que foi removido
     */
    static removerTema(id) {
        const index = TEMAS.findIndex(t => t.id === id);
        if (index === -1) throw new Error(`Tema com id ${id} não encontrado.`);

        const [removido] = TEMAS.splice(index, 1);
        return removido;
    }
}