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
        // Busca o usuário em ambas as listas (jogadores e admins do banco de dados temporário)
        const todosUsuarios = [...jogadoresMock, ...adminsMock];

        // Para todo item u que olhar no array/lista todosUsuarios
        // retorne aquele no qual u.email sejá igual ao email que eu te dei
        const usuario = todosUsuarios.find(u => u.email === email);

        // Se usuário estiver vazio, indique que não encontrou o usuário
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }

        // verificarSenha() (método da classe Usuário) usa bcrypt internamente para comparar com o hash
        // Se retornar true, a senha é verdadeira, o !true = false e então o if não aciona
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
     * @param {string} senha - string senha que vai ser armazenado como hash
     * @returns {Player}
     */
    static cadastrarJogador(nome, email, senha) {
        // Procura todos os usuarios cadastrados
        const todosUsuarios = [...jogadoresMock, ...adminsMock];
        
        // Verifica se o email recebido já existe
        const jaExiste = todosUsuarios.find(u => u.email === email);

        // Se ja existe lança um erro (não podemos cadastrar)
        if (jaExiste) {
            throw new Error("E-mail já cadastrado.");
        }

        // Se o erro não for lançado crie um jogador 
        const novoJogador = new Player(nome, email, senha); // hash é feito dentro de Player
        // Lance esse jogador pro branco de dados temporário
        jogadoresMock.push(novoJogador);
        // Retorna o novo jogador
        return novoJogador;
    }
}