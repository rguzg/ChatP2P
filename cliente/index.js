const electron = require('electron');
const url = require('url');
const path = require('path');
const io = require("socket.io");
const http = require("http");

const {app, BrowserWindow, contextBridge} = electron;
const server = http.createServer();
const socket_server = io(server, {
    // Este puerto será definido para cada cliente durante el proceso de inicio de sesión. Por el momento se dejará como 3000
    port: 3000,
    serveClient: false
});

let index;

// Listen for app to be ready
app.on('ready', function() {
    // Create new window
    index = new BrowserWindow({});
    // Load HTML into window
    index.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file:',
        slashes: true
    }));
});

// Esta sección controla todo lo que tenga que ver con los WebSockets
socket_server.on('connection', (socket) => {
    console.log("Nueva conexión detectada");
    socket.on('message', (message) => {
        console.log("Se ha recibido un mensaje, enviandolo al proceso Render...");
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('The server is running!');
});



