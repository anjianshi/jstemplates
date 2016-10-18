import { app, BrowserWindow} from 'electron'
import { enhanceDebug } from './debug-main'

app.on('ready', () => {
    const win = new BrowserWindow({ width: 1024, height: 768 })
    enhanceDebug(win)

    // {{TMP:HMR_protocol}} 可以设成 http 或 https。
    // 详见 /build/renderer_hmr.js
    const indexURL = process.env.HMR === '1' ? `{TMP:HMR_protocol}://{TMP:HMR_domain}:{TMP:HMR_port}/` : `file://${__dirname}/../renderer/index.html`
    win.loadURL(indexURL)
})

app.on('window-all-closed', () => app.quit())
