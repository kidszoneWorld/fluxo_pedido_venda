// viewsRouter.js
const express = require('express');
const path = require('path');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

// Rota para a página inicial
router.get('/', (req, res) => {
    console.log('Rota / acessada');
    res.sendFile(path.resolve(__dirname, '..','views', 'index.html'));
});

// Rota para a página de login
router.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','views', 'login.html'));
});

// Rota para a página de administração
router.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','views', 'admin.html'));
});


// Rota para envio do PDF
router.post('/send-pdf', pdfController.sendPdf);

module.exports = router;
