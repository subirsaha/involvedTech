postApp.factory('eventService', function ($rootScope) {
    return {
        on: function(scope, event, callback) {
            var handler = $rootScope.$on(event, callback);
            scope.$on('$destroy', handler);
            // return the unsubscribe function to the client
            return handler;
        },

        notify: function(event, data) {
            $rootScope.$emit(event, data);
        }
    };
});