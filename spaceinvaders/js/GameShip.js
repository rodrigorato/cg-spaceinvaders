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

	createTriangleMesh(listOfVertices, material){
		var triangleGeometry = new THREE.Geometry();
		//material.side = THREE.DoubleSide; // TO-DO: OPTIMIZE

		for(var vert in listOfVertices)
			triangleGeometry.vertices.push(listOfVertices[vert]);

		triangleGeometry.faces.push(new	THREE.Face3(0,1,2));
		triangleGeometry.computeFaceNormals();

		var triangleMesh = new THREE.Mesh(triangleGeometry, material);
		triangleMesh.position.set(0,0,0);

		this.add(triangleMesh);
	}

	createSquare(a,b,c,d, material){  
		this.createTriangleMesh([a,b,c], material)
		this.createTriangleMesh([a,c,d],material)
	}

	createCube(v1,v2,v3,v4,v5,v6,v7,v8,material){    
		/*  2----1
		   /*	/|	
		  /	*  / |
		 3--*-4	 |
		 |	6-|--5	
		 | /  | /
		 |/   |/ 
		 7----8	
		*/
		this.createSquare(v1,v2,v3,v4,material);//top
		this.createSquare(v8,v7,v6,v5,material);//botom
		this.createSquare(v3,v2,v6,v7,material);//left
		this.createSquare(v1,v4,v8,v5,material);//rigth
		this.createSquare(v4,v3,v7,v8,material);//front
		this.createSquare(v2,v1,v5,v6,material);//back
	}
	createObject(material_obj){
		'use strict';

		var material_type_obj = (material_obj == null ? MATERIALS : material_obj);


		//Main part
		this.createCube(	new THREE.Vector3(-15,30,10),
							new THREE.Vector3(-15,-30,10),
							new THREE.Vector3(15,-30,10),
							new THREE.Vector3(15,30,10),

							new THREE.Vector3(-15,30,-10),
							new THREE.Vector3(-15,-30,-10),
							new THREE.Vector3(15,-30,-10),
							new THREE.Vector3(15,30,-10),
							material_type_obj.blue);
		//Rear end
		this.createCube(	new THREE.Vector3(45,-20,0),
							new THREE.Vector3(45,-10,0),
							new THREE.Vector3(-45,-10,0),
							new THREE.Vector3(-45, -20, 0),

							new THREE.Vector3(45,-20,-10),
							new THREE.Vector3(45,-10,-10),
							new THREE.Vector3(-45,-10,-10),
							new THREE.Vector3(-45, -20, -10),
							material_type_obj.blue);
		
		//Right back cube
		this.createCube(	new THREE.Vector3(45, -30, 0),
							new THREE.Vector3(45, -20, 0),
							new THREE.Vector3(35, -20, 0),
							new THREE.Vector3(35,-30,0),

							new THREE.Vector3(45, -30, -10),
							new THREE.Vector3(45, -20, -10),
							new THREE.Vector3(35, -20, -10),
							new THREE.Vector3(35,-30,-10),
							material_type_obj.blue);
		//Left back cube
		this.createCube(	new THREE.Vector3(-35, -20, 0),
							new THREE.Vector3(-45, -20, 0),
							new THREE.Vector3(-45, -30, 0),
							new THREE.Vector3(-35,-30,0),

							new THREE.Vector3(-35, -20, -10),
							new THREE.Vector3(-45, -20, -10),
							new THREE.Vector3(-45, -30, -10),
							new THREE.Vector3(-35,-30,-10),
							material_type_obj.blue);

		// Nose - Top left
		this.createTriangleMesh([new THREE.Vector3(0, 50, 0),
								 new THREE.Vector3(-10, 30, 0),
								 new THREE.Vector3(0, 30, 10)],
								 material_type_obj.red
								 ); 

		// Nose - Bottom Left
		this.createTriangleMesh([new THREE.Vector3(0, 50, 0),
								 new THREE.Vector3(0, 30, -10),
								 new THREE.Vector3(-10,30,0)],
								 material_type_obj.red
								 );

		// Nose - Top right
		this.createTriangleMesh([new THREE.Vector3(0, 30, 10),
								 new THREE.Vector3(10, 30, 0),
								 new THREE.Vector3(0, 50, 0)],
								 material_type_obj.red
								 );  

		// Nose - Bottom right
		this.createTriangleMesh([new THREE.Vector3(10, 30, 0),
								 new THREE.Vector3(0, 30, -10),
								 new THREE.Vector3(0, 50, 0)],
								 material_type_obj.red
							 	 ); 

		// Left blaster - top left
		this.createTriangleMesh([new THREE.Vector3(-30, 0, -5),
								 new THREE.Vector3(-35, -10, -5),
								 new THREE.Vector3(-30, -10, 0)],
								 material_type_obj.purpleish
							     ); 

		// Left blaster - top right
		this.createTriangleMesh([new THREE.Vector3(-30, -10, 0),
								 new THREE.Vector3(-25, -10, -5),
								 new THREE.Vector3(-30, 0, -5)],
								 material_type_obj.purpleish
								 ); 

		// Left blaster - bottom
		this.createTriangleMesh([new THREE.Vector3(-30, 0, -5),
								 new THREE.Vector3(-25, -10, -5),
								 new THREE.Vector3(-35, -10, -5)],
					 			 material_type_obj.purpleish
								 );

		// Right blaster - top left
		this.createTriangleMesh([new THREE.Vector3(30, -10, 0),
								 new THREE.Vector3(35, -10, -5),
								 new THREE.Vector3(30, 0, -5)],
								 material_type_obj.purpleish
								 ); 

		// Right blaster - top right
		this.createTriangleMesh([new THREE.Vector3(30, 0, -5),
								 new THREE.Vector3(25, -10, -5),
								 new THREE.Vector3(30, -10, 0)],
								 material_type_obj.purpleish
								 ); 

		// Right blaster - bottom
		this.createTriangleMesh([new THREE.Vector3(35, -10, -5),
								 new THREE.Vector3(25, -10, -5),
								 new THREE.Vector3(30, 0, -5)],
								 material_type_obj.purpleish
								 );

		// Back blaster - top left
		this.createTriangleMesh([new THREE.Vector3(-5,-30,-5),
								 new THREE.Vector3(0,-40,-5),
								 new THREE.Vector3(0,-30,0)],
								 material_type_obj.red
								 ); 

		// Back blaster - bottom left
		this.createTriangleMesh([new THREE.Vector3(0,-30,-10),
								 new THREE.Vector3(0,-40,-5),
								 new THREE.Vector3(-5,-30,-5)],
								 material_type_obj.red
								 ); 

		// Back blaster - top right
		this.createTriangleMesh([new THREE.Vector3(0,-30,0),
								 new THREE.Vector3(0,-40,-5),
								 new THREE.Vector3(5,-30,-5)],
								 material_type_obj.red
								 ); 

		// Back blaster - bottom right
		this.createTriangleMesh([new THREE.Vector3(5,-30,-5),
								 new THREE.Vector3(0,-40,-5),
								 new THREE.Vector3(0,-30,-10)],
								 material_type_obj.red
								 ); 

		// Driver pod - top left
		this.createTriangleMesh([new THREE.Vector3(-5, 0, 10),
								 new THREE.Vector3(0, 0, 15),
								 new THREE.Vector3(0, 20, 15)],
								 material_type_obj.white
								 );
		this.createTriangleMesh([new THREE.Vector3(0, 20, 15),
								 new THREE.Vector3(-5, 20, 10),
								 new THREE.Vector3(-5, 0, 10)],
								 material_type_obj.white
								 );
		
		// Driver pod - top right
		this.createTriangleMesh([new THREE.Vector3(0, 20, 15),
								 new THREE.Vector3(0, 0, 15),
								 new THREE.Vector3(5, 0, 10)],
								 material_type_obj.white
								 );
		this.createTriangleMesh([new THREE.Vector3(5, 0, 10),
								 new THREE.Vector3(5, 20, 10),
								 new THREE.Vector3(0, 20, 15)],
								 material_type_obj.white
								 );

		// Driver pod - front
		this.createTriangleMesh([new THREE.Vector3(5, 20, 10),
								 new THREE.Vector3(-5, 20, 10),
								 new THREE.Vector3(0, 20, 15)],
								 material_type_obj.white
								 ); 

		// Driver pod - back
		this.createTriangleMesh([new THREE.Vector3(0, 0, 15),
								 new THREE.Vector3(-5, 0, 10),
								 new THREE.Vector3(5, 0, 10)],
								 material_type_obj.white
								 ); 

		
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
