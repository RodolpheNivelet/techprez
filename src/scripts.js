var scene, camera, renderer, canvas, loader, controls, floor, light, stats, mixer, frontLight;
var geometry, material;
var clock = new THREE.Clock();

var cubeContainer, cube;

window.addEventListener('load', init, false);

function init() {
  renderScene();
  animate();
}

function renderScene() {

  scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xFFFFFF, 0, 750 );

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xFFFFFF );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.shadowMap.enabled = true;

  renderedSize();

  stats = new Stats();
	document.body.appendChild( stats.dom );

  canvas = renderer.domElement;
  document.body.appendChild( canvas );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set(0, 0, 30);

  controls = new THREE.OrbitControls( camera, canvas );

  (function() { // LIGHTS
    var ambientLight = new THREE.AmbientLight( 0x666666 );
    scene.add( ambientLight );

    light = new THREE.DirectionalLight( 0xAAAAAA, .7, 100 );
    light.position.set( .5, 1, 0 );
    light.castShadow = true;
    light.shadow.camera.near = -30;
    light.shadow.camera.left = -30;
    light.shadow.camera.bottom = -30;
    light.shadow.camera.right = 30;
    light.shadow.camera.top = 30;
    scene.add( light );

    light = new THREE.DirectionalLight( 0xAAAAAA, .2, 100 );
    light.position.set( -.5, 1, .1 );
    light.castShadow = true;
    light.shadow.camera.near = -30;
    light.shadow.camera.left = -30;
    light.shadow.camera.bottom = -30;
    light.shadow.camera.right = 30;
    light.shadow.camera.top = 30;
    scene.add( light );

    frontLight = new THREE.PointLight( 0xAAAAAA, .8, 100 );
    scene.add( frontLight );
  }());

  (function() { // FLOOR
    geometry = new THREE.PlaneGeometry( 10000, 10000 );

  	// do something with the texture
    material = new THREE.MeshPhongMaterial( {
      color: 0xdddddd
  	});
    floor = new THREE.Mesh( geometry, material );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = -20;
    scene.add( floor );

  }());

  cubeContainer = new THREE.Object3D();
  scene.add( cubeContainer );

  // create an animation sequence with the tracks
	// If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
  var position = new THREE.VectorKeyframeTrack( '.position', [ 2, 3.6, 4 ], [ 0, -30, 0, 0, 1, 0, 0, 0, 0 ], THREE.InterpolateSmooth );
	var clip = new THREE.AnimationClip( 'Action', 4, [ position ] );

	// setup the AnimationMixer
	mixer = new THREE.AnimationMixer( cubeContainer );

	// create a ClipAction and set it to play
	var clipAction = mixer.clipAction( clip );
  clipAction.setLoop(THREE.LoopOnce);
  clipAction.play();

  loader = new THREE.TextureLoader();

  loader.load(
    './images/mongo.jpg',
    function(texture) {
      var materialFace = new THREE.MeshPhongMaterial( {
        color: 0xFFFFFF,
        emissive: 0x000000,
        map: texture,
        bumpMap: texture
      });
      var materialSide = new THREE.MeshBasicMaterial( {
        color: 0x222222
      });
      geometry = new THREE.CubeGeometry( 10, 10, 1 );
      cube = new THREE.Mesh( geometry, [
        materialSide, materialSide,
        materialSide, materialSide,
        materialFace, materialFace
      ] );
      cube.position.set(0, 0, 0);
      cube.castShadow = true;
      cubeContainer.add(cube);
      controls.target = cube.position.clone();
    }
  );

}

function animate() {
  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  cubeContainer.rotation.y += 0.02;
  controls.update(delta);
  if ( mixer ) {
		mixer.update( delta );
	}
  frontLight.position.set(camera.position.clone());
  stats.update();
  render();
}

function render() {
  renderer.render( scene, camera );
}

window.addEventListener('resize', onWindowResize);

function renderedSize() {
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function cameraSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
}

function onWindowResize() {
  renderedSize();
  cameraSize();
  camera.updateProjectionMatrix();
};
