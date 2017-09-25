define(['./module', 'services/glossary_data'], function (directives) {
    /** Directive must be used as <glossary-word word="word" display-word="words"></glossary-word>
    where word is the word being looked up in the glossary and will be used
    at the top of the modal. display-word is the way you wish this word to appear
    on screen. Do not provide if you wish it to be the same as word.*/
    directives.directive('glossaryWord', function() {
        return {
            scope: {},
            controller: ['$scope', '$attrs', 'GlossaryData', function ($scope, $attrs, GlossaryData) {
                GlossaryData.getWord($attrs.word).then(function(res) {
                    $scope.word = $attrs.word;
                    $scope.displayWord = $attrs.displayWord || $attrs.word;
                    $scope.def = res || "";
                }, function (err) {
                    console.log('Word not found in json: ' + $attrs.word);
                });
            }],
            templateUrl: '/partials/glossary_word.html'
        }
    });
});
