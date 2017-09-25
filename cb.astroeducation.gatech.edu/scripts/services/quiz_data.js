define(['./module'], function(services) {
    /** Gets the quizzes stored in data/quizzes.json. */
    services.factory('QuizData', function($http, $q) {
        var promise = $http.get('/data/quizzes.json');
        return {
            /** Get a quiz by its name. Returns the JSON object. */
            getQuiz: function(name) {
                var defer = $q.defer();
                promise.then(function(res) {
                    if (res.data[name] != undefined) {
                        defer.resolve(res.data[name]);
                    } else {
                        defer.reject('Quiz not found.');
                    }
                }, function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            }
        }
    });
});
