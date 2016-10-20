/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

var MATERIALS = {
	'red': 			new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true }),
	'green': 		new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true }),
	'blue': 		new THREE.MeshBasicMaterial({color: 0x0000FF, wireframe: true }),
	'black': 		new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true }),
	'white': 		new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true }),
	'lightblue': 	new THREE.MeshBasicMaterial({color: 0x00E5FF, wireframe: true }),
	'purpleish': 	new THREE.MeshBasicMaterial({color: 0x5D1BD1, wireframe: true }),	

}

class GameAlien extends HasPhysics{
	constructor(x,y,z){
	super(x,y,z);
	this.createCube(0,     5, 0, 10, 30, 25, MATERIALS.red);//paralelipepedo central
	this.createCube(-15,   0, 0, 10, 10, 25, MATERIALS.red);//cubos
	this.createCube(+15,   0, 0, 10, 10, 25, MATERIALS.red);

	this.createCube(+10,  +7.5, 0, 10,  5, 25, MATERIALS.red);//paralelipipedos mini
	this.createCube(-10,  +7.5, 0, 10,  5, 25, MATERIALS.red);

	this.createCube(+7.5, +12.5, 0,  5,  5, 25, MATERIALS.red);//cubos altos
 	this.createCube(-7.5, +12.5, 0,  5,  5, 25, MATERIALS.red);
	this.createCube(+7.5,  -2.5, 0,  5,  5, 25, MATERIALS.red);
	this.createCube( -7.5,  -2.5, 0,  5,  5, 25, MATERIALS.red);
	
	this.createCube(+12.5,  -7.5, 0,  5,  5, 15, MATERIALS.red);//pata direita
	this.createCube(+17.5, -12.5, 0,  5,  5, 15, MATERIALS.red);
	this.createCube(+12.5, -17.5, 0,  5,  5, 15, MATERIALS.red);
	this.createCube(-12.5,  -7.5, 0,  5,  5, 15, MATERIALS.red);//pata esquerda
	this.createCube(-17.5, -12.5, 0,  5,  5, 15, MATERIALS.red);
	this.createCube(-12.5, -17.5, 0,  5,  5, 15, MATERIALS.red);

	this.createCube(-7.5,   2.5, 0,  5, 5,  25, MATERIALS.white);
	this.createCube( 7.5,   2.5, 0,  5, 5,  25, MATERIALS.white);
	}	
}