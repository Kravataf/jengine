const {app, Menu, ipcMain} = require('electron')


const isMac = process.platform === 'darwin'

const template = [
    //{role: 'appMenu'}
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    }] : []),
    // {role 'fileMenu'}
    {
        label: 'File',
        submenu: [
            {
                label: 'Create Project',
                click: async () => {
                    //call func here :p
                }
            },
            {
                label: 'Open Project',
                click: async () => {
                    //call func here :p
                }
            },
            {
                label: 'Import Asset',
                click: async () => {
                    //call func here :p
                }
            },
            {
                label: 'Export Project',
                click: async () => {
                    //call func here :p
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                click: async () => {
                    //call func here :p
                }
            },
            {
                label: 'Redo',
                click: async () => {
                    //call func here :p
                }
            },
            {
                label: 'Cut',
                click: async () => {
                    //call func here :p
                }
            },
            {
                label: 'Copy',
                click: async () => {
                    //call func here :p
                }
            },
            {
                label: 'Paste',
                click: async () => {
                    //call func here :p
                }
            },
            {
                label: 'Delete',
                click: async () => {
                    //call func here :p
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Open Inspector',
                click: async () => {
                    webContents.openDevTools() //this shit doesnt fucking work
                }
            },
            {
                label: 'Open Preferences',
                //
            }
        ]
    },
]

module.exports.mainMenu = Menu.buildFromTemplate(template);