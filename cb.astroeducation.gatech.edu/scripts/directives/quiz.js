define(['./module', 'services/quiz_data'], function (directives) {
    /** Directive must be used as <quiz name="tides-pre-eval"></quiz>
    where name is the name of the quiz that is being looked up in quizdata.*/
    directives.directive('quiz', function(QuizData) {
        return {
            scope: {},
            controller: ['$scope', '$attrs', 'QuizData', 'UserAPI', 'SessionStorage', function ($scope, $attrs, QuizData, UserAPI, SessionStorage) {
                $scope.answers = []
                var user = SessionStorage.retrieve('user');
                if (user) {
                    $scope.username = user.username;
                }

                $scope.message = '';
                $scope.messageClass = '';

                QuizData.getQuiz($attrs.name).then(function(res) {
                    $scope.quiz = res;
                    $scope.quiz.type = $attrs.type || 'page';
                }, function(err) {
                });

                $scope.submit = function() {
                    var correctCount = 0;
                    for (var i = 0; i < $scope.quiz.questions.length; i++) {
                        if ($scope.answers[i]) {
                            var question = $scope.quiz.questions[i];
                            var answer = $scope.answers[i];
                            question.showHint = !answer.correct;
                            question.showCorrect = answer.correct;
                            if (!answer.correct) {
                                question.currentHint = answer.hint || "Sorry, that is incorrect.";
                            } else {
                                correctCount += 1;
                            }
                        }
                    }

                    if ($scope.username) {
                        var score = Math.round(correctCount / $scope.quiz.questions.length * 100);
                        UserAPI.sendQuizScore($scope.username, $attrs.name, score).then(function(res) {
                            UserAPI.getQuizScore($scope.username, $attrs.name).then(function(res) {
                                $scope.message = 'Your score: ' + score + '. Your best score: ' + res.max_score;
                                $scope.messageClass = 'alert alert-info';
                            }, function(err) {
                                console.log("Something went wrong...");
                            });
                        }, function(err) {
                            $scope.message = 'Failed to record score: ' + score + '. Sorry!';
                            $scope.messageClass = 'alert alert-danger';
                            console.log("Failed to record score.")
                        });

                    }
                };
            }],
            templateUrl: '/partials/quiz.html'
        }
    });
});
