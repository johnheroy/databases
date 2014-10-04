var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});
var that = this;
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

dbConnection.connect();


exports.findAllMessages = function(cb){
  var queryString = 'SELECT * FROM ??';
  var queryArgs = ['MESSAGES'];
  dbConnection.query(queryString, queryArgs, function(err, results){
    if (err) {throw err;}

    cb(err, results);
  });
};

exports.findUser = function(username, cb){
  var queryString = 'SELECT * FROM USERS WHERE NAME=?';
  var queryArgs = [username];
  dbConnection.query(queryString, queryArgs, function(err, results){
    if (err) {throw err;}
    cb(results);
  });
};

exports.saveUser = function(username, cb){
  var queryString = 'INSERT INTO USERS (name) VALUES (?)';
  var queryArgs = [username];
  dbConnection.query(queryString, queryArgs, function(err, results){
    if (err) {throw err;}
    exports.findUser(username, cb);
  });
};

exports.saveMessage = function(message, userid, roomname, cb){
  var queryString = 'INSERT INTO MESSAGES (User_id, Text) VALUES (?, ?)';
  var queryArgs = [userid, message];
  dbConnection.query(queryString, queryArgs, function(err, results){
    if (err) {throw err;}
    cb();
  });
};

