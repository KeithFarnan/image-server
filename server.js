const http = require("http");
const app = require("./app");

// use port issued or port 3000 if not assigned
const port = process.env.PORT || 3000;

// creates the server using the imported app object
const server = http.createServer(app);

// prompts the server to listen on the port set above
server.listen(port);
