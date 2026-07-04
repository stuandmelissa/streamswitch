import { useEffect, useState } from 'react'
import './App.css'

type Device = {
  id: string
  name: string
  current: string
}

const countries = [
  { id: 'usa', label: 'USA', flag: '🇺🇸' },
  { id: 'canada', label: 'Canada', flag: '🇨🇦' },
  { id: 'uk', label: 'UK', flag: '🇬🇧' },
  { id: 'japan', label: 'Japan', flag: '🇯🇵' },
  { id: 'australia', label: 'Australia', flag: '🇦🇺' },
  { id: 'germany', label: 'Germany', flag: '🇩🇪' },
  { id: 'france', label: 'France', flag: '🇫🇷' },
  { id: 'spain', label: 'Spain', flag: '🇪🇸' },
  { id: 'netherlands', label: 'Netherlands', flag: '🇳🇱' },
]

const API_BASE = 'http://192.168.1.205:3333'

function App() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  async function loadDevices() {
    const res = await fetch(`${API_BASE}/api/devices`)
    setDevices(await res.json())
  }

  async function switchCountry(device: string, country: string) {
    setLoading(`${device}-${country}`)
    setMessage('')

    const res = await fetch(`${API_BASE}/api/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device, country }),
    })

    const data = await res.json()

    if (!data.ok) {
      setMessage(data.error ?? 'Switch failed')
    } else {
      setDevices(prev =>
        prev.map(d =>
          d.id === device ? { ...d, current: country } : d
        )
      )
      setMessage(`Switched ${device} to ${country.toUpperCase()}`)
    }

    setLoading(null)
  }

  useEffect(() => {
    loadDevices()
  }, [])

  return (
    <main className="page">
      <section className="hero">
        <h1>StreamSwitch</h1>
        <p>Choose the region for each Apple TV.</p>
      </section>

      {message && <div className="message">{message}</div>}

      <section className="grid">
        {devices.map(device => {
          const current = countries.find(c => c.id === device.current)

          return (
            <div className="card" key={device.id}>
              <h2>{device.name}</h2>
              <p>
                Current Region:{' '}
                <strong>
                  {current?.flag} {current?.label}
                </strong>
              </p>

              <div className="buttons">
                {countries.map(country => (
                  <button
                    key={country.id}
                    className={
                      device.current === country.id
                        ? 'country active'
                        : 'country'
                    }
                    disabled={loading !== null}
                    onClick={() =>
                      switchCountry(device.id, country.id)
                    }
                  >
                    {loading === `${device.id}-${country.id}`
                      ? 'Switching...'
                      : `${country.flag} ${country.label}`}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}

export default App
