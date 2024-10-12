(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  var paragraph = document.getElementById("test");

  console.log(JSON.stringify({ websiteUrl: tab.url }));
  console.log(typeof (tab.url));

  fetch("http://localhost:8000/api/website-assessment/", {
    // mode: "no-cors",
    method: "POST",
    body: JSON.stringify({
      websiteUrl: tab.url,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json())
    .then(data => {
      paragraph.appendChild(document.createTextNode(JSON.stringify(data)));
    })
    .catch(error => {
      console.log("ERROR:\n", error);
    });
})();
