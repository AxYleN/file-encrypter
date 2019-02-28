const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;

const crypt = require('./crypt');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 350,
    show: false,
    minWidth: 400,
    minHeight: 350,
    resizable: false,
    autoHideMenuBar: true,
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
});

ipcMain.on('file:encrypt', (e, data) => {
  workWithFile(data, 'encrypt', err => {
    if (err) {
      return mainWindow.webContents.send('file:error', err);
    }

    mainWindow.webContents.send('file:done');
  });
});

ipcMain.on('file:decrypt', (e, data) => {
  workWithFile(data, 'decrypt', err => {
    if (err) {
      return mainWindow.webContents.send('file:error', err);
    }

    mainWindow.webContents.send('file:done');
  });
});

function workWithFile(data, operation, cb) {
  let { path: input, key } = data;

  key = key || 'AxYleN file-encrypter';

  dialog.showSaveDialog({ defaultPath: input }, output => {
    if (input == output) {
      dialog.showErrorBox(
        'Ошибка сохранения файла',
        'Нельзя сохранить в тот же файл',
      );

      return mainWindow.webContents.send('file:cancel');
    }

    if (!output) {
      return mainWindow.webContents.send('file:cancel');
    }

    switch (operation) {
      case 'encrypt':
        crypt.encrypt(input, output, key, cb);
        break;
      case 'decrypt':
        crypt.decrypt(input, output, key, cb);
        break;
    }
  });
}
