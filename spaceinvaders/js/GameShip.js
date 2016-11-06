/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

class GameShip extends HasPhysics {
	constructor(x,y,z){
		'use strict';
		super(x,y,z);
		this.size = {'x': 90, 'y': 80, 'z': 25};
		this.accel = {'x': 4000, 'y': 0, 'z': 0};	
		this.boundingSphereRadius = 56;
		this.moving = {'left': false, 'right': false};
		this.shootRules = {'shooting': false, 'timeBetweenShots': 0.15, 'bulletTime': 0.15};
	}	

	static getSize(){ 
		return {'x': 90, 'y': 80, 'z': 25};
	}

	shoot(dt){
		this.shootRules.bulletTime += dt;
		var bullet = null;
		if(this.shootRules.shooting && this.shootRules.bulletTime >= this.shootRules.timeBetweenShots){
			bullet = new GameBullet(this.position.x,
									this.position.y + this.size.y/2,
									this.position.z);
			this.shootRules.bulletTime = 0;
		}
		return bullet;
	}

	calculateVel(dt){
		var newVel = {'x': 0, 'y': 0, 'z': 0};
		if(!this.moving.left && !this.moving.right && Math.abs(this.vel.x) <= this.accel.x / 20){
			// It's stopped
			newVel.x = 0;
		} else if((!this.moving.left && this.vel.x <= 0) || (!this.moving.right && this.vel.x > 0)){
			// It's slowing down
			newVel.x = this.calcVelEq(this.vel.x, (this.vel.x > 0 ? -1 : 1) * this.accel.x , dt);
		}
		if(this.moving.left || this.moving.right){
			// It's moving
			newVel.x = this.calcVelEq(this.vel.x, (this.moving.left ? -1 : 1) * this.accel.x , dt);
		}
		return newVel;
	}
	
	
	calculatePosition(dt){
		var hitWall = this.hitTheWalls(dt);
		var newPos = {'x': 0, 'y': this.position.y, 'z': this.position.z};
		if(hitWall == 'l'){
			newPos.x = this.size.x / 2;
			this.vel.x = 0;
		} else if(hitWall == 'r'){
			newPos.x = SpaceInvaders.getGameSize().x - this.size.x / 2;
			this.vel.x = 0;
		} else 
			return hitWall;
		return newPos;
	}

	createTriangleMesh(listOfVertices, posX, posY, posZ, material){
		var triangleGeometry = new THREE.Geometry();
		material.side = THREE.DoubleSide; // TO-DO: OPTIMIZE

		for(var vert in listOfVertices)
			triangleGeometry.vertices.push(listOfVertices[vert]);

		triangleGeometry.faces.push(new	THREE.Face3(0, 1, 2));
		triangleGeometry.computeFaceNormals();

		var triangleMesh = new THREE.Mesh(triangleGeometry, material);
		triangleMesh.position.set(posX, posY, posZ);

		this.add(triangleMesh);
	}

	createObject(material_obj){
		'use strict';

		var material_type_obj = (material_obj == null ? MATERIALS : material_obj);


		// Example Face
		/*
		this.createTriangleMesh([new THREE.Vector3(),
								 new THREE.Vector3(),
								 new THREE.Vector3()],
								 0, 0, 0, material_type_obj.blue); 
		*/

		// Main part - top
		this.createTriangleMesh([new THREE.Vector3(-15,30,10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(15,30,10)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(-15,30,10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(-15,-30,10)],
								 0, 0, 0, material_type_obj.blue); 

		// Main part - bottom
		this.createTriangleMesh([new THREE.Vector3(-15,30,-10),
								 new THREE.Vector3(15,-30,-10),
								 new THREE.Vector3(15,30,-10)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(-15,30,-10),
								 new THREE.Vector3(15,-30,-10),
								 new THREE.Vector3(-15,-30,-10)],
								 0, 0, 0, material_type_obj.blue); 

		// Main part - front
		this.createTriangleMesh([new THREE.Vector3(-15,30,10),
								 new THREE.Vector3(15,30,10),
								 new THREE.Vector3(-15,30,-10)],
								 0, 0, 0, material_type_obj.blue);

		this.createTriangleMesh([new THREE.Vector3(15,30,10),
								 new THREE.Vector3(-15,30,-10),
								 new THREE.Vector3(15,30,-10)],
								 0, 0, 0, material_type_obj.blue);

		// Main part - back
		this.createTriangleMesh([new THREE.Vector3(-15,-30,10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(-15,-30,-10)],
								 0, 0, 0, material_type_obj.blue);

		this.createTriangleMesh([new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(-15,-30,-10),
								 new THREE.Vector3(15,-30,-10)],
								 0, 0, 0, material_type_obj.blue)

		// Main part - left
		this.createTriangleMesh([new THREE.Vector3(-15,30,10),
								 new THREE.Vector3(-15,-30,10),
								 new THREE.Vector3(-15,30,-10)],
								 0, 0, 0, material_type_obj.blue);

		this.createTriangleMesh([new THREE.Vector3(-15,30,-10),
								 new THREE.Vector3(-15,-30,10),
								 new THREE.Vector3(-15,-30,-10)],
								 0, 0, 0, material_type_obj.blue);

		// Main part - right
		this.createTriangleMesh([new THREE.Vector3(15,30,10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(15,30,-10)],
								 0, 0, 0, material_type_obj.blue);

		this.createTriangleMesh([new THREE.Vector3(15,30,-10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(15,-30,-10)],
								 0, 0, 0, material_type_obj.blue);

		// Rear end - top
		this.createTriangleMesh([new THREE.Vector3(-45,-10,0),
								 new THREE.Vector3(45,-20,0),
								 new THREE.Vector3(45,-10,0)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(-45, -10, 0),
								 new THREE.Vector3(45, -20, 0),
								 new THREE.Vector3(-45, -20, 0)],
								 0, 0, 0, material_type_obj.blue); 

		// Rear end - bottom
		this.createTriangleMesh([new THREE.Vector3(-45,-10,-10),
								 new THREE.Vector3(45,-20,-10),
								 new THREE.Vector3(45,-10,-10)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(-45, -10, -10),
								 new THREE.Vector3(45, -20, -10),
								 new THREE.Vector3(-45, -20, -10)],
								 0, 0, 0, material_type_obj.blue); 

		// Rear end - back
		this.createTriangleMesh([new THREE.Vector3(-45,-20,0),
								 new THREE.Vector3(45,-20,-10),
								 new THREE.Vector3(45,-20,0)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(-45, -20, 0),
								 new THREE.Vector3(-45, -20, -10),
								 new THREE.Vector3(45, -20, -10)],
								 0, 0, 0, material_type_obj.blue);

		// Rear end - front
		this.createTriangleMesh([new THREE.Vector3(-45,-10,0),
								 new THREE.Vector3(45,-10,-10),
								 new THREE.Vector3(45,-10,0)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(-45, -10, 0),
								 new THREE.Vector3(-45, -10, -10),
								 new THREE.Vector3(45, -10, -10)],
								 0, 0, 0, material_type_obj.blue);

		// Rear end - left
		this.createTriangleMesh([new THREE.Vector3(-45,-10,0),
								 new THREE.Vector3(-45,-20,0),
								 new THREE.Vector3(-45,-10,-10)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(-45, -10, -10),
								 new THREE.Vector3(-45, -20, -10),
								 new THREE.Vector3(-45, -20, 0)],
								 0, 0, 0, material_type_obj.blue);

		// Rear end - right
		this.createTriangleMesh([new THREE.Vector3(45,-10,0),
								 new THREE.Vector3(45,-20,0),
								 new THREE.Vector3(45,-10,-10)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(45, -10, -10),
								 new THREE.Vector3(45, -20, -10),
								 new THREE.Vector3(45, -20, 0)],
								 0, 0, 0, material_type_obj.blue);

		// Right back cube - top
		this.createTriangleMesh([new THREE.Vector3(45, -20, 0),
								 new THREE.Vector3(35, -20, 0),
								 new THREE.Vector3(45, -30, 0)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(45, -30, 0),
								 new THREE.Vector3(35,-20,0),
								 new THREE.Vector3(35,-30,0)],
								 0, 0, 0, material_type_obj.blue); 

		// Right back cube - bottom
		this.createTriangleMesh([new THREE.Vector3(45, -20, -10),
								 new THREE.Vector3(35, -20, -10),
								 new THREE.Vector3(45, -30, -10)],
								 0, 0, 0, material_type_obj.blue); 

		this.createTriangleMesh([new THREE.Vector3(45, -30, -10),
								 new THREE.Vector3(35,-20,-10),
								 new THREE.Vector3(35,-30,-10)],
								 0, 0, 0, material_type_obj.blue); 

		// Right back cube - left
		this.createTriangleMesh([new THREE.Vector3(35, -20, 0),
								 new THREE.Vector3(35, -30, 0),
								 new THREE.Vector3(35, -20, -10)],
								 0, 0, 0, material_type_obj.blue);
		this.createTriangleMesh([new THREE.Vector3(45),
								 new THREE.Vector3(),
								 new THREE.Vector3()],
								 0, 0, 0, material_type_obj.blue);
		
		//this.createCube(0,   0,  0, 30, 60, 20, material_type_obj.blue);
		//this.createCube(0, -15, -5, 90, 10, 10, material_type_obj.blue);

		//this.createCube( 40, -25, -5, 10, 10, 10, material_type_obj.blue);
		//this.createCube(-40, -25, -5, 10, 10, 10, material_type_obj.blue);

		//this.createCylinder(-30,  -5, -5, 0,  5, 10, 3, 2,  true, material_type_obj.purpleish);
		//this.createCylinder( 30,  -5, -5, 0,  5, 10, 3, 2,  true, material_type_obj.purpleish);
		//this.createCylinder(  0, -35, -5, 5,  0, 10, 3, 2,  true, material_type_obj.red);
		//this.createCylinder(  0,  40,  0, 0, 10, 20, 3, 2,  true, material_type_obj.purpleish);

		//this.createCylinder(  0,  10, 10, 5,  5, 20, 3, 2, false, material_type_obj.white);
		
	}
}
