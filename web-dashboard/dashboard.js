// Dashboard JavaScript - manages UI and syncing

const API_URL = 'http://localhost:3001/api';

// Load areas on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAreas();
    setupEventListeners();
    loadSettings();
});

function setupEventListeners() {
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
}

// Load monitored areas from extension storage
function loadAreas() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(['monitoredAreas'], (result) => {
            const areas = result.monitoredAreas || [];
            displayAreas(areas);
            updateStats(areas);
        });
    } else {
        // Fallback: load from localStorage
        const areas = JSON.parse(localStorage.getItem('monitoredAreas') || '[]');
        displayAreas(areas);
        updateStats(areas);
    }
}

function displayAreas(areas) {
    const list = document.getElementById('areasList');

    if (areas.length === 0) {
        list.innerHTML = `
            <div class="empty">
                <p>📍 No monitored areas yet</p>
                <p>Use the browser extension to select areas on websites</p>
            </div>
        `;
        return;
    }

    list.innerHTML = areas.map((area, index) => `
        <div class="area-card">
            <div class="area-url">${area.url}</div>
            <div class="area-selector">Selector: ${area.selector}</div>
            <div class="area-info">
                <span class="area-status">Active</span>
                <span>${new Date(area.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="area-actions">
                <button class="btn btn-primary" onclick="viewArea(${index})">View</button>
                <button class="btn btn-danger" onclick="removeArea(${index})">Remove</button>
            </div>
        </div>
    `).join('');
}

function updateStats(areas) {
    document.getElementById('statAreas').textContent = areas.length;
    
    const refreshRate = localStorage.getItem('refreshRate') || '30';
    document.getElementById('statRefreshRate').textContent = refreshRate + 's';

    const lastUpdate = localStorage.getItem('lastUpdate');
    if (lastUpdate) {
        const date = new Date(lastUpdate);
        document.getElementById('statLastUpdate').textContent = date.toLocaleTimeString();
    } else {
        document.getElementById('statLastUpdate').textContent = 'Never';
    }
}

function removeArea(index) {
    if (confirm('Remove this monitored area?')) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['monitoredAreas'], (result) => {
                const areas = result.monitoredAreas || [];
                areas.splice(index, 1);
                chrome.storage.sync.set({ monitoredAreas: areas }, loadAreas);
            });
        } else {
            const areas = JSON.parse(localStorage.getItem('monitoredAreas') || '[]');
            areas.splice(index, 1);
            localStorage.setItem('monitoredAreas', JSON.stringify(areas));
            loadAreas();
        }
    }
}

function viewArea(index) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(['monitoredAreas'], (result) => {
            const area = result.monitoredAreas[index];
            showAreaDetails(area);
        });
    } else {
        const areas = JSON.parse(localStorage.getItem('monitoredAreas') || '[]');
        const area = areas[index];
        showAreaDetails(area);
    }
}

function showAreaDetails(area) {
    alert(`URL: ${area.url}\nSelector: ${area.selector}\nCoordinates: ${area.coordinates.x}, ${area.coordinates.y}\nSize: ${area.coordinates.width}x${area.coordinates.height}`);
}

function saveSettings() {
    const refreshRate = document.getElementById('refreshRate').value;
    localStorage.setItem('refreshRate', refreshRate);
    alert('Settings saved! Refresh rate set to ' + refreshRate + ' seconds');
    loadAreas(); // Reload to update stats
}

function loadSettings() {
    const refreshRate = localStorage.getItem('refreshRate') || '30';
    document.getElementById('refreshRate').value = refreshRate;
}

// Auto-refresh stats
setInterval(() => {
    loadAreas();
}, 5000);
