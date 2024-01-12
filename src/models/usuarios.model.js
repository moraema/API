const Sequelize = require('sequelize');
const sequelize = require('../configs/db.confing');

const Usuarios = sequelize.define('Usuarios', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    contraseña: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('now'),
    },
    createdBy: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
    },
    updatedBy: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
    },
    deletedBy: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
});


Usuarios.sync()
    .then(() => {
        console.log("Tabla cliente creada.")
    })
    .catch(error => {
        console.log("Error al crear la tabla cliente: ", error);
    });

module.exports = Usuarios;