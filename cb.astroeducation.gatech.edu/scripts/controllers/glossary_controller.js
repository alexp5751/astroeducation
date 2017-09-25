define(['./module', 'services/glossary_data'], function (controllers) {
    /** Controller for the glossary page. Simple gets all words and displays nicely. */
    controllers.controller('GlossaryController', function($scope, GlossaryData) {
        GlossaryData.getAllWords().then(function(res) {
            $scope.glossary = res;
        });
    });
})
