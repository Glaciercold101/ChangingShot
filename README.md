# ChangingShot

Monitor specific areas on any website with a floating desktop window. Select an area, and ChangingShot will display live updates in a lightweight desktop widget.

## Features

✨ **Easy Area Selection** - Click to select any region on any website
🔄 **Live Updates** - Auto-refreshing desktop window shows the latest content
💻 **Cross-Browser** - Works with Edge, Chrome, and Chromium-based browsers
⚡ **Lightweight** - Built with Tauri for minimal resource usage
🎯 **Simple & Fast** - No complex setup, just select and watch

## Project Structure

```
ChangingShot/
├── browser-extension/     # Edge/Chrome extension (Manifest V3)
├── web-dashboard/         # Configuration & management page
├── backend/               # Node.js API server
├── desktop-app/           # Tauri desktop application
├── docs/                  # Documentation
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+
- Rust (for Tauri)
- Edge, Chrome, or Chromium browser

### Installation

1. Clone this repository
2. Follow setup instructions in each component's README
3. Build the desktop app for your platform

## Components

### 1. Browser Extension
Select areas on websites and send them to the desktop app.

### 2. Web Dashboard
Manage monitored areas, set refresh intervals, and view history.

### 3. Backend API
Handles screenshot capturing and serving monitored regions.

### 4. Desktop App
Displays a floating window with live updates from selected areas.

## Build & Installation

See `docs/BUILD.md` for detailed build instructions and `.exe` generation.

## License

MIT

## Author

Glaciercold101
