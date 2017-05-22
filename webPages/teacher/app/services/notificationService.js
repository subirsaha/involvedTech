postApp.service('notificationService', ['$rootScope', '$q', 'eventService',
    function ($rootScope, $q, eventService) {

        var _signalRUrl = $("signalr").first().attr("href");
        var _notificationProxy = null;
        var _isConnected = false;
        var _connectionId = {};

        var connect = function () {
            //$.connection.hub.logging = true;
            var localDeferred = $q.defer();
            var connection = $.hubConnection();
            connection.url = _signalRUrl + '/signalr';
            _notificationProxy = connection.createHubProxy("notificationHub");
            //connection.qs = { 'Bearer': $rootScope.access_token };
            _notificationProxy.on('onNotificationReceived', onNotificationReceived);
            connection.start().done(function () {
                _isConnected = true;
                localDeferred.resolve();
                _connectionId = _notificationProxy.connection.id;
                console.log("SignalR notificationHub conection id: " + _connectionId);
            }).fail(function (error) {
                console.log('SignalR notificationHub connection failed! ' + error);
            });

            connection.disconnected(function () {
                _isConnected = false;
                console.log("SignalR notificationHub disconnected conection id: " + _connectionId);
            });
            return localDeferred.promise;
        };

        var onNotificationReceived = function (notification) {
            if (notification) {
                if (notification.Message) {
                    eventService.notify('message', notification);
                } else if (notification.StudentTaskId) {
                    eventService.notify('task', notification);
                }
            }
        };

        var callSubscribe = function () {
            _notificationProxy.invoke('subscribe', $rootScope.userid).done(function () {
                console.log('Subscribed successfully to notifications for logged on user');
            }).fail(function (error) {
                console.log('Failed to subscribe to notifications for logged on user. Error: ' + error);
            });
        };

        var callUnsubscribe = function () {
            _notificationProxy.invoke('unsubscribe', $rootScope.userid).done(function () {
                console.log('Unubscribed successfully from notifications for logged on user');
            }).fail(function (error) {
                console.log('Failed to unsubscribe from notifications for logged on user. Error: ' + error);
            });
        };

        this.subscribe = function () {
            if (!_isConnected) {
                connect().then(function () {
                    callSubscribe();
                }, function (error) {
                    console.log('Error in connecting to SignalR notificationHub. ' + error);
                });
            }
            else {
                callSubscribe();
            }
        };

        this.unsubscribe = function () {
            if (!_isConnected) {
                connect().then(function () {
                    callUnsubscribe();
                }, angular.noop);
            }
            else {
                callUnsubscribe();
            }
        };
    }]);
