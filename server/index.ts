import express from 'express'
import cors from 'cors'
import { config } from './config'
import { getDevices, switchDevice } from './switcher'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'streamswitch', timestamp: new Date().toISOString() })
})

app.get('/api/devices', async (_req, res) => {
  try {
    res.json(await getDevices())
  } catch (error) {
    res.status(500).json({ ok: false, error: String(error) })
  }
})

app.post('/api/switch', async (req, res) => {
  try {
    const { device, country } = req.body
    const result = await switchDevice(device, country)
    res.json(result)
  } catch (error) {
    res.status(400).json({ ok: false, error: String(error) })
  }
})

app.listen(config.port, '0.0.0.0', () => {
  console.log(`StreamSwitch API running on http://0.0.0.0:${config.port}`)
})
