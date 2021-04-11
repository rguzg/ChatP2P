const electron = require('electron');
const url = require('url');
const path = require('path');
const io = require("socket.io");
const http = require("http");

const {app, BrowserWindow, ipcMain} = electron;
let server;
let socket_server = undefined;

let index;

// Listen for app to be ready
app.on('ready', function() {
    // Create new window
    index = new BrowserWindow({
        webPreferences: {
            preload: app.getAppPath() + '/preload.js'
        }
    });
    // Load HTML into window
    index.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file:',
        slashes: true
    }));
});

// El Servidor de WS del cliente es el lugar a donde otros clientes se conectarán. La tarea de este servidor es recibir los mensajes
// que envien otros clientes y enviarlos al proceso Render para que los muestre
ipcMain.on('startWSServer', (event, port) => {
    // Si el usuario recarga la ventana el servidor seguirá existiendo en el proceso Main y no habrá necesidad de volverlo a crear
    if(!socket_server){
        server = http.createServer();
        
        socket_server = io(server, {
            port: port,
            serveClient: false
        });
    
        server.on('close', () => {
            console.log("Servidor parado");
            socket_server = undefined
        });
    
        socket_server.on('connection', (socket) => {
            console.log("Nueva conexion detectada");
        
            // Cuando se recibe un mensaje, enviarlo al proceso Render
            socket.on('message', (message) => {
                console.log(`Se ha recibido un mensaje de ${message.contact}, enviandolo al proceso Render`);        
                index.webContents.send(`message:${message.contact}`, message);
            });
        });
        
        server.listen(port, () => {
            console.log(`Servidor iniciado en el puerto ${port}`);
        });
    } else {
        console.log("Se recibió petición para iniciar el servidor de WS, pero este ya existía");
    }
});

ipcMain.on('closeWSServer', () => {
    if(socket_server){
        console.log("Se recibió petición para cerrar el servidor de WS");
        socket_server.close();
    }
});




