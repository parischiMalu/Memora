// Esse arquivo é um exemplo de implementação
import { Player } from '../models/Player.js';
import { Admin }  from '../models/Admin.js';

// Jogadores pré-cadastrados
export const jogadoresMock = [
    new Player("Dona Bento", "bento@email.com", "senha123"),
    new Player("Seu José",   "jose@email.com",  "senha456"),
];

// Simula recordes já registrados 
// Utiliza a função atualizarRecorde(temaId, nivelId, tempo) para atualizar o recorde
jogadoresMock[0].atualizarRecorde(1, 1, 30); // Dona Bento: Frutas  Fácil  em 30s
jogadoresMock[0].atualizarRecorde(2, 1, 50); // Dona Bento: Animais Fácil  em 50s
jogadoresMock[1].atualizarRecorde(1, 1, 25); // Seu José:   Frutas  Fácil  em 25s (melhor!)
jogadoresMock[1].atualizarRecorde(1, 2, 60); // Seu José:   Frutas  Médio  em 60s

// Admnistradores pré-cadastrados
export const adminsMock = [
    new Admin("Professora Ana", "ana@utfpr.edu.br", "admin123"),
];

