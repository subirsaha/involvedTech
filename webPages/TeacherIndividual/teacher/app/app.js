var postApp = angular.module("routerApp", ['ui.router', 'ngSanitize', 'tagged.directives.infiniteScroll', 'slick', 'angular-loading-bar','ngAnimate', 'toaster']);

postApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
       .state('/', {
           url: '/',
           views: {
               'content': { templateUrl: 'app/views/login.html', controller: 'loginCtrl' },
           }
       })
       .state('/forgotpassword', {
           url: '/forgotpassword',
           views: {
               'content': { templateUrl: 'app/views/forget_password.html', controller: 'loginCtrl' },
           }
       })
       .state('/home', {
           url: '/home',
           views: {
               'content': { templateUrl: 'app/views/teacher_login.html', controller: 'homeCtrl' },
           }
       })
         //.state('/hometest', {
         //    url: '/hometest',
         //    views: {
         //        'content': { templateUrl: 'app/views/test_edit.html', controller: 'testeditctrl' },
         //    }
         //})
         //.state('/testing', {
         //    url: '/testing',
         //    views: {
         //        'content': { templateUrl: 'app/views/page2.html', controller: 'ctrl2' },
         //    }
         //});

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
});

// https://github.com/chieffancypants/angular-loading-bar
postApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}])


postApp.directive('select', function ($interpolate) {
    return {
        restrict: 'E',
        //require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var defaultOptionTemplate;
            if (!attrs.ignoreDefault) {
                scope.defaultOptionText = attrs.defaultOption || 'Task Type';
                defaultOptionTemplate = '<option value="" disabled selected style="display: none;">{{defaultOptionText}}</option>';
                elem.prepend($interpolate(defaultOptionTemplate)(scope));
            }
        }
    };
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

postApp.factory('myTaskStat', function () {
    return {
        val: '0'
    };
});