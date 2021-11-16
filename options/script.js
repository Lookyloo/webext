function saveOptions(e) {
  browser.storage.sync.set({
    url: document.querySelector("#url").value
  });
  e.preventDefault();
  document.querySelector("#stored-url").innerText = document.querySelector("#url").value;
}

function restoreOptions() {
  var storageItem = browser.storage.sync.get('url');
  storageItem.then((res) => {
    document.querySelector("#stored-url").innerText = res.url;
  });

  var gettingItem = browser.storage.sync.get('url');
  gettingItem.then((res) => {
    document.querySelector("#url").value = res.url || 'http://127.0.0.1:5100';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
