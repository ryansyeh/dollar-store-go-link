
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    const {url: activeUrl, id: activeTabId} = details;

    console.log(activeUrl)

    if (activeUrl.startsWith('https://go/')) {
        const link = activeUrl.replace('https://go/','')
        const res = await fetch(`http://cheangmbrian.pythonanywhere.com/go/${link}`)
        console.log(res)
        const record = await res.json();
        console.log(record)
        const redirect_url = record.data[0].actual_url
        console.log(redirect_url)
        chrome.tabs.update(activeTabId, { url: redirect_url });
    }

    // if (activeUrl.startsWith('https://www.foxnews.com/')) {
    //     chrome.tabs.update(activeTabId, { url: 'https://www.cnn.com/' });
    // }
});