// preload.js expone APIs de Node y Electron al proceso Render

const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
    sendMessage: (message) => {
        ipcRenderer.send('message', message)
    },
    startWSServer: (port) => {
        ipcRenderer.send('startWSServer', port);
    },
    closeWSServer: () => {
        ipcRenderer.send('closeWSServer');
    },
    setMessageCallback: (username, callback) => {
        /*  Solo puede existir un solo handler para cada evento mensaje de cada contacto
            Si esta linea no existiera, al recargar la página del proceso Render, se asignaria otro
            handler causando que al proceso Render le llegaran mensajes repetidos */  
        ipcRenderer.removeAllListeners(`message:${username}`);
        ipcRenderer.on(`message:${username}`, callback);
    },
    removeAllListeners: () => {
        ipcRenderer.removeAllListeners('message');
    }
})
