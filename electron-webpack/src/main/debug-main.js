import { app, BrowserWindow, ipcMain } from 'electron'

// 提供方便的调试功能。需要在 renderer 中进行配合才能工作。
export function enhanceDebug(win) {
    const F12 = 123
    const F5 = 116
    ipcMain.on('keydown', (e, keyCode) => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if(keyCode === F12) {
            win.toggleDevTools()
        } else if(keyCode === F5) {
            win.reload()
        }
    })
}
