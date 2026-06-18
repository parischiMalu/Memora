// Esse import é para fazer hash seguro de senha
import bcrypt from "bcryptjs";

export class Usuarios {
  constructor(nome, email, senhaTexto, role) {
    this.id = null;
    this.nome = nome;
    this.email = email;
    this.senha = bcrypt.hashSync(senhaTexto, 10);

    this.role = role;
    this.dataCadastro = new Date();
  }

  /**
   * Verifica se a senha digitada corresponde ao hash salvo
   * @param {string} senhaTexto
   * @returns {boolean}
   */
  verificarSenha(senhaTexto) {
    return bcrypt.compareSync(senhaTexto, this.senha);
  }

  // Retorna um resumo público do usuário sem a senha.

  getResumo() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      role: this.role,
      dataCadastro: this.dataCadastro,
    };
  }
}
