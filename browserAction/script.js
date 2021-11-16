async function onGot(tabs){
  const tab = tabs.pop();
  console.log(tab);
  let pass_referrer = document.querySelector('.capture #referrer:checked') !== null;
  let pass_cookies = document.querySelector('.capture #cookies:checked') !== null;
  let pass_ua = document.querySelector('.capture #useragent:checked') !== null;


  const referrer = await browser.tabs.executeScript(tab.id, {
        code: 'document.referrer'
  }).then(result => result[0]);

  console.log(`Referer: ${referrer}`);

  var gettingAllCookies =  browser.cookies.getAll({storeId: tab.cookieStoreId});
  gettingAllCookies.then((cookies) => {
    console.log(cookies);
    console.log(document.referrer);
    var lookylooURL = browser.storage.sync.get();
    lookylooURL.then((res) => {
      console.log(res);
      console.log(`${res.url}/submit`);
      let data = {url: tab.url , listing: 0}
      if (pass_referrer === true) {
          data.referer = referrer;
      }
      if (pass_cookies === true) {
          data.cookies = cookies
      }
      if (pass_ua === true) {
          data.user_agent = navigator.userAgent;
      }
      console.log(data);

      fetch(`${res.url}/submit`, {
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
                    url :  `${res.url}/tree/${result}`
                });
                creating.then(tab => {console.log(`Created new tab: ${tab.id}`)},
                              error => {console.log(`Error: ${error}`)})
            }, 200);
        });
    });
  });
};

function onError(error) {
  console.log(`Error: ${error}`);
}

function launchCapture() {
  document.querySelector("#capture").disabled = true;
  const gettingCurrent = browser.tabs.query({currentWindow: true, active: true});
  gettingCurrent.then(onGot, onError);
};

document.addEventListener('DOMContentLoaded', (e) => {

  var lookylooURL = browser.storage.sync.get();
  lookylooURL.then((res) => {
      document.querySelector(".stored-url").innerHTML = `Current instance: ${res.url}`
  });
  document.querySelector(".current-ua").innerHTML = `Current User-Agent: ${navigator.userAgent}`
  // document.querySelector(".current-referer").innerHTML = `Current referer: ${}`

  document.querySelector("#capture").addEventListener('click', launchCapture);
});
