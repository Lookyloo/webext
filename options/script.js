async function saveOptions(e) {
  let private_ok = false;

  if (document.querySelector("#private").checked) {
    private_ok = await browser.permissions.request({permissions: ["cookies"]})
        .then(response => response);
  }
  else {
    private_ok = await browser.permissions.remove({permissions: ["cookies"]})
      .then(response => false);
  }

  browser.storage.local.set({
    url: document.querySelector("#url").value,
    private: private_ok
  });
  e.preventDefault();
  document.querySelector("#stored-url").innerText = document.querySelector("#url").value;
}

function restoreOptions() {
  var storageItem = browser.storage.local.get();
  storageItem.then((res) => {
    if (res.url) {
      document.querySelector("#stored-url").innerText = res.url;
    }
    document.querySelector("#url").value = res.url || 'http://127.0.0.1:5100';
    document.querySelector("#private").checked = res.private;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
