var dbConnection;
var ObjectID = require('mongodb').ObjectID;

exports.setDBConnectionsFromApp = function(app) {

  console.log("things controller setDBConnectionFromApp Started");
  dbConnection = app.get("dbConnection");
}

exports.findAll = function(req, res) {

 // console.log("things controller findAll Started");

  var collection = dbConnection.collection("Things");
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
            newItem.location = item.location;
 
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

  var collection = dbConnection.collection("Things");

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
        newItem.location = item.location;
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

exports.add = function(req, res) {

  var item = req.body;
  var newItem = {};
  newItem.name = req.body.name;
  newItem.location = req.body.location;
  newItem.timestamp = Date.now() / 1000; // date is in milliseconds and we want seconds

  var collection = dbConnection.collection("Things");

  // check to see if the item already exists. If so skip the insert.
  var checkItem = collection.findOne({"name": newItem.name}, function(err, returnItem) {
    if (returnItem != null) {
      res.status(400);
      res.json({success:false, msg:"item with name already in database"});
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

exports.update = function(req, res) {

  console.log(req.body);

  var item = req.body;
  var collection = dbConnection.collection("Things");

  // check for valid Object(ID)
  var objID;
  try {
    objID = ObjectID(req.params.id);
  } catch(e) {
    res.status(500);
    res.send({success:false, msg:"invalid object id"});
    return;
  }

  var items = collection.update({"_id": objID}, {"$set": item}, function(err, result) {
    res.type('application/json');

    if (result == null) {
      console.log('Update failed');
      res.status(400);
      res.send({success:false, msg:"failed to update"});
      return;
    }
    res.status(200);
    res.json({});
  });
}


exports.delete = function(req, res) {

  var collection = dbConnection.collection("Things");

  var objID;
  try {
    objID = ObjectID(req.params.id);
   } catch(e) {
    res.status(500);
    res.send({success:false, msg:"invalid object id"});
    return;
   }


  var items = collection.remove({"_id": objID}, function(err, status) {
    res.type('application/json');


    if (status.result.n == 0) {
      console.log('Delete failed');
      res.status(400);
      res.send({success:false, msg:"failed to delete"});
      return;
    }
    res.status(200);
    res.json({});
  });
}




