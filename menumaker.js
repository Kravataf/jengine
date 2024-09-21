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
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            ...(isMac ? [
                {role: 'pasteAndMatchStyle'},
                {role: 'delete'},
                {role: 'selectAll'},
                {type: 'separator'},
            ])
        ]
    }