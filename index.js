const express = require("express");
const path = require("path");
require("dotenv").config();

// db config
require('./database/config').dbConnection();

// app de express
const app = express();

// Lectura y parseo del body
app.use(express.json());

// node server
const server = require("http").createServer(app);
module.exports.io = require("socket.io")(server);
require('./socket/socket');

// path publico
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// mis rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));


server.listen(process.env.PORT, (err) => {

    if (err) throw new Error(err);

    console.log("Servidor corriendo en el puerto", 3000);
});