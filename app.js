// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const viewsRouter = require('./router/viewsRouter');


const app = express();
const PORT = process.env.PORT || 3000;


// Configurar o tamanho máximo do corpo da requisição
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware para parsing de JSON
app.use(express.json());

// Configurar a pasta 'public' para arquivos estáticos (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// Configuração da sessão
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true
}));


// Usar o router para as views
app.use('/', viewsRouter);

app.get('/teste', (req, res) => {
    res.send('Rota de teste funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
