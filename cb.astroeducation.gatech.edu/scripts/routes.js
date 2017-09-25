define(['app', 'services/three_app'], function (app) {
    return app.config(function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('welcome', {
            url: '/',
            templateUrl: 'partials/welcome.html',
        }).state('topics', {
            url: '/topics',
            templateUrl: 'partials/topics.html'
        }).state('tides-topics', {
            url: '/tides-topics',
            templateUrl: 'partials/tides_topics.html'
        }).state('roche-limit', {
            url: '/roche-limit',
            templateUrl: 'partials/roche-limit.html'
        }).state('login', {
            url: '/login',
            templateUrl: 'partials/login.html'
        }).state('tides-pretest', {
            url: '/tides_pretest',
            templateUrl: 'partials/tides_pretest.html'
        }).state('tides-introduction', {
            url: '/tides-introduction',
            templateUrl: 'partials/tides_01_introduction.html'
        }).state('tides-existence', {
            url: '/tides-existence',
            templateUrl: 'partials/tides_02_existence.html'
        }).state('tides-gravity', {
            url: '/tides-gravity',
            templateUrl: 'partials/tides_03_gravity.html'
        }).state('tides-daily-changes', {
            url: '/tides-daily-changes',
            templateUrl: 'partials/tides_04_daily_changes.html'
        }).state('tides-two-high-tides', {
            url: '/tides-two-high-tides',
            templateUrl: 'partials/tides_05_two_high.html'
        }).state('tides-yearly-changes', {
            url: '/tides-yearly-changes',
            templateUrl: 'partials/tides_06_yearly_changes.html'
        }).state('tides-summary', {
            url: '/tides-summary',
            templateUrl: 'partials/tides_summary.html'
        }).state('tides-final-app', {
            url: '/tides-final-app',
            templateUrl: 'partials/tides_posttest.html'
        }).state('glossary', {
            url: '/glossary',
            templateUrl: 'partials/glossary_page.html'
        });
    });
});
