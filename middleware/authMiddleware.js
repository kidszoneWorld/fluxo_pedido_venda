// middleware/authMiddleware.js
const REPRESENTANTES = require('../public/data/representantes.json');

function authMiddleware(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        // Usuário autenticado, permitir acesso
        return next();
    }

    // Redirecionar para a página de login caso não esteja autenticado
    res.redirect('/login2');
}

function authenticateUser(req, res) {
    const { email, senha } = req.body;

    if (REPRESENTANTES[email] && senha === 'Repkz@2024') {
        req.session.isAuthenticated = true;
        req.session.user = REPRESENTANTES[email];
        res.redirect('/');
    } else {
        res.send('Acesso negado, tente novamente ou contate o administrador');
    }
}

module.exports = { authMiddleware, authenticateUser };
