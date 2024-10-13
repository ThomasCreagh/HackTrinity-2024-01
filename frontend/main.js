(async () => {
  console.log("main.js is running");
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  var consernList = document.getElementById("concern-list");
  var numberConserns = document.getElementById("number-concerns");
  var status = document.getElementById("status");

  // good = safe
  // medium = caution
  // bad = dangerous

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
      console.log(data);
      numberConserns.insertAdjacentText("afterbegin", data.failed_criteria.length);

      var statusItem = document.createElement("span");

      var statusSwitch = "";
      switch (data.general_score) {
        case "good":
          statusSwitch = "Safe";
          break;
        case "medium":
          statusSwitch = "Caution";
          break;
        case "bad":
          statusSwitch = "Dangerous";
          break;
      }

      var statusValue = document.createTextNode(statusSwitch);

      statusItem.classList.add("status");
      statusItem.classList.add(data.general_score);

      statusItem.appendChild(statusValue);
      status.appendChild(statusItem);

      data.failed_criteria.sort((a, b) => a.level.charCodeAt(1) - b.level.charCodeAt(1));

      for (var i = 0; i < data.failed_criteria.length; i++) {
        var newConsernListItem = document.createElement("li");
        var consernListValue = document.createTextNode(data.failed_criteria[i].criterion);

        newConsernListItem.classList.add("concern");
        newConsernListItem.classList.add(data.failed_criteria[i].level + "-concern");

        newConsernListItem.appendChild(consernListValue);
        consernList.appendChild(newConsernListItem);
      }
    })
    .catch(error => {
      console.log("ERROR:\n", error);
    });
})();
