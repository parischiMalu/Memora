// Esse import é para fazer hash seguro de senha
import bcrypt from 'bcryptjs';

/**
 * Classe base (pai) para todos os usuários do sistema.
 * Contém os atributos e métodos comuns a Player e Admin.
 * Nunca deve ser instanciada diretamente, somente as filhas (Player e Admin).
 */

export class Usuarios {
    constructor(nome, email, senhaTexto, role) {
        this.id = null;             // Tem que ser preenchido com o banco de dados depois
        this.nome = nome;
        this.email = email;
        this.senha = bcrypt.hashSync(senhaTexto, 10); // serve para não salvar a senha pura
        this.role = role;           // 'jogador' ou 'admin'
        this.dataCadastro = new Date();
    }

    /**
     * Verifica se a senha digitada corresponde ao hash salvo.
     * @param {string} senhaTexto - A senha em texto puro digitada pelo usuário
     * @returns {boolean}
     */
    verificarSenha(senhaTexto) {
        return bcrypt.compareSync(senhaTexto, this.senha);
    }

    /**
     * Retorna um resumo público do usuário sem a senha.
     */
    getResumo() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            role: this.role,
            dataCadastro: this.dataCadastro
        };
    }
}