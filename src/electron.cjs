const { app, ipcMain, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const ws = require("electron-window-state");

try { require("electron-reloader")(module); } catch { }

const loadURL = serve({ directory: "." });
const port = process.env.PORT || 5173;
const isdev = !app.isPackaged || (process.env.NODE_ENV == "development");
const lock = app.requestSingleInstanceLock();
let mainwindow;

function loadVite(port) {
    mainwindow.loadURL(`http://localhost:${port}`).catch(() => {
        setTimeout(() => { loadVite(port); }, 200);
    });
}

function createMainWindow() {
    let mws = ws({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    mainwindow = new BrowserWindow({
        title: 'Tinymovr control',
        x: mws.x,
        y: mws.y,
        width: mws.width,
        height: mws.height,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: isdev || true,
            nativeWindowOpen: false,
            enableRemoteModule: true
        }
    });

    mainwindow.setMenuBarVisibility(false);

    mainwindow.maximize();

    mainwindow.once("close", () => { mainwindow = null; });

    mainwindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("http")) {
            require("electron").shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    if (!isdev) mainwindow.removeMenu();
    else mainwindow.webContents.openDevTools();
    mws.manage(mainwindow);

    if (isdev) loadVite(port);
    else loadURL(mainwindow);
}

if (!lock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainwindow) {
            if (mainwindow.isMinimized()) mainwindow.restore();
            mainwindow.show();
            mainwindow.focus();
        }
    })

    app.once("ready", createMainWindow);
    app.on("activate", () => { if (!mainwindow) createMainWindow(); });
    app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
}
