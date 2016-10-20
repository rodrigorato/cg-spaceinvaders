/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

class HasPhysics extends THREE.Object3D {
	constructor(x,y,z){
		super();
		this.position.set(x,y,z);
	}

	createCube(x, y, z, dx, dy, dz, material){
		var geometry = new THREE.CubeGeometry(dx,dy,dz);
		// cria um novo material para cada um para evitar colisoes ao dar toggle ao wireframe
		var mesh = new THREE.Mesh(geometry, material); 
		mesh.position.set(x,y,z);
		this.add(mesh);
	}

	createCylinder(x, y, z, radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, material){
		var temp_geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
		var mesh = new THREE.Mesh(temp_geom, material); 
		mesh.position.set(x, y, z);
		this.add(mesh);
	}	
}