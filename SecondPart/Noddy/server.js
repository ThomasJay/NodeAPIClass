var express = require('express');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// Register JSON body parsing for Post, Updates, Deletes, etc.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Database Connection Information
var db;
var mongodbURL;

// Get env vars
var program_name = process.argv[0]; 
var script_path = process.argv[1]; 
var port_string = process.argv[2]; 
var env_value = process.argv[3];

console.log("program_name=" + program_name);
console.log("script_path=" + script_path);
console.log("port_string=" + port_string);

var port_value = "4444";

if (typeof port_string !== "undefined" && port_string.length > 0) {
	port_value = port_string;
}

if (env_value === "undefined") {
  console.log("env_value is not set");
  return -1;
}
else {
  switch(env_value) {
    case "DEV":
      mongodbURL = "mongodb://localhost:27017/Noddy";
      console.log("environment = " + mongodbURL);
      break;

    default:
      console.log("env_value is not valid: " + env_value);
      return -1;
  }
}


app.set('public', path.join(__dirname, 'public'));

console.log(__dirname);
console.log(__filename);
console.log(app.get('public'));

app.use(express.static(app.get('public')));




MongoClient.connect(mongodbURL, function(err, dbConnection){
  assert.equal(null, err);
  console.log("connected successfully to mongodb server: " + mongodbURL);
  db = dbConnection;
  app.set("dbConnection", dbConnection);

  var userCollection = dbConnection.collection("user");
  userCollection.createIndex({ "loc": "2d" } );




  require('./routes/things')(app);
  require('./routes/users')(app);

  // Handle 404 issues
  app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(path.join(__dirname, './public', '404.html'));
  });

  // Handle stack trace errors
  app.use(function(err, req, res, next) {

    console.error(err.stack);

    res.status(500);
    res.sendFile(path.join(__dirname, './public', '500.html'));
  });


  app.listen(Number(port_value));
  console.log('Server Running on port ' + port_value);

});




