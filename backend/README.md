# Backend API - Step 3

## Overview

The backend API handles:
- Screenshot capture from websites
- Area monitoring management
- Image compression and storage
- API endpoints for the desktop app and dashboard

## Setup

### Prerequisites
- Node.js 16+
- Puppeteer will download Chromium automatically

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` if needed:
```
PORT=3001
NODE_ENV=development
```

### Running

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Add Monitored Area
```
POST /api/areas
Content-Type: application/json

{
  "url": "https://example.com",
  "selector": "div.price",
  "coordinates": { "x": 10, "y": 20, "width": 100, "height": 50 },
  "timestamp": "2026-05-30T10:00:00Z"
}
```

### Get All Areas
```
GET /api/areas
```

### Get Specific Area
```
GET /api/areas/:id
```

### Capture Screenshot
```
POST /api/capture/:id
```

Returns:
```json
{
  "success": true,
  "areaId": "123456",
  "screenshot": "/screenshots/123456_latest_compressed.jpg",
  "timestamp": "2026-05-30T10:05:00Z",
  "elementInfo": { "x": 10, "y": 20, "width": 100, "height": 50 }
}
```

### Remove Area
```
DELETE /api/areas/:id
```

### Health Check
```
GET /api/health
```

## Features

✅ **Puppeteer Integration** - Captures live website screenshots
✅ **Element Targeting** - Finds and captures specific DOM elements
✅ **Auto Compression** - Reduces image size with Sharp
✅ **API Management** - RESTful endpoints for all operations
✅ **Error Handling** - Comprehensive error messages

## Technologies

- **Express.js** - Web framework
- **Puppeteer** - Browser automation & screenshots
- **Sharp** - Image processing & compression
- **CORS** - Cross-origin requests

## Next Steps

- ✅ Step 1: Browser extension
- ✅ Step 2: Web dashboard
- ✅ Step 3: Backend API
- ⬜ Step 4: Desktop app (Tauri)

