document.getElementById('myHeading').style.color = 'red'

function onGot(tabs){
  const tab = tabs.pop();
  console.log(tab);
  var gettingAllCookies =  browser.cookies.getAll({storeId: tab.cookieStoreId});
  gettingAllCookies.then((cookies) => {
        console.log(cookies);
        let url = 'http://127.0.0.1:5100/submit';
        let data = { url: tab.url , listing: 0, cookies: cookies}

        fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          // mode: 'cors', // no-cors, *cors, same-origin
          // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: 'include', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/text',
            // 'Access-Control-Allow-Origin': 'http://127.0.0.1:5100'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          // redirect: 'follow', // manual, *follow, error
          // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
         .then(response => response.text())
         .then(result => console.log(result));
    });
};

function onError(error) {
  console.log(`Error: ${error}`);
}

const gettingCurrent = browser.tabs.query({currentWindow: true, active: true});
gettingCurrent.then(onGot, onError);
