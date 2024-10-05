const {app, BrowserWindow, ipcMain, Menu} = require('electron')
const {mainMenu} = require("./menumaker")

app.on('ready', function () {
  var mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  var prefsWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: false
  }) //this opens up preferences window :u
  prefsWindow.loadURL('file://' + __dirname + '/prefs.html')

  ipcMain.on('toggle-prefs', function () {
    if (prefsWindow.isVisible())
      prefsWindow.hide()
    else
      prefsWindow.show()
  });
  //change to custom menu
  Menu.setApplicationMenu(null) // Menu.setApplicationMenu(mainMenu)

})