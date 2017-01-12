(function () {
  'use strict';

  angular
    .module('jackies.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: '/management/register/',
      controller: 'RegisterController',
      controllerAs: 'vm'
    }).when('/login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/management/auth/login/'
    }).otherwise('/');
  }
})();