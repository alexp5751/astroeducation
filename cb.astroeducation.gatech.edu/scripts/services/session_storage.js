define(['./module'], function (controllers) {
    /** This is a service designed to allow storing of variables in the user's
    session. Currently, this is only used for storing a username and API token. */
    controllers.factory('SessionStorage', function($window) {
        return {
            /** Stores a specific user's information in the session storage
            with key key and value information. Session storage only
            supports storing strings, so information is stringified. */
            store: function (key, information) {
                $window.sessionStorage[key] = JSON.stringify(information);
            },

            /** Returns any information previously stored in session storage
            with key key. Must parse JSON because objects stored are
            converted to strings. */
            retrieve: function (key) {
                if ($window.sessionStorage.hasOwnProperty(key)) {
                    return JSON.parse($window.sessionStorage[key]);
                }
                return undefined;
            }
        }
    });
})
