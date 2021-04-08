// Al hacer clic en un usuario, se conectará al servidor de WS de ese usuario
class Contacto{
    constructor(){
        // Estos valores normalmente se obtendrían haciendo una petición al servidor,
        // pero por el momento se quedará así
        this.port = 3000;
        this.name = "Paul Smith";
        
        // El elemento en el DOM que representará al contacto
        this.DOMElement = this.CreateDOMElement();
        this.ws = null;
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

        // Mostrar la ventana de chat, y si no existe, crear el WS que le corresponde al contacto
        button.addEventListener('click', () => {
            if(this.ws == null){
                this.ws = this.CreateWebSocket();
            }
        });

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

let contactos = [];

window.onload = () => {
    // Por el momento solo existirá un solo contacto, en el futuro, las personas conectadas se obtendrán 
    // del servidor
    let nuevoContacto = new Contacto();
    contactos.push(nuevoContacto);

    document.querySelector('.botones').appendChild(nuevoContacto.DOMElement);
}