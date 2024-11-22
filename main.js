const {app, BrowserWindow} = require('electron'); 

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Radio Atılım Stats"
    });

    window.loadFile("dist/index.html");

    
}

app.whenReady().then(() => {
    createWindow();
});