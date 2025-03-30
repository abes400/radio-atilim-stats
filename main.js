const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
//const url = 'https://cros9.yayin.com.tr/https://radyoatilim.yayin.com.tr/stats?sid=1&json=1';
const url = 'http://shoutcast.radyogrup.com:1010/statistics?sid=1&json=1&_=1732930231466'
const filePath = path.join(os.homedir(), 'RD ATILIM STATS');

// TODO: Check the EIO dialog and try to fix it accordingly
// ! To reprodue, keep the program open overnight with recording disabled

let window = null;

//['delete_chart'];

ipcMain.on('save_chart', async (event, chartInfo, saveData) => {
    const fileName = infoToName(chartInfo);
    if(!fs.existsSync(filePath))
        fs.mkdirSync(filePath, {recursive: true});
    fs.writeFileSync(path.join(filePath, fileName), saveData);
    window.webContents.send('update_list', chartInfo);
});

ipcMain.handle('open_chart', async(event, chartInfo) => {
    let fileContent = fs.readFileSync(path.join(filePath, infoToName(chartInfo)));
    return fileContent;
})

ipcMain.handle('fetch_list', async () => {
    let fetchedListInfo = fs.readdirSync(filePath).map(fileName => nameToInfo(fileName));
    return(fetchedListInfo);
})

const fetchData = async () => {
    let response = await fetch(url);
    let currentStat = await response.json()
    
    let timeInfo = new Date()
    const time = `${('0' + timeInfo.getHours()).slice(-2)}:${('0' + timeInfo.getMinutes()).slice(-2)}:${('0' + timeInfo.getSeconds()).slice(-2)}`
    const date = `${timeInfo.getFullYear()}/${('0' + (timeInfo.getMonth() + 1)).slice(-2)}/${('0' + timeInfo.getDate()).slice(-2)}`
    currentStat.time = time;
    currentStat.date = date;

    window.webContents.send('new_stat', currentStat);

    //currentStat = timeInfo = response = null;
}

const nameToInfo = (fileName) => {
    const splitFileName = fileName.replace('.stat', '').split('-');
    return {beginDate: `${splitFileName[0]}/${splitFileName[1]}/${splitFileName[2]}`, 
            startTime: `${splitFileName[3]}:${splitFileName[4]}:${splitFileName[5]}`, 
            endTime:   `${splitFileName[6]}:${splitFileName[7]}:${splitFileName[8]}`} 
}

const infoToName = (chartInfo) => {
    return `${chartInfo.beginDate.replaceAll('/', '-')}-${chartInfo.startTime.replaceAll(':', '-')}-${chartInfo.endTime.replaceAll(':', '-')}.stat`;
}

const createWindow = () => {
    window = new BrowserWindow({
        minWidth: 1060,
        minHeight: 600,
        width: 1070,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.resolve(__dirname, 'preload.js')
        },
    });

    window.loadFile('dist/index.html');
}

app.whenReady().then(() => {
    createWindow();
    setInterval(fetchData, 1000);
});