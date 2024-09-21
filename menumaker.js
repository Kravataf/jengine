const {app, Menu} = require('electron')

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
                label: 'Open File',
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
            }
        ]
    }
]

module.exports.mainMenu = Menu.buildFromTemplate(template);