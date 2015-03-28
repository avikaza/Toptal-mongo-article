var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');

var logger = require('morgan');
var mongoskin = require('mongoskin');
var app = module.exports = express();

app.engine('html', require('ejs').renderFile);

var db = mongoskin.db('mongodb://avinash:techxplorers@localhost/airpair', {safe:true});

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
});

app.get('/collections/:collectionName', function(req, res) {
  req.collection.find({},{}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  });
});

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/public');
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
	 
}

// production only
if (env === 'production') {
  // TODO
}

app.get('/', function (request,response){
	response.render('index.html');
});

/**
 * Routes
 */

// serve index and view partials
//app.get('/', routes.index);
//app.get('/partials/:name', routes.partials);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
