const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  const method = req.method.toLowerCase();
  const queryStringObj = parsedUrl.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    res.end('BOOP\n');

    console.log(`\n${method.toUpperCase()} /${trimmedPath}`);
    console.log('Headers: ', headers);
    Object.keys(queryStringObj).length &&
      console.log('Query string params: ', queryStringObj);
    buffer && console.log('Payload: ', buffer);
  });
});

server.listen(3000, () => console.log('\nListening on port 3000...'));
