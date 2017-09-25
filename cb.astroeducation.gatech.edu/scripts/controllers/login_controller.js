define(['./module'], function(controllers) {
    /** Controller for the register form. */
    controllers.controller('LoginController', function($scope, $state, UserAPI, SessionStorage) {
        $scope.showForm = true;
        if (SessionStorage.retrieve('user') && SessionStorage.retrieve('user').username) {
            $scope.showForm = false;
            $scope.showAlreadyLoggedIn = true;
        };

        $scope.message = '';
        $scope.messageClass = '';
        $scope.credentials = {
            username: '',
            password: ''
        };

        /** Sends given credentials to the User API and displays an appropriate
        message depending on the response. */
        $scope.login = function(credentials) {
            UserAPI.login(credentials).then(function(res) {
                if (res.user_token) {
                    SessionStorage.store('user', {
                        username: credentials.username,
                        token: res.user_token
                    });
                    $scope.message = 'Login succesful.';
                    $scope.messageClass = 'alert alert-success';
                    $state.go('topics');
                } else {
                    $scope.message = 'Login failed. Internal error.';
                    $scope.messageClass = 'alert alert-danger';
                }
            }, function(err) {
                if (err.status == 401) {
                    $scope.message = 'Login failed. Username or password incorrect.';
                    $scope.messageClass = 'alert alert-danger';
                } else {
                    $scope.message = 'Login failed. Something went wrong...';
                    $scope.messageClass = 'alert alert-danger';
                }
            });
        }
    });
});
