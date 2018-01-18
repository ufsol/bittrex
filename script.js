var express = require("express");
var app = express();
var fetch = require('node-fetch');
var player = require('play-sound')(opts = {});
var bittrex = "https://bittrex.com/api/v1.1/public/getmarketsummaries";
var alreadyPlayed = false;
var firstArr = [];
var secondArr = [];

app.use(express.static(__dirname + "/"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
    
    
fetch(bittrex)
.then(function(res) {
    return res.json();
}).then(function(json) {
    firstArr = [].concat(json.result);
});
    


setInterval(function(){
    
    if (secondArr.length > 0) {
      firstArr = [].concat(secondArr);
    }  
    
    fetch(bittrex)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        secondArr = [].concat(json.result);
    });
    
    
}, 600000);

setInterval(function(){
        
  secondArr.forEach(function(elem){
      var elemA = firstArr.splice(0, 1)[0];
      var valueA = elemA.Last;
      var valueB = elem.Last;
      var volA = elemA.BaseVolume;
      var volB = elem.BaseVolume;
      var name = elem.MarketName;
      var diff = ((1 - valueA / valueB) * 100).toFixed(2);
      var volDiff = ((1 - volA / volB) * 100).toFixed(2);

      if (diff > 2 && volDiff > 10) {

        console.warn(name + " | price changed by: " + diff + "% & volume changed by: " + volDiff + "%");

        if (alreadyPlayed === false) {
          player.play('default.mp3', function(err){
            if (err) throw err;
          });
          alreadyPlayed = true;
        }
      }
  });
    
  alreadyPlayed = false;
  console.log("--------------------------REPORT END--------------------------------");
    
}, 605000);