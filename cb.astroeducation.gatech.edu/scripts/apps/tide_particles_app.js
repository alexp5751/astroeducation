'use strict';
require(['three', 'dat.gui'], function (THREE, dat) {
    var scene, camera, renderer, plane;
    var land, water = [], moon, draggingMoon = false, particlesMoving = false, mouseStartVector, mouseEndVector, forceArrowsShown = false;
    var sun, draggingSun = false;

    var G = 6.67408; //grav constant

    //adjusting vars/free params
    var ratio = 16 / 9;
    var initVelMult = 10, accelMult = 1, velMult = .001, centerMass = .1, minRadius = .05, maxRadius = 50, minMoonSize = .05;
    var waterParticlesPerCircle = 100, forceArrowsPerCricle = 8, circleRadius = .1, numCircles = 2, earthRadius = .1, atmosphereBuffer = .15, movementFrames = 100, arrowColor = 0xffff00;

    var moonRadius = .07, moonMass = 1;
    var sunRadius = .14, sunMass = 1.1;
    //gui vars
    var mainMenu, gui;

    //there are some hard-coded numbers in calculateEndPos to make the moon distance thing work
    //debug vars
    var intersects, dist;

    //create scene with particles and earth
    function init() {
        parent = document.getElementById( 'game-container' );
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( parent.offsetWidth, parent.offsetWidth / ratio );
        parent.appendChild( renderer.domElement );
        //init scene
        scene = new THREE.Scene();
        //create camera
        camera = new THREE.PerspectiveCamera(
            40,
            renderer.domElement.width / renderer.domElement.height,
            1,
            1000
        );

        //create 2d plane
        var planeMat = new THREE.MeshBasicMaterial({color: 0xffffff});
        planeMat.visible = false;
        plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8),
            planeMat);
        scene.add(plane);

        camera.position.z = 3;
        initEventHandlers();

        //create center mass
        addSphereTexture(earthRadius, 16, 16, '/images/earth_color.jpg', function(sphere) {
            land = sphere;
            land.start =  new THREE.Vector3();
            land.goal = new THREE.Vector3();
            land.speed = new THREE.Vector3();
            land.start.x = land.goal.x = land.position.x;
            land.start.y = land.goal.y = land.position.y;
            land.hasArrow = true;
            land.arrow = new THREE.ArrowHelper( new THREE.Vector3(), new THREE.Vector3(0, 0, earthRadius), 0, arrowColor);
            water.push(land);
        });

        //create water masses in 2 cocentric circles around land
        for (var i = 0; i < numCircles; i++) {
            var arrowsAdded = 0; //if (Math.floor(waterParticlesPerCircle/forceArrowsPerCricle*arrowsAdded) == j)
            for (var j = 0; j < waterParticlesPerCircle; j++) {
                var radius = earthRadius+(i+1)*circleRadius;
                var angle = 2 * Math.PI * (j/waterParticlesPerCircle);

                var waterParticle = addSphereColor(.02, 8, 8, 0x1E649D);

                waterParticle.position.x = radius * Math.cos(angle);
                waterParticle.position.y = radius * Math.sin(angle);

                waterParticle.start = new THREE.Vector3();
                waterParticle.goal = new THREE.Vector3();
                waterParticle.speed = new THREE.Vector3();

                waterParticle.start.x = waterParticle.goal.x = waterParticle.position.x;
                waterParticle.start.y = waterParticle.goal.y = waterParticle.position.y;

                if (Math.floor(waterParticlesPerCircle/forceArrowsPerCricle*arrowsAdded) == j){
                    waterParticle.hasArrow = true;
                    waterParticle.arrow = new THREE.ArrowHelper( new THREE.Vector3(), new THREE.Vector3(0, 0, earthRadius), 1, arrowColor);
                    arrowsAdded++;
                }

                water.push(waterParticle);
            }
        }
        //create moon
        addSphereTexture(moonRadius, 16, 16, '/images/moon_color.jpg', function(sphere) {
            moon = sphere;
            moon.position.y = .7;
        });

        //create sun
        sun = addSphereTexture(sunRadius, 16, 16, '/images/sun_color.jpg', function(sphere) {
            sun = sphere;
            sun.position.y = .7;
            sun.position.x = -.7;
        });

        createStarfield();
        createGUI();
    }

    //Adds a starry background to the app
    function createStarfield(){
        //load texture
        var loader = new THREE.TextureLoader();
        loader.load('/images/galaxy_starfield.png', function(texture) {
            // create the geometry sphere
            var geometry  = new THREE.SphereGeometry(90, 32, 32);
            // create the material, using a texture of startfield
            var material  = new THREE.MeshBasicMaterial();
            material.map   = texture;
            material.side  = THREE.BackSide;
            // create the mesh based on geometry and material
            var starfield  = new THREE.Mesh(geometry, material);
            scene.add(starfield);
        });
    }

    //add a 3d cube mesh to the scene with dimesions 'x','y','z'
    //returns the cube
    function addCube(x, y, z) {
        var geo = new THREE.BoxGeometry(x, y, z);
        var mat = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
        var cubeObj = new THREE.Mesh(geo, mat);
        scene.add( cubeObj );
        return cubeObj
    }

    //add a 3d sphere mesh to the scene with radius 'r' and segments 'wseg' and 'hseg'
    //returns the sphere
    function addSphere(r, wseg, hseg){ //wireframe
        var geo = new THREE.SphereGeometry(r, wseg, hseg);
        var mat = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
        var sphereObj = new THREE.Mesh(geo, mat);
        scene.add(sphereObj);
        return(sphereObj);
    }

    //add a 3d sphere with a solid color 'colorHex' to the scene with radius 'r' and segments 'wseg' and 'hseg'
    //returns the sphere
    function addSphereColor(r, wseg, hseg, colorHex){ //color
        var geo = new THREE.SphereGeometry(r, wseg, hseg);
        var mat = new THREE.MeshBasicMaterial( { color: colorHex } );
        var sphereObj = new THREE.Mesh(geo, mat);
        scene.add(sphereObj);
        return(sphereObj);
    }

    //add a 3d sphere with a texture 'img' to the scene with radius 'r' and segments 'wseg' and 'hseg'
    //returns the sphere
    function addSphereTexture(r, wseg, hseg, img, callback){
        var loader = new THREE.TextureLoader();
        var mat;
        var texture = loader.load(img, function (texture) {
            mat = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5})
            var geo = new THREE.SphereGeometry(r, wseg, hseg);

            var sphereObj = new THREE.Mesh(geo, mat);
            scene.add(sphereObj);
            callback(sphereObj);
        });
    }

    //returns the coordinates of the mouse intersection and the mouse's ray
    function get2DMousePos(event) {
        var mouse = {x: 0, y:0, z:0};
        var mouse_vector = new THREE.Vector3();
        var ray = new THREE.Raycaster( new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));


        // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        // mouse.y = - (event.clientY / window.innerHeight ) * 2 + 1;
        var rect = parent.getBoundingClientRect();
        var eventX = event.pageX - rect.left - window.pageXOffset - 3;
        var eventY = event.pageY - rect.top - window.pageYOffset - 3;

        mouse.x = ( eventX / parent.offsetWidth ) * 2 - 1;
        mouse.y = - ( eventY / (parent.offsetWidth / ratio)) * 2 + 1;
        ray.setFromCamera( mouse, camera );


        mouse_vector.set( mouse.x, mouse.y, mouse.z );
        mouse_vector.unproject(camera);

        var direction = mouse_vector.sub( camera.position ).normalize();
        ray.set( camera.position, direction );

        intersects = ray.intersectObject( plane );

        if( intersects.length ) {
            mouse_vector.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            return {vector2D: mouse_vector, ray2D:ray};
        } else {
            return {vector2D: null, ray2D:ray};
        }
    }

    //creates the GUI dom element and button functions
    function createGUI() {
        mainMenu = {
            "Show Force Arrows": true,
            "Sun Exists": true
        };

        gui = new dat.GUI({
            autoplace: true,
            width: 300,
            height: 300
        });

        parent.insertBefore(gui.domElement, parent.firstChild);
        gui.domElement.id = "gui";


        gui.add(mainMenu, "Show Force Arrows").onChange(function(newValue) {
            toggleForceArrows();
        });
        gui.add(mainMenu, "Sun Exists").onChange(function(newValue) {
            toggleSun();
        });
    }

    //mouse controls
    function initEventHandlers() {
        var mouse_vector = new THREE.Vector3();
        mouseStartVector = new THREE.Vector3(); //where the mouse started to press
        mouseEndVector = new THREE.Vector3(); //moue release location

        //check to see if clicked on either sun or moon
        function onMouseDown (event) {
            event.preventDefault();

            var pos2d = get2DMousePos(event);
            mouseStartVector = pos2d.vector2D;
            var mouseRay = pos2d.ray2D;

            intersects = mouseRay.intersectObject(moon);
            if (intersects.length){ //pressed on moon
                draggingMoon = true;
                particlesMoving = false;
            } else {
                intersects = mouseRay.intersectObject(sun);
                if (intersects.length){ //pressed on sun
                    draggingSun = true;
                    particlesMoving = false;
                }
            }

        }

        //stop dragging
        function onMouseUp(event) {
            draggingMoon = false;
            draggingSun = false;
        }

        //drag clicked object
        function onMouseMove(event){
            mouseEndVector = get2DMousePos(event).vector2D;
            if(draggingMoon && mouseEndVector != null){
                //calculated distance from origin
                var length = mouseEndVector.length();
                if(length > earthRadius+circleRadius*numCircles+moonRadius+atmosphereBuffer){
                    moon.position.x = mouseEndVector.x;
                    moon.position.y = mouseEndVector.y;
                    moon.position.z = mouseEndVector.z;
                }
            } else if (draggingSun && mouseEndVector != null){
                var length = mouseEndVector.length();
                if(length > earthRadius+circleRadius*numCircles+sunRadius+atmosphereBuffer){
                    sun.position.x = mouseEndVector.x;
                    sun.position.y = mouseEndVector.y;
                    sun.position.z = mouseEndVector.z;
                }
            }
        }

        parent.addEventListener('mousedown', onMouseDown);
        parent.addEventListener('mouseup', onMouseUp);
        parent.addEventListener("mousemove", onMouseMove);
    }

    //clear the destination position of all particles
    function clearEndPos(){
        water.forEach(function(thisSphere, i) {

            thisSphere.goal.x = thisSphere.start.x;
            thisSphere.goal.y = thisSphere.start.y;

            if (thisSphere.hasArrow){
                thisSphere.arrow.setLength(0);
                thisSphere.arrow.vector = new THREE.Vector3();
            }
        });
    }

    //modify the end position based on the passed in object 'massObj' and it's mass 'mass'
    function calculateEndPos(massObj, mass) {
        water.forEach(function(thisSphere, i) {
            //apply acceleration towards mass
            var direction = new THREE.Vector3().subVectors(massObj.position, thisSphere.start).normalize();

            // var distanceSq = moon.position.distanceToSquared(thisSphere.start);
            var distance = new THREE.Vector3();
            distance.add(massObj.position);
            distance.sub(thisSphere.start);
            var distanceMag = distance.length();
            distanceMag = distanceMag+10;
            var distanceSq = Math.pow(distanceMag, 2);

            var accel = G * mass / distanceSq;

            var directionVector = direction.clone().multiplyScalar(accel*2.5); //make distances more apparent

            thisSphere.goal.add(directionVector);

            //force arrow stuff
            if(thisSphere.hasArrow){
                var arrowLen = accel*20-1; //make arrow scale more apparent
                if (arrowLen < 0) {
                    arrowLen = 0;
                }
                var currVector = thisSphere.arrow.vector.normalize().multiplyScalar(thisSphere.arrow.line.scale.y/.8);
                var newVector = direction.clone().normalize().multiplyScalar(arrowLen);
                thisSphere.arrow.vector = currVector.add(newVector);

                thisSphere.arrow.setLength(thisSphere.arrow.vector.length());
                // console.log(arrowLen + "/" + );        }
                thisSphere.arrow.setDirection(thisSphere.arrow.vector.normalize());
            }
        });
    }

    //the particles will reach their final destination after 'timeToDest' frames
    function calculateSpeeds(timeToDest) { //figure out where each of the particles should be
        water.forEach(function(thisSphere, i) {
            var distance = new THREE.Vector3();
            distance.add(thisSphere.goal);
            distance.sub(thisSphere.position);
            distance.divideScalar(timeToDest);

            thisSphere.speed = distance;
        });
    }

    //turns off and on the force vectors
    function toggleForceArrows(){
        water.forEach(function(thisSphere, i) {
            if(thisSphere.hasArrow) {
                if(forceArrowsShown){
                    scene.remove(thisSphere.arrow);
                } else {
                    scene.add(thisSphere.arrow);
                }
            }
        });
        forceArrowsShown = !forceArrowsShown;
    }

    //turns off and on the sun
    function toggleSun(){
        sun.material.visible = !sun.material.visible;
    }

    //moves the particles one step towards their destination
    function moveParticles() {
        water.forEach(function(thisSphere, i) {
            var distance = new THREE.Vector3();
            distance.add(thisSphere.goal);
            distance.sub(thisSphere.position);
            var distanceMag = distance.length();
            var speedMag = thisSphere.speed.length();
            if(distanceMag > speedMag){
                thisSphere.position.x += thisSphere.speed.x;
                thisSphere.position.y += thisSphere.speed.y;
                if(thisSphere.hasArrow){
                    thisSphere.arrow.position.x = thisSphere.position.x;
                    thisSphere.arrow.position.y = thisSphere.position.y;
                }
            }
        });
    }

    //render the scene
    function render() {
        requestAnimationFrame( render );

        clearEndPos();
        if (moon) {
            calculateEndPos(moon, moonMass);
        }
        if (sun && sun.material.visible){
            calculateEndPos(sun, sunMass);
        }
        calculateSpeeds(movementFrames);

        moveParticles();
        if (sun) {
            sun.rotation.y += .01;
        }
        if (moon) {
            moon.rotation.y += .01;
        }
        renderer.render( scene, camera );
    }

    init();
    render();
    toggleForceArrows();
});
