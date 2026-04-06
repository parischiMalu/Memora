# Jogo da Memória - Projeto TEDI
Repositório para a disciplina EC45G.


# 🧠 Jogo da Memória - Projeto TEDI (UTFPR-CP)

Este projeto faz parte da disciplina **Certificadora de Competência I (EC45G)** do curso de Engenharia da Computação. O objetivo é desenvolver um jogo da memória focado na inclusão digital e estímulo cognitivo de idosos, atendendo às demandas do **Projeto TEDI**.


## 🛠️ Tecnologias e Ferramentas (Ambiente Inicial)
Até o momento, o ambiente de desenvolvimento backend foi configurado com as seguintes ferramentas:

*   **Runtime:** Node.js (v. LTS)
*   **Gerenciador de Pacotes:** NPM
*   **Linguagem:** JavaScript (padrão ES6+ com ES Modules)
*   **Produtividade:** 
    *   `Nodemon`: Reinicialização automática do servidor durante o desenvolvimento.
    *   `ESLint/Prettier`: Padronização e formatação automática de código.
    *   `Thunder Client`: Testes de rotas e lógica de API.

---

## 📁 Estrutura de Pastas (Backend)
O projeto segue uma estrutura modular para facilitar a manutenção e a integração futura:

*   `src/models/`: Definição das classes e estruturas de dados (ex: Jogador, Partida).
*   `src/services/`: Lógica de negócio e regras do jogo (ex: algoritmos de embaralhamento).
*   `src/controllers/`: Gerenciamento das requisições e respostas.
*   `src/mocks/`: Dados estáticos para testes enquanto o Banco de Dados não é integrado.
*   `src/app.js`: Arquivo principal de inicialização.

---

## 🚀 Como Executar o Ambiente
Para rodar o projeto em modo de desenvolvimento com *hot-reload*:

1.  Certifique-se de ter as dependências instaladas:
    ```bash
    npm install
    ```
2.  Inicie o servidor:
    ```bash
    npm run dev
    ```

---













### 👤 1. Player (Entidade)

Responsável por gerenciar os dados do usuário e seu histórico de desempenho dentro do jogo.

**Principais atributos:**
- `nome`
- `dataCadastro`
- `recordesPessoais`: objeto que armazena o melhor tempo por nível de dificuldade
- `totalPartidasConcluidas`

**Lógica principal:**
- Possui o método `atualizarRecorde`, que encapsula a regra de negócio responsável por atualizar o recorde do jogador apenas quando o novo tempo for melhor (menor) que o anterior.

---

### ⚙️ 2. GameService (Domínio / Lógica)

Classe responsável pela lógica central do jogo, funcionando de forma independente e sem estado interno.

**Responsabilidade:**
- Gerar o tabuleiro do jogo

**Algoritmo utilizado:**
- Implementa o algoritmo **Fisher-Yates**, garantindo um embaralhamento estatisticamente aleatório das cartas.
- Os pares são gerados com base no `temaId` e `nivelId`.

---

### 🎮 3. GameSession (Serviço / Integração)

Classe responsável por coordenar a interação entre o jogador e a lógica do jogo.

**Fluxo de funcionamento:**
1. Recebe uma instância de `Player` junto com as configurações da partida.
2. Utiliza o `GameService` para gerar o tabuleiro inicial.
3. Controla o tempo da partida através dos atributos:
   - `inicio`
   - `fim`

**Finalização da partida:**
- Ao término do jogo, a `GameSession` comunica automaticamente o objeto `Player` para verificar e registrar possíveis novos recordes.

---

