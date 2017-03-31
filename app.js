var express = require('express'),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
morgan = require('morgan'),
routes = require('./routes'),
api = require('./routes/api'),
http = require('http'),
path = require('path'),
consolidate = require('consolidate'),
swig = require('swig');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('.html', consolidate.swig);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', routes.index);
app.get('/api/tweets/:word_search', api.tweets);
app.get('/api/stop', api.stop);



/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});*/



/**
 * Start Server
 */

var server = http.createServer(app);
var io = require('./io').initialize(server);

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});




