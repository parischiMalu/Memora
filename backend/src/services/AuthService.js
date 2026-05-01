import { Player } from '../models/Player.js';
import { jogadoresMock, adminsMock } from '../mocks/db.mock.js';

/**
 * Responsável pela autenticação e cadastro de usuários.
 * Centraliza as regras de login para jogadores e administradores.
 * 
 */
export class AuthService {

    /**
     * Realiza o login de um usuário (jogador ou admin).
     * Busca o e-mail em todas as listas e verifica a senha.
     * @param {string} email
     * @param {string} senha - texto digitado pelo usuário
     * @returns {Usuario} - o objeto do usuário autenticado
     */
    static login(email, senha) {
        // Busca o usuário em ambas as listas (jogadores e admins)
        const todosUsuarios = [...jogadoresMock, ...adminsMock];
        const usuario = todosUsuarios.find(u => u.email === email);

        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }

        // verificarSenha() usa bcrypt internamente para comparar com o hash
        if (!usuario.verificarSenha(senha)) {
            throw new Error("Senha incorreta.");
        }

        return usuario; // retorna o objeto completo do usuário logado
    }

    /**
     * Cadastra um novo jogador no sistema.
     * Impede e-mails duplicados entre jogadores e admins.
     * @param {string} nome
     * @param {string} email
     * @param {string} senha - string senha que vai ser armazenado como hash)
     * @returns {Player}
     */
    static cadastrarJogador(nome, email, senha) {
        const todosUsuarios = [...jogadoresMock, ...adminsMock];
        const jaExiste = todosUsuarios.find(u => u.email === email);

        if (jaExiste) {
            throw new Error("E-mail já cadastrado.");
        }

        const novoJogador = new Player(nome, email, senha); // hash é feito dentro de Player
        jogadoresMock.push(novoJogador);
        return novoJogador;
    }
}