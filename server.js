
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
	app.get("/", function(req, res){
	    res.render("page");
	}); 
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
});

server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});

io.set("log level", 1);

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
    	console.log(data);
        io.sockets.emit('message', data);
    });
});