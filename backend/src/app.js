// Demonstra as funcionalidades do sistema

import { AuthService }    from './services/AuthService.js';
import { TemaService }    from './services/TemaService.js';
import { RankingService } from './services/RankingService.js';
import { GameSession }    from './models/GameSession.js';
import {TEMAS}            from './mocks/temas.mock.js'
import { Player } from './models/Player.js';
import { jogadoresMock } from './mocks/db.mock.js';

console.log("╔══════════════════════════════════════╗");
console.log("║    JOGO DA MEMÓRIA - PROJETO TEDI    ║");
console.log("╚══════════════════════════════════════╝\n");

// 1. CADASTRO DE NOVO JOGADOR
console.log("\nCadastro do jogador");
const novoJogador = AuthService.cadastrarJogador("Pedro Paulo", "pedro@hotemail.com", "senha123");
console.log(`O jogador: "${novoJogador.nome}" foi cadastrado com sucesso!`);


// 2 LOGIN DE JOGADOR
console.log("\nLogin do jogador");
const jogador = AuthService.login("pedro@hotemail.com", "senha123");
console.log(`Logado: ${jogador.nome} [${jogador.role}]`);


// 3 IMPLEMENTAR TEMA
console.log("\nCadastrando um tema");
const cartasTeste = ["GATO", "CACHORRO", "LEAO", "TIGRE", "ELEFANTE", "MACACO", "COBRA", "COELHO", "GIRAFA", "ZEBRA", "URSO", "RAPOSA"];
const novoTema = TemaService.cadastrarTema("Animais", cartasTeste);
console.log(`Tema "${novoTema.nome}" cadastrado com ${novoTema.cartas.length} cartas.`);


// 4 LÓGICA DO EMBARALHAMENTO 
console.log("\nLÓGICA DO TABULEIRO");
const paresOrdenados = [...novoTema.cartas, ...novoTema.cartas];
console.log("Pares antes do embaralhamento:");
console.log(paresOrdenados.join(" | "));

const sessaoTeste = new GameSession(novoJogador, novoTema.id); // tabuleiro é gerado automaticamente quando instanciamos
console.log("\nTabuleiro após Fisher-Yates (Embaralhado):");
console.log(sessaoTeste.tabuleiro.join(" | "));


// 5 SIMULAÇÃO DE PARTIDAS E RECORDES
console.log("\nSIMULAÇÃO DE PERFORMANCE");

// Cenário A: Primeira partida (Sempre será recorde)
console.log("Caso A: Primeira partida do jogador");
const partida1 = new GameSession(jogador, novoTema.id);
partida1.inicio = Date.now() - 60000; // Simula 60 segundos
const res1 = partida1.finalizarPartida();
console.log(`Tempo: ${res1.tempo}s | Novo Recorde: ${res1.novoRecorde}`);

// Cenário B: Quebrando o recorde (Tempo menor)
console.log("\nCaso B: Superando o tempo anterior");
const partida2 = new GameSession(jogador, novoTema.id);
partida2.inicio = Date.now() - 35000; // Simula 35 segundos
const res2 = partida2.finalizarPartida();
console.log(`Tempo: ${res2.tempo}s | Novo Recorde: ${res2.novoRecorde}`);

// Cenário C: Tempo pior (Não quebra recorde)
console.log("\nCaso C: Tempo superior ao recorde");
const partida3 = new GameSession(jogador, novoTema.id);
partida3.inicio = Date.now() - 50000; // Simula 50 segundos
const res3 = partida3.finalizarPartida();
console.log(`Tempo: ${res3.tempo}s | Novo Recorde: ${res3.novoRecorde}`);


// 6 GERAR RECORDES PESSOAIS 
console.log("\nDEMONSTRANDO OS RECORDES PESSOAIS");
console.log("Resumo do Jogador:");
console.log(jogador.getResumo());


// 7 GERAÇÃO DO RANKING PARA UM TEMA ESPECÍFICO (VÁRIOS JOGADORES)
console.log("\nGERAÇÃO DO RANKING POR TEMA")
console.log("Ranking do tema 'Cornélio':");
const resultadoRanking = RankingService.getRankingPorTema(1);
resultadoRanking.ranking.forEach((r, i) => {
    console.log(`${i + 1}º - ${r.nome}: ${r.melhorTempo} em ${r.data}`);
});
