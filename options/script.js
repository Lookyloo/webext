function saveOptions(e) {
  browser.storage.sync.set({
    url: document.querySelector("#url").value,
    private: document.querySelector("#private").checked
  });
  e.preventDefault();
  document.querySelector("#stored-url").innerText = document.querySelector("#url").value;
}

function restoreOptions() {
  var storageItem = browser.storage.sync.get();
  storageItem.then((res) => {
    document.querySelector("#stored-url").innerText = res.url;
    document.querySelector("#url").value = res.url || 'http://127.0.0.1:5100';

    document.querySelector("#private").checked = res.private;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
