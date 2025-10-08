const { contextBridge, ipcRenderer } = require('electron');

availableChannels = ['new_stat', 'new_stat_timeline', 'save_chart', 'open_chart', 'delete_chart', 'update_list', 'fetch_list', 'about', 'toggle_auto', 'fetch', 'listen'];

contextBridge.exposeInMainWorld(
    'ipc', {
        send: (channel, ...args) => {
            if (availableChannels.includes(channel)) {
                ipcRenderer.send(channel, ...args);
            }
        },
        on: (channel, func) => {
            if (availableChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        invoke: (channel, ...args) => {
            if (availableChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, ...args);
            }
        },
        handle: (channel, func) => {
            if (availableChannels.includes(channel)) {
                ipcRenderer.handle(channel, (event, ...args) => func(...args));
            }
        },
    }
)