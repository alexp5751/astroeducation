define(['./module'], function(services) {
    /** This service exists to simplify interaction with the REST API,
    specifically, with user functions. */
    services.factory('UserAPI', function($http, $q, SessionStorage) {
        return {
          /** Sends user credentials to server to validate. Returns the result
          of the call if successful (a user token) and an error if not. */
            login: function(credentials) {
                var deferred = $q.defer();
                $http.post('http://cb.astroeducation.gatech.edu/api/user/login', credentials).then(function(res) {
                    deferred.resolve(res.data);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /** Sends new user credentials to server to validate. Returns the result
            of the call if successful (a user token) and an error if not. */
            register: function(credentials) {
                var deferred = $q.defer();
                $http.post('http://cb.astroeducation.gatech.edu/api/user/create', credentials).then(function(res) {
                    deferred.resolve(res.data);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /** Gets a user's score on a quiz from the server. User
            token must be present on the header of the request to be
            successfully authenticated. */
            getQuizScore(username, quiz) {
                var deferred = $q.defer();
                var token = SessionStorage.retrieve('user').token;
                $http.get('http://cb.astroeducation.gatech.edu/api/user/' + username + '/score/' + quiz, {
                    headers: {
                        'Auth': token
                    }
                }).then(function(res) {
                    deferred.resolve(res.data);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /** Sends a user's score on a quiz to the server. User
            token must be present on the header of the request to be
            successfully authenticated. */
            sendQuizScore(username, quiz, score) {
                var deferred = $q.defer();
                var token = SessionStorage.retrieve('user').token;
                console.log(token)
                $http({
                    method: 'POST',
                    url: 'http://cb.astroeducation.gatech.edu/api/user/' + username + '/score/' + quiz,
                    data: {
                        'score': score
                    },
                    headers: {
                        'Auth': token
                    }
                }).then(function(res) {
                    deferred.resolve(res.data);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    });
})
