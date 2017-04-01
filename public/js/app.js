'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */

//------------------VARIABLES GLOBALES

var host = 'localhost:3000';
var type="api";

 angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'pascalprecht.translate',
    'restangular',
    'chart.js',
    'ngSanitize',
    'angularMoment',
    'ngOpenWeatherMap',
    'ngMessages',
	'base64'
	
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider','$translateProvider','RestangularProvider','owmProvider','$httpProvider','cfpLoadingBarProvider','$base64',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider,$translateProvider,RestangularProvider,owmProvider,$httpProvider,cfpLoadingBarProvider,$base64) {

      
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
		
	RestangularProvider.setBaseUrl('http://'+host+'/'+type);




RestangularProvider.addFullRequestInterceptor(function (element, operation, route, url, headers, params) {
    if (operation == 'remove') {
      element = null;
    }
    console.log(operation);
    return {
      headers: headers,
      params: params,
      element: element,
      httpConfig: {}
    };
});


    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
          var extractedData;
          
          if (operation === "getList") {
            // .. and handle the data and meta data
            extractedData = response.data;
            //extractedData.error = data.error;
            extractedData.paging = data.totalPages;
          } else {
            extractedData = response.data;
          }
          
          return extractedData;
        });

    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });
    owmProvider
        .setApiKey('17647a6a8387baf10383d848a6db2375')
        .useMetric()
        .setLanguage('es');





  // Configure the application


$urlRouterProvider.otherwise('/tweets');

//cambiar esto con el idioma por defecto
var locale = window.navigator.userLanguage || window.navigator.language;
locale = locale.split('-')[0];
if (locale!='es' || locale!='eu')
{
  locale='es';
}
moment.locale(locale); 
$translateProvider.preferredLanguage(locale);
$translateProvider.useStaticFilesLoader({
    prefix: 'languages/locale-',
    suffix: '.json'
});


    $stateProvider
	 .state('tweets',{
		   templateUrl:'views/tweets.html',
		   url:'/tweets',
		   controller:'TweetsCtrl',
		   resolve: {
			  loadMyFiles:function($ocLazyLoad) {
				return $ocLazyLoad.load({
				  name:'sbAdminApp',
				  files:[
				  'js/controllers/TweetsController.js',
				  'servicios/TweetService.js',
				  'bower_components/angular-chart.js/dist/angular-chart.min.js',
                  'bower_components/angular-chart.js/dist/angular-chart.css'
				  ]
				})
				
			  }
			}
	   })  

	
  }]);
  
  var app = angular.module('sbAdminApp');
app.run(["$rootScope", "$location", '$state', 'Restangular', '$window', 
         function ($rootScope, $location, $state, Restangular, $window) {
	

	}] 
 
);

    
