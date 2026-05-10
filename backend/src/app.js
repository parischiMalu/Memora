// Demonstra todas as funcionalidades do sistema

import { AuthService }    from './services/AuthService.js';
import { TemaService }    from './services/TemaService.js';
import { RankingService } from './services/RankingService.js';
import { GameSession }    from './models/GameSession.js';
import {TEMAS}            from './mocks/temas.mock.js'
import { Player } from './models/Player.js';

console.log("╔══════════════════════════════════════╗");
console.log("║    JOGO DA MEMÓRIA - PROJETO TEDI    ║");
console.log("╚══════════════════════════════════════╝\n");

// 1. CADASTRO DE NOVO JOGADOR
console.log("Cadastro do jogador");
const novoJogador = AuthService.cadastrarJogador("Pedro Paulo", "pedro@hotemail.com", "senha123");
console.log(`O jogador: "${novoJogador.nome}" foi cadastrado com sucesso!\n`);

// 2 LOGIN DE JOGADOR
console.log("Login do jogador");
const jogador = AuthService.login("pedro@hotemail.com", "senha123");
console.log(`Logado: ${jogador.nome} [${jogador.role}]\n`);

// 3 IMPLEMENTAR TEMA
console.log("Cadastrando um tema (mínimo de 12)");
const cartasTeste = ["Arquivos", "Cadeira", "configurações", "CPU", "Fone", "Google", "Impressora", "Monitor", "Mouse", "Roteador", "Teclado", "Webcam"];
const novoTema = TemaService.cadastrarTema("Testando", cartasTeste);
console.log(novoTema.cartas);

// 3.1 LISTAR TEMAS
console.log(TemaService.listarTemas());

// 4 INICIANDO PARTIDA 
console.log("\nIniciar partida"); // utilizamos o novoJogador (nome = "Pedro Paulo") que acabamos de criar
const minhaPartida = new GameSession(novoJogador, 3); // tabuleiro é gerado automaticamente quando instanciamos (atributo tabuleiro)
console.log("Tabuleiro gerado: ");
console.log(minhaPartida.tabuleiro);

// 4.1 Finalizando a partida em 60 segundos
console.log("EXEMPLO PARTIDA FINALIZADA");
minhaPartida.inicio = Date.now() - 60000; // Utilizado apenas como exemplo (duração da partida)
const resultados = minhaPartida.finalizarPartida();
console.log("Tempo final: ", resultados.tempo);
console.log("Novo recorde: ", resultados.novoRecorde);

const partida2 = new GameSession(novoJogador, 3);
partida2.inicio = Date.now() - 35000;
const resultados2 = partida2.finalizarPartida();
console.log("Tempo final: ", resultados2.tempo);
console.log("Novo recorde: ", resultados2.novoRecorde);

console.log(novoJogador.getResumo());






// 5 GERAR RANKING  ***PRECISO TERMINAR****
