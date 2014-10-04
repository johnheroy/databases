var Sequelize = require('sequelize');
var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/

////////// TEMPORARY!!!!!! //////////////////////////////
// var dbConnection = mysql.createConnection({
//   user: "root",
//   password: "",
//   database: "chat"
// });
// dbConnection.connect();
/////////////////////////////////////////////////////


var sequelize = new Sequelize("chat", "root", "", {
  dialect: "mysql",
  port: 3306
});

var Message = sequelize.define('Message', {
  User_id: Sequelize.INTEGER,
  Text: Sequelize.STRING,
  Room_id: Sequelize.INTEGER
}, {
  timestamps: false
});

var User = sequelize.define('User', {
  Name: Sequelize.STRING
},{
  timestamps: false
});

sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err);
    } else {
      console.log('Connection has been established successfully.');
    }
  });

exports.findAllMessages = function(cb){
  Message.findAll().success(function(messages){
    cb(null, messages);
  });
};

exports.findUser = function(username, cb){
  User.findAll({where: {Name: username}}).success(function(name){
    cb(name);
  });
};

exports.saveUser = function(username, cb){
  var newUser = User.build({
    Name: username
  });
  newUser.save().success(function(){
    exports.findUser(username, cb);
  });

  // var queryString = 'INSERT INTO USERS (name) VALUES (?)';
  // var queryArgs = [username];
  // dbConnection.query(queryString, queryArgs, function(err, results){
  //   if (err) {throw err;}
  //   exports.findUser(username, cb);
  // });
};

exports.saveMessage = function(message, userid, roomname, cb){
  var newMsg = Message.build({
    User_id: userid,
    Text: message
  });
  newMsg.save().success(function(){
    cb();
  });

  // var queryString = 'INSERT INTO MESSAGES (User_id, Text) VALUES (?, ?)';
  // var queryArgs = [userid, message];
  // dbConnection.query(queryString, queryArgs, function(err, results){
  //   if (err) {throw err;}
  //   cb();
  // });
};

