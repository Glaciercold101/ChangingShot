// Popup script - handles UI interactions
document.getElementById('selectBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
        
        // Inject selector script
        chrome.tabs.sendMessage(tabId, { action: 'startSelection' }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('Content script not ready');
                return;
            }
            if (response && response.status === 'selection-started') {
                document.getElementById('status').textContent = '📌 Click on the area you want to monitor...';
                document.getElementById('status').style.color = '#ff9800';
            }
        });
    });
});

document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

// Load monitored areas on popup open
document.addEventListener('DOMContentLoaded', loadMonitoredAreas);

function loadMonitoredAreas() {
    chrome.storage.sync.get(['monitoredAreas'], (result) => {
        const areas = result.monitoredAreas || [];
        const list = document.getElementById('areasList');
        
        if (areas.length === 0) {
            list.innerHTML = '<p class="empty">No areas monitored yet</p>';
            return;
        }

        list.innerHTML = areas.map((area, index) => `
            <div class="area-item">
                <small>${area.url.substring(0, 35)}...</small>
                <button class="area-remove" data-index="${index}">Remove</button>
            </div>
        `).join('');

        document.querySelectorAll('.area-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                areas.splice(index, 1);
                chrome.storage.sync.set({ monitoredAreas: areas }, loadMonitoredAreas);
            });
        });
    });
}
