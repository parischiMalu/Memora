import { Usuarios } from './Usuarios.js';
import { TEMAS } from '../mocks/temas.mock.js';
import { NIVEIS } from './Configuracoes.js';

/**
 * Representa um jogador do sistema.
 * Herda login e autenticação de Usuario (classe pai).
 * Adiciona a lógica de recordes e controle de partidas.
 */

export class Player extends Usuarios {
    // Chama o constructor da classe Usuario,
    // definindo automaticamente o tipo como 'jogador'
    constructor(nome, email, senhaTexto) {
        super(nome, email, senhaTexto, 'jogador');

        /**
         * Armazena o melhor tempo por combinação de tema + NÍVEL.
         * A chave é gerada no formato "temaId-nivelId" (ex: "1-2" = Frutas Médio).
         * Isso permite que o jogador tenha um recorde separado para cada tema/id.
         *
         * Exemplo:
         *   {"1-1": { melhorTempo: 45, nomeTema: "Frutas", nomeNivel: "Iniciante", data: Date },
         *   "2-1": { melhorTempo: 30, nomeTema: "Animais", nomeNivel: "Iniciante", data: Date }}
         */
        this.recordesPessoais = {};

        this.totalPartidasConcluidas = 0;
    }

    /**
     * Tenta atualizar o recorde de uma combinação tema + nível.
     * O recorde só é atualizado se o novo tempo for menor que o anterior.
     * @param {number} temaId    - ID do tema jogado
     * @param {number} nivelId   - ID do nível jogado (1, 2 ou 3)
     * @param {number} tempoGasto - Tempo final da partida em segundos
     * @returns {boolean} - true se um novo recorde foi registrado
     */
    atualizarRecorde(temaId, nivelId, tempoGasto) {
        //Essa string chave garante que o recorde do nível Fácil nunca seja sobrescrito por um 
        // tempo do nível Difícil.
        const chave = `${temaId}-${nivelId}`; // ex: "1-2" = Frutas Médio

        //O código vai até o objeto recordesPessoais (atributo dessa classe ) e verifica se 
        // já existe algo nessa variável, exemplo, se "1-2" não existir retorna undefined
        const registroAtual = this.recordesPessoais[chave];

        //?. = se registroAtual estiver vazia, ele não quebra o código, apenas retorna undefined.  
        //?? = se não houver recorde, ele define como null.
        const recordeAtual  = registroAtual?.melhorTempo ?? null;

        // recordeAtual === null é o mesmo que: é a primeira vez que ele joga esse tema nesse nível? 
        // Se sim, qualquer tempo é um recorde.
        if (recordeAtual === null || tempoGasto < recordeAtual) {
            // Busca os nomes do tema e nível para guardar junto ao recorde

            // Arrow function (=>) é uma forma curta de escrever função.
            // Aqui é equivalente a function(t) { return t.id === temaId; }
            // Para cada item (t) que olhar no array TEMAS, verifique se o id dele é igual 
            // ao temaId que eu te dei, se não retorna undefined
            const tema  = TEMAS.find(t => t.id === temaId);
            
            // Object.values(NIVEIS) transforma o objeto NIVEIS em uma lista/array de seus valores (nesse caso retorna outro objeto)
            // Para cada item (n) que olhar no array, verifique se o id dele é igual 
            // ao nivelId que eu te dei, se não retorna undefined
            // Fazemos isso para que, na hora de salvar o recorde, possamos pegar o nome do nível, como 'FÁCIL'
            const nivel = Object.values(NIVEIS).find(n => n.id === nivelId);

            // Salva o objeto recordesPessoais
            this.recordesPessoais[chave] = {
                melhorTempo: tempoGasto,
                // ?. evita erro se for undefined | ?? define valor padrão (null)
                // Se tema não existir ou se tema.nome não existir, o resultado será undefined.
                // O ?. significa: “Acesse nome só se tema existir"
                // O ?? significa: “Se o valor da esquerda for null ou undefined, usa o da direita"
                nomeTema:  tema?.nome  ?? `Tema ${temaId}`,
                nomeNivel: nivel?.nome ?? `Nível ${nivelId}`,
                data: new Date()
            };

            /*
            Exemplo de como recordesPessoais fica salvo:
            this.recordesPessoais["1-2"] = {
                melhorTempo: 45,
                nomeTema: "Frutas",
                nomeNivel: "Intermediário",
                data: new Date() // Registra o dia 
            };
           */

            // Incrementa a quantidade de partidas do jogador
            this.totalPartidasConcluidas++;
            return true; 
        }

        // Se o if acima for falso, o método incrementa o totalPartidasConcluidas e 
        // retorna falso, ou seja, não foi criado o novo recorde.
        this.totalPartidasConcluidas++;
        return false;
    }

    /**
     * Sobrescreve getResumo() para incluir os recordes do jogador.
     */
    getResumo() {
        return {
            // ... copia os dados do objeto retornado pelo pai
            ...super.getResumo(), // aproveita nome, email, role, dataCadastro
            totalPartidasConcluidas: this.totalPartidasConcluidas,
            recordesPessoais: this.recordesPessoais
        };
    }
}