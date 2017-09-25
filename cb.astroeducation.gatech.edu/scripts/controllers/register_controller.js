define(['./module'], function(controllers) {
    /** Controller for the register form. */
    controllers.controller('RegisterController', function($scope, $state, UserAPI, SessionStorage) {
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

        /** Parses the credentials provided, sends them to the User API,
        and then displays an appropriate response based on the results
        of the API call. */
        $scope.register = function(credentials) {
            UserAPI.register(credentials).then(function(res) {
                if (res.user_token) {
                    SessionStorage.store('user', {
                        username: credentials.username,
                        token: res.user_token
                    });
                    $scope.message = 'Registered succesfully.';
                    $scope.messageClass = 'alert alert-success';
                    $state.go('topics');

                } else {
                    $scope.message = 'Registration failed. Internal error.';
                    $scope.messageClass = 'alert alert-danger';
                }
            }, function(err) {
                if (err.status == 409) {
                    $scope.message = 'Registration failed. Username already exists.';
                    $scope.messageClass = 'alert alert-danger';
                } else {
                    $scope.message = 'Registration failed. Something went wrong...';
                    $scope.messageClass = 'alert alert-danger';
                }
            });
        }
    });
});
