// Put all the javascript code here, that you want to execute in background.

function handleClick() {
      browser.runtime.openOptionsPage();
}

browser.browserAction.onClicked.addListener(handleClick);
