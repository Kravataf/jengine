// create window
const { app, BrowserWindow } = require('electron')
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    })
  
    win.loadFile('index.html')
    win.setMenu(null)
    // F12 => open console
    win.webContents.on('before-input-event', (_, input) => {
        if (input.type === 'keyDown' && input.key === 'F12') {
          win.webContents.isDevToolsOpened()
            ? win.webContents.closeDevTools()
            : win.webContents.openDevTools({ mode: 'right' });
        }
    });

  }
app.whenReady().then(() => {
  createWindow()
})