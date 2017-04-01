'use strict';
var app=angular.module('sbAdminApp')
  app.controller('TweetsCtrl', ['$scope','TweetService','socket','$translate',function ($scope,TweetService,socket,$translate) {


	$scope.tweets=[];
	$scope.positive_tweets=[];
	$scope.neutral_tweets=[];
	$scope.negative_tweets=[];
    $scope.working = false;

	$scope.termino = "";

	$scope.donut = {
    	labels: ["Positivos", "Neutros", "Negativos"],
    	data: [ $scope.positive_tweets.length,  $scope.neutral_tweets.length,  $scope.negative_tweets.length],
		options: {legend: {display: true}},
		colours:["#3FBF8A", // verde
				"#ED7A07",  // naranja
				"#ED0707"]  // rojo
    };

    $scope.showTweets = function() {
	
		$scope.$broadcast('show-errors-check-validity');
		if ($scope.TweetForm.$valid) {
			$scope.tweets=[];
			$scope.positive_tweets=[];
			$scope.neutral_tweets=[];
			$scope.negative_tweets=[];
			$scope.working = true;
			$scope.termino = $scope.word_search;
			$scope.donut.data= [ $scope.positive_tweets.length,  $scope.neutral_tweets.length,  $scope.negative_tweets.length];
			toastr.success($translate.instant('Searching'));
			TweetService.tweets($scope.word_search).then(function() {
	
			});
		}
    }
	
	$scope.stop = function() {
       TweetService.stop().then(function() {
		
	  });
	  $scope.word_search = "";
	  $scope.working = false;
	  console.log("stop");
	  socket.emit('stop', '');
    }
	
	socket.on('new_tweet', function (data) {
		//Solucionar problema con los streamings abiertos
		if (data.word_search == $scope.word_search)
		{
			$scope.tweets.unshift(data.tweet);
			if (data.tweet.sentiment == 1)
				$scope.positive_tweets.unshift(data.tweet);
			else if (data.tweet.sentiment == -1)
				$scope.negative_tweets.unshift(data.tweet);
			else
				$scope.neutral_tweets.unshift(data.tweet);
			
			$scope.donut.data= [ $scope.positive_tweets.length,  $scope.neutral_tweets.length,  $scope.negative_tweets.length];
		}
	});
	
	socket.on('stopped', function () {
		toastr.error($translate.instant('Stopped'));
	});
	
	socket.on('stopping', function () {
		toastr.warning($translate.instant('Stopping'));
	});
	
	


}]);



app.directive('showErrors', function ($timeout, showErrorsConfig) {
      var getShowSuccess, linkFn;
      getShowSuccess = function (options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && options.showSuccess != null) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };
      linkFn = function (scope, el, attrs, formCtrl) {
        var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses;
        blurred = false;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        inputEl = el[0].querySelector('[name]');
        inputNgEl = angular.element(inputEl);
        inputName = inputNgEl.attr('name');
        if (!inputName) {
          throw 'show-errors element has no child input elements with a \'name\' attribute';
        }
        inputNgEl.bind('blur', function () {
          blurred = true;
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$watch(function () {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, function (invalid) {
          if (!blurred) {
            return;
          }
          return toggleClasses(invalid);
        });
        scope.$on('show-errors-check-validity', function () {
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$on('show-errors-reset', function () {
          return $timeout(function () {
            el.removeClass('has-error');
            el.removeClass('has-success');
            return blurred = false;
          }, 0, false);
        });
        return toggleClasses = function (invalid) {
          el.toggleClass('has-error', invalid);
          if (showSuccess) {
            return el.toggleClass('has-success', !invalid);
          }
        };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function (elem, attrs) {
          if (!elem.hasClass('form-group')) {
            throw 'show-errors element does not have the \'form-group\' class';
          }
          return linkFn;
        }
      };
    }
  );
  
app.provider('showErrorsConfig', function () {
    var _showSuccess;
    _showSuccess = false;
    this.showSuccess = function (showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.$get = function () {
      return { showSuccess: _showSuccess };
    };
  });


app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
