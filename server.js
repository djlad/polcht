var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');

var mongoose = require("mongoose");
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/politichat');

//Schemas
var accountSchema = new mongoose.Schema({
	likes: Number,
	rating: Numbe,
	username: String,
	password: String	
});
var Accounts = mongoose.model("Accounts",accountSchema);

var chatRoomSchema = new mongoose.Schema({
	messages:[messageSchema],
	onlineNow: []
});
var ChatRooms = mongoose.model("ChatRooms",chatRoomSchema);

var chatMessageSchema = new mongoose.Schema({
	content:String,
	date:Number
});
var ChatMessages = mongoose.model("ChatMessages",chatMessageSchema);

function getChatRoomMessages(roomId,socket){
	ChatRooms.findOne({roomId:roomId},function(e,cMessages){
		console.log(e);
		socket.emit("chts2c",cMessages);
	});
}
function updateOtherChatClientsMessages(roomId,){
	
}



//routes
app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/enterChat', function(req, res){
	var roomId = url.parse(req.url,true).roomId;
	
});

io.on('connection', function(socket){
  console.log('a user connected');
	socket.on("newChatMessage",function(req,res){
		
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});