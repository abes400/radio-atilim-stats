const {app, BrowserWindow} = require('electron'); 

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
    });

    window.loadFile("dist/index.html");
    window.webContents.send("a");
    

    
}

app.whenReady().then(() => {
    createWindow();
});