(function () {
  'use strict';

  angular
    .module('jackies', [
          'jackies.routes',
          'jackies.management',
          'jackies.config',
          'jackies.interpolate',
          'jackies.layout'
    ]);

  angular
    .module('jackies.routes', ['ngRoute']);

    angular
  .module('jackies.config', []);

    angular
  .module('jackies.interpolate', []);

    angular
    .module('jackies.management', ['ngDialog']);

    angular
  .module('jackies')
  .run(run);

    run.$inject = ['$http'];

    /**
    * @name run
    * @desc Update xsrf $http headers to align with Django's defaults
    */
    function run($http) {
      $http.defaults.xsrfHeaderName = 'X-CSRFToken';
      $http.defaults.xsrfCookieName = 'csrftoken';
    }

})();
