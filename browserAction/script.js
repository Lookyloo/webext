async function onGot(tabs){
  const tab = tabs[0];
  let pass_referrer = document.querySelector('.capture #referrer:checked') !== null;
  let pass_cookies = document.querySelector('.capture #cookies:checked') !== null;
  let pass_ua = document.querySelector('.capture #useragent:checked') !== null;


  const config = await browser.storage.local.get().then(res => res);

  const referrer = await browser.scripting.executeScript({
      target: {
          tabId: tab.id
      },
      func: () => { return document.referrer; },
  }).then(result => result[0].result);

  let cookies = []
  if (config.private) {
    cookies = await browser.cookies.getAll({
      storeId: tab.cookieStoreId
    });
  };

  let data = {url: tab.url , listing: 0}
  if (pass_referrer === true && referrer !== "") {
      data.referer = referrer;
  }
  if (config.private && pass_cookies === true) {
      data.cookies = cookies
  }
  if (pass_ua === true) {
      data.user_agent = navigator.userAgent;
  }

  console.log(`${config.url}/submit`);
  await fetch(`${config.url}/submit`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'include', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Accept': 'text/text',
      // 'Access-Control-Allow-Origin': 'http://127.0.0.1:5100'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
    .then(response => response.json())
    .then(result => {
        setTimeout(function() {
            var creating = browser.tabs.create({
                url: `${config.url}/tree/${result}`
            });
            creating.then(tab => {console.log(`Created new tab: ${tab.id}`)},
                          error => {console.log(`Error: ${error}`)})
        }, 200);
    })
    .catch((error) => {
        document.querySelector(".error-submit").textContent = `Unable to reach the instance: ${error}`;
        document.querySelector("#capture").disabled = false;
    });
};

function onError(error) {
  console.log(`Error: ${error}`);
}

function launchCapture() {
  document.querySelector("#capture").disabled = true;
  browser.tabs.query({ currentWindow: true, active: true })
    .then(onGot, onError);
};

document.addEventListener('DOMContentLoaded', (e) => {

  var lookylooURL = browser.storage.local.get();
  lookylooURL.then((res) => {
      document.querySelector(".stored-url").textContent = `Current instance: ${res.url}`
  });
  document.querySelector(".current-ua").textContent = `Current User-Agent: ${navigator.userAgent}`
  browser.storage.local.get().then(res => {
      if (!res.private) {
        document.querySelector(".cookie-box").hidden = true;
      }
  });

  document.querySelector("#capture").addEventListener('click', launchCapture);
});
