'use strict';
define(['./module', 'three', 'jquery', 'tween'], function(services, THREE, $, TWEEN) {
    /** This service gives a constant reference to the overall scene visible
    in the background of the entire app. All components are made avaiable
    to any controller, directive or service that names this as a dependency.
    NOTE: this is NOT used for in-page apps. */
    services.factory('ThreeApp', function($q) {
        var parent, scene, renderer, camera, controls, width, height;
        var updates = {};
        var objects = {};
        var tweens = {};

        /** Initializes all components of the scene to allow other components
        to interact. */
        var initScene = function() {
            parent = $('#app-container');
            width = parent.width();
            height = parent.height();

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(
                40,
                width / height,
                1,
                50000
            );
            camera.position.set(0, 0, 0);
            scene.add(camera);

            renderer = new THREE.WebGLRenderer({
                antialias: true
            });

            parent.append(renderer.domElement);
            parent = document.getElementById('app-container');
            renderer.setSize(width, height);

            // controls = new THREE.FlyControls(camera, renderer.domElement);
            // controls.movementSpeed = 0.5;
            // controls.rollSpeed = 0.005;
            // controls.autoForward = false;

            window.addEventListener('resize', onWindowResize, false);
        };

        /** Constant loop that updates the scene. */
        var render = function() {
            requestAnimationFrame(render);
            // controls.update(1);
            TWEEN.update();
            Object.keys(updates).forEach(function(key) {
                updates[key]();
            });
            renderer.render(scene, camera);
        };

        /** Handler for user resizing browser window. */
        function onWindowResize(event) {
            var elem = $('#app-container');
            width = elem.width();
            height = elem.height();
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }


        initScene();
        render();
        return {
            /** Get the scene. */
            getScene: function() {
                return scene;
            },
            /** Get the renderer used in the scene. */
            getRenderer: function() {
                return renderer;
            },
            /** Get the camera in the scene. */
            getCamera: function() {
                return camera;
            },
            /** Adds a function that is called in the render() function above.
            This allows for updates that can be added and removed by all
            other components. Must be given a name. */
            addUpdate: function(name, update_func) {
                updates[name] = update_func;
            },
            /** Removes a function from being called in the render() function above.
            Must be identified by a name. */
            removeUpdate: function(name) {
                delete updates[name];
            },
            /** Returns an object in the scene, identified by the name given
            in addObject. */
            getObject: function(name) {
                return objects[name];
            },
            /** Adds an object to the THREE.js scene. Identified by its name. */
            addObject: function(name, object) {
                if (objects[name]) {
                    this.removeObject(name);
                }
                objects[name] = object;
                scene.add(object);
            },
            /** Removes an object in the THREE.js scene. Identified by its name. */
            removeObject: function(name) {
                scene.remove(objects[name]);
                delete objects[name];
            },
            /** Similar to adding an update, but done with TWEEN. Currently only
            used to smoothly move the moon in orbit around the earth. */
            addTween: function(name, tween) {
                tweens[name] = tween;
                tween.start();
            },
            /** Stops a tween with the given name, but does not remove it
            from the list of tweens in the scene. */
            stopTween: function(name) {
                tweens[name].stop();
            },
            /** Starts a previously stopped tween. */
            startTween: function(name) {
                tweens[name].start();
            },
            /** Stops and removes a tween from the scene, ending all
            animations caused by this TWEEN. */
            removeTween: function(name) {
                tweens[name].stop();
                delete tweens[name];
            },
            /** Complicated-looking function that only moves the camera's
            position and rotation smoothly from one point to the next using
            TWEEN.js.
            @param dstpos: the desired ending position of the camera.
            @param dstlookat: the desired ending look target of the camera.
            @param duration: the length of time to take in the transition.
            @param onComplete: function to run at the end of the transition. */
            cameraMoveAndLook: function(dstpos, dstlookat, duration, onComplete) {
                var origpos = new THREE.Vector3().copy(camera.position);
                var origrot = new THREE.Euler().copy(camera.rotation);

                camera.position.set(dstpos.x, dstpos.y, dstpos.z);
                camera.lookAt(dstlookat);
                var dstrot = new THREE.Euler().copy(camera.rotation);

                camera.position.set(origpos.x, origpos.y, origpos.z);
                camera.rotation.set(origrot.x, origrot.y, origrot.z);

                new TWEEN.Tween(camera.position)
                    .to({
                        x: dstpos.x,
                        y: dstpos.y,
                        z: dstpos.z
                    }, duration)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onComplete(onComplete).start();

                var originQ = new THREE.Quaternion().copy(camera.quaternion);
                var destQ = new THREE.Quaternion().setFromEuler(dstrot);
                var currentQ = new THREE.Quaternion();

                var keep = {
                    t: 0
                };

                new TWEEN.Tween(keep)
                    .to({
                        t: 1
                    }, duration)
                    .onUpdate(function() {
                        THREE.Quaternion.slerp(originQ, destQ, currentQ, keep.t);
                        camera.quaternion.set(currentQ.x, currentQ.y, currentQ.z, currentQ.w);
                    })
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
        }
    });
});
