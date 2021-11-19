// Put all the javascript code here, that you want to execute in background.

function handleClick() {
      browser.runtime.openOptionsPage();
}

browser.browserAction.onClicked.addListener(handleClick);


browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  //if (temporary) return; // skip during development
  switch (reason) {
    case "install":
      {
        const url = browser.runtime.getURL("views/installed.html");
        await browser.tabs.create({ url });
      }
      break;
    //case "update":
    //  {
    //    const url = browser.runtime.getURL("views/updated.html");
    //    await browser.tabs.create({ url });
    //  }
    //  break;
  }
});
