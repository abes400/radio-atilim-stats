const { contextBridge, ipcRenderer } = require('electron');

availableChannels = ['new_stat', 'save_chart', 'open_chart', 'delete_chart', 'update_list', 'fetch_list'];

contextBridge.exposeInMainWorld(
    'ipc', {
        send: (channel, ...args) => {
            if (availableChannels.includes(channel)) {
                ipcRenderer.send(channel, ...args);
            }
        } ,
        on: (channel, func) => {
            if (availableChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
)