const fs = require('fs'); // pull in the file system module
// const { dirname } = require('path');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const js = fs.readFileSync(`${__dirname}/../client/client.js`);

// function to handle the index page
const getIndex = (request, response) => {
  // set status code (200 success), content type, and content length
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(index, 'utf8'),
  });
  // write an HTML string or buffer to the response
  response.write(index);
  // send the response to the client.
  response.end();
};

// function to handle CSS
const getCSS = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/css',
  });
  response.write(css);
  response.end();
};

// function to handle client JS
const getJS = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'application/javascript',
  });
  response.write(js);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getJS,
};
