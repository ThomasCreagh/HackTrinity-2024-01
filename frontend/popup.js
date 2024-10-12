(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  var paragraph = document.getElementById("test");
  var text = document.createTextNode(tab.url);
  paragraph.appendChild(text);
})();
