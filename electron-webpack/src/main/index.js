import { supportDebug } from './debug-main'

app.on('ready', () => {
    const win = new BrowserWindow({ width: 1024, height: 768 })
    enhanceDebug(win)

    const indexURL = process.env.HMR === '1' ? `https://{TMP:HMR_domain}:{TMP:HMR_port}/` : `file://${__dirname}/../renderer/index.html`
    win.loadURL(indexURL)
})

app.on('window-all-closed', () => app.quit())
