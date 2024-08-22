"use strict";

function uninstall() {
  var settingUrl = browser.runtime.setUninstallURL("https://lookyloo.circl.lu/capture");
  settingUrl.then(() => true, (error) => true);

  var uninstalling = browser.management.uninstallSelf({
    showConfirmDialog: true
  });

  uninstalling.then(null, error => console.log(`Canceled: ${error}`));
};

function setup() {
  function onOpened() {
    console.log(`Options page opened`);
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var opening = browser.runtime.openOptionsPage();
  opening.then(onOpened, onError);
}


document.addEventListener('DOMContentLoaded', (e) => {
  document.querySelector("#uninstall").addEventListener('click', uninstall);
  document.querySelector("#setup").addEventListener('click', setup);
});
