import ClienteSQL from './sql.js';
import { options } from './options/sqlite.js'
import ClienteSQL1 from './sql1.js';
import { options1 } from './options/mysqlconn.js'
const sql1 = new ClienteSQL1(options1);
const sql = new ClienteSQL(options);

import express from 'express';

import { createServer } from "http";

import { Server } from "socket.io";

const app = express()

const httpServer = new createServer(app)
const io = new Server(httpServer)


app.use(express.static('./public'))
app.use(express.urlencoded({extended:true}))
app.set('views', './public')

app.set('view engine', 'pug')
app.get('/', (req, res) => {
    // res.sendFile('index.pug', {root: __dirname})
    res.render('./views/mensajes')
})

io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado!')
    let mensajes;
    // socket.emit('messages', messages)
    // socket.emit('messages', await contenedorMensajes.getAll())

    socket.emit('messages', await sql.listarMensajes())

    socket.on('new-message', async data => {
        let mensajes;

        await sql.insertarMensajes(data);

        io.sockets.emit('messages', await sql.listarMensajes())
    })
    // socket.emit('products', productos)
    socket.emit('products', await sql1.listarProductos())

    socket.on('new-product', async data => {
        // productos.push(data)
        await sql1.insertarProductos(data);
        io.sockets.emit('products',  await sql1.listarProductos())
    })
})

const PORT = process.env.PORT || 8080

httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))