define(['./module', 'three'], function(controllers, THREE) {
    /** Slows down the rotation of the earth and its clouds to allow for
    less distraction when reading content. */
    controllers.controller('TidesController', function($scope, $state, ThreeApp) {
        ThreeApp.addUpdate('earth_rotate', function() {
                ThreeApp.getObject('earth').rotation.y += 0.0005;
                ThreeApp.getObject('clouds1').rotation.y += 0.00075;
                ThreeApp.getObject('clouds1').rotation.z += 0.000075;
                ThreeApp.getObject('clouds2').rotation.y += 0.00075;
                ThreeApp.getObject('clouds2').rotation.z -= 0.000075;
            });
    });
});
