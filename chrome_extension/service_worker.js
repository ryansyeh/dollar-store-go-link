
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    const {url: activeUrl, id: activeTabId} = details;
    if (activeUrl.startsWith('https://go/')) {
        const link = activeUrl.replace('https://go/','')
        const res = await fetch(`http://cheangmbrian.pythonanywhere.com/go/${link}`)
        const record = await res.json();
        const redirect_url = record.data[0].actual_url
        chrome.tabs.update(activeTabId, { url: redirect_url });
    }
});