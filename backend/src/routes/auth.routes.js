const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateBody } = require('../middlewares/validation.middleware');
const { loginSchema } = require('../validators/auth.validator');

// POST /api/auth/login - Autenticação
router.post('/login', validateBody(loginSchema), authController.login);

// POST /api/auth/logout - Logout
router.post('/logout', authController.logout);

module.exports = router;
