const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello');
})


const ip = '127.0.0.1';
const port = 9999;
server.listen(port, ip, () => {
  console.log(`Server running at http://${ip}:${port}/`);
});
