# StreamSwitch

Instantly switch Apple TVs between VPN regions on a UniFi Dream Router.

StreamSwitch provides a simple web interface that allows you to change the VPN traffic route assigned to individual Apple TVs without opening the UniFi Network application.

---

## Features

- 🌎 One-click VPN region switching
- 🇺🇸 Local (USA / No VPN) mode
- 📺 Multiple Apple TV support
- ⚡ Live status directly from UniFi
- 🔒 SSH-based integration (no browser automation)
- 💻 Responsive React dashboard

---

## Supported Regions

- 🇺🇸 USA (No VPN)
- 🇨🇦 Canada
- 🇬🇧 United Kingdom
- 🇯🇵 Japan
- 🇦🇺 Australia
- 🇩🇪 Germany
- 🇫🇷 France
- 🇪🇸 Spain
- 🇳🇱 Netherlands

---

# Architecture

```
                React UI
                    │
                    ▼
             Express API (Node)
                    │
                    ▼
             SSH to Dream Router
                    │
                    ▼
        MongoDB traffic_route collection
                    │
                    ▼
        UniFi applies VPN immediately
```

Unlike browser automation, StreamSwitch talks directly to the Dream Router over SSH and updates the internal traffic routing configuration.

---

# Screens

Current dashboard

- Living Room
- Basement
- Bedroom

Each device displays:

- Current region
- Available regions
- One-click switching

---

# Requirements

- UniFi Dream Router
- SSH enabled
- Node.js 22+
- npm

---

# Installation

Clone the repository

```bash
git clone git@github.com:stuandmelissa/streamswitch.git
cd streamswitch
```

Install dependencies

```bash
npm install
```

Create a `.env`

```env
PORT=3333

UDR_HOST=192.168.1.1
UDR_USER=root
UDR_PASS=YOUR_UDR_SSH_PASSWORD
```

Start development

```bash
npm run dev:all
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:3333
```

---

# API

## Health

```
GET /health
```

Response

```json
{
  "ok": true
}
```

---

## Get Devices

```
GET /api/devices
```

Example

```json
[
  {
    "id": "living-room",
    "name": "Living Room",
    "current": "australia"
  }
]
```

---

## Switch Region

```
POST /api/switch
```

Example

```json
{
  "device": "living-room",
  "country": "japan"
}
```

---

# Project Structure

```
server/
    config.ts
    index.ts
    streamConfig.ts
    switcher.ts
    unifi.ts

src/
    App.tsx
    App.css
```

---

# Current Status

✅ React dashboard

✅ Express API

✅ Live UniFi status

✅ SSH integration

✅ USA (No VPN)

✅ Multiple Apple TVs

---

# Roadmap

## Planned

- Authentication
- Favorites
- Home Assistant integration
- Scheduling
- Better animations
- Device icons
- Auto-refresh status
- Docker deployment
- Configuration UI
- Remote access

---

# License

MIT
