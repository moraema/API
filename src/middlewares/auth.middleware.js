const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const verificarJwt = (req, res, next) => {
    const token = req.get('Authorization');

    jwt.verify(token, jwtSecret, (err, decode) => {
        if (err) {
            return res.status(401).send({
                message: 'hubo un error al validar el token',
                errror: err.message
            });
        }

        req.usuario = decode.usuario;
        next();
    })
};

module.exports = {
    verificarJwt
}