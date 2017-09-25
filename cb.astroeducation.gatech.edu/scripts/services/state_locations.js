define(['./module'], function(services) {
    /** Gets the state locations from file. The state locations are the position
    in the THREE.js scene we move to when clicking links inside the app. Take
    a look at data/state_locations.json to edit these positions. */
    services.factory('StateLocations', function($http, $q) {
        var promise = $http.get('/data/state_locations.json');
        return {
            getStateLocations: function(state) {
                var defer = $q.defer();
                promise.then(function(res) {
                    if (res.data[state] != undefined) {
                        defer.resolve(res.data[state]);
                    } else {
                        defer.reject('State not found.');
                    }
                }, function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            }
        }
    });
})
