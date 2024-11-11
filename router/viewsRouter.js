// viewsRouter.js
const express = require('express');
const path = require('path');
const pdfController = require('../controllers/pdfController');
const { authMiddleware, authenticateUser } = require('../middleware/authMiddleware');


const router = express.Router();

// Rota para a página inicial
router.get('/', authMiddleware, (req, res) => {
    console.log('Rota / acessada');
    res.sendFile(path.resolve(__dirname, '..','views', 'index.html'));
});

// Rota para a página de login
router.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','views', 'login.html'));
});


// Rota para a página de login2 para acessar o index.html
router.get('/login2', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'login2.html'));
});

// Rota para a página de administração
router.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','views', 'admin.html'));
});


// Rota para envio do PDF
router.post('/send-pdf', pdfController.sendPdf);

// Rota para autenticação
router.post('/auth', authenticateUser);

module.exports = router;
