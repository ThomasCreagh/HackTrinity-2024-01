(async () => {
  console.log("main.js is running");
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  var consernList = document.getElementById("concern-list");
  var numberConserns = document.getElementById("number-concerns");

  fetch("http://127.0.0.1:8000/api/website-assessment/", {
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
      numberConserns.insertAdjacentText("afterbegin", data.results.length);
      for (var i = 0; i < data.results.length; i++) {
        var newConsernListItem = document.createElement("li");
        var consernListValue = document.createTextNode(data.results[i].criterion);

        newConsernListItem.classList.add("concern");
        newConsernListItem.classList.add("big-concern");

        newConsernListItem.appendChild(consernListValue);
        consernList.appendChild(newConsernListItem);
      }
    })
    .catch(error => {
      console.log("ERROR:\n", error);
    });
})();
