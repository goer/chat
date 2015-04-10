
var express = require('express')
, app = express()
, server = require('http').createServer(app)
, io = require("socket.io").listen(server);


app.configure(function() {
	app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);  
	app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"); 
	app.set('views', __dirname + '/tpl');
	app.set('view engine', "jade");
	app.engine('jade', require('jade').__express);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, res){
    res.render("page");
}); 

server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});

io.set("log level", 1);

io.sockets.on('connection', function (socket) {

    socket.emit('message', { message: 'welcome to the chat' });


// CHAT
    
    socket.on('send', function (data) {
    	console.log(data);
        io.sockets.emit('message', data);
    });


// BIDDING    

    var users = {};

    var bid = {
    	'name' : '',
    	'price_min' : 0,
    	'price_max' : 0,
    	'latest_price' : 0,
    	'latest_bidder' : '',
    };

	socket.on('client:login:request', function (data) {
    	console.log('client:login:request >>'+' user:'+data.user+' password:'+data.password);
    	users[data.user] = { 'user': data.user, 'password': data.password, 'status': 'OK' };
		io.sockets.emit('client:login:response', users[data.user]);
    });

	socket.on('client:bid', function (data) {

    	console.log('client:bid >>'+' user:'+data.user+' bid:'+data.price);

		io.sockets.emit('client:bid', data);
		if( data.price > bid.latest_price ){
			bid.latest_price = data.price;
			bid.latest_bidder = data.user;
			io.sockets.emit('bid:update', bid);
		}
		
    });

	socket.on('owner:bid:update', function (data) {
    	console.log('owner:item:update >>'+ data);
    	bid=data;
		io.sockets.emit('bid:update', bid);
    });


// GPS

    var location = {
        lat : 0, lon : 0,
        time : 0
    }

    var userLocation = {
        '' : location
    }

    socket.on('user:location:update', function (data) {
        console.log('user:location:update >>'+ data.user + " lat:" + data.location.lat + " lon:" + data.location.lon);
        userLocation[data.user] = data.location;
        io.sockets.emit('user:location:broadcast', data);
    });



});