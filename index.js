require("dotenv").config();
require("./src/configs/db.confing");
const express = require('express');
const app = express();
const usuarioController = require('./src/routes/usuarios.router');
const authRouter = require('./src/routes/auth.route');

app.use(express.json());

app.use('/usuarios', usuarioController);
app.use('/auth', authRouter);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.error("El api fue escuchado en el puerto: " + PORT);
});