
const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

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


