/* ==========================================================================
   API.JS - Camada de Comunicação com o Servidor
(Usa o fetch para conversar com o seu servidor (backend)
   ========================================================================== */

const BASE_URL = 'http://localhost:3000'; 
// Endereço do servidor ^^

/**
 * login()
 */
export async function login(email, senha) { // async function login: 
// Cria uma função que espera uma resposta para logar, export permite 
// que o outro arquivo a use.
    try {
        const response = await fetch(`${BASE_URL}/login`, { //Envia os dados para o servidor.
            method: 'POST', // Enviando dados novos (postando)
            headers: { 'Content-Type': 'application/json' }, // Avisa que é formato JSON
            body: JSON.stringify({ email, senha }) //Transforma o objeto do JS em uma 
            // string JSON para o servidor entender.
        });

        const data = await response.json(); //Transforma a resposta que veio do 
        // servidor de volta em um objeto JS.

        if (!response.ok) {
            throw new Error(data.erro || data.message || 'Erro desconhecido');
        } // Se o servidor disser que algo deu errado (ex: senha incorreta), "lançamos" 
        // um erro com a mensagem que o servidor nos mandou.

        return data;
    } catch (error) {
        // Trata erro de rede (Ex: Servidor fora do ar ou sem internet)
        // Se o erro já tiver uma mensagem (vinda do throw acima), usa ela.
        // Se não, assume que é um erro de conexão/rede.
        throw new Error(error.message === 'Failed to fetch' || error.message.includes('network') 
            ? 'Erro de conexão: Verifique se o servidor está ligado.' 
            : error.message);
    }
}

/**
 * cadastrar()
 */
export async function cadastrar(nome, email, senha) {
    // O fetch inicia a viagem para a rota '/register'
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            // Verificamos se o servidor aceitou o cadastro
            throw new Error(data.erro || data.message || 'Erro desconhecido');
        }

        return data;
    } catch (error) {
        throw new Error(error.message === 'Failed to fetch' 
            ? 'Erro de conexão com o servidor.' 
            : error.message);
    }
}