requirejs.config({
    baseUrl: '/scripts',
    paths: {
        'angular': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular',
            'lib/angular/angular.min'
        ],
        'angularAnimate': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-sanitize.min',
            'lib/angular/angular-animate.min'
        ],
        'angularSanitize': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-animate.min',
            'lib/angular/angular-sanitize.min'
        ],
        'uiRouter': [
            'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.min',
            'lib/angular/angular-ui-router.min'
        ],
        'three': 'lib/three/three.min',
        'fly_controls': 'lib/three/fly_controls',
        'physijs': 'lib/three/physi',
        'planets': 'lib/three/planets',
        'dat.gui': 'lib/three/dat.gui',
        'bootstrap': 'lib/bootstrap.min',
        'jquery': [
            'https://code.jquery.com/jquery-2.2.4.min',
            'lib/jquery.min'
        ],
        'tween': [
            'https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min',
            'lib/three/Tween.min'
        ]
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angularAnimate': ['angular'],
        'angularSanitize': ['angular'],
        'uiRouter': ['angular', 'jquery'],
        'three': {
            exports: 'THREE'
        },
        'bootstrap': ['jquery'],
        'dat.gui': {
            exports: 'dat'
        },
        'tween': {
            exports: 'TWEEN'
        }
    }
});

require([
    'angular',
    'bootstrap',
    'app',
    'routes',
    'three',
    'fly_controls',
    'planets',
    'physijs',
    'dat.gui'
], function(angular, app) {
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    angular.element().ready(function() {
        angular.bootstrap(document, ['astronomyApp']);
    });
});
