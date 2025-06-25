// 1. Importa as ferramentas necessárias
const express = require('express');
const { createClient } = require('@supabase/supabase-js'); // Importa o cliente do Supabase

// 2. Inicializa o servidor Express
const app = express();
const PORT = 3000;

// 3. Conexão com o Supabase
// !!! SUBSTITUA PELAS SUAS INFORMAÇÕES !!!
const SUPABASE_URL = 'https://govmpucjwkagotyskjwb.supabase.co'; // Cole sua Project URL aqui
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvdm1wdWNqd2thZ290eXNrandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Nzg3MjcsImV4cCI6MjA2NjQ1NDcyN30.vrwob9f_p9RCTBDBD3qTVTFIQCgN68n52OO7UXcYIS8'; // Cole sua chave 'anon (public)' aqui

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 4. Configurações do servidor
app.use(express.json());
app.use(express.static('public'));

// 5. Criação das Rotas da API (agora com Supabase)

// Rota para BUSCAR todas as notícias
app.get('/api/noticias', async (req, res) => {
    const { data, error } = await supabase
        .from('noticias') // Nome da sua tabela
        .select('*') // Pega todas as colunas
        .order('created_at', { ascending: false }); // Ordena pelas mais recentes

    if (error) {
        console.error('Erro ao buscar notícias:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// Rota para CRIAR uma nova notícia
app.post('/api/noticias', async (req, res) => {
    const { titulo, conteudo } = req.body;

    const { data, error } = await supabase
        .from('noticias')
        .insert([
            { titulo: titulo, conteudo: conteudo }
        ])
        .select(); // .select() para retornar o que foi inserido

    if (error) {
        console.error('Erro ao criar notícia:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
});

// 6. Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT} e conectado ao Supabase.`);
});