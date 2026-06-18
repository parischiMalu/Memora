-- ============================================


-- BANCO DE DADOS - JOGO DA MEMÓRIA 

--PostgreSQL


-- ============================================



-- Tabela: usuario


CREATE TABLE usuario (
    
    
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(45) NOT NULL UNIQUE,
    email VARCHAR(45) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    tipo VARCHAR(45) NOT NULL DEFAULT 'jogador'
        CHECK (tipo IN ('jogador', 'adm'))

);



-- Tabela: jogo (temas)


CREATE TABLE jogo (

    
    id SERIAL PRIMARY KEY, 
    nome VARCHAR(45) NOT NULL,
    tipo_peca TEXT
    
);

-- Tabela: partida

CREATE TABLE partida (

    id SERIAL PRIMARY KEY,
    pontuacao INT NOT NULL DEFAULT 0,
    tempo_decorrido INT NOT NULL, -- tempo em segundos
    data_jogada TIMESTAMP NOT NULL DEFAULT NOW(),
    jogo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (jogo_id) REFERENCES jogo(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)

);
