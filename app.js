var express = require('express'),
  bodyParser = require('body-parser'),
  http = require('http'),
  path = require('path');

var logger = require('morgan');
var mongoose = require('mongoose');
var app = module.exports = express();

app.engine('html', require('ejs').renderFile);

mongoose.connect('mongodb://avinash:techxplorers@localhost/airpair');
var db = mongoose.connection,
	Faculty,
	Payroll;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	var FacultySchema = mongoose.Schema({
		Institution : String,
		Category : String,
		State : String,
		Position : String,
		AvgSalary : Number,
		AvgRaisePCT : Number,
		Count : Number,
		AvgCompensation : Number,
		SalaryEqualityPCT : Number
	}, {collection: 'faculty'});
	Faculty = db.model('faculty', FacultySchema);

	var PayrollSchema = mongoose.Schema({
		State : String,
		GovernmentFunction : String,
		FullTimeEmployees : Number,
		VariationPCT : Number,
		FullTimePay : Number, 
		PartTimeEmployees : Number,
		PartTimePay : Number, 
		PartTimeHours : Number,
		FullTimeEquivalentEmployment : Number,
		TotalEmployees : Number,
		TotalMarchPay : Number
	}, {collection: 'payroll'});
	Payroll = db.model('payroll', PayrollSchema);
});

app.use(bodyParser());

app.get('/collections/faculty', function(request, response) {
   Faculty.find(function (err, docs) {
       if(err) {
		response.send("Error :"+err.toString());
	} else if(docs) {
		response.send(docs);
	} else {
		response.send('Error : Failed to get faculty data.');
	}
   });
});

app.get('/collections/payroll', function(request, response) {
   Payroll.find(function (err, docs) {
       if(err) {
		response.send("Error :"+err.toString());
	} else if(docs) {
		response.send(docs);
	} else {
		response.send('Error : Failed to get payroll data.');
	}
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

app.get('/aggregate', function (request,response){
	var query = request.param('statement');
	var model = request.param('collection');
	var json = eval('('+query+')');
	if(model == 'Payroll'){
		Payroll.aggregate(json, function (err, result){
			if(err) {
				response.send("Error :"+err.toString());
			} else if(result) {
				response.send(result);
			}else{
				response.send('Error : Failed to aggregate payroll data.');
			}
		});
	}else{
		Faculty.aggregate(json, function (err, result){
			if(err) {
				response.send("Error :"+err.toString());
			} else if(result) {
				response.send(result);
			}else{
				response.send('Error : Failed to aggregate payroll data.');
			}
		});
	}
});

/**
 * Routes
 */


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
