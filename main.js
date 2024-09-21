const {app, BrowserWindow, ipcMain} = require('electron')

app.on('ready', function () {
  var mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  var prefsWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: true
  })
  prefsWindow.loadURL('file://' + __dirname + '/prefs.html')

  ipcMain.on('toggle-prefs', function () {
    if (prefsWindow.isVisible())
      prefsWindow.hide()
    else
      prefsWindow.show()
  });
  //loadscript just loads scripts from urls.. can be used for libraries or smth
  function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve(url);
        script.onerror = (error) => reject(`Failed to load script ${url}: ${error.message}`);
        document.head.appendChild(script);
    });
  }
})