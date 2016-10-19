// 配合 main process 实现调试功能
import { ipcRenderer } from 'electron'
document.addEventListener('keydown', e => {
    ipcRenderer.send('keydown', e.which)
})
