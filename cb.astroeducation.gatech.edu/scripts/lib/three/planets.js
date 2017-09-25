define(['three'], function(THREE) {
    THREE.Planets = {}
    var loader = new THREE.TextureLoader();

    THREE.Planets.createSun = function() {
        var geometry = new THREE.SphereGeometry(20, 32, 32)
        var texture = loader.load('/images/sunmap.jpg')
        var material = new THREE.MeshPhongMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 1.5,
        })
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    THREE.Planets.createMercury = function() {
        var geometry = new THREE.SphereGeometry(20, 32, 32)
        var material = new THREE.MeshPhongMaterial({
            map: loader.load('/images/mercurymap.jpg'),
            bumpMap: loader.load('/images/mercurybump.jpg'),
            bumpScale: 1.5,
        })
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    THREE.Planets.createVenus = function() {
        var geometry = new THREE.SphereGeometry(20, 32, 32)
        var material = new THREE.MeshPhongMaterial({
            map: loader.load('/images/venusmap.jpg'),
            bumpMap: loader.load('/images/venusbump.jpg'),
            bumpScale: 0.005,
        })
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    THREE.Planets.createEarth = function(radius) {
        var geometry = new THREE.SphereGeometry(radius, 32, 32)
        var material = new THREE.MeshPhongMaterial({
            map: loader.load('/images/earthmap1k.jpg'),
            bumpMap: loader.load('/images/earthbump1k.jpg'),
            bumpScale: radius / 10,
            specularMap: loader.load('/images/earthspec1k.jpg'),
            specular: new THREE.Color(0x444444),
        })
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    THREE.Planets.createMoon = function(radius) {
        var geometry = new THREE.SphereGeometry(radius, 32, 32)
        var material = new THREE.MeshPhongMaterial({
            map: loader.load('/images/moonmap1k.jpg'),
            bumpMap: loader.load('/images/moonbump1k.jpg'),
            bumpScale: radius / 10,
        })
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    THREE.Planets.createMars = function() {
        var geometry = new THREE.SphereGeometry(20, 32, 32)
        var material = new THREE.MeshPhongMaterial({
            map: loader.load('/images/marsmap1k.jpg'),
            bumpMap: loader.load('/images/marsbump1k.jpg'),
            bumpScale: 0.05,
        })
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    THREE.Planets.createJupiter = function() {
        var geometry = new THREE.SphereGeometry(20, 32, 32)
        var texture = loader.load('/images/jupitermap.jpg')
        var material = new THREE.MeshPhongMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 0.02,
        })
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }
});
