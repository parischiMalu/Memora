// Demonstra todas as funcionalidades do sistema

import { AuthService }    from './services/AuthService.js';
import { TemaService }    from './services/TemaService.js';
import { RankingService } from './services/RankingService.js';
import { GameSession }    from './models/GameSession.js';

console.log("╔══════════════════════════════════════╗");
console.log("║    JOGO DA MEMÓRIA - PROJETO TEDI    ║");
console.log("╚══════════════════════════════════════╝\n");

// ─────────────────────────────────────────────────────────────
// 1. CADASTRO DE NOVO JOGADOR
// ─────────────────────────────────────────────────────────────
console.log("📋 1. CADASTRO DE JOGADOR");
const novoJogador = AuthService.cadastrarJogador("Seu Francisco", "francisco@email.com", "senha789");
console.log(`   ✔ "${novoJogador.nome}" cadastrado com sucesso!\n`);

// ─────────────────────────────────────────────────────────────
// 2. LOGIN DE JOGADOR
// ─────────────────────────────────────────────────────────────
console.log("🔐 2. LOGIN DE JOGADOR");
const jogador = AuthService.login("francisco@email.com", "senha789");
console.log(`   ✔ Logado: ${jogador.nome} [${jogador.role}]\n`);

// ─────────────────────────────────────────────────────────────
// 3. LOGIN DE ADMINISTRADOR
// ─────────────────────────────────────────────────────────────
console.log("🔐 3. LOGIN DE ADMINISTRADOR");
const admin = AuthService.login("ana@utfpr.edu.br", "admin123");
console.log(`   ✔ Logado: ${admin.nome} [${admin.role}]\n`);

// ─────────────────────────────────────────────────────────────
// 4. ADMIN CADASTRA UM NOVO TEMA
// ─────────────────────────────────────────────────────────────
console.log("🎨 4. ADMINISTRADOR CADASTRA NOVO TEMA");
if (admin.role === 'admin') {
    const novoTema = TemaService.cadastrarTema("Profissões", [
        "👨‍⚕️", "👩‍🏫", "👨‍🚒", "👮", "👨‍🍳", "👩‍🔧",
        "👨‍💻", "👩‍🎨", "👨‍🌾", "👩‍✈️", "👨‍🔬", "👩‍⚖️"
    ]);
    console.log(`   ✔ Tema "${novoTema.nome}" cadastrado.`);
    console.log(`   Temas disponíveis: ${TemaService.listarTemas().map(t => t.nome).join(", ")}\n`);
}

// ─────────────────────────────────────────────────────────────
// 5. JOGADOR INICIA PARTIDA — Frutas, Fácil
// ─────────────────────────────────────────────────────────────
console.log("🎮 5. JOGADOR INICIA PARTIDA  (Tema: Frutas | Nível: Fácil)");
const partida = new GameSession(jogador, 1, 1);
console.log(`   Tabuleiro gerado:`, partida.tabuleiro);

setTimeout(() => {

    // ─────────────────────────────────────────────────────────
    // 6. FINALIZAR PARTIDA E SALVAR RECORDE
    // ─────────────────────────────────────────────────────────
    console.log("\n⏱️  6. FINALIZANDO PARTIDA");
    const resultado = partida.finalizarPartida();
    console.log(`   Tempo: ${resultado.tempo}s | Novo Recorde: ${resultado.novoRecorde}`);

    // ─────────────────────────────────────────────────────────
    // 7. JOGADOR VISUALIZA SEUS RECORDES PESSOAIS
    //    Agora organizados por tema + nivel
    // ─────────────────────────────────────────────────────────
    console.log("\n🏅 7. RECORDES PESSOAIS DO JOGADOR (por tema e nível)");
    console.table(jogador.getResumo().recordesPessoais);

    // ─────────────────────────────────────────────────────────
    // 8. ADMIN — RANKING DE UMA COMBINAÇÃO ESPECÍFICA
    //    Exemplo: quem foi melhor em Frutas no nível Fácil
    // ─────────────────────────────────────────────────────────
    console.log("\n🏆 8. RANKING — Frutas | Fácil (visão do administrador)");
    if (admin.role === 'admin') {
        const { tema, nivel, ranking } = RankingService.getRankingPorTemaENivel(1, 1);
        console.log(`Tema: ${tema} | Nível: ${nivel}`);
        console.table(ranking);
    }

    // ─────────────────────────────────────────────────────────
    // 9. ADMIN — RANKING GERAL (todas as combinações jogadas)
    // ─────────────────────────────────────────────────────────
    console.log("\n9. RANKING GERAL — todas as combinações jogadas");
    if (admin.role === 'admin') {
        const rankingGeral = RankingService.getRankingGeral();
        rankingGeral.forEach(({ tema, nivel, ranking }) => {
            console.log(`\n${tema} | ${nivel}`);
            ranking.length === 0
                ? console.log("   (sem registros)")
                : console.table(ranking);
        });
    }
})