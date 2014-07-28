var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var request = require('request');

var usersNum = 0;

app.use("/public", express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/public/js/'));
app.use("/css", express.static(__dirname + '/public/css/'));

app.get('/', function(req, res) {
	
	res.sendfile(__dirname + '/public/index.html');
	//res.sendfile('index.html');
	//if(req.url.indexOf('.css') != -1) {
	//	res.sendfile(__dirname + 'public/css/main.css');
	//}
})

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('chat message', 'user connected');
	usersNum += 1;
	io.emit('userNum', usersNum);

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('disconnect', function(){
		io.emit('chat message', 'a user has disconnected');
		usersNum -= 1;
		io.emit('userNum', usersNum);
	});


	socket.on('location', function(apiLocation){
            var apiQuery = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20text%3D%22' + encodeURIComponent(apiLocation) + '%22%20and%20gflags%3D%22R%22&format=json&diagnostics=true&callback=';
            console.log("set query");
            request({url: apiQuery, json: true }, function(err, response, body){
            	console.log("got results");
            	var r = body;
                var count = r.query.count;
                if (count > 1) {
                    var results = r.query.results.Result[0];
                } else if (count == 1) {
                    var results = r.query.results.Result;
                } else {
                    location = 'err';
                    var results = '';
                }

                location = results.city;
                if (results.statecode) { 
                	location = location + ' ' + results.statecode;
                }
                console.log(location);
                io.emit('location', location);
            });
    });
});

var port = Number(process.env.PORT || 5000);
server.listen(port, function() {
   console.log("Listening on " + port);
});