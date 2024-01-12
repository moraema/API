const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.verificarJwt, usuariosController.create);
router.get('/', authMiddleware.verificarJwt, usuariosController.obtener);
router.put('/:id', authMiddleware.verificarJwt, usuariosController.actualizar);
router.delete('/:id', authMiddleware.verificarJwt, usuariosController.eliminar);




module.exports = router;