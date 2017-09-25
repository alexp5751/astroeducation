/** An app made into an on page directive. Most apps probably should have had
this done to them, but it isn't strictly necessary. Usage: <gravity-app></gravity-app>*/
define(['./module', 'three', 'physijs', 'dat.gui'], function (directives, THREE, Physijs, dat) {
    Physijs.scripts.worker = '/scripts/lib/three/physijs_worker.js';
    Physijs.scripts.ammo = '/scripts/lib/three/ammo.js';

    var initScene, initPlanets, initEventListeners, createNewPlanet, createGUI, updatePlanets, updateMenu, updateVelocityVectors,
        renderer, parent, ratio, scene, gui, mainMenu, folder, camera, controls, centroid, planets, light, selectedPlanet,
        prevTime, currTime, play, showForceVectors, showVelocityVectors, lockOnCentroid, createStarfield;

    var G = Math.pow(6.67408, -11);
    var numStartingPlanets = 2;
    var frameRate = 1 / 60;

    planets = [];
    play = false;
    showForceVectors = false;
    showVelocityVectors = false;
    lockOnCentroid = true;

    /** Initializes all main parts of the app, such as the camera, renderer,
    and scene itself.*/
    initScene = function() {
        parent = document.getElementById( 'game-container' );
        ratio = 16 / 9;

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize( parent.offsetWidth, parent.offsetWidth / ratio );
        parent.appendChild( renderer.domElement );

        scene = new Physijs.Scene({ fixedTimeStep: frameRate });
        scene.setGravity(new THREE.Vector3(0, 0, 0));

        camera = new THREE.PerspectiveCamera(
            40,
            renderer.domElement.width / renderer.domElement.height,
            1,
            10000
        );
        camera.position.set( 0, 0, 50 );
        camera.lookAt( getCentroid() );

        controls = new THREE.FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 1;
        controls.rollSpeed = 0.01;
        controls.autoForward = false;
        controls.dragToLook = true;
        // controls.addEventListener('change', render);

        scene.add( camera );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );

        centroid = new Physijs.SphereMesh(
            new THREE.SphereGeometry(0.5, 20, 20),
            new THREE.MeshNormalMaterial(),
            0);
        scene.add(centroid);
        createStarfield();
        initPlanets();
        createGUI();
        initEventListeners();

        requestAnimationFrame(animate);
        scene.simulate();
    };
    /** Creates a spherical backdrop with a starscape painted on the inside.
    Gives a more realistic space feel. */
    createStarfield = function() {
        //load texture
        var loader = new THREE.TextureLoader();
        loader.load('/images/galaxy_starfield.png', function (texture) {
            // create the geometry sphere
            var geometry  = new THREE.SphereGeometry(10000, 32, 32);
            // create the material, using a texture of startfield
            var material  = new THREE.MeshBasicMaterial();
            material.map   = texture;
            material.side  = THREE.BackSide;
            // create the mesh based on geometry and material
            var starfield  = new THREE.Mesh(geometry, material);
            scene.add(starfield);
        });
    }

    /** Initialize all planets that start in the scene. */
    initPlanets = function() {
        for (var i = 0; i < numStartingPlanets; i++) {
            createNewPlanet();
        }
    }

    /** Listens for mouse click and key down events to generate clicking
    on stationary planets to edit variables and allow for moving about the scene. */
    initEventListeners = function () {
        function onMouseDown (event) {
            if (!play) {
                var mouse = new THREE.Vector2();
                var raycaster = new THREE.Raycaster();

                var rect = parent.getBoundingClientRect();
                var eventX = event.pageX - rect.left - window.pageXOffset - 3;
                var eventY = event.pageY - rect.top - window.pageYOffset - 3;

                mouse.x = ( eventX / parent.offsetWidth ) * 2 - 1;
                mouse.y = - ( eventY / (parent.offsetWidth / ratio)) * 2 + 1;

                raycaster.setFromCamera( mouse, camera );

                var intersects = raycaster.intersectObjects( scene.children );
                if (intersects.length > 0) {

                    var planet = intersects[0].object;
                    if (planet.name) {
                        if (selectedPlanet) {
                            selectedPlanet.material.color.setRGB(
                                selectedPlanet.color.r,
                                selectedPlanet.color.g,
                                selectedPlanet.color.b
                            );
                        }
                        selectedPlanet = planet;
                        planet.material.color.setRGB(0, 1, 0.3);

                        var pos = planet.position;
                        var vel = planet.getLinearVelocity();

                        if (folder) {
                            gui.removeFolder(folder.name);
                        }
                        folder = gui.addFolder("Current Planet: " + planet.name);
                        folder.add(planet.menu, "Mass", 0.1, 100);
                        folder.add(planet.menu, "Pos X", pos.x - 25, pos.x + 25);
                        folder.add(planet.menu, "Pos Y", pos.y - 25, pos.y + 25);
                        folder.add(planet.menu, "Pos Z", pos.z - 25, pos.z + 25);
                        folder.add(planet.menu, "Vel X", vel.x - 5, vel.x + 5);
                        folder.add(planet.menu, "Vel Y", vel.y - 5, vel.y + 5);
                        folder.add(planet.menu, "Vel Z", vel.z - 5, vel.z + 5);
                        folder.add(planet.menu, "KILL PLANET");
                        folder.open();
                    }
                }
            }
        }

        parent.addEventListener('mousedown', onMouseDown);
    }

    /** Create a new randomly generated planet. Cannot overlap with existing planets. */
    createNewPlanet = function() {
        var name = "Planet " + (planets.length + 1);
        var mass = Math.random() * 10000000000;
        var radius = Math.random() * 4 + 1;

        var pos = new THREE.Vector3(
            Math.random() * 50 - 25,
            Math.random() * 50 - 25,
            Math.random() * 50 - 25
        );

        var posIsUnique = false;
        while (!posIsUnique) {
            posIsUnique = true;
            for (var i = 0; i < planets.length; i++) {
                var planet = planets[i];
                if (planet.position.distanceTo(pos) < planet.radius + radius) {
                    pos = new THREE.Vector3(
                        Math.random() * 50 - 25,
                        Math.random() * 50 - 25,
                        Math.random() * 50 - 25
                    );
                    posIsUnique = false;
                    break;
                }
            }
        }

        var vel = new THREE.Vector3(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        );

        var material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x000000 }),
            0,
            0.8
        );

        var planet = new Physijs.SphereMesh(
            new THREE.SphereGeometry(radius, 20, 20),
            material
        );

        planet.color = {
            r: Math.random() * 0.75 + 0.25,
            g: Math.random() * 0.75 + 0.25,
            b: Math.random() * 0.75 + 0.25
        };
        planet.material.color.setRGB(planet.color.r, planet.color.g, planet.color.b);

        planet.position.set(pos.x, pos.y, pos.z);
        planet.mass = mass;
        planet.radius = radius;

        // Enable CCD if the object moves more than 1 meter in one simulation frame
        planet.setCcdMotionThreshold(1);

        // Set the radius of the embedded sphere such that it is smaller than the object
        planet.setCcdSweptSphereRadius(1);
        planet.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {

        });

        planet.name = name;
        planet.menu = {
            Mass: mass / 100000000,
            "Pos X": pos.x,
            "Pos Y": pos.y,
            "Pos Z": pos.z,
            "Vel X": vel.x,
            "Vel Y": vel.y,
            "Vel Z": vel.z,
            "KILL PLANET": function() {
                planets.splice(planets.indexOf(planet), 1);
                scene.remove(planet);
                planet.forceArrows.forEach(function(arrow, i) {
                    scene.remove(arrow);
                })
                scene.remove(planet.velocityArrow);
                selectedPlanet = null;
                gui.removeFolder(folder.name);
                folder = null;
            }

        };

        planet.forceArrows = [];
        planet.velocityArrow = new THREE.ArrowHelper(
            new THREE.Vector3(),
            new THREE.Vector3(),
            5,
            0xFFFFFF
        );

        if (showVelocityVectors) {
            scene.add(planet.velocityArrow);
        }

        planets.push(planet);
        scene.add(planet);

        planet.setLinearVelocity(vel);
    }

    /** Creates the datGUI component in the top right of the app. */
    createGUI = function() {
        mainMenu = {
            "Add New Planet": function() {
                if (!play) {
                    createNewPlanet();
                }
            },
            Start: function() {
                play = true;
                if (selectedPlanet) {
                    selectedPlanet.material.color.setRGB(
                        selectedPlanet.color.r,
                        selectedPlanet.color.g,
                        selectedPlanet.color.b
                    );
                }
                if (folder) {
                    gui.removeFolder(folder.name);
                    folder = null;
                }
                scene.onSimulationResume();
            },
            Stop: function() {
                updateMenu();
                play = false;
            },
            Clear: function() {
                play = false;
                numStartingPlanets = this["Number of Planets"];
                planets.forEach(function (planet, i) {
                    planet.forceArrows.forEach(function(arrow, j) {
                        if (arrow) {
                            scene.remove(arrow);
                        }
                    });
                    planet.forceArrows = [];
                    if (planet.velocityArrow) {
                        scene.remove(planet.velocityArrow);
                    }
                    scene.remove(planet);
                });
                planets = [];
                if (selectedPlanet) {
                    selectedPlanet = null;
                }
                if (folder) {
                    gui.removeFolder(folder.name);
                    folder = null;
                }
                mainMenu["Locked on Centroid"] = true;
                lockOnCentroid = true;
            },
            "Gravitational Constant": 0,
            "Show Force Vectors": false,
            "Show Velocity Vectors": false,
            "Locked on Centroid": true
        };

        gui = new dat.GUI({
            autoplace: true,
            width: 300,
            height: 300
        });

        parent.insertBefore(gui.domElement, parent.firstChild);
        gui.domElement.id = "gui";

        gui.add(mainMenu, "Add New Planet");
        gui.add(mainMenu, "Start");
        gui.add(mainMenu, "Stop");
        gui.add(mainMenu, "Clear");
        var gController = gui.add(mainMenu, "Gravitational Constant", -5, 5).step(.1);
        var fvController = gui.add(mainMenu, "Show Force Vectors");
        var vvController = gui.add(mainMenu, "Show Velocity Vectors");
        var centController = gui.add(mainMenu, "Locked on Centroid").listen();

        gController.onChange(function(value) {
            G = Math.pow(6.67408, -11 + value);
        });

        fvController.onChange(function(value) {
            showForceVectors = value;
            planets.forEach(function(planet, i) {
                planet.forceArrows.forEach(function(arrow, j) {
                    if (arrow) {
                        if (value) {
                            scene.add(arrow);
                        } else {
                            scene.remove(arrow);
                        }
                    }
                });
            });
        });

        vvController.onChange(function(value) {
            showVelocityVectors = value;
            planets.forEach(function(planet, i) {
                if (planet.velocityArrow) {
                    if (value) {
                        scene.add(planet.velocityArrow);
                    } else {
                        scene.remove(planet.velocityArrow);
                    }
                }
            });
        });

        centController.onChange(function(value) {
            lockOnCentroid = value;
        });
    }

    /** Updates the menu to keep track of planet velocity and position numerically. */
    updateMenu = function() {
        planets.forEach(function (planet, i) {
            var pos = planet.position;
            var vel = planet.getLinearVelocity();
            planet.menu["Pos X"] = pos.x;
            planet.menu["Pos Y"] = pos.y;
            planet.menu["Pos Z"] = pos.z;
            planet.menu["Vel X"] = vel.x;
            planet.menu["Vel Y"] = vel.y;
            planet.menu["Vel Z"] = vel.z;
        });
    }

    /** Sets planet velocity and position based on menu values. Possible bug in here. */
    updatePlanets = function() {
        planets.forEach(function (planet, i) {
            var menu = planet.menu;
            planet.mass = menu.Mass * 100000000;
            planet.__dirtyPosition = true;
            planet.position.set(menu["Pos X"], menu["Pos Y"], menu["Pos Z"]);
            planet.setLinearVelocity(new THREE.Vector3(menu["Vel X"], menu["Vel Y"], menu["Vel Z"]));
        });
    }

    /** Updates the vectors displayed for a planet's velocity on each turn. */
    updateVelocityVectors = function() {
        planets.forEach(function(planet, i) {
            if (planet.velocityArrow) {
                var direction = planet.getLinearVelocity().clone().normalize();
                var length = planet.getLinearVelocity().length() || 0.0001;
                var newPos = planet.position.clone().add(direction.clone().multiplyScalar(planet.radius));
                planet.velocityArrow.position.set(newPos.x, newPos.y, newPos.z);
                planet.velocityArrow.setDirection(direction);
                planet.velocityArrow.setLength(length * 2);
            }
        });
    }

    function render() {
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);

        if (play) {
            applyForces();
            scene.simulate();
        } else {
            updatePlanets();
        }

        if (showVelocityVectors) {
            updateVelocityVectors();
        }

        var centroidPos = getCentroid();
        centroid.__dirtyPosition = true;
        centroid.position.set(centroidPos.x, centroidPos.y, centroidPos.z);
        if (lockOnCentroid) {
            camera.lookAt(centroidPos);
        }

        renderer.render(scene, camera);
        controls.update(1);
    }

    /** The meat of the app. Allows neighboring planets to exert a force on others.
    This causes the other planets to change velocity based on the mass and distance
    of this one. Has some errors. */
    function applyForces() {
        planets.forEach(function(thisPlanet, i) {
            if (scene.children.indexOf(thisPlanet) > -1) {
                for (var j = 0; j < planets.length; j++) {
                    var forcingPlanet = planets[j];
                    if (thisPlanet != forcingPlanet) {
                        var direction = new THREE.Vector3().subVectors(forcingPlanet.position, thisPlanet.position).normalize();
                        var magnitude = G * thisPlanet.mass * forcingPlanet.mass / forcingPlanet.position.distanceToSquared(thisPlanet.position);

                        if (j >= thisPlanet.forceArrows.length) {
                            var arrow = new THREE.ArrowHelper(new THREE.Vector3(), new THREE.Vector3(), 1, thisPlanet.material.color);
                            thisPlanet.forceArrows.push(arrow);
                            if (showForceVectors) {
                                scene.add(arrow);
                            }
                        }

                        var arrow = thisPlanet.forceArrows[j];
                        arrow.__dirtyPosition = true;

                        var newPos = thisPlanet.position.clone().add(direction.clone().multiplyScalar(thisPlanet.radius));
                        arrow.position.set(newPos.x, newPos.y, newPos.z);
                        arrow.setDirection(direction);
                        arrow.setLength(magnitude / thisPlanet.mass * 4000);

                        thisPlanet.applyCentralImpulse(direction.multiplyScalar(magnitude));
                    } else {
                        var arrow = null;
                        thisPlanet.forceArrows.push(arrow);
                    }
                };
            }
        });
    }

    /** Returns the center of mass of all planets in the scene. */
    function getCentroid() {
        var massSum = 0;
        var vecSum = new THREE.Vector3();
        planets.forEach(function(planet, i) {
            massSum += planet.mass;
            vecSum.add(planet.position.clone().multiplyScalar(planet.mass));
        });
        return vecSum.divideScalar(massSum);
    }

    directives.directive('gravityApp', function() {
        return {
            scope: {},
            controller: ['$scope', '$http', '$attrs', function ($scope, $http, $attrs) {
                initScene();

                var index = 0;
                var info = [
                    '<p>This is an interactive application that illustrates the force of gravity with heavy objects in space.</p>',
                    '<h3>Controls</h3><p>WASD: Move around the current centroid or fly freely if not locked to centroid.</p><p>Arrow Keys: While not locked to the centroid, these control camera angle.</p>',
                    '<p>Try adding, removing, and modifying planets by clicking on the planets themselves and using the menu in the upper right.</p>',
                    '<p>You can also alter aspects of the universe like the gravitational constant, or show the force and velocity vectors of the planets.</p>',
                    '<h3>Have fun!</h3>'
                ]
                $scope.currentInfo = info[index];
                $scope.nextInfo = function() {
                    index++;
                    $scope.currentInfo = info[index];
                }
            }],
            templateUrl: '/partials/gravity_app.html'
        }
    });
});
