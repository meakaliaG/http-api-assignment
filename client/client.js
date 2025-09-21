// handling fetch response
// display on page
const handleResponse = async (response, acceptType) => {
  const content = document.getElementById('content');

  // start fresh
  content.innerHTML = '';

  // status-dependent message
  switch (response.status) {
    case 200:
      content.innerHTML = '<b>Success</b>';
      break;
    case 400:
      content.innerHTML = '<b>Bad Request</b>';
      break;
    case 401:
      content.innerHTML = '<b>Unauthorized</b>';
      break;
    case 403:
      content.innerHTML = '<b>Forbidden</b>';
      break;
    case 404:
      content.innerHTML = '<b>Not Found</b>';
      break;
    case 500:
      content.innerHTML = '<b>Internal Server Error</b>';
      break;
    case 501:
      content.innerHTML = '<b>Not Implemented</b>';
      break;
    default:
      content.innerHTML = '<p>Client has no clue what to do with your status spell.</p>';
      break;
  }

  // parse body based on Accept header
  if (acceptType === 'application/json') {
    const obj = await response.json();
    // content.innerHTML += `<p>ID: ${obj.id}</p>`;
    if (obj.id) content.innerHTML += `<p>ID: ${obj.id}</p>`;
    if (obj.message) content.innerHTML += `<p>${obj.message}</p>`
  } else if (acceptType === 'text/xml') {
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'application/xml');
    const msgNode = xmlDoc.getElementsByTagName('message')[0];
    const idNode = xmlDoc.getElementsByTagName('id')[0];
    if (msgNode) content.innerHTML += `<p>${msgNode.textContent}</p>`;
    if (idNode) content.innerHTML += `<p>ID: ${idNode.textContent}</p>`;
  }
};

// HELPER - send fetch
// sends accept header for correct media type
const sendFetch = async (url, acceptType) => {
  const response = await fetch(url, {
    headers: { Accept: acceptType },
  });
  handleResponse(response, acceptType);
};

const init = () => {
  const pageSelect = document.querySelector('#page');
  const typeSelect = document.querySelector('#type');
  const sendButton = document.querySelector('#send');

  const sendRequest = () => {
    const url = pageSelect.value;
    const acceptType = typeSelect.value;
    sendFetch(url, acceptType);
  };

  sendButton.addEventListener('click', sendRequest);
};

window.onload = init;
