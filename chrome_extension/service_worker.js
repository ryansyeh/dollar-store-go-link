chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    const {url: activeUrl, id: activeTabId} = details;

    if (activeUrl === 'https://www.foxnews.com/') {
        chrome.tabs.update(activeTabId, { url: 'https://www.cnn.com/' });
    }
});