async function fetchAssessment(url) {
    const response = await fetch("http://127.0.0.1:8000/api/website-assessment/", {
        method: "POST",
        body: JSON.stringify({
          websiteUrl: url,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    });
    const jsonResponse = await response.json();
    return jsonResponse;
}

function getTabStorageKey(tabId) {
    return `scrollpatrol-tab-${tabId}`;
}

chrome.webNavigation.onCompleted.addListener(async details => {
    urlString = (details.url + '').trim()
    if(urlString === 'about:blank') return;
    if(urlString.startsWith('chrome://')) return;
    if(urlString.startsWith('https://www.google.com/recaptcha/enterprise/anchor')) return;
    console.log("Navigated to a new page:", urlString);
    const assessmentResult = await fetchAssessment(urlString);

    const tabsOpen = await chrome.tabs.query({});
    const matchingTabs = tabsOpen.filter(tab => tab.url === urlString);
    const promises = matchingTabs.map(tab => 
        chrome.storage.session.set({ [getTabStorageKey(tab.id)]: assessmentResult })
    );
    await Promise.all(promises);
});

chrome.tabs.onActivated.addListener(async activeInfo => {
    const tabStorageKey = getTabStorageKey(activeInfo.tabId);
    let result = await chrome.storage.session.get([tabStorageKey]);
    result = result[tabStorageKey];
    if(!result?.general_score) {
        chrome.action.setIcon({ path: "/icon.png" });
        return;
    }
    switch(result.general_score) {
        case "good":
            chrome.action.setIcon({ path: "/icon_good.png" });
            break;
        case "medium":
            chrome.action.setIcon({ path: "/icon_medium.png" });
            break;
        case "bad":
            chrome.action.setIcon({ path: "/icon_bad.png" });
            break;
    }
});

chrome.tabs.onRemoved.addListener(async tabId => {
    await chrome.storage.session.remove(getTabStorageKey(tabId));
});

  