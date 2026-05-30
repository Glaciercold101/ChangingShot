// Content script - runs on every webpage

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startSelection') {
        enableSelection();
        sendResponse({ status: 'selection-started' });
    }
});

function enableSelection() {
    const overlay = document.createElement('div');
    overlay.id = 'changingshot-selector-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        cursor: crosshair;
    `;

    const highlighter = document.createElement('div');
    highlighter.id = 'changingshot-highlighter';
    highlighter.style.cssText = `
        position: fixed;
        border: 2px dashed #667eea;
        background: rgba(102, 126, 234, 0.1);
        z-index: 10001;
        display: none;
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(highlighter);

    let selectedElement = null;

    overlay.addEventListener('mouseover', (e) => {
        if (e.target === overlay || e.target === highlighter) return;
        
        selectedElement = e.target;
        const rect = selectedElement.getBoundingClientRect();
        
        highlighter.style.display = 'block';
        highlighter.style.top = (rect.top + window.scrollY) + 'px';
        highlighter.style.left = (rect.left + window.scrollX) + 'px';
        highlighter.style.width = rect.width + 'px';
        highlighter.style.height = rect.height + 'px';
    });

    overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (selectedElement) {
            const rect = selectedElement.getBoundingClientRect();
            const data = {
                url: window.location.href,
                selector: getSelectorForElement(selectedElement),
                coordinates: {
                    x: Math.round(rect.left),
                    y: Math.round(rect.top),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                timestamp: new Date().toISOString()
            };

            // Save to local storage
            chrome.storage.sync.get(['monitoredAreas'], (result) => {
                const areas = result.monitoredAreas || [];
                areas.push(data);
                chrome.storage.sync.set({ monitoredAreas: areas });
            });

            // Clean up
            overlay.remove();
            highlighter.remove();

            console.log('Area selected:', data);
        }
    });

    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            highlighter.remove();
        }
    });

    // Allow ESC key to cancel
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            overlay.remove();
            highlighter.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    });
}

function getSelectorForElement(element) {
    if (!element) return '';
    
    if (element.id) return `#${element.id}`;
    
    let path = [];
    while (element.parentElement) {
        let selector = element.tagName.toLowerCase();
        if (element.id) {
            selector += `#${element.id}`;
            path.unshift(selector);
            break;
        } else {
            let sibling = element;
            let nth = 1;
            while (sibling = sibling.previousElementSibling) {
                if (sibling.tagName.toLowerCase() === selector) nth++;
            }
            if (nth > 1) selector += `:nth-of-type(${nth})`;
        }
        path.unshift(selector);
        element = element.parentElement;
    }
    return path.join(' > ');
}
