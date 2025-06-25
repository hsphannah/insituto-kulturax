// 1. Importa as ferramentas necessárias
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// 2. Inicializa o servidor
const app = express();
const PORT = 3000; // O servidor rodará na porta 3000

// 3. Configurações do servidor
// Permite que o servidor entenda requisições com corpo em JSON (para criar notícias)
app.use(express.json());
// **ESSA LINHA É CRUCIAL**: Diz ao Express para servir os arquivos da pasta 'public'
app.use(express.static('public'));

// 4. Conexão com o Banco de Dados
let db;
(async () => {
    try {
        db = await open({
            filename: './database.db', // Cria um arquivo de banco de dados
            driver: sqlite3.Database
        });
        await db.exec(`
            CREATE TABLE IF NOT EXISTS noticias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                conteudo TEXT NOT NULL,
                data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Banco de dados conectado com sucesso.');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
})();

// 5. Criação das Rotas da API

// Rota para BUSCAR todas as notícias
app.get('/api/noticias', async (req, res) => {
    const noticias = await db.all('SELECT * FROM noticias ORDER BY data_publicacao DESC');
    res.json(noticias);
});

// Rota para CRIAR uma nova notícia
app.post('/api/noticias', async (req, res) => {
    const { titulo, conteudo } = req.body;
    if (!titulo || !conteudo) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
    }
    const result = await db.run(
        'INSERT INTO noticias (titulo, conteudo) VALUES (?, ?)',
        [titulo, conteudo]
    );
    res.status(201).json({ id: result.lastID, titulo, conteudo });
});

// 6. Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});