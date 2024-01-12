const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/usuarios.model');
const jwtSecret = process.env.JWT_SECRET;

const login = async(req, res) => {
    try {
        const { usuario, contraseña } = req.body;

        const usuarioEncontrado = await Usuarios.findOne({
            where: {
                usuario: usuario,
                deleted: false,
            },
        });

        if (!usuarioEncontrado) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos',
            });
        }

        const contraseñaEncontrada = bcrypt.compareSync(contraseña, usuarioEncontrado.contraseña);

        if (!contraseñaEncontrada) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos',
            });
        }

        const payload = {
            usuario: {
                id: usuarioEncontrado.id,
            },
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'El acceso fue correcto',
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrio un error al validar las credenciales',
            error: error.message,
        });
    }
};

module.exports = {
    login
}