(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  var numberList = document.getElementById("numberList");

  fetch("http://localhost:8000/api/website-assessment/", {
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
      console.log(data.results);
      for (var i = 0; i < data.results.length; i++) {
        var newNumberListItem = document.createElement("li");
        var numberListValue = document.createTextNode(data.results[i].criterion);
        newNumberListItem.appendChild(numberListValue);
        numberList.appendChild(newNumberListItem);
      }
    })
    .catch(error => {
      console.log("ERROR:\n", error);
    });
})();
