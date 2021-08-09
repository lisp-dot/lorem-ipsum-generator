const http = require('http');
const router = require('./router.js');
const port = 8080;

http.createServer((req, res) => {
        router.renderingRoute(req, res);
}).listen(port, () => console.log(`Listening at port: ${port}`));