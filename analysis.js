function openEmptyTab() {
  Tabs.openEmpty(function(tab) {
    log("New Empty Tab Created: " + JSON.stringify(tab));
  });
}

function goToWebsite(text) {
  var url = text.match(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/gm)[0];
  if (!url.contains("http://")) url = "http://" + url;
  renderStatus('Going to: ' + url);
  Tabs.openNew(url, function(tab) {
    log("New tab at " + url + " created: " + JSON.stringify(tab));
  });
}

function discardNonActiveAudibleTabs() {
  renderStatus('Muted all audible tabs.');
  Tabs.muteTabs(function(tabs) {
    log("Muted all audible tabs " + tabs);
  });
}

function searchGoogle(text) {
  text = text.replace(TRIGGER_NAME + " ", "");
  var textArr = text.split(" ");
  var query = '';
  if (textArr[0] == "look" && textArr[1] == "up") {
    query = text.replace("look up", "");
  } else if (textArr[0] == "search") {
    if (textArr[1] == "for") {
      query = text.replace("search for", "");
    } else if (textArr[2] == "for") {
      textArr.splice(0,3);
      query = textArr.join(" ");
    } else if (textArr[3] == "up") {
      query = text.replace("search up", "");
    } else {
      query = text.replace("search", "");
    }
  }
  var url = 'http://google.com/search?q=' + query;
  Tabs.openNew(url, function(tab) {
    log("Searched Google for " + query + ": " + JSON.stringify(tab));
  });
}

function closeCurrentTab() {
  Tabs.closeTabs(1);
}

function closeRecentTabs(text) {
  var num = text.match(/[0-9]+\s(tabs)/g)
  if (num) {
    num = num[0].replace(" tabs", "");
  } else {
    var textArr = text.split(" ");
    num = textTonum(textArr[textArr.indexOf("last") + 1]);
  }
  Tabs.closeTabs(num);
}

function discardNonActiveTabs() {
  Tabs.memSave(function (tabs) {
    log("Dicarded the following tabs from memory: " + tabs);
  });
}

function analyze(text) {
  var text = text.toLowerCase();
  if (text.contains(TRIGGER_NAME + " go to sleep")) { return 'sleep' };
  if (text.contains("continuous analysis")) { return 'continuous' };
  // return null;
  return 'tabs';
}

function doTabAction(text) {
  var text = text.toLowerCase();
  if (text.contains("open a new tab") || text.contains("open another tab")) {
    openEmptyTab();
  } else if (text.contains("go to ")) {
    goToWebsite(text);
  } else if (text.contains("mute all audible tabs") || text.contains("close all audible tabs") || text.contains("stop all audible tabs")) {
    discardNonActiveAudibleTabs();
  } else if (text.contains("search") || text.contains("look up") || text.contains("google")) {
    searchGoogle(text);
  } else if (text.contains("close this tab")) {
    closeCurrentTab(); // If not voice web
  } else if (text.contains("close the last") && text.contains("tabs")) {
    closeRecentTabs(text); // If not voice web
  } else if (text.contains("enter memory save mode")) {
    discardNonActiveTabs();
  }
}

function toggleContinuousAnalysis(text) {
  if (text.contains("off")) {
    continuous_check.checked = false;
  } else if (text.contains("on")) {
    continuous_check.checked = true;
  }
}

function takeAction(text) {
  switch(analyze(text)) {
    case 'search':
      log('Search Command');
      break;
    case 'continuous':
      log('Toggle Continuous Analysis');
      toggleContinuousAnalysis(text);
      break;
    case 'tabs':
      log('Tab Command');
      doTabAction(text);
      break;
    case 'sleep':
      log('Sleep Command');
      forceStop();
      break;
    default:
      log('Not a valid Command');
      renderStatus('Not a valid Command');
  }
}
