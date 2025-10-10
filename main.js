const {app, BrowserWindow, Menu, ipcMain, dialog, powerSaveBlocker, shell} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const winTitle = 'Radio Atılım Statistics Monitor';
const url = 'https://cros9.yayin.com.tr/https://radyoatilim.yayin.com.tr/stats?sid=1&json=1';
//const url = 'https://stream3.radyoodtu.com.tr:8000/statistics?sid=1&json=1';
//const url = 'http://shoutcast.radyogrup.com:1010/statistics?sid=1&json=1&_=1732930231466';
const listenurl = 'http://www.radioatilim.com';
const filePath = path.join(os.homedir(), 'RD ATILIM STATS');
const fetchIntervalMillisecond = 10000;
const dont_handle_timeline_until = 6;

const {version} = require('./package.json');

// TODO: Check the EIO dialog and try to fix it accordingly
// ! To reprodue, keep the program open overnight with recording disabled

powerSaveBlocker.start('prevent-app-suspension'); // Prevent system to enter sleep mode
Menu.setApplicationMenu(null); // Get rid of the application menu on both platforms


let window = null;
let autoFetch = true;
let stat_count = -1;

ipcMain.on('about', () => { app.showAboutPanel(); });

ipcMain.on('save_chart', async (event, chartInfo, saveData) => {
    const fileName = infoToName(chartInfo);
    if(!fs.existsSync(filePath))
        fs.mkdirSync(filePath, {recursive: true});
    fs.writeFileSync(path.join(filePath, fileName), saveData);
    window.webContents.send('update_list', chartInfo);
    stat_count = -1;
});

ipcMain.on('fetch',  () => { fetchData(); });

ipcMain.on('listen', (event) => {
    event.preventDefault();
    shell.openExternal(listenurl);
});

ipcMain.handle('open_chart', async (event, chartInfo) => {
    try {
        let fileContent = fs.readFileSync(path.join(filePath, infoToName(chartInfo)));
        return {success: true, data: fileContent};
    } catch (e) {
        return {success: false};
    }
});

ipcMain.handle('fetch_list', async () => {
    try {
        let fetchedListInfo = fs.readdirSync(filePath)
            .filter(fileName => fileName.endsWith('.stat'))
            .map(fileName => nameToInfo(fileName))
            .sort()
            .reverse();
        return {success: true, data: fetchedListInfo};
    } catch (e) {
        return {success: false};
    }
});

ipcMain.handle('delete_chart', async (event, chartInfo) => {
    try {
        let del = false;
        await dialog.showMessageBox(
            window, {
                type: 'warning',
                buttons: ['No', 'Yes'],
                defaultId: 1,
                cancelId: 0,
                title: 'Delete chart',
                message: 'Are you sure you want to delete this chart?',
                detail: 'This action is irreversible.',
                noLink: true,
            }).then(selection => {
            if (selection.response === 1) {
                fs.unlinkSync(path.join(filePath, infoToName(chartInfo)))
                del = true;
            }
        });
        return { success: del };
    } catch (e) { return { success: false }; }
});

ipcMain.handle('toggle_auto', () => {
    autoFetch = !autoFetch;
    return autoFetch;
});

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// At some point I'm going to have to re-implement this function.
const fetchData = async () => {
    let fetchSuccessful = false;
    let response;

    try {
        response = await fetch(url);
        if(response.ok) {
            fetchSuccessful = true;
        }
        else {
            console.warn("Warning: promise resolved but something went wrong.");
            fetchSuccessful = false;
        }
    } catch (e) {
        console.warn("Warning: ", e.message)
        fetchSuccessful = false;
    }

    if(fetchSuccessful) {

        stat_count++;
        
        const respJSON = await response.json();
        let songArtist, songTitle;
        try {
            [songArtist, songTitle] = respJSON.songtitle.split(' - ');
        } catch(e) {
            songTitle = respJSON.songtitle;
            songArtist = "Unknown";
        }
        let currentStat = {
            songartist: songArtist,
            songtitle: songTitle,
            currentlisteners: respJSON.currentlisteners,
            peaklisteners: respJSON.peaklisteners,
            maxlisteners: respJSON.maxlisteners,
            uniquelisteners: respJSON.uniquelisteners,
            averagetime: respJSON.averagetime
        }
        
        let timeInfo = new Date()
        const time = `${('0' + timeInfo.getHours()).slice(-2)}:${('0' + timeInfo.getMinutes()).slice(-2)}:${('0' + timeInfo.getSeconds()).slice(-2)}`
        const date = `${timeInfo.getFullYear()}/${('0' + (timeInfo.getMonth() + 1)).slice(-2)}/${('0' + timeInfo.getDate()).slice(-2)}`
        currentStat.time = time;
        currentStat.date = date;
        if(!currentStat.songtitle) currentStat.songtitle = 'Unknown'

        if(window && window.webContents)
            try {
                window.webContents.send('new_stat', currentStat);
                if(!autoFetch || stat_count >= dont_handle_timeline_until || stat_count == 0) {
                    window.webContents.send('new_stat_timeline', currentStat);
                    stat_count = 0;
                }
            }
            catch (e) { console.warn("The window object might have been destroyed. It's no big deal but we wanted to warn you anyway.", e.message) }
    }
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
        titleBarStyle: 'hidden',
        ...(process.platform !== 'darwin' ? {titleBarOverlay: true} : {}),
        titleBarOverlay: {
            color: '#00000000',
            symbolColor: '#9a9a9a'
        },
        trafficLightPosition: {x: 16, y: 12},

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.resolve(__dirname, 'preload.js')
        },
    });

    window.loadFile('dist_vue/index.html');
    window.webContents.on('did-finish-load', () => window.setTitle(winTitle));
}

app.whenReady().then(() => {
    app.setAboutPanelOptions(
        {
        applicationName: 'Radio Atılım Statistics Monitor',
        applicationVersion: version,
        version: version,
        credits: 'Programming: Abes400',
        copyright: 'Made for Atılım University. \nDistributed under MIT License.',
        website: 'https://github.com/abes400',
    });
    createWindow();
    fetchData();
    setInterval(() => { if(autoFetch) fetchData() }, fetchIntervalMillisecond);
});