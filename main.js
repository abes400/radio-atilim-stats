const {app, BrowserWindow} = require('electron'); 

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
    });

    window.loadURL("http://localhost:8080");
    

    
}

app.whenReady().then(() => {
    createWindow();
});