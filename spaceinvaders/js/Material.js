/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/


var MATERIALS_BASIC = {
	'red': 			new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: false }),
	'green': 		new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: false }),
	'blue': 		new THREE.MeshBasicMaterial({color: 0x0000FF, wireframe: false }),
	'black': 		new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false }),
	'white': 		new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: false }),
	'lightblue': 	new THREE.MeshBasicMaterial({color: 0x00E5FF, wireframe: false }),
	'purpleish': 	new THREE.MeshBasicMaterial({color: 0x5D1BD1, wireframe: false }),
	'grey': 		new THREE.MeshBasicMaterial({color: 0x555555, wireframe: false })
}

var MATERIALS_GOURAUD = {
	'red': 			new THREE.MeshPhongMaterial({color: 0xFF0000, wireframe: false }),
	'green': 		new THREE.MeshPhongMaterial({color: 0x00FF00, wireframe: false }),
	'blue': 		new THREE.MeshPhongMaterial({color: 0x0000FF, wireframe: false }),
	'black': 		new THREE.MeshPhongMaterial({color: 0x000000, wireframe: false }),
	'white': 		new THREE.MeshPhongMaterial({color: 0xFFFFFF, wireframe: false }),
	'lightblue': 	new THREE.MeshPhongMaterial({color: 0x00E5FF, wireframe: false }),
	'purpleish': 	new THREE.MeshPhongMaterial({color: 0x5D1BD1, wireframe: false }),
	'grey': 		new THREE.MeshPhongMaterial({color: 0x555555, wireframe: false })
}

var MATERIALS_PHONG = {
	'red': 			new THREE.MeshPhongMaterial({color: 0xFF0000, wireframe: false }),
	'green': 		new THREE.MeshPhongMaterial({color: 0x00FF00, wireframe: false }),
	'blue': 		new THREE.MeshPhongMaterial({color: 0x0000FF, wireframe: false }),
	'black': 		new THREE.MeshPhongMaterial({color: 0x000000, wireframe: false }),
	'white': 		new THREE.MeshPhongMaterial({color: 0xFFFFFF, wireframe: false }),
	'lightblue': 	new THREE.MeshPhongMaterial({color: 0x00E5FF, wireframe: false }),
	'purpleish': 	new THREE.MeshPhongMaterial({color: 0x5D1BD1, wireframe: false }),
	'grey': 		new THREE.MeshPhongMaterial({color: 0x555555, wireframe: false })
}

var MATERIALS = MATERIALS_BASIC;/*{
	'red': 			new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: false }),
	'green': 		new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: false }),
	'blue': 		new THREE.MeshBasicMaterial({color: 0x0000FF, wireframe: false }),
	'black': 		new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false }),
	'white': 		new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: false }),
	'lightblue': 	new THREE.MeshBasicMaterial({color: 0x00E5FF, wireframe: false }),
	'purpleish': 	new THREE.MeshBasicMaterial({color: 0x5D1BD1, wireframe: false }),
	'grey': 		new THREE.MeshBasicMaterial({color: 0x555555, wireframe: false })
}*/

var MATERIALS_INUSE = MATERIALS;
var fancyMaterial = 'phong';

/*
class MaterialManager(){
	constructor(listOfColors){
		this.materialList = [];
		if(listOfColors != null)
			for(var color in listOfColors)
				addMeshBasicMaterial(listOfColors[color].name, listOfColors[color].hex);
	}

	addMeshBasicMaterial(name, hexCode){

	}
}
*/