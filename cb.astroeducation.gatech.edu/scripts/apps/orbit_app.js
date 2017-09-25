require(['three', 'dat.gui'], function(THREE, dat) {
    var scene, camera, renderer, geometry, material, cube, plane, spheres = [];

    var madeObject; //bool
    var mouseStartVector, mouseEndVector, activeSphere, isActiveSphere = false, activeArrow, isActiveArrow = false;
    var state = 0; //0 = can create mass, 1 = can shoot mass

    var G = 6.67408; //grav constant

    //adjusting vars/free params
    var initVelMult = 2.5, accelMult = 1, velMult = .01, centerMass = .1, minRadius = 5, maxRadius = 50, minMoonSize = .025;
    var ratio = 16 / 9;

    //debug vars
    var intersects, dist;

    //gui vars
    var mainMenu, gui;

    var isGUI = false;

    function init() {
        //add to html
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

        var ambientLight = new THREE.AmbientLight(0x888888);
        scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 0, -100000);
        scene.add(directionalLight);

        camera.position.z = 3;
        initEventHandlers();

        //create center mass
        addSphereTexture(.1, 16, 16, '/images/earth_color.jpg', function (sphere) {
            cube = sphere;
            cube.rotation.x += .5;
            cube.rotation.z += .1;
        });

        parent.children[0].id = "canvasArea";
        createStarfield();
    }

    //Creates the GUI
    function createGUI() {
        mainMenu = {
            "Add Example 1": function(){
                addTestSphere(-.7, 0, -0.1, 0, 2.1, 0);
            },
            "Add Example 2": function(){
                addTestSphere(0, .5, -0.1, -1, .2, 0);
            },
            "Clear": function() {
                state = 0;
                isActiveSphere = 0;
                isActiveArrow = 0;
                scene.remove(activeSphere);
                spheres.forEach(function(thisSphere) {
                    scene.remove(thisSphere);
                });
                activeSphere = null;
                spheres = [];
            }
        };

        gui = new dat.GUI({
            autoplace: true,
            width: 300,
            height: 300
        });

        parent.insertBefore(gui.domElement, parent.firstChild);
        gui.domElement.id = "gui";
        // gui.add(mainMenu, "Show Force Arrows").onChange(function(newValue) {
        //     toggleForceArrows();
        // });
        gui.add(mainMenu, "Add Example 1");
        gui.add(mainMenu, "Add Example 2");
        gui.add(mainMenu, "Clear");
    }

    //Adds a starry background to the app
    function createStarfield(){
        //load texture
        var loader = new THREE.TextureLoader();
        loader.load('/images/galaxy_starfield.png', function (texture) {
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
    function addSphere(r, wseg, hseg){
        var geo = new THREE.SphereGeometry(r, wseg, hseg);
        var mat = new THREE.MeshLambert( { color: 0x00ff00, wireframe:true } );
        var sphereObj = new THREE.Mesh(geo, mat);
        scene.add(sphereObj);
        return(sphereObj);
    }

    //add a 3d sphere with a solid color 'colorHex' to the scene with radius 'r' and segments 'wseg' and 'hseg'
    //returns the sphere
    function addSphereColor(r, wseg, hseg, colorHex){ //color
        var geo = new THREE.SphereGeometry(r, wseg, hseg);
        var mat = new THREE.MeshLambertMaterial( { color: colorHex } );
        var sphereObj = new THREE.Mesh(geo, mat);
        scene.add(sphereObj);
        return(sphereObj);
    }

    //add a 3d sphere with a texture 'img' to the scene with radius 'r' and segments 'wseg' and 'hseg'
    //returns the sphere
    function addSphereTexture(r, wseg, hseg, img, callback){
        var loader = new THREE.TextureLoader();
        var mat;
        loader.load(img, function (texture) {
            mat = new THREE.MeshLambertMaterial({map: texture, overdraw: 0.5})
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

    //mouse controls
    var initEventHandlers = function () {
        var mouse_vector = new THREE.Vector3();
        mouseStartVector = new THREE.Vector3();
        mouseEndVector = new THREE.Vector3();

        var mouse = { x: 0, y: 0, z: 0 };

        //creates either the sphere or the velocity arrow
        function onMouseDown (event) {
            event.preventDefault();

            var pos2d = get2DMousePos(event);
            mouseStartVector = pos2d.vector2D;
            var mouseRay = pos2d.ray2D;
            if (document.elementFromPoint(event.clientX, event.clientY).id != "canvasArea") { //intersects with GUI
                // console.log("hit gui");
            } else if( state == 0){
                if(mouseStartVector != null) {
                    mouseStartVector.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);

                    //random color
                    var letters = '46789ABC';
                    var color = '#';
                    for (var i = 0; i < 6; i++ ) {
                       color += letters[Math.floor(Math.random() * letters.length)];
                    }


                    activeSphere = addSphereColor(minMoonSize, 16, 16, color);//addCube (.1, .1, .1);
                    activeSphere.position.x = mouseStartVector.x;
                    activeSphere.position.y = mouseStartVector.y;
                    activeSphere.position.z = mouseStartVector.z;
                    isActiveSphere = true;
                    activeSphere.velocity = new THREE.Vector3();
                    activeSphere.mass = 1;
                }
            } else if (state == 1){ //create arrow vectorvar dir = new THREE.Vector3( 1, 0, 0 );
                intersects = mouseRay.intersectObject(activeSphere);
                if (intersects.length){
                    var origin = intersects[0].object.position;
                    dist = new THREE.Vector3();
                    dist.add(mouseStartVector);
                    dist.sub(origin);
                    var length = dist.length();
                    var dir = dist;
                    if (dir.length() == 0) {
                        dir.x = 1;
                        length = .01;
                    }
                    dir.normalize();
                    var hex = 0xffff00;

                    isActiveArrow = true;
                    activeArrow = new THREE.ArrowHelper( dir, origin, length, hex );
                    scene.add( activeArrow );
                }
            }

        }

        //starts the motion of the sphere or arrow
        function onMouseUp(event) {
            if (state == 0 && isActiveSphere){
                isActiveSphere = false;
                state = 1;
            } else if (state == 1 && isActiveArrow) {
                isActiveArrow = false;
                state = 0;
                modifyInitialVelocities(activeSphere);
                scene.remove(activeArrow);
                spheres.push(activeSphere);
            }
        }

        //resizes the sphere or arrow
        function onMouseMove(event){
            mouseEndVector = get2DMousePos(event).vector2D;
            if(isActiveSphere && state == 0){
                //the ray will return an array with length of 1 or greater if the mouse click
                //does touch the sphere object
                if( mouseEndVector != null ) {

                    dist = new THREE.Vector3();
                    dist.add(mouseStartVector);
                    dist.sub(mouseEndVector);

                    if (Math.abs(dist.x) > minMoonSize){
                        activeSphere.scale.x = dist.x*(1 / minMoonSize); //*10 because size .1
                        activeSphere.scale.y = dist.x*(1 / minMoonSize); //*10 because size .1
                        activeSphere.mass = Math.abs(dist.x*(1 / minMoonSize));
                        activeSphere.scale.z = dist.x*(1 / minMoonSize); //*10 because size .1
                        // if (dist.x <= .05 && dist.x >= -.05){ //if not rotating on z axis
                        // }
                    }
                    activeSphere.position.x = mouseEndVector.x+dist.x/2;
                    activeSphere.position.y = mouseEndVector.y+dist.y/2;
                    activeSphere.position.z = mouseEndVector.z+dist.z/2;

                }
            } else if (isActiveArrow && state == 1) {
                if (mouseEndVector != null){
                    dist = new THREE.Vector3();
                    dist.add(mouseEndVector);
                    dist.sub(activeArrow.position);
                    activeArrow.setLength(dist.length());
                    activeSphere.velocity = dist.clone().multiplyScalar(initVelMult);

                    // console.log(activeSphere.velocity);
                    activeArrow.setDirection(dist.normalize());
                }
            }
        }

        parent.addEventListener('mousedown', onMouseDown);
        parent.addEventListener('mouseup', onMouseUp);
        parent.addEventListener("mousemove", onMouseMove);
    }

    //adjusts the initial velocity of the sphere 'thisSphere' in an attempt to reduce error
    function modifyInitialVelocities(thisSphere) {
        var direction = new THREE.Vector3().subVectors(cube.position, thisSphere.position).normalize();
        var radiusSq = cube.position.distanceToSquared(thisSphere.position);

        var accel = G * centerMass / radiusSq;

        var tempVel = thisSphere.velocity.clone();
        tempVel.add(direction.clone().multiplyScalar(accel*accelMult));
        thisSphere.prevPos = thisSphere.position.clone()
        thisSphere.position.add(tempVel.multiplyScalar(velMult/2));
    }

    //move each sphere according to gravity
    function applyForces() {
        spheres.forEach(function(thisSphere, i) {

            //get direction
            var direction = new THREE.Vector3().subVectors(cube.position, thisSphere.position).normalize();

            var radiusSq = cube.position.distanceToSquared(thisSphere.position) + minRadius;
            // var radius = cube.position.distanceTo(thisSphere.position);

            //applyradius checks
            if (radiusSq < minRadius) {
                radiusSq = minRadius;
            } else if (radiusSq > maxRadius) {
                scene.remove(thisSphere);
                spheres.splice(i, 1);
            }
            var accel = G * centerMass / radiusSq;

            // //impl2: position verlet: http://young.physics.ucsc.edu/115/leapfrog.pdf
            // thisSphere.position.add(thisSphere.velocity.clone().multiplyScalar(velMult/2)); //x(n+1/2)
            // thisSphere.velocity.add(direction.clone().multiplyScalar(accel*accelMult)); //v(n+1)
            // thisSphere.position.add(thisSphere.velocity.clone().multiplyScalar(velMult/2)); //x(n+1)

            //impl1: Forest-Ruth: http://young.physics.ucsc.edu/115/leapfrog.pdf
            var theta = 1.35120719195966;
            thisSphere.position.add(thisSphere.velocity.clone().multiplyScalar(velMult/2 * theta)); //x(n+1/2)
            thisSphere.velocity.add(direction.clone().multiplyScalar(theta * accel*accelMult)); //v(n+1)
            thisSphere.position.add(thisSphere.velocity.clone().multiplyScalar(velMult/2 * (1-theta))); //x(n+1/2)
            thisSphere.velocity.add(direction.clone().multiplyScalar((1-2*theta) * accel*accelMult)); //v(n+1)
            thisSphere.position.add(thisSphere.velocity.clone().multiplyScalar(velMult/2 * (1-theta))); //x(n+1/2)
            thisSphere.velocity.add(direction.clone().multiplyScalar(theta * accel*accelMult)); //v(n+1)
            thisSphere.position.add(thisSphere.velocity.clone().multiplyScalar(velMult/2 * theta)); //x(n+1/2)
            thisSphere.velocity.add(direction.clone().multiplyScalar((-.41) * accel*accelMult)); //adjustment to make sure periodic motion works properly
        });
    }

    //create and set in motion a sphere with position 'xPos', 'yPos', 'zPos' and velocity 'xVel', 'yVel', 'zVel'
    function addTestSphere(xPos, yPos, zPos, xVel, yVel, zVel){
        var letters = '46789ABC';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
           color += letters[Math.floor(Math.random() * letters.length)];
        }

        var testSphere = addSphereColor(.1, 16, 16, color);//addCube (.1, .1, .1);
        testSphere.position.x = xPos;
        testSphere.position.y = yPos;
        testSphere.position.z = zPos;
        testSphere.velocity = new THREE.Vector3(xVel, yVel, zVel);
        testSphere.mass = 1;
        modifyInitialVelocities(testSphere);
        spheres.push(testSphere);
    }

    //render the scene
    function render() {
        requestAnimationFrame( render );
        if (cube) { cube.rotation.y += 0.01; }
        applyForces();
        renderer.render( scene, camera );
    }

    init();
    createGUI();
    render();
});
