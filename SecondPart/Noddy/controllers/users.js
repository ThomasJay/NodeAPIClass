var dbConnection;
var ObjectID = require('mongodb').ObjectID;
var uuid = require('node-uuid');


exports.setDBConnectionsFromApp = function(app) {

  console.log("users controller setDBConnectionFromApp Started");
  dbConnection = app.get("dbConnection");
}

exports.findAll = function(req, res) {

 // console.log("things controller findAll Started");

  var collection = dbConnection.collection("users");
  var items = collection.find({}, function(err, docsCursor) {
    res.type('application/json');
    if (err) {
      res.status(500);
      res.send({success:false, msg:"database error"});
      return;
    }

    var itemList = [];
    docsCursor.each(function(err, item) {
        if (item != null) {
            var newItem = {};
            newItem.id = item._id;
            newItem.name = item.name;
            newItem.emailAddress = item.emailAddress;
            newItem.cityState = item.cityState;
            newItem.lat = item.loc[1];
            newItem.lon = item.loc[0];
 
           itemList.push(newItem);
         }
         else {
            res.status(200);
            res.json({ items : itemList});
         }
      });
  });
}

exports.findById = function(req, res) {

  var collection = dbConnection.collection("users");

  // check for valid Object(ID)
  var objID;
  try {
    objID = ObjectID(req.params.id);
  } catch(e) {
    res.status(500);
    res.send({success:false, msg:"invalid object id"});
    return;
  }

  var items = collection.findOne({"_id": objID}, function(err, item) {
    res.type('application/json');

    if (item != null) {
        var newItem = {};
        newItem.id = item._id;
        newItem.name = item.name;
        newItem.emailAddress = item.emailAddress;
        newItem.cityState = item.cityState;
        newItem.lat = item.loc[1];
        newItem.lon = item.loc[0];
        res.status(200);
        res.json(newItem);
     }
     else {
        console.log('Item not found: ' + req.params.id);
        res.status(400);
        res.json({success:false, msg:"item not found"});
     }
  });
}

exports.findNearMe = function(req, res) {

 // console.log("things controller findAll Started");

  var lon = req.params.lon
  var lat = req.params.lat

  var collection = dbConnection.collection("users");
  var items = collection.find({"loc":{$near:[parseFloat(lon), parseFloat(lat)]}}, function(err, docsCursor) {
    res.type('application/json');
    if (err) {
      res.status(500);
      res.send({success:false, msg:"database error"});
      return;
    }

    var itemList = [];
    docsCursor.each(function(err, item) {
        if (item != null) {
            var newItem = {};
            newItem.id = item._id;
            newItem.name = item.name;
            newItem.emailAddress = item.emailAddress;
            newItem.cityState = item.cityState;
            newItem.lat = item.loc[1];
            newItem.lon = item.loc[0];
 
           itemList.push(newItem);
         }
         else {
            res.status(200);
            res.json({ items : itemList});
         }
      });
  });
}

exports.signup = function(req, res) {

    var item = req.body;
    var newItem = {};
    newItem.name = req.body.name;
    newItem.emailAddress = req.body.emailAddress;
    newItem.password = req.body.password;
    newItem.cityState = req.body.cityState;
    newItem.loc = [req.body.lon, req.body.lat];
    newItem.uniqueUUID = uuid.v1();
    newItem.timestamp = Date.now() / 1000; // date is in milliseconds and we want seconds

    var collection = dbConnection.collection("users");

    // check to see if the item already exists. If so skip the insert.
    var checkItem = collection.findOne({"emailAddress": newItem.emailAddress}, function(err, returnItem) {
        if (returnItem != null) {
            res.status(400);
            res.json({success:false, msg:"item with emailAddress already in database"});
        } else {
            // no item was found so insert a new one
            var items = collection.insertOne(newItem, function(err, returnItem) {
                res.type('application/json');

                if (returnItem != null) {
                    res.status(201);
                    res.json(newItem);
                }
                else {
                    console.log('Insert failed');
                    res.status(400);
                    res.json({});
                }
            });
        }
    });


}
