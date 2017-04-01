var Twitter = require('twitter'),
sentiment = require('sentiment'),
nconf = require('nconf');

var express = require('express');
var router = express.Router();

nconf.file({ file: './config.json' }).env();

var client = new Twitter({
  consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
  consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
  access_token_key: nconf.get('TWITTER_ACCESS_TOKEN'),
  access_token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET')
});




/* Añadir el sentimiento al json */
function appendObject(obj,tweet){
  var config = JSON.parse(tweet);
  config.push(obj);
  return config;

}


var socket = require('../io').io();
var sss = null;
exports.tweets = function (req, res) {
  console.log("tweets");
  socket = require('../io').io();
  var search = req.params.word_search;
  client.stream('statuses/filter', {track: search}, function(stream) {
	  sss = stream;
	  stream.on('data', function(tweet) {
		var r1 = sentiment(tweet.text);
		
		if (r1.score>0)
			r1 = 1;
		else if (r1.score<0)
			r1 = -1;
		else 
			r1 = 0;
		tweet.sentiment = r1;
		//console.log(tweet);
		socket.emit('new_tweet', { tweet: tweet, word_search: search });
	  });
	 
	 socket.on('stop', function(data) { 
		console.log("stop");	 
		stream.destroy();
	});
	 
	  stream.on('error', function(error) {
		throw error;
	  });
	});

};



exports.stop = function (req, res) {
	sss.destroy();
	socket.emit('stopped', {});
	console.log("destroy");
};
