/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require("request"); // You might need to npm install the request module!
var expect = require('../../node_modules/chai/chai').expect;

describe("Persistent Node Chat Server", function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      // TODO: Fill this out with your mysql username
      user: "root",
      // and password.
      password: "",
      database: "chat"
    });
    dbConnection.connect();

    var tablename = "messages"; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query("truncate " + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it("Should insert posted messages to the DB", function(done) {
    // Post a message to the node chat server:
    request({method: "POST",
             uri: "http://127.0.0.1:3000/classes/messages",
             json: {username: "Valjean",
                    message: "In mercy's name, three days is all I need.",
                    roomname: "Hello"}
            },
            function () {

              var queryString = "SELECT * FROM ??"; // SELECT ...
              var queryArgs = ['messages']; // messages

              dbConnection.query( queryString, queryArgs,
                function(err, results) {
                  // Should have one result:
                  expect(results.length).to.equal(1);
                  expect(results[0].Text).to.equal("In mercy's name, three days is all I need.");
                  /* TODO: You will need to change these tests if the
                   * column names in your schema are different from
                   * mine! */

                  done();
                });
            });
  });

  it("Should output all messages from the DB", function(done) {
    // Let's insert a message into the db
    var queryString = 'INSERT INTO MESSAGES (User_id, Text, Room_id) VALUES(?, ?, ?)';
    var queryArgs = [2, 'Men like you can never change!', 1];
    /* TODO - The exact query string and query args to use
     * here depend on the schema you design, so I'll leave
     * them up to you. */

    dbConnection.query( queryString, queryArgs,
      function(err, results) {
        if (err) { throw err; }
        /* Now query the Node chat server and see if it returns
         * the message we just inserted: */
        request("http://127.0.0.1:3000/classes/messages",
          function(error, response, body) {
            var messageLog = JSON.parse(body);
            expect(messageLog[0].Text).to.equal("Men like you can never change!");
            expect(messageLog[0].Room_id).to.equal(1);
            done();
          });
      });
  });
});
