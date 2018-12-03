/*
    What is the express module?
    Express is a web application framework designed for building web applications and APIs. 
    It is the standard server framework for Node.js.

    What is the mysql module?
    The mysql is necessary to access the database provided and work with it.

    What is the body-parser module?
    Used for parsing the incoming data for easier interaction. Basically you can do this by yourself,
    but body-parser gives you a buffer object that is easier to work with.    
*/
var express = require("express");
var session = require('express-session');
var jwt = require('jsonwebtoken');
var passportJWT = require('passport-jwt');
var authentication = require('express-authentication');
var RedisStore = require('connect-redis');
var passport = require("simple-passport");
var BasicStrategy = require("passport-http").BasicStrategy;
var http = require("http");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var rest = require("./REST.js");
var app  = express();
var cors = require("cors");
var passport = require("passport");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;


/*
  An array is used to store username/password information, but
  in practice a database should be used.
*/
var users = [
  {
    id:1,
    name:'testing',
    password:'testing',
  },
  {
    id:2,
    name:'testing2',
    password:'testing2'
  }
];


var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = '2374hsdfjjsnd092342';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  for(i = 0; i < users.length; i++){
    if(users[i].id == jwt_payload.id){
      user = users[i];
      break;
    }
  }
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);

function REST(){
    var self = this;
    self.connectMysql();
};

//Connection to the database
REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        host:'192.168.1.157',
        user: 'medadmin',
        password: 'MEDmysql!001',
        database: 'med_demo'
    });
    pool.getConnection(function(err,connection){
        if(err) {
          console.log("Issue with MYSQL: " + err);
          process.exit(1);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) 
{
      var self = this;
      app.use(passport.initialize());
      app.use(cors());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      app.post("/login", function(req, res) {
      
        //IP address based security
        var ipv4 = "::ffff:";
        if (req.ip !== ipv4+'10.0.2.2') {
          res.status(401);
          console.log(req.ip);
          return res.send('Permission denied');
        }
        
        //Check code to see if name and body were entered
        if(req.body.name && req.body.password){
          var name = req.body.name;
          var password = req.body.password;
        }


        //Check database(array in this case) to see if the user is in there.
        var user = false;
        for(var i = 0; i < users.length; i++){
          if(users[i].name === name){
            user = users[i];
          }
        }

        //If no user is found, then return the following message.
        if(!user){
          res.status(401).json({message:"no such user found"});
        }


        //If the user matches the password
        //Sign the token with a specific payload and secret key.
        if(user.password === req.body.password) {
            var payload = {id: user.id};
            var token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({message: "ok", token: token});
          } 
          else {
            res.status(401).json({message:"passwords did not match"});
          }
        });

        //Here we set-up the express router using the jwt authentication method.
        var router = express.Router();
        app.use('/', passport.authenticate('jwt', { session: false }), router);
        var rest_router = new rest(router,connection);
        app.listen(3000, function() {
          console.log("Running on port: " + "3000!"); 
        });
}

new REST();
