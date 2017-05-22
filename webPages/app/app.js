var postApp = angular.module("routerApp", ['ui.router', 'ngSanitize', 'tagged.directives.infiniteScroll', 'slick']);

postApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
       .state('/', {
           url: '/',
           views: {
               'content': { templateUrl: 'app/views/landing.html', controller: 'landingCtrl' },
           }
       });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
});

postApp.filter("trust", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);

angular.module("selectBox", []).directive('selectBox', function () {
    return {
        restrict: 'E',
        link: function () {
            return $(window).bind("load", function () {
                //this will make all your select elements use bootstrap-select
                return $('select').selectpicker();
            });
        }
    };
});
