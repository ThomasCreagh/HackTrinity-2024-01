(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  fetch("http://localhost:8000", {
    method: "POST",
    body: JSON.stringify({
      websiteUrl: tab.url,
    }),
    // headers: {
    //   "Content-type": "application/json; charset=UTF-8"
    // }
  })
    .then((response) => response.json())
    .then((json) => paragraph.appendChild(document.createTextNode((json))));

  // var paragraph = document.getElementById("test");
  // var text = document.createTextNode(tab.url);
  //
  // paragraph.appendChild(text);
})();
