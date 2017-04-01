'use strict';
 
 var myApp= angular.module('sbAdminApp');
myApp.factory('TweetService',['Restangular',function (Restangular) {
return {
    tweets : function(word_search)
    { 
	  console.log("word_search: "+word_search);
      var allTweets=Restangular.one("tweets", word_search).get();
	 
	  //var allTweets=Restangular.all("tweets").post({word_search: word_search},{}, {'Content-Type': json});
      return allTweets;
    },
	stop : function()
    {
	  
      var stopping=Restangular.all('stop').getList();
      return stopping;
    }
  };
}]);




