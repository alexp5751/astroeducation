define(['./module', 'jquery', 'three', 'services/three_app', 'services/state_locations'], function(services, $, THREE) {
    /** Handles the transition between states with TWEEN and THREE. */
    services.factory('StateChangeManager', function($rootScope, $state, $q, ThreeApp, StateLocations) {
        /** Intercepts the initial state change event and begins running our code.
        Eventually a promise is returned and the event is allowed to continue. */
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
            if ($rootScope.stateChangeBypass || (fromState.abstract && toState.name =="welcome")) {
                $rootScope.stateChangeBypass = false;
                return;
            }

            event.preventDefault();

            transitionState(toState.name).then(function() {
                $rootScope.stateChangeBypass = true;
                $state.go(toState, toParams);
            });
        });

        /** Begins the state transition, setting up tweens for both the previous
        content page (opacity 1->0) and the new content page (opacity 0->1). When
        the previous content page disappears, resolves the returned promise,
        allowing the state to change content while the camera is transitioning. */
        function transitionState(toState) {
            var defer = $q.defer();
            var container = $('#html-wrapper');
            var delay = 0;

            StateLocations.getStateLocations(toState).then(function(res) {
                if (res.camera_position && res.camera_lookat) {
                    var pos = res.camera_position;
                    var lpos = res.camera_lookat;
                    ThreeApp.cameraMoveAndLook({
                            x: pos.x,
                            y: pos.y,
                            z: pos.z
                        },
                        new THREE.Vector3(lpos.x, lpos.y, lpos.z),
                        2000,
                        function() {}
                    );
                    setUpUITweens(1600);
                }
            });

            function setUpUITweens(delay) {
                var tween1 = new TWEEN.Tween({
                    opacity: 1
                }).to({
                    opacity: 0
                }, 200).onUpdate(function() {
                    container.css('opacity', this.opacity);
                }).onComplete(function() {
                    defer.resolve();
                });

                var tween2 = new TWEEN.Tween({
                    opacity: 0
                }).to({
                    opacity: 1
                }, 200).onUpdate(function() {
                    container.css('opacity', this.opacity);
                }).delay(delay);

                tween1.chain(tween2);
                tween1.start();
            }
            return defer.promise;
        }
        return {};
    });
})
