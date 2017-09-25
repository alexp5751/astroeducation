define(['./module', 'three', 'services/three_app'], function(controllers, THREE, ThreeApp, TWEEN, $) {
    /** Initial controller for site pages. Could be used to put some objects
    in the initial background of the ThreeApp scene. */
    controllers.controller('WelcomeController', function($scope, $state, ThreeApp, SessionStorage) {
        $scope.loggedIn = false;
        if (SessionStorage.retrieve('user') && SessionStorage.retrieve('user').username) {
            $scope.loggedIn = true;
        };

        $scope.continue = function() {
            $state.go('tides');
        };
    });
});
