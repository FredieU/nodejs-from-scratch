const http = require('http');

const server = http.createServer((req, res) => {
  res.end('BOOP\n');
});

server.listen(3000, () => console.log('\nListening on port 3000...'));
