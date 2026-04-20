// PARA TESTAR O CÓDIGO COM DADOS ALEATÓRIOS

import { Jogador } from '../models/Jogador.js';

const j1 = new Jogador("Dona Bento");
j1.atualizarRecorde(1, 30); // 30 segundos no fácil

const j2 = new Jogador("Seu José");
j2.atualizarRecorde(1, 25); // 25 segundos no fácil (Melhor que a Dona Bento)

export const jogadoresMock = [j1, j2];