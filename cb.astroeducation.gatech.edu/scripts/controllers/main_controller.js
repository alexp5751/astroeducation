define(['./module', 'three'], function(controllers, THREE, ThreeApp) {
    /** Creates all objects used in the background of the website, as
    this controller wraps all content on site. This includes the particle fields,
    the earth, moon, and earth's clouds. All so adds all relevant update
    steps, such as planets spinning and orbitting. */
    controllers.controller('MainController', function($rootScope, $scope, $state, ThreeApp, StateChangeManager) {
        var particles1 = new THREE.Geometry();
        var particles2 = new THREE.Geometry();
        var particles3 = new THREE.Geometry();
        var p_material1 = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 20,
            map: new THREE.TextureLoader().load("/images/staralpha.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        var p_material2 = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 20,
            map: new THREE.TextureLoader().load("/images/staralpha2.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        var p_material3 = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 20,
            map: new THREE.TextureLoader().load("/images/staralpha3.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        for (var p = 0; p < 30000; p++) {
            var pX1 = Math.random() * 5000 - 2500,
                pY1 = Math.random() * 5000 - 2500,
                pZ1 = Math.random() * 5000 - 2500,
                particle1 = new THREE.Vector3(pX1, pY1, pZ1);
            pX2 = Math.random() * 5000 - 2500,
                pY2 = Math.random() * 5000 - 2500,
                pZ2 = Math.random() * 5000 - 2500,
                particle2 = new THREE.Vector3(pX2, pY2, pZ2);
            pX3 = Math.random() * 5000 - 2500,
                pY3 = Math.random() * 5000 - 2500,
                pZ3 = Math.random() * 5000 - 2500,
                particle3 = new THREE.Vector3(pX3, pY3, pZ3);
            particles1.vertices.push(particle1);
            particles2.vertices.push(particle2);
            particles3.vertices.push(particle3);
        }

        var particle_system1 = new THREE.Points(
            particles1,
            p_material1);
        particle_system1.sortParticles = true;
        var particle_system2 = new THREE.Points(
            particles2,
            p_material2);
        particle_system2.sortParticles = true;
        var particle_system3 = new THREE.Points(
            particles3,
            p_material3);
        particle_system3.sortParticles = true;

        ThreeApp.addObject('main_particle_system_1', particle_system1);
        ThreeApp.addObject('main_particle_system_2', particle_system2);
        ThreeApp.addObject('main_particle_system_3', particle_system3);
        ThreeApp.addUpdate('main_particle_system_update', function() {
            particle_system1.rotation.y += 0.0001;
            particle_system2.rotation.y += 0.0001;
            particle_system3.rotation.y += 0.0001;
        });

        var light_a = new THREE.AmbientLight(0x888888);
        ThreeApp.addObject('ambient_light', light_a);

        var light_d = new THREE.DirectionalLight(0xffffff, 0.5);
        light_d.position.set(-1000, 100, 0);
        ThreeApp.addObject('directional_light', light_d);


        if (!ThreeApp.getObject('earth')) {
            var earth = THREE.Planets.createEarth(10);
            earth.position.set(1000, 0, 30)
            ThreeApp.addObject('earth', earth);

            var loader = new THREE.TextureLoader()

            var clouds1 = new THREE.Mesh(
                new THREE.SphereGeometry(10.1, 32, 32),
                new THREE.MeshPhongMaterial({
                    map: loader.load('/images/fair_clouds_4k.png'),
                    transparent: true,
                    depthWrite: false
                })
            );

            var clouds2 = new THREE.Mesh(
                new THREE.SphereGeometry(10.1, 32, 32),
                new THREE.MeshPhongMaterial({
                    map: loader.load('/images/fair_clouds_4k.png'),
                    transparent: true,
                    depthWrite: false
                })
            );
            clouds1.position.set(1000, 0, 30);
            clouds2.position.set(1000, 0, 30);
            clouds2.rotation.z += 180;
            ThreeApp.addObject('clouds1', clouds1);
            ThreeApp.addObject('clouds2', clouds2);

        }

        if (!ThreeApp.getObject('moon')) {
            var moon = THREE.Planets.createMoon(2.5);
            moon.position.set(1000, 0, 30)
            ThreeApp.addObject('moon', moon);

            ThreeApp.addUpdate('moon_rotate', function() {
                moon.rotation.y += 0.0015;
            });

            var moon_rotate = new TWEEN.Tween({
                    t: 0
                })
                .to({
                    t: 2 * Math.PI
                }, 100000)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(function() {
                    moon.position.set(
                        1000 - 50 * Math.cos(this.t),
                        0,
                        30 + 50 * Math.sin(this.t))
                }).repeat(Infinity);
            ThreeApp.addTween('moon_orbit', moon_rotate);
        }
    });
});
