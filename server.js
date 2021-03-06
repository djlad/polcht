var app = require('express')();
var expressSession = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

var mongoose = require("mongoose");
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/politichat');

//Schemas
var accountSchema = new mongoose.Schema({
	likes: Number,
	rating: Number,
	username: String,
	password: String	
});
var Accounts = mongoose.model("Accounts",accountSchema);

var messageSchema = new mongoose.Schema({

});

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
function updateOtherChatClientsMessages(roomId){
	
}


//passport uses
passport.use("login",new LocalStrategy(
  function(username, password, done) {
    /*Accounts.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });*/

	if(username === password)return done(null,{id:username,name:username});
	else{
		return done(null,null);
	}
  }
));
passport.serializeUser(function(user,done){
	done(null,user.id);
});
passport.deserializeUser(function(id,done){
	done(null,{id:id});
});

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
  	console.log("hello");
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      User.findOne({username:username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);

          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);

//middleware

//express session
app.use(expressSession({
	secret: 'mySecretKey',
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());


//routes
app.get("/",function(req,res){
	res.sendfile("index.html");
	console.log(req.user.id);
	console.log(req.user);
})


app.get("/loginScreen",function(req,res){
	res.sendfile("loginScreen.html");
	console.log(req.user);
})

app.post('/loginScreen',
	passport.authenticate('login'),
	function(req,res){
		console.log("success "+req.user.name);
		res.redirect("/");

	}
);
app.get("/passwordprotected.html",function(req,res){
	console.log(req.user);
	if(req.user.id == "a")res.sendfile("passwordprotected.html");
})

app.post("/signup",passport.authenticate("signup",{
	successRedirect:"/",
	failureRedirect:"/loginScreen"
}),function(){

});

io.on('connection', function(socket){
  console.log('a user connected');
	socket.on("newChatMessage",function(req,res){
		
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
