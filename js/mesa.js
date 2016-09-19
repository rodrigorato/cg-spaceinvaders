var camera, scene, renderer;
var geometry, material, mesh;

function render(){
	'use strict';
	renderer.render(scene, camera);
}



function addTableLeg(obj, x, y, z){
	'use strict';
	geometry = new THREE.CubeGeometry(2, 6, 2);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y - 3, z);
	obj.add(mesh);
}

function addTableTop(obj, x, y, z){
	'use strict';
	geometry = new THREE.CubeGeometry(60, 2, 20);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function createTable(x, y, z){
	'use strict';
	var table = new THREE.Object3D();
	material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
	
	addTableTop(table, 0, 0, 0);
	addTableLeg(table, -25, -1, -8);
	addTableLeg(table, -25, -1, 8);
	addTableLeg(table, 25, -1, 8);
	addTableLeg(table, 25, -1, -8);

	scene.add(table);
	
	table.position.x = x;
	table.position.y = y;
	table.position.z = z;
}

function createScene(){
  'use strict';
  scene = new THREE.Scene();
  scene.add(new THREE.AxisHelper(10));
  createTable(0, 0, 0);
}

function createCamera(){
	'use strict';
	camera = new THREE.PerspectiveCamera(70,
										 window.innerWidth/window.innerHeight,
										 1,
										 1000);
	camera.position.x = 50;
	camera.position.y = 50;
	camera.position.z= 50;
	camera.lookAt(scene.position);

}

function init(){
  'use strict';
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  createScene();
  createCamera();
  render();
}
