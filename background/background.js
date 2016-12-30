chrome.browserAction.onClicked.addListener(function(activeTab) {
  var query = { url: "chrome-extension://ecbiglglpcmpjmdplphadimldeldkpbl/index.html" };
  chrome.tabs.query(query, function(tabs) {
    if (tabs.length == 0) {
      chrome.windows.create({width: 620, height: 430, type: 'normal', state: 'normal', focused: true, url: "chrome-extension://ecbiglglpcmpjmdplphadimldeldkpbl/index.html"}, function(tab) {
        console.log("Vocal Web site tab initialized: " + tab.url);
      });
    } else {
      var tab = tabs[0];
      console.log("Vocal Web site tab initialized: " + tab.url);
    }
  });
});
