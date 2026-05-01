import { Usuarios } from './Usuarios.js';

/**
 * Representa um admnistrador do sistema.
 * Herda login e autenticação de Usuario (classe pai).
 * Administradores gerenciam temas e visualizam o ranking geral.
 * 
 * A função para cadastrar tema está em outra classe, denominada TemaService
 * 
 */
export class Admin extends Usuarios {
    // Chama o constructor da classe Usuario,
    // definindo automaticamente o tipo como 'admin'
    constructor(nome, email, senhaTexto) {
        super(nome, email, senhaTexto, 'admin');
    }
}