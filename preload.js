const { contextBridge, ipcRenderer } = require('electron');

availableChannels = ['new_stat'];

contextBridge.exposeInMainWorld(
    'ipc', {
        send: (channel, data) => {
            if (availableChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        } ,
        on: (channel, func) => {
            if (availableChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
)