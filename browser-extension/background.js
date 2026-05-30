// Background service worker

chrome.runtime.onInstalled.addListener(() => {
    console.log('ChangingShot extension installed');
    chrome.storage.sync.set({ monitoredAreas: [] });
});

// Context menu for quick selection
chrome.contextMenus.create({
    id: 'changingshot-select',
    title: 'Monitor this area with ChangingShot',
    contexts: ['all']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'changingshot-select') {
        chrome.tabs.sendMessage(tab.id, { action: 'startSelection' }, () => {
            if (chrome.runtime.lastError) {
                console.log('Could not communicate with content script');
            }
        });
    }
});
