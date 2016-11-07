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

	createTriangleMesh(listOfVertices, posX, posY, posZ, material, ind0, ind1, ind2){
		var triangleGeometry = new THREE.Geometry();
		//material.side = THREE.DoubleSide; // TO-DO: OPTIMIZE

		for(var vert in listOfVertices)
			triangleGeometry.vertices.push(listOfVertices[vert]);

		triangleGeometry.faces.push(new	THREE.Face3(ind0, ind1, ind2));
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
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 
		*/

		// Main part - top
		this.createTriangleMesh([new THREE.Vector3(-15,30,10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(15,30,10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 
		this.createTriangleMesh([new THREE.Vector3(-15,30,10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(-15,-30,10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 

		// Main part - bottom
		this.createTriangleMesh([new THREE.Vector3(-15,30,-10),
								 new THREE.Vector3(15,-30,-10),
								 new THREE.Vector3(15,30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 
		this.createTriangleMesh([new THREE.Vector3(-15,30,-10),
								 new THREE.Vector3(15,-30,-10),
								 new THREE.Vector3(-15,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 

		// Main part - front
		this.createTriangleMesh([new THREE.Vector3(-15,30,10),
								 new THREE.Vector3(15,30,10),
								 new THREE.Vector3(-15,30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);
		this.createTriangleMesh([new THREE.Vector3(15,30,10),
								 new THREE.Vector3(-15,30,-10),
								 new THREE.Vector3(15,30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);

		// Main part - back
		this.createTriangleMesh([new THREE.Vector3(-15,-30,10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(-15,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);
		this.createTriangleMesh([new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(-15,-30,-10),
								 new THREE.Vector3(15,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);
		// Main part - left
		this.createTriangleMesh([new THREE.Vector3(-15,30,10),
								 new THREE.Vector3(-15,-30,10),
								 new THREE.Vector3(-15,30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);
		this.createTriangleMesh([new THREE.Vector3(-15,30,-10),
								 new THREE.Vector3(-15,-30,10),
								 new THREE.Vector3(-15,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);

		// Main part - right
		this.createTriangleMesh([new THREE.Vector3(15,30,10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(15,30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);
		this.createTriangleMesh([new THREE.Vector3(15,30,-10),
								 new THREE.Vector3(15,-30,10),
								 new THREE.Vector3(15,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);

		// Rear end - top
		this.createTriangleMesh([new THREE.Vector3(-45,-10,0),
								 new THREE.Vector3(45,-20,0),
								 new THREE.Vector3(45,-10,0)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 
		this.createTriangleMesh([new THREE.Vector3(-45, -10, 0),
								 new THREE.Vector3(45, -20, 0),
								 new THREE.Vector3(-45, -20, 0)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 

		// Rear end - bottom
		this.createTriangleMesh([new THREE.Vector3(-45,-10,-10),
								 new THREE.Vector3(45,-20,-10),
								 new THREE.Vector3(45,-10,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 
		this.createTriangleMesh([new THREE.Vector3(-45, -10, -10),
								 new THREE.Vector3(45, -20, -10),
								 new THREE.Vector3(-45, -20, -10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 

		// Rear end - back
		this.createTriangleMesh([new THREE.Vector3(-45,-20,0),
								 new THREE.Vector3(45,-20,-10),
								 new THREE.Vector3(45,-20,0)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 
		this.createTriangleMesh([new THREE.Vector3(-45, -20, 0),
								 new THREE.Vector3(-45, -20, -10),
								 new THREE.Vector3(45, -20, -10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);

		// Rear end - front
		this.createTriangleMesh([new THREE.Vector3(-45,-10,0),
								 new THREE.Vector3(45,-10,-10),
								 new THREE.Vector3(45,-10,0)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 
		this.createTriangleMesh([new THREE.Vector3(-45, -10, 0),
								 new THREE.Vector3(-45, -10, -10),
								 new THREE.Vector3(45, -10, -10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);

		// Rear end - left
		this.createTriangleMesh([new THREE.Vector3(-45,-10,0),
								 new THREE.Vector3(-45,-20,0),
								 new THREE.Vector3(-45,-10,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 
		this.createTriangleMesh([new THREE.Vector3(-45, -10, -10),
								 new THREE.Vector3(-45, -20, -10),
								 new THREE.Vector3(-45, -20, 0)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);

		// Rear end - right
		this.createTriangleMesh([new THREE.Vector3(45,-10,0),
								 new THREE.Vector3(45,-20,0),
								 new THREE.Vector3(45,-10,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 
		this.createTriangleMesh([new THREE.Vector3(45, -10, -10),
								 new THREE.Vector3(45, -20, -10),
								 new THREE.Vector3(45, -20, 0)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);

		// Right back cube - top
		this.createTriangleMesh([new THREE.Vector3(45, -20, 0),
								 new THREE.Vector3(35, -20, 0),
								 new THREE.Vector3(45, -30, 0)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 
		this.createTriangleMesh([new THREE.Vector3(45, -30, 0),
								 new THREE.Vector3(35,-20,0),
								 new THREE.Vector3(35,-30,0)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 

		// Right back cube - bottom
		this.createTriangleMesh([new THREE.Vector3(45, -20, -10),
								 new THREE.Vector3(35, -20, -10),
								 new THREE.Vector3(45, -30, -10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 
		this.createTriangleMesh([new THREE.Vector3(45, -30, -10),
								 new THREE.Vector3(35,-20,-10),
								 new THREE.Vector3(35,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 

		// Right back cube - left
		this.createTriangleMesh([new THREE.Vector3(35, -20, 0),
								 new THREE.Vector3(35, -30, 0),
								 new THREE.Vector3(35, -20, -10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);
		this.createTriangleMesh([new THREE.Vector3(35, -20, -10),
								 new THREE.Vector3(35, -30, -10),
								 new THREE.Vector3(35, -30, 0)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);

		// Right back cube - right
		this.createTriangleMesh([new THREE.Vector3(45, -20, 0),
								 new THREE.Vector3(45, -30, 0),
								 new THREE.Vector3(45, -20, -10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);
		this.createTriangleMesh([new THREE.Vector3(45, -20, -10),
								 new THREE.Vector3(45, -30, -10),
								 new THREE.Vector3(45, -30, 0)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);

		// Right back cube - back (we don't need the front as its colliding with the ship)
		this.createTriangleMesh([new THREE.Vector3(45,-30,0),
								 new THREE.Vector3(35,-30,0),
								 new THREE.Vector3(45,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);
		this.createTriangleMesh([new THREE.Vector3(35,-30,-10),
								 new THREE.Vector3(35,-30,0),
								 new THREE.Vector3(45,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);
		
		// Left back cube - top
		this.createTriangleMesh([new THREE.Vector3(-45, -20, 0),
								 new THREE.Vector3(-35, -20, 0),
								 new THREE.Vector3(-45, -30, 0)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 
		this.createTriangleMesh([new THREE.Vector3(-45, -30, 0),
								 new THREE.Vector3(-35,-20,0),
								 new THREE.Vector3(-35,-30,0)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0); 

		// Left back cube - bottom
		this.createTriangleMesh([new THREE.Vector3(-45, -20, -10),
								 new THREE.Vector3(-35, -20, -10),
								 new THREE.Vector3(-45, -30, -10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 
		this.createTriangleMesh([new THREE.Vector3(-45, -30, -10),
								 new THREE.Vector3(-35,-20,-10),
								 new THREE.Vector3(-35,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2); 

		// Left back cube - right
		this.createTriangleMesh([new THREE.Vector3(-35, -20, 0),
								 new THREE.Vector3(-35, -30, 0),
								 new THREE.Vector3(-35, -20, -10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);
		this.createTriangleMesh([new THREE.Vector3(-35, -20, -10),
								 new THREE.Vector3(-35, -30, -10),
								 new THREE.Vector3(-35, -30, 0)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);

		// Left back cube - left
		this.createTriangleMesh([new THREE.Vector3(-45, -20, 0),
								 new THREE.Vector3(-45, -30, 0),
								 new THREE.Vector3(-45, -20, -10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);
		this.createTriangleMesh([new THREE.Vector3(-45, -20, -10),
								 new THREE.Vector3(-45, -30, -10),
								 new THREE.Vector3(-45, -30, 0)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);

		// Left back cube - back (we don't need the front as its colliding with the ship)
		this.createTriangleMesh([new THREE.Vector3(-45,-30,0),
								 new THREE.Vector3(-35,-30,0),
								 new THREE.Vector3(-45,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 2, 1, 0);
		this.createTriangleMesh([new THREE.Vector3(-35,-30,-10),
								 new THREE.Vector3(-35,-30,0),
								 new THREE.Vector3(-45,-30,-10)],
								 0, 0, 0, material_type_obj.blue,
								 0, 1, 2);

		// Nose - Top left
		this.createTriangleMesh([new THREE.Vector3(0, 30, 10),
								 new THREE.Vector3(-10, 30, 0),
								 new THREE.Vector3(0, 50, 0)],
								 0, 0, 0, material_type_obj.red,
								 2, 1, 0); 

		// Nose - Bottom Left
		this.createTriangleMesh([new THREE.Vector3(0, 50, 0),
								 new THREE.Vector3(0, 30, -10),
								 new THREE.Vector3(-10,30,0)],
								 0, 0, 0, material_type_obj.red,
								 0, 1, 2);

		// Nose - Top right
		this.createTriangleMesh([new THREE.Vector3(0, 30, 10),
								 new THREE.Vector3(10, 30, 0),
								 new THREE.Vector3(0, 50, 0)],
								 0, 0, 0, material_type_obj.red,
								 0, 1, 2);  

		// Nose - Bottom right
		this.createTriangleMesh([new THREE.Vector3(0, 50, 0),
								 new THREE.Vector3(0, 30, -10),
								 new THREE.Vector3(10, 30, 0)],
								 0, 0, 0, material_type_obj.red,
								 2, 1, 0); 

		// Left blaster - top left
		this.createTriangleMesh([new THREE.Vector3(-30, -10, 0),
								 new THREE.Vector3(-35, -10, -5),
								 new THREE.Vector3(-30, 0, -5)],
								 0, 0, 0, material_type_obj.purpleish,
								 2, 1, 0); 

		// Left blaster - top right
		this.createTriangleMesh([new THREE.Vector3(-30, -10, 0),
								 new THREE.Vector3(-25, -10, -5),
								 new THREE.Vector3(-30, 0, -5)],
								 0, 0, 0, material_type_obj.purpleish,
								 0, 1, 2); 

		// Left blaster - bottom
		this.createTriangleMesh([new THREE.Vector3(-35, -10, -5),
								 new THREE.Vector3(-25, -10, -5),
								 new THREE.Vector3(-30, 0, -5)],
								 0, 0, 0, material_type_obj.purpleish,
								 2, 1, 0);

		// Right blaster - top left
		this.createTriangleMesh([new THREE.Vector3(30, -10, 0),
								 new THREE.Vector3(35, -10, -5),
								 new THREE.Vector3(30, 0, -5)],
								 0, 0, 0, material_type_obj.purpleish,
								 0, 1, 2); 

		// Right blaster - top right
		this.createTriangleMesh([new THREE.Vector3(30, -10, 0),
								 new THREE.Vector3(25, -10, -5),
								 new THREE.Vector3(30, 0, -5)],
								 0, 0, 0, material_type_obj.purpleish,
								 2, 1, 0); 

		// Right blaster - bottom
		this.createTriangleMesh([new THREE.Vector3(35, -10, -5),
								 new THREE.Vector3(25, -10, -5),
								 new THREE.Vector3(30, 0, -5)],
								 0, 0, 0, material_type_obj.purpleish,
								 0, 1, 2);

		// Back blaster - top left
		this.createTriangleMesh([new THREE.Vector3(0,-30,0),
								 new THREE.Vector3(0,-40,-5),
								 new THREE.Vector3(-5,-30,-5)],
								 0, 0, 0, material_type_obj.red,
								 2, 1, 0); 

		// Back blaster - bottom left
		this.createTriangleMesh([new THREE.Vector3(0,-30,-10),
								 new THREE.Vector3(0,-40,-5),
								 new THREE.Vector3(-5,-30,-5)],
								 0, 0, 0, material_type_obj.red,
								 0, 1, 2); 

		// Back blaster - top right
		this.createTriangleMesh([new THREE.Vector3(0,-30,0),
								 new THREE.Vector3(0,-40,-5),
								 new THREE.Vector3(5,-30,-5)],
								 0, 0, 0, material_type_obj.red,
								 0, 1, 2); 

		// Back blaster - bottom right
		this.createTriangleMesh([new THREE.Vector3(0,-30,-10),
								 new THREE.Vector3(0,-40,-5),
								 new THREE.Vector3(5,-30,-5)],
								 0, 0, 0, material_type_obj.red,
								 2, 1, 0); 

		// Driver pod - top left
		this.createTriangleMesh([new THREE.Vector3(0, 20, 15),
								 new THREE.Vector3(0, 0, 15),
								 new THREE.Vector3(-5, 0, 10)],
								 0, 0, 0, material_type_obj.white,
								 2, 1, 0);
		this.createTriangleMesh([new THREE.Vector3(0, 20, 15),
								 new THREE.Vector3(-5, 20, 10),
								 new THREE.Vector3(-5, 0, 10)],
								 0, 0, 0, material_type_obj.white,
								 0, 1, 2);
		
		// Driver pod - top right
		this.createTriangleMesh([new THREE.Vector3(0, 20, 15),
								 new THREE.Vector3(0, 0, 15),
								 new THREE.Vector3(5, 0, 10)],
								 0, 0, 0, material_type_obj.white,
								 0, 1, 2);
		this.createTriangleMesh([new THREE.Vector3(0, 20, 15),
								 new THREE.Vector3(5, 20, 10),
								 new THREE.Vector3(5, 0, 10)],
								 0, 0, 0, material_type_obj.white,
								 2, 1, 0);

		// Driver pod - front
		this.createTriangleMesh([new THREE.Vector3(0, 20, 15),
								 new THREE.Vector3(-5, 20, 10),
								 new THREE.Vector3(5, 20, 10)],
								 0, 0, 0, material_type_obj.white,
								 2, 1, 0); 

		// Driver pod - back
		this.createTriangleMesh([new THREE.Vector3(0, 0, 15),
								 new THREE.Vector3(-5, 0, 10),
								 new THREE.Vector3(5, 0, 10)],
								 0, 0, 0, material_type_obj.white,
								 0, 1, 2); 

		
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
