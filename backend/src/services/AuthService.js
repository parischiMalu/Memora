import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { Player } from "../models/Player.js";

/**
 * Responsável pela autenticação e cadastro de usuários.
 * Centraliza as regras de login para jogadores e administradores utilizando PostgreSQL.
 */
export class AuthService {
  /**
   * Realiza o login de um usuário (jogador ou admin).
   * Busca o e-mail no banco de dados e verifica a senha criptografada.
   * @param {string} email
   * @param {string} senha - texto digitado pelo usuário
   * @returns {object} - os dados do usuário autenticado (sem a senha)
   */
  static async login(email, senha) {
    // 1. Busca o usuário diretamente na tabela 'usuario'
    const query = "SELECT * FROM usuario WHERE email = $1";
    const resultado = await pool.query(query, [email]);
    const usuarioDb = resultado.rows[0];

    // Se o banco não retornar nenhuma linha, o usuário não existe
    if (!usuarioDb) {
      throw new Error("Usuário não encontrado.");
    }

    // 2. Compara a senha digitada com o hash armazenado no banco
    const senhaValida = await bcrypt.compare(senha, usuarioDb.senha_hash);

    if (!senhaValida) {
      throw new Error("Senha incorreta.");
    }

    // 3. Remove o hash da senha do objeto antes de retornar por segurança
    const { senha_hash, ...dadosUsuario } = usuarioDb;

    // Retorna os dados limpos vindos do banco
    return dadosUsuario;
  }

  /**
   * Cadastra um novo jogador no sistema.
   * Impede e-mails e nicknames duplicados no banco de dados.
   * @param {string} nome - será mapeado para a coluna 'nickname'
   * @param {string} email
   * @param {string} senha - senha limpa que será convertida em hash
   * @returns {object} - os dados do jogador recém-cadastrado
   */
  static async cadastrarJogador(nome, email, senha) {
    // 1. Verifica se o e-mail ou o nickname já existem no banco
    const verificaQuery =
      "SELECT * FROM usuario WHERE email = $1 OR nickname = $2";
    const verificaResultado = await pool.query(verificaQuery, [email, nome]);

    if (verificaResultado.rows.length > 0) {
      throw new Error("E-mail ou Nickname já cadastrado no sistema.");
    }

    // 2. Gera o hash da senha usando bcrypt (substituindo a lógica interna da classe Player)
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Insere o novo jogador no banco de dados
    // Utilizamos RETURNING para o banco nos devolver os dados recém-salvos
    const insertQuery = `
            INSERT INTO usuario (nickname, email, senha_hash, tipo) 
            VALUES ($1, $2, $3, 'jogador') 
            RETURNING id, nickname, email, tipo;
        `;

    // Os valores $1, $2 e $3 são substituídos com segurança, evitando SQL Injection
    const valores = [nome, email, senhaHash];
    const resultadoInsert = await pool.query(insertQuery, valores);

    // Retorna a primeira (e única) linha inserida
    return resultadoInsert.rows[0];
  }
}
