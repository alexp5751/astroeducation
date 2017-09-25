define(['./module'], function(services) {
    /** Gets the glossary words and definitions stored in data/glossary.json. */
    services.factory('GlossaryData', function($http, $q) {
        var promise = $http.get('/data/glossary.json');
        return {
            /** Returns a single word (indicated by the parameter). */
            getWord: function(word) {
                var defer = $q.defer();
                promise.then(function(res) {
                    if (res.data[word] != undefined) {
                        defer.resolve(res.data[word]);
                    } else {
                        defer.reject('Word not found.');
                    }
                }, function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            },
            /** Returns all words. Used on the glossary page only. */
            getAllWords: function() {
                var defer = $q.defer();
                promise.then(function(res) {
                    defer.resolve(res.data);
                }, function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            }
        }
    });
});
