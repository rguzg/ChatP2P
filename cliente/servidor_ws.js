// El servidor de WS del lado del cliente se va a encargar de recibir los mensajes de chat enviados por
// otros clientes. Al recibirlos, el servidor se los pasará al cliente para que los muestre en el front.

const io = require("socket.io");
const http = require("http");

const server = http.createServer();

const socket_server = io(server, {
    // Este puerto será definido para cada cliente durante el proceso de inicio de sesión. Por el momento se dejará como 3000
    port: 3000,
});

// Esta función mandará al front el mensaje que se recibió para que lo muestre de la manera que considere apropiada
const DispatchMessageToFrontEnd = (message) => {
    console.log(`Enviando mensaje al front`);
    console.log(`El mensaje es de: ${message.username} y dice: ${message.message}`);
};

// Esta sección controla todo lo que tenga que ver con los WebSockets
socket_server.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log(`Enviando mensaje al front`);
        console.log(`El mensaje es de: ${message.username} y dice: ${message.message}`);
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('The server is running!');
});