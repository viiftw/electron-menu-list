// Build an Electron App in Under 60 Minutes----TRAVERSY MEDIA
require('electron-reload')(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`)
})
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

// Set ENV
process.env.NODE_ENV = 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let addWindow

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('mainWindow.html')

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// Handle create add window
function createAddWindow() {
  addWindow = new BrowserWindow({ width: 300, height: 200, title: 'Add Shopping List Item' })

  // and load the index.html of the app.
  addWindow.loadFile('addWindow.html')

  // Emitted when the window is closed.
  addWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    addWindow = null
  })
}

// Catch item:add
ipcMain.on('item:add',function(e, item) {
  console.log(item)
  win.webContents.send('item:add', item)
  addWindow.close()
})

const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'Add Item',
        click() {
          createAddWindow()
        }
      },
      {
        label: 'Clear Item',
        click() {
          win.webContents.send('item:clear')
        }
      },
      {
        label: 'Quit',
        click() {
          app.quit()
        },
        accelerator: 'CmdOrCtrl+Q'
      }
    ]
  }
]

// Add developer tools item if not in prod
if(process.env.NODE_ENV !=='production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        click(item, focuseWindow) {
          focuseWindow.toggleDevTools()
        },
        accelerator: 'CmdOrCtrl+I'
      },
      {
        role: 'reload'
      }
    ]
  })
}

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
Menu.setApplicationMenu(mainMenu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
