const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

const httpServer = http.createServer((req, res) => {
  commonServer(req, res);
});
httpServer.listen(config.httpPort, () =>
  console.log(`\nListening on port ${config.httpPort}...`),
);

const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  commonServer(req, res);
});
httpsServer.listen(config.httpsPort, () =>
  console.log(`\nListening on port ${config.httpsPort} (HTTPS)...`),
);

const commonServer = (req, res) => {
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

      res.setHeader('Content-Type', 'application/json');
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
};

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
