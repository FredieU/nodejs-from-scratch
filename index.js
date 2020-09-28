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

    const handler = router[trimmedPath] || handlers.notFound;

    const data = {
      headers,
      method,
      path: trimmedPath,
      payload: buffer,
      queryString: queryStringObj,
    };

    handler(data, (statusCode = 200, payload = {}) => {
      const payloadString = JSON.stringify(payload);

      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(`\n${method.toUpperCase()} /${trimmedPath}`);
      console.log('Headers: ', headers);
      Object.keys(queryStringObj).length &&
        console.log('Query string params: ', queryStringObj);
      buffer && console.log('Payload: ', buffer);
      console.log(`Response: Status ${statusCode}, Payload ${payloadString}`);
    });
  });
});

server.listen(3000, () => console.log('\nListening on port 3000...'));

const handlers = {};

handlers.sample = (data, callback) => {
  callback(406, { key: 'value' });
};

handlers.notFound = (data, callback) => {
  callback(404);
};

const router = {
  test: handlers.sample,
};
