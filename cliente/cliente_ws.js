const io = require('socket.io-client');
const readline = require('readline-sync');

const Chat = () => {
    let message = readline.prompt();

    if(message == 'exit'){
        exit = true;
        socket.disconnect();
    } else {
        socket.emit('message', {username, message});
        Chat();
    }
}

// Estos datos son un placeholder. Normalmente los datos serían obtenidos del front
let username = readline.question('Ingresa tu nombre de usuario: ');

console.log("¿Cón quien quieres chatear?");
// En el front, esto sería lo equivalente al hacer clic en una persona
console.log("1. La única persona que está en el chat por el momento")
readline.question('');

// El cliente debería de consultar con el servidor sobre el número de puerto que le corresponde a cada cliente.
// Por el momento se quedará en 3000
const socket = io('http://localhost:3000');

console.log("Conectando al otro usuario...");

socket.on('connect', () => {
    console.log('Conectado al otro usuario. ¡Preparanse para chatear!. Para salir escribe "exit"');
    Chat();
});

socket.on('disconnect', () => {
    console.log("Desconectado del otro usuario");
    console.log("Bye!");
});