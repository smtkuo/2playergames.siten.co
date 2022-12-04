const express = require("express")
const minifyHTML = require('express-minify-html-2');
const fs = require('fs')
const https = require('https')
const http = require('http')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const logger = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const lusca = require('lusca');
const compression = require('compression');
require('dotenv').config();

var privateKey = fs.readFileSync('../ssl.key').toString()
var certificate = fs.readFileSync('../ssl.cert').toString()
var ca = fs.readFileSync('../ssl.ca').toString()
var config = require('./config')
var options = {
    key: privateKey,
    cert: certificate
  };
var serverPort = process.env.port;
var httpServerPort = process.env.sslport;
const app = express()
var server = https.createServer(options, app);
var httpserver = http.createServer(app);
var io = require('socket.io')(server,{
    allowEIO3: true,
    cors: { origin: '*' } 
});

function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
  }

  
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
      collapseWhitespace:        true,
      collapseBooleanAttributes: false,
      removeAttributeQuotes:     false,
      removeEmptyAttributes:     false,
      minifyJS:                  false
  }
}))
app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(compression());
app.use(lusca.xssProtection(true));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('./router/index'))
app.get('*', require('./controllers/indexController').pageNotFound)
app.use(clientErrorHandler)

// START ^^
server.listen(serverPort, function() {
    console.log('server up and running at %s port', serverPort);
});
httpserver.listen(httpServerPort, function() {
    console.log('http server up and running at %s port', httpServerPort);
});