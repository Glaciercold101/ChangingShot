# Web Dashboard - Step 2

## Overview

The web dashboard is a management interface for ChangingShot. It lets you:
- View all monitored areas
- Configure refresh intervals
- Remove areas from monitoring
- View monitoring history

## Setup

### Prerequisites
- Node.js 16+

### Installation

```bash
cd web-dashboard
npm install
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173` (or the port Vite assigns)

### Build

```bash
npm run build
```

This creates a production-ready build in the `dist/` folder.

## Features

✅ **View Monitored Areas** - See all areas you're tracking
✅ **Manage Settings** - Configure refresh intervals
✅ **Remove Areas** - Stop monitoring specific areas
✅ **Live Stats** - Real-time monitoring statistics
✅ **Cross-Browser Storage** - Syncs with browser extension

## File Structure

```
web-dashboard/
├── index.html        # Main dashboard page
├── styles.css        # Styling
├── dashboard.js      # Logic & interactivity
├── package.json      # Dependencies
└── README.md         # This file
```

## How It Works

1. **Data Sync**: The dashboard reads monitored areas from Chrome/Edge extension storage
2. **Settings**: Refresh rate and other settings stored in localStorage
3. **Real-time Updates**: Auto-refreshes every 5 seconds
4. **API Ready**: Can connect to backend API for server-side storage

## Next Steps

- ✅ Step 1: Browser extension
- ✅ Step 2: Web dashboard
- ⬜ Step 3: Backend API
- ⬜ Step 4: Desktop app

