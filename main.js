const electron = require("electron");
const { app, BrowserWindow } = electron;
const { ipcMain } = require('electron');
const electronOauth2 = require('electron-oauth2');

var config = {
    clientId: '5308df513e964bb386198ff1a552fa38',
    clientSecret: 'e7fcf8e3f44e4d7d9842a8cef1d8af97',
    authorizationUrl: 'https://www.instagram.com/oauth/authorize/',
    tokenUrl: 'https://api.instagram.com/oauth/access_token/',
    useBasicAuthorizationHeader: false,
    redirectUri: 'http://localhost'
};

let mainWindow = null;

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("ready", function () {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    const windowParams = {
        alwaysOnTop: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false
        }
    }
    const options = {
        scope: 'public_content'

    };

    const myApiOauth = electronOauth2(config, windowParams);
    ipcMain.on('request-authkey', (event, arg) => {


        myApiOauth.getAccessToken(options)
            .then(token => {
                // use your token.access_token
                
                event.sender.send('authkey-reply', token);
                // In main process.

                myApiOauth.refreshToken(token.refresh_token)
                    .then(newToken => {
                        //use your new token
                        console.log(newToken);
                    });
            });
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
});
