const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios.model');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

const create = async(req, res) => {
    try {
        const usuarioAutenticado = req.usuario.id;
        const { nombre, usuario, contraseña } = req.body;
        const hashedPassword = await bcrypt.hash(contraseña, saltosBcrypt);

        const usuarios = await Usuario.create({
            nombre: nombre,
            usuario: usuario,
            contraseña: hashedPassword,
            createdBy: usuarioAutenticado,
        });

        await usuarios.save();

        res.status(201).json({
            message: 'El usuario se creo con exito',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al crear al usuario',
            error: error.message,
        });
    }
};

const obtener = async(req, res) => {
    try {
        const { page, limit } = req.query;
        const offset = (page - 1) * limit;

        const usuario = await Usuario.findAndCountAll({
            where: { deleted: false },
            limit: parseInt(limit),
            offset: offset,
            order: [
                ['nombre', 'ASC']
            ]
        });

        let response = {
            message: 'Se obtuvieron a los usuarios correctamente',
            data: usuario,
        }

        if (page && limit) {
            const totalusuario = await Usuario.count({ where: { deleted: false } });
            const totalpages = Math.ceil(totalusuario / parseInt(limit));
            const currentpage = parseInt(page);
            response = {
                ...response,
                total: totalusuario,
                totalpages,
                currentpage
            }
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'ocurrio un error al obtener los usuarios',
            error: error.message
        });
    }
};


const eliminar = async(req, res) => {
    try {
        const clienteAutenticado = req.usuario.id;
        const { id } = req.params;

        const clienteEliminado = await Usuario.findOne({ where: { id: id, deleted: false } });

        if (!clienteEliminado) {
            res.status(401).json({
                message: 'El cliente no fue encontrado'
            });
            return;
        }

        clienteEliminado.deleted = true;
        clienteEliminado.deletedAt = new Date();
        clienteEliminado.deletedBy = clienteAutenticado;

        await clienteEliminado.save();

        return res.status(200).json({
            message: 'El cliente fue eliminado con exito'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al eliminar al usuario',
            error: error.message
        });
    }
};

const actualizar = async(req, res) => {
    try {
        const clienteAutenticado = req.usuario.id;
        const { id } = req.params;
        const { nombre, usuario, contraseña } = req.body;

        const clienteActualizado = await Usuario.findByPk(id);

        if (!clienteActualizado) {
            return res.status(404).json({
                message: 'El usuario no fue encontrado'
            });
        }

        if (nombre) clienteActualizado.nombre = nombre;
        if (usuario) clienteActualizado.usuario = usuario;
        if (contraseña) {
            const hashedPassword = await bcrypt.hash(contraseña, saltosBcrypt);
            clienteActualizado.contraseña = hashedPassword;
        }
        clienteActualizado.updatedAt = new Date();
        clienteActualizado.updatedBy = clienteAutenticado;
        await clienteActualizado.save();

        return res.status(200).json({
            message: 'El cliente fue actulizado con exito'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrio un error al actualizar al cliente',
            error: error.message
        });
    }
};

module.exports = {
    create,
    obtener,
    eliminar,
    actualizar
}