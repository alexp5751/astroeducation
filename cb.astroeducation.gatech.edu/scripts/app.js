'use strict';

define([
    'angular',
    'angularAnimate',
    'angularSanitize',
    'uiRouter',
    'services/app.services',
    'controllers/app.controllers',
    'directives/app.directives'
], function(angular) {
    return angular.module('astronomyApp', [
        'ngAnimate',
        'ngSanitize',
        'ui.router',
        'app.services',
        'app.controllers',
        'app.directives'
    ])
});
