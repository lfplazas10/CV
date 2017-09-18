var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://admin:AdminAdmin@ds139954.mlab.com:39954/datosdeportivos", function (err, db) {
  if (!err) {
    console.log("We are connected");

    // router.get('/', function (req, res, next) {
    //   res.render('index', {title: 'Express'});
    // });

    router.get('/players', function (req, res) {
      var col = db.collection('Players');
      col.find({}).toArray(function (mongoError, ej) {
          res.send(ej);
        }
      );
    });

    router.post('/rate', function (req, res) {
      var body = req.body;
      var col = db.collection('Players');
      console.log(body);
      // var id = require('mongodb').ObjectID(body.id);
      col.findOne({"name" :body.name}).then(function (player) {
        console.log(player.score)
        player.score = player.score * player.numRatings;
        console.log(player.score)
        player.score = (player.score + parseInt(body.score));
        console.log(player.score);
        player.score = player.score / (player.numRatings + 1)
        console.log(player.score);
        player.numRatings = player.numRatings + 1;
        col.updateOne({"name" :body.name}, player).then(function (mongoError, ej2) {
          res.send(ej2);
        })
      })

    });

    router.get('/search/:name', function (req, res) {
        var col = db.collection('Players');
        var reg = new RegExp(".*" + req.params.name+ ".*", "i")
        col.find({name: {$regex: reg}}).toArray(function (mongoError, ej) {
            res.send(ej);
          }
        );
      }
    );

    router.get('/players/:name/results', function (req, res) {
      var col = db.collection('Results');
      var reg = new RegExp(".*" + req.params.name+ ".*", "i")
      col.aggregate([
        {
          $match: {
            $or: [
              {Winner: {$regex: reg}},
              {Loser: {$regex: reg}}
            ]
          }
        }
      ]).toArray(function (mongoError, ej) {
          res.send(ej);
        }
      );
    });

    router.get('/players/:name/statistics', function (req, res) {
      var col = db.collection('Results');
      col.aggregate([
        {
          $match: {
            $or: [
              {Winner: {$regex: ".*" + req.params.name + ".*"}},
              {Loser: {$regex: ".*" + req.params.name + ".*"}}
            ]
          }
        }
      ]).toArray(function (mongoError, ej) {
          var averageWonSets = 0;
          var averageBet = 0;
          var countSets = 0;
          var wonCount = 0;
          ej.forEach(function (row) {
            console.log(req.params.name)
            if (row.Winner == req.params.name){
              averageWonSets += row.Wsets;
              averageBet += row.B365W;
              wonCount++;
            }
            else{
              averageWonSets += row.Lsets;
              averageBet += row.B365L;
            }
            countSets++;
          });
          averageBet /= countSets;
          averageWonSets /= countSets;

          var statistics = {
            averageBet : averageBet.toFixed(2),
            averageWonSets : averageWonSets.toFixed(2),
            wonCount : wonCount
          }
          res.send(statistics)
        }

      );
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname+'/client/build/index.html'));
    });
  }
});


module.exports = router;
