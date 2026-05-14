// Esse arquivo é um exemplo de implementação
import { Player } from '../models/Player.js';
import { Admin }  from '../models/Admin.js';

// Jogadores pré-cadastrados
export const jogadoresMock = [
    new Player("Maria", "maria@email.com", "senha123"),
    new Player("José",   "jose@email.com",  "senha456"),
    new Player("Cíntia", "cintia@email.com", "senha789")
];

// Simula recordes já registrados 
// Utiliza a função atualizarRecorde(temaId, tempo) para atualizar o recorde
jogadoresMock[0].atualizarRecorde(1, 30); // Maria (temaId = 1), 30 segundos
jogadoresMock[0].atualizarRecorde(2, 50); // Maria (temaId = 2), 50 segundos

jogadoresMock[1].atualizarRecorde(1, 25); // José (temaId = 1), 25 segundos
jogadoresMock[1].atualizarRecorde(2, 60); // José (temaId = 2), 60 segundos

jogadoresMock[2].atualizarRecorde(1, 22); // Cíntia (temaId = 1), 22 segundos
jogadoresMock[2].atualizarRecorde(2, 30); // Cíntia (temaId = 2), 30 segundos

// Admnistradores pré-cadastrados
export const adminsMock = [
    new Admin("Professora Ana", "profana@utfpr.edu.br", "admin123"),
];

