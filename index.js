const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  res.end('BOOP\n');

  console.log(`Request to ${trimmedPath}`);
});

server.listen(3000, () => console.log('\nListening on port 3000...'));
