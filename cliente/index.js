const electron = require('electron');
const url = require('url');
const path = require('path');
const io = require("socket.io");
const http = require("http");
const fs_promises = require("fs/promises");

const {app, BrowserWindow, ipcMain, dialog} = electron;
let server;
let socket_server = undefined;

let index;

const GetFilename = (path) => {
    let split_path = path.split('\\');

    return split_path[split_path.length - 1];
}

// Listen for app to be ready
app.on('ready', async function() {
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
            serveClient: false,
            // Mensajes de máximo 5MB. Si un mensaje es máximo a esto, se cierra el socket
            maxHttpBufferSize: 5e6
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

ipcMain.handle('OpenFileDialog', async () =>{

    let file_path = await dialog.showOpenDialog(index, {
        title: "Selecciona el archivo a subir",
        properties: ['openFile']
    });

    if(!file_path.canceled){
        let file = await fs_promises.readFile(file_path.filePaths[0]);
    
        // La propiedad filePaths es un arreglo que contiene el path del archivo. Las otras cosas
        // del objeto se ignoran
        let filename = GetFilename(file_path.filePaths[0]);
    
        return {
            file,
            filename
        };
    }

    return null;    
});

ipcMain.handle('OpenSaveDialog', async (event, file) => {
    let saveDialogResult = await dialog.showSaveDialog(index, {
        title: "Guardar archivo",
        defaultPath: file.filename
    });

    if(!saveDialogResult.canceled){
        try {
            await fs_promises.writeFile(saveDialogResult.filePath, file.file);
            return true;
        } catch {
            return false;
        }
    } 

    return false;
});





