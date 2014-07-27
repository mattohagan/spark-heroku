var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendfile('index.html');
})

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('chat message', 'user connected');

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
	socket.on('disconnect', function(){
		io.emit('chat message', 'user disconnected');
	});
});

var port = Number(process.env.PORT || 5000);
http.listen(port, function() {
   console.log("Listening on " + port);
});