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
    // Permite especificar un callback cuando Main Process envia un mensaje 'message'
    setMessageCallback: (callback) => {
        ipcRenderer.on('message', callback);
    }
})
