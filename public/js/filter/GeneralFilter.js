'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:InstalacionFormCtrl
 * @description
 * # InstalacionFormCtrl
 * Controller of the sbAdminApp
 */
 
angular.module('sbAdminApp')

.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
});