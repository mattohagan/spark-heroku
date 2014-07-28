var username = 'ANON';
var previousName = 'ANON';
var state = '';
var socket = io();

$('form').submit(function(){
	sendMess = '[' + username + ']';
	if(state != '') {
		sendMess += "[" + state + "]" + ": " + $('#m').val();
	}
	else {
		sendMess += ": " + $('#m').val();
	}
	socket.emit('chat message', sendMess);
	$('#m').val('');
	return false;
});

socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
	$('#messages').scrollTop($('#messages')[0].scrollHeight);
});

socket.on('userNum', function(num){
	var amt = '';
	for (var i = 0; i < num; i++) {
		amt += '.';
	}
	$('#userNum').text(amt);
});

socket.on('location', function(loc){
	$('#loc').val(loc);
});

socket.on('state', function(code){
	state = code;
});

$('#user').change(function() {
	username = $('#user').val().toUpperCase();
	socket.emit('chat message', "- " + previousName + " has changed their name to " + username + " -");
	previousName = username;
	socket.emit('username', username);
});

function getLocation() {
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}

function locationSuccess(position) {
    loc = position.coords.latitude + ',' + position.coords.longitude;
    socket.emit('location', loc);
}

function locationError(error) {
    console.log('Error getting location: ' + error.code);
}

getLocation();