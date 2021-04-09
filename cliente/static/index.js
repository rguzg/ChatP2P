// Esta clase manejará el WS de un contacto, además de almacenar sus mensajes
class Contacto{
    constructor(){
        // Estos valores normalmente se obtendrían haciendo una petición al servidor,
        // pero por el momento se quedará así
        this.port = 3000;
        this.name = "Paul Smith";
        
        // El elemento en el DOM que representará al contacto
        this.DOMElement = this.CreateDOMElement();
        this.ws = null;
        this.messages = [
            {type: 'enviado', content: '¡Hola!'},
            {type: 'recibido', content: 'Adios.'}
        ]
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
        button.appendChild(status_image);
        button.appendChild(profile_picture);
        button.appendChild(name);

        return button;
    }

    CreateWebSocket(){
        let socket = io(`ws://localhost:${this.port}`, {
            transports: ["websocket"],
        });

        socket.on('connect', () => {
            alert("Conectado al servidor de WS");
        });
    }
}

// Muestra los mensajes almacenados del contacto en la caja de mensajes
const ShowMessages = (mensajes) => {
    let contenedor_mensajes = document.querySelector('#mensajes');
    
    // Eliminar los elementos que representan los mensajes enviados y recibidos que se encuentren actualmente en la caja de mensajes
    contenedor_mensajes.innerHTML = "";
    
    mensajes.forEach((mensaje) => {
        let contenedor_mensaje = document.createElement('div');
        let contenido_mensaje = document.createElement('div');


        switch(mensaje.type){
            case 'recibido':
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
            case 'enviado':
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
        contenedor_mensajes.appendChild(contenedor_mensaje);
    });
};

let currentContact = null;
let contactos = [];

window.onload = () => {
    // Por el momento solo existirá un solo contacto, en el futuro, las personas conectadas se obtendrán 
    // del servidor
    let nuevoContacto = new Contacto();
    contactos.push(nuevoContacto);   

    // Mostrar la ventana de chat, y si no existe, crear el WS que le corresponde al contacto
    nuevoContacto.DOMElement.addEventListener('click', () => {
        if(nuevoContacto.ws == null){
            nuevoContacto.ws = nuevoContacto.CreateWebSocket();
        }

        ShowMessages(nuevoContacto.messages);
    });

    document.querySelector('.botones').appendChild(nuevoContacto.DOMElement);
}