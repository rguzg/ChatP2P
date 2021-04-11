const express = require("express");
const app = express();
const server = require('http').createServer(app);
const socket_server = require('socket.io')(server, {
    port: 4000,
    serveClient: false
});

//Routers
const chat = require('./Routes/chat');
const {user, database} = require('./Routes/user');

//Middleware separation 
const notFound = require("./middleware/notFound")
const auth = require("./middleware/auth")
const cors = require("./middleware/cors")

app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: true} ));

app.use("/user",user)
app.use(auth)
app.use("/chat",chat)

app.use(notFound)

server.listen(process.env.PORT ||4000,()=>{
    
    console.log("Server is Running...")
});

socket_server.on('connection', (socket) => {
    console.log("Nueva conexion detectada");
    socket.emit('users', database);
});



