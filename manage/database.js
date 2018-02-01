const client = require('mongodb').MongoClient;
const key = require('../json/token.json');
const url = "mongodb://localhost:27017/" + key.db;


module.exports = {
    isDatabase: function() {
        client.connect(url, function(err, db) {
            if (err) throw err;
            console.log("Database Created!");
            db.close();
        });
    },
    isCollection: function(collection) {
        client.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(key.db);
            dbo.createCollection(collection, function(err, res) {
              if (err) throw err;
              console.log("Collection created!");
              db.close();
            });
        });
    },
    isInsertData: function(json, collection) {
        client.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(key.db);
            dbo.collection(collection).insertOne(json, function(err, res) {
              if (err) throw err;
                console.log("Log Created");
              db.close();
            });
        });
    },
    isQuery: function(json, collection, response) {
        client.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(key.db);
            dbo.collection(collection).find(json).toArray(function(err, result) {
              if (err) throw err;
              response(result)
              db.close();
            });
        });
    },
    isRemove: function(json, collection) {
        client.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(key.db);
            dbo.collection(collection).deleteOne(json, function(err, obj) {
              if (err) throw err;
              console.log("1 document deleted");
              db.close();
            });
        });
    }
}