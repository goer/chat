var express = require("express");
var app = express();
var port = 8080;


app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);  
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"); 
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
 
app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen());

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
    	console.log(data);
        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);