const http = require("http");

const app = require("./app");

// use port issued or port 3000 if not assigned
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
