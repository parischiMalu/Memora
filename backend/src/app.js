import express from 'express';

// Importação dos serviços desenvolvidos
import { AuthService } from './services/AuthService.js';
import { TemaService } from './services/TemaService.js';
import { GameService } from './services/GameService.js';
import { RankingService } from './services/RankingService.js';
import { GameSession } from './models/GameSession.js';
import { jogadoresMock } from './mocks/db.mock.js';

const app = express();
const PORT = 3000;

// Para que o express consiga ler o json enviado no corpo das requisições
app.use(express.json());

// TIVE QUE ADICIONAR ISSO PARA FUNCIONAR COM O FRONTEND ASS. MALU
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde imediatamente requisições de "preflight" do browser
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});


// 1. Rotas para AuthService

// POST - Realiza o login de um usuário 
app.post('/login', (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuarioLogado = AuthService.login(email, senha);
        
        res.status(200).json(usuarioLogado.getResumo());

    } catch (error) {
        res.status(401).json({ erro: error.message });
    }
});

// POST - Cadastrar um novo jogador 
app.post('/jogadores', (req, res) => {
    try {
        const {nome, email, senha} = req.body;
        const usuarioCadastrado = AuthService.cadastrarJogador(nome, email, senha);

        res.status(201).json(usuarioCadastrado.getResumo());

    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// 2. Rotas para TemaService

// GET - Listar Temas
app.get('/temas', (req, res) => {
    try {
        const meusTemas = TemaService.listarTemas();

        res.status(200).json(meusTemas);

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// POST - Cadastrar Tema
app.post('/temas', (req, res) => {
    try {
        const {nome, cartas} = req.body;
        const novoTema = TemaService.cadastrarTema(nome, cartas);

        res.status(201).json(novoTema);

    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// GET - Buscar Tema Por ID
app.get('/temas/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id); // ID para inteiro
        const temaEncontrado = TemaService.buscarPorId(id);

        res.status(200).json(temaEncontrado);

    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

// DELETE - Remover Tema Por ID
app.delete('/temas/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const temaRemovido = TemaService.removerTema(id);

        res.status(200).json(temaRemovido);

    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

// 3. Rotas para RankingService

// GET - Gerar Ranking Por Tema
app.get('/ranking/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const ranking = RankingService.getRankingPorTema(id);

        res.status(200).json(ranking);

    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

// 4. Rotas para Player (método getResumo)

// GET - Busca o resumo de um jogador específico (Dados e também recordes pessoais)
// estava quebrando porque o frontend estava enviando o email como query e não como parametro, então mudei ass. malu
app.get('/jogadores', (req, res) => {
    try {
        /*
        trocar req.params por req.query


        */
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ erro: "Email não informado" });
        }

        // Busca instância de um jogador no banco de dados temporário
        const jogador = jogadoresMock.find(j => j.email === email);

        // Verifica a existência do jogador no banco de dados
        if (!jogador) {
            return res.status(404).json({ erro: "Jogador não encontrado." });
        }

        // Executa o método getResumo e retorna os dados em json
        res.status(200).json(jogador.getResumo());
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// 5. Rotas para GameSession

/*

partidasAtivas, que guarda os jogos em andamento, é um protótipo que pode ser revisto/alterado depois 
para que haja uma representação de um sistema de forma mais "realista".
Sugestões possíveis são:
1- Implementar o cronômetro no frontend;
2- Criar uma tabela "mock" no banco de dados que represente as partidas em andamento (achei essa mais interessante)

*/
const partidasAtivas = {};

// POST - Cria a sessão de jogo e envia o tabuleiro embaralhado
app.post('/jogo/iniciar', (req, res) => {
    try {
        const { email, temaId } = req.body;

        // Busca a instância de jogador necessária para instanciar o GameSession a partir do email
        const jogador = jogadoresMock.find(j => j.email === email);
        if (!jogador) {
            return res.status(404).json({ erro: "Jogador não encontrado para iniciar a partida." });
        }

        // Instancia a classe GameSession (o que automaticamente inicia a partida)
        const novaPartida = new GameSession(jogador, parseInt(temaId));

        // Guarda as partidas ativas em um objeto com chave = email do jogador
        partidasAtivas[email] = novaPartida;

        // Responde o frontend com as cartas embaralhadas
        res.status(201).json({
            mensagem: "Partida iniciada!",
            tabuleiro: novaPartida.tabuleiro
        });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// POST - Encerra o cronômetro e calcula se houve novo recorde (Finalizar partida)
app.post('/jogo/finalizar', (req, res) => {
    try {
        //adicionei tentativas aqui para enviar o número de tentativas do jogador 
        // para o backend, para que o ranking seja ordenado por tempo e por tentativas
        const { email, tentativas } = req.body;

        // Busca as partidas ativas em partidasAtivas de acordo com o email do jogador
        const partida = partidasAtivas[email];
        if (!partida) {
            return res.status(400).json({ erro: "Nenhuma partida em andamento encontrada para este jogador." });
        }

        // Chama o método finalizarPartida e obtém o resultado (tempo final e se houve novo recorde)
        const resultado = partida.finalizarPartida(tentativas);

        // Limpa a partida ativa em partidasAtivas a partir do email do jogador
        delete partidasAtivas[email];

        // Devolve o resultado da partida finalizada
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});



// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Servidor do TEDI rodando na porta ${PORT}`);
});






// SÓ SERVE PARA TESTE, DESCONSIDERAR
// Rota temporária para inspecionar o banco de dados em memória
app.get('/debug/jogadores', (req, res) => {
    res.json(jogadoresMock.map(j => j.getResumo()));
});


app.get('/debug/partidas', (req, res) => {
  const resumo = {};
  for (const [email, p] of Object.entries(partidasAtivas)) {
    resumo[email] = { temaId: p.temaId, encerrada: p.encerrada, inicio: p.inicio };
  }
  res.json(resumo);
});