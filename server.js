const express = require('express');
const connectDB = require('./database');
const path = require('path');
// executes express like a function allowing us to use methods
const app = express();
const helmet = require('helmet');

// all requests are funnelled through this middleware which logs the data and then lets it continue morgan behind the scenes will use the next fuction saying "i logged it now you do something"
const morgan = require('morgan');

/* 
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);
*/

// Connect to db
connectDB();

//creating a static route to the images folder only used for urls targeted at /uploads
app.use('/uploads', express.static(process.cwd() + '/uploads'));

// setting the view engine and what engine to view it on and dont need to require as it will automatically be loaded
app.set('view engine', 'pug');

// Initialising the middleware parses the body of the request into JSON
app.use(express.json({ extended: false }));

app.use(express.urlencoded({ extended: true }));

// app.use('/api/events', express.static('events'));

app.use(helmet());

/*
This prevents CORS errors from happening
CORS errors are a security feature for browsers preventing
other ports from connection to the server
This setup gives access to everyone with the * for the origin
this appends the headers to any response we get
funnels every request thourugh this appending the headers to it
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With, Accept'
  );
  // browser sends options with post or put first
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    // sends the response with all the headers attached
    return res.status(200).json({});
  }
  // Calling the next method because this did not handle the request and passes it along to the other methods
  next();
});

if (app.get('env') === 'development') {
  // prompting the server to log the data befor it is passed to the routes
  // app.use(morgan('tiny'));
  app.use(morgan('tiny'));
  console.log('morgan Enabeled');
}

// all urls with /images will use imageRoutes files
// this way allows us to split up the code into seperate files
// setting the routes for the application to use
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/events', require('./routes/api/events'));
app.use('/api/people', require('./routes/api/people'));

// all requests that are not any of the above are handelled below
app.use((req, res, next) => {
  //  new const of Error object with the text "Not Found"
  const error = new Error('Not Found');
  // setting the status code property
  error.status = 404;
  // Executes the next method fowarding the error object
  next(error);
});

/*
This method will handle all kinds of errors
including database errors
New First arguement 'error' 
*/
app.use((error, req, res, next) => {
  /*
  use specific error status else use 500 for generic 
  server error as response object 
  */

  res.status(error.status || 500);
  // return JSON object
  res.json({
    // Error object which contains message property
    // to which the error message which we passed in as first arguement
    error: {
      message: error.message
    }
  });
});

// If the application is in production use the static assets
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// use port issued or port 3000 if not assigned
// sentting the port to be either set by the enviroment or defaults to 5000
const PORT = process.env.PORT || 5000;

// prompts the server to listen on the port set above
// Start the application on the specified port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
