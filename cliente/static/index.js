// Esta clase manejará el WS de un contacto, además de almacenar sus mensajes
class Contacto{
    constructor(name, port){
        // Estos valores normalmente se obtendrían haciendo una petición al servidor,
        // pero por el momento se quedará así
        this.port = port;
        this.name = name;
        
        // El elemento en el DOM que representará al contacto
        this.DOMElement = this.CreateDOMElement();
        this.ws = null;

        // Elemento al que se le reenviarán los eventos que reciba el socket
        this.listener = null;

        this.messages = [];

        this.SetMessageCallback();
    };

    CreateDOMElement(){
        let button = document.createElement('button');
        let status_image = document.createElement('img');
        let profile_picture = document.createElement('img');
        let name = document.createElement('p');

        // Definición de status_image
        status_image.src = 'img/status.png';
        status_image.alt = 'Status';
        status_image.classList.add('status');

        // Definición de profile_picture
        profile_picture.src = 'img/user.png';
        profile_picture.alt = 'User';
        profile_picture.classList.add('user');

        // Definición de name
        name.innerText = this.name;

        // Definición de button
        button.id = this.name;
        button.appendChild(status_image);
        button.appendChild(profile_picture);
        button.appendChild(name);

        return button;
    }

    // Set this.ws como un nuevo socket 
    SetWebSocket(){
        let socket = io(`ws://localhost:${this.port}`, {
            transports: ["websocket"],
        });

        socket.on('connect', () => {
            this.dispatchWSEvent(new Event('connect'));
        });

        socket.on('disconnect', () => {
            this.DOMElement.remove();
        })

        this.ws = socket;
    }

    // Enviar un evento 'message' cuando el proceso Main envie un mensaje a este contacto y almacenar el mensaje 
    // recibido
    SetMessageCallback(){
        ipcRenderer.setMessageCallback((event, message) => {
            if(message.contact == this.name){
                this.dispatchWSEvent(new CustomEvent('message', {detail: message}));
                this.messages.push(message);
            }
        });
    }

    // Envia al contacto al que se esté conectado un mensaje. 
    // El mensaje también se almacena en this.messages y además se 
    // envía un evento 'message' con los contenidos del mensaje
    SendMessage(message_content){
        if(this.ws == null){
            throw new Error("El WebSocket de este contacto no está definido");
        }

        let sent_message = {
            type: 'text',
            content: message_content,
            origin: 'sent',
            contact: this.name,
        };

        let received_message = {
            type: 'text',
            content: message_content,
            origin: 'received',
            contact: username,
        };

        this.ws.emit('message', received_message);
        this.messages.push(sent_message);
        this.dispatchWSEvent(new CustomEvent('message', {detail: sent_message}));
    }

    // Envia evento si listener no es nulo
    dispatchWSEvent(event){
        if(this.listener != null){
            this.listener.dispatchEvent(event);
        }
    }
}

const contenedorMensajes = document.querySelector('#mensajes');
const inputMensajesTexto = document.querySelector('#mensajes_texto');
const botonEnviar = document.querySelector('#boton_enviar');

let currentContact = null;
let contactos = [];
let username;
let server_socket;

// Muestra los mensajes almacenados del contacto en contenedorMensajes
const ShowMessages = (mensajes) => {
    if(!contenedorMensajes){
        throw new Error('contenedorMensajes no está definido');
    }

    if(!mensajes){
        throw new Error('El argumento mensajes es obligatorio');
    }

    // Eliminar los elementos que representan los mensajes enviados y recibidos que se encuentren actualmente en la caja de mensajes
    contenedorMensajes.innerHTML = "";
    
    mensajes.forEach((mensaje) => {
        let contenedor_mensaje = CreateMessage(mensaje);
        contenedorMensajes.appendChild(contenedor_mensaje);
    });
};

const ChangeMessageBoxHeader = (text) => {
    document.querySelector('#contactName').innerText = text;
};

const CreateMessage = (mensaje) => {
    let contenedor_mensaje = document.createElement('div');
    let contenido_mensaje = document.createElement('div');

    switch(mensaje.origin){
        case 'received':
            let profile_picture = document.createElement('img');

            // Definición de profile_picture
            profile_picture.src = 'img/user.png';
            profile_picture.alt = 'User';
            profile_picture.classList.add('user');

            contenedor_mensaje.appendChild(profile_picture);

            // Definición de mensaje
            contenido_mensaje.classList.add('box', 'sb2');
            contenido_mensaje.innerText = mensaje.content;

            // Definición de contenedor_mensaje
            contenedor_mensaje.classList.add('receive', 'd-flex', 'col-sm-12', 'align-items-center', 'justify-content-start');

            break;
        case 'sent':
            // Definición de mensaje
            contenido_mensaje.classList.add('box', 'sb1');
            contenido_mensaje.innerText = mensaje.content;

            // Definición de contenedor_mensaje
            contenedor_mensaje.classList.add('sending', 'd-flex', 'col-sm-12', 'align-items-center', 'justify-content-end');
            
            break;
        default:
            break;
    }

    contenedor_mensaje.appendChild(contenido_mensaje);
    return contenedor_mensaje;
}

const AddContact = (username, port) => {
    let nuevoContacto = new Contacto(username, port);
    contactos.push(nuevoContacto);   

    // Mostrar la ventana de chat, y si no existe, crear el WS que le corresponde al contacto
    nuevoContacto.DOMElement.addEventListener('click', () => {
        if(nuevoContacto.ws == null){
            nuevoContacto.SetWebSocket();
        }

        currentContact = nuevoContacto;
        ShowMessages(currentContact.messages);
        ChangeMessageBoxHeader(currentContact.name);
    });

    nuevoContacto.listener = contenedorMensajes;

    document.querySelector('.botones').appendChild(nuevoContacto.DOMElement);
}

const RemoveContact = (username) => {
    document.querySelector(`#${username}`).remove();

}

// Enviar al cliente el mensaje que se encuentre en inputMensajesTexto
botonEnviar.addEventListener('click', () => {
    let texto_mensaje = inputMensajesTexto.value;

    if(texto_mensaje.trim() != "" && currentContact){
        currentContact.SendMessage(texto_mensaje);
    }

    inputMensajesTexto.value = "";
});

document.querySelector('#logout').addEventListener('click', () => {
    ipcRenderer.closeWSServer();
    sessionStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Enviar el mensaje cuando se presione enter y cuando se #mensajes_texto tenga focus 
document.querySelector('#mensajes_texto').addEventListener('keydown', (event) => {
    if(event.code === 'Enter'){
        event.preventDefault();
        botonEnviar.dispatchEvent(new Event('click'));
    }
});

// Mostrar mensajes que haya enviado/recibido el usuario. Los mensajes solo se envían si currentContact es
// el mismo contacto al que le mandó/del que recibió el mensaje
contenedorMensajes.addEventListener('message', (event) => {
    let message = event.detail;

    if(currentContact.name === message.contact){
        contenedorMensajes.appendChild(CreateMessage(message));
    }
});

window.onload = () => {
    try {
        ipcRenderer.closeWSServer();

        let token = sessionStorage.getItem('token');
        let decoded = jwt_decode(token);

        username = decoded['user_name'];
        let port = decoded['port']

        ipcRenderer.startWSServer(port);

        server_socket = io(`ws://localhost:4000?token=${token}`, {
            transports: ["websocket"],
            auth: {
                token
            }
        });

        server_socket.on('users', (database) => {
            let usuariosConectados = database['usuariosConectados']

            Object.keys(usuariosConectados).forEach((user) => {
                AddContact(usuariosConectados[user][0], usuariosConectados[user][1]);
            });
        });

        server_socket.on('connect_error', () => {
            alert('Ocurrió un error al conectarse con el servidor. Es necesario que vuelvas a iniciar sesión');
            window.location.href = 'login.html';
        });

        server_socket.on('new_user', (user) => {
            AddContact(user.user, user.port);
        });

        server_socket.on('remove_user', (user) => {
            RemoveContact(user.user);
        });

        server_socket.on('disconnect', () => {
            alert('Ocurrió un error al conectarse con el servidor. Es necesario que vuelvas a iniciar sesión');
            window.location.href = 'login.html';
        });

        document.querySelector('#username').innerText = username;
    } catch {
        window.location.href = 'login.html';
    }
}