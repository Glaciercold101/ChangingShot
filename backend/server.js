const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Store for monitored areas
const monitored = new Map();

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Routes

// POST /api/areas - Add monitored area
app.post('/api/areas', (req, res) => {
    const { url, selector, coordinates, timestamp } = req.body;
    
    if (!url || !selector) {
        return res.status(400).json({ error: 'URL and selector required' });
    }

    const areaId = Date.now().toString();
    const areaData = {
        id: areaId,
        url,
        selector,
        coordinates,
        timestamp,
        lastCapture: null,
        isActive: true,
        refreshInterval: 30000 // 30 seconds default
    };

    monitored.set(areaId, areaData);
    
    console.log(`✅ Area added: ${areaId}`);
    res.json({ id: areaId, ...areaData });
});

// GET /api/areas - Get all monitored areas
app.get('/api/areas', (req, res) => {
    const areas = Array.from(monitored.values());
    res.json(areas);
});

// GET /api/areas/:id - Get specific area
app.get('/api/areas/:id', (req, res) => {
    const area = monitored.get(req.params.id);
    
    if (!area) {
        return res.status(404).json({ error: 'Area not found' });
    }
    
    res.json(area);
});

// DELETE /api/areas/:id - Remove area
app.delete('/api/areas/:id', (req, res) => {
    const area = monitored.get(req.params.id);
    
    if (!area) {
        return res.status(404).json({ error: 'Area not found' });
    }
    
    monitored.delete(req.params.id);
    console.log(`🗑️ Area removed: ${req.params.id}`);\n    res.json({ success: true });
});

// POST /api/capture/:id - Capture screenshot of monitored area
app.post('/api/capture/:id', async (req, res) => {
    const area = monitored.get(req.params.id);
    
    if (!area) {
        return res.status(404).json({ error: 'Area not found' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto(area.url, { waitUntil: 'networkidle2', timeout: 10000 });

        // Get element position and size
        const elementInfo = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            
            const rect = element.getBoundingClientRect();
            return {
                x: Math.round(rect.left),
                y: Math.round(rect.top),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        }, area.selector);

        if (!elementInfo) {
            await browser.close();
            return res.status(404).json({ error: 'Element not found on page' });
        }

        // Add padding for better screenshots
        const padding = 5;
        const clip = {
            x: Math.max(0, elementInfo.x - padding),
            y: Math.max(0, elementInfo.y - padding),
            width: elementInfo.width + padding * 2,
            height: elementInfo.height + padding * 2
        };

        // Take screenshot
        const screenshotPath = path.join(screenshotsDir, `${area.id}_latest.png`);
        await page.screenshot({
            path: screenshotPath,
            clip
        });

        // Compress image
        const compressedPath = path.join(screenshotsDir, `${area.id}_latest_compressed.jpg`);
        await sharp(screenshotPath)
            .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(compressedPath);

        await browser.close();

        // Update area
        area.lastCapture = new Date().toISOString();
        monitored.set(req.params.id, area);

        res.json({
            success: true,
            areaId: req.params.id,
            screenshot: `/screenshots/${area.id}_latest_compressed.jpg`,
            timestamp: area.lastCapture,
            elementInfo
        });

        console.log(`📸 Captured: ${req.params.id}`);

    } catch (error) {
        console.error('Capture error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /screenshots/:filename - Serve screenshots
app.use('/screenshots', express.static(screenshotsDir));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend API running ✅', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 ChangingShot Backend API running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   POST   /api/areas          - Add monitored area`);
    console.log(`   GET    /api/areas          - List all areas`);
    console.log(`   GET    /api/areas/:id      - Get area details`);
    console.log(`   DELETE /api/areas/:id      - Remove area`);
    console.log(`   POST   /api/capture/:id    - Capture screenshot`);
    console.log(`   GET    /api/health         - Health check\n`);
});

module.exports = app;
