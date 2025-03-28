const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
//const url = 'https://cros9.yayin.com.tr/https://radyoatilim.yayin.com.tr/stats?sid=1&json=1';
const url = 'http://shoutcast.radyogrup.com:1010/statistics?sid=1&json=1&_=1732930231466'
const filePath = path.join(os.homedir(), 'RD ATILIM STATS');


let window = null;
let currentStat = null;

//['new_stat', 'save_chart', 'open_chart', 'delete_chart', 'update_list', 'fetch_list'];

ipcMain.on('save_chart', async (event, chartInfo, saveDataBuffer) => {
    const fileName = `${chartInfo.beginDate.replaceAll('/', '-')}-${chartInfo.startTime.replaceAll(':', '-')}-${chartInfo.endTime.replaceAll(':', '-')}.stat`;
    if(!fs.existsSync(filePath))
        fs.mkdirSync(filePath, {recursive: true});
    fs.writeFileSync(path.join(filePath, fileName), saveDataBuffer);
    window.webContents.send('update_list', chartInfo);
});

const fetchData = async () => {
    const response = await fetch(url);
    currentStat = await(response.json())
    
    const timeInfo = new Date()
    const time = `${timeInfo.getHours()}:${timeInfo.getMinutes()}:${timeInfo.getSeconds()}`
    const date = `${timeInfo.getFullYear()}/${timeInfo.getMonth() + 1}/${timeInfo.getDate()}`
    currentStat.time = time;
    currentStat.date = date;

    //console.log(currentStat.songtitle);
    window.webContents.send('new_stat', currentStat);
}

const createWindow = () => {
    window = new BrowserWindow({
        width: 1500,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.resolve(__dirname, 'preload.js')
        },
    });

    window.loadFile('dist/index.html');
    
    //window.webContents.send('test');
    setInterval(fetchData, 1000) 

    
}

app.whenReady().then(() => {
    createWindow();
});