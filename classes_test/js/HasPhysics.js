/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

class HasPhysics extends THREE.Object3D {
	constructor(x, y, z){
		super();
		this.position.set(x, y, z);
		this.createObject();
		this.createBoundingSphere();
		this.vel = {'x': 0, 'y': 0, 'z': 0};
		this.accel = {'x': 0, 'y': 0, 'z': 0};	
		this.size = {'x': 0, 'y': 0, 'z': 0};	
	}

	static getSize(){
		return {'x': 0, 'y': 0, 'z': 0}; 
	}

	hitTheWalls(dt){
		var candPos = this.calculateStandardPosition(dt);

		if(candPos.x < this.size.x / 2)
			return 'l';

		else if(candPos.x > (SpaceInvaders.getGameSize().x - this.size.x / 2))
			return 'r';

		else if(candPos.y < this.size.y / 2)
			return 'b';

		else if(candPos.y > (SpaceInvaders.getGameSize().y - this.size.y / 2))
			return 't';

		else
			return candPos;
	}

	calcVelEq(v, a, dt){
		return v + a*dt;
	}

	calcPosEq(p, v, dt){
		return p + v*dt;
	}

	calculateVel(dt){
		return {'x': this.calcVelEq(this.vel.x, this.accel.x, dt),
				'y': this.calcVelEq(this.vel.y, this.accel.y, dt),
		        'z': this.calcVelEq(this.vel.z, this.accel.z, dt)};	
	}

	updateVelocity(newVel){
		this.vel.x = newVel.x;
		this.vel.y = newVel.y;
		this.vel.z = newVel.z;
	}

	/*
	calculatePosition(dt){
		this.updateVelocity(this.calculateVel(dt));
		return {'x': this.calcPosEq(this.position.x, this.vel.x, dt),
				'y': this.calcPosEq(this.position.y, this.vel.y, dt),
				'z': this.calcPosEq(this.position.z, this.vel.z, dt)};	 
	}
	*/

	calculatePosition(dt){
		var hitWall = this.hitTheWalls(dt);
		var newPos = {'x': this.position.x, 'y': this.position.y, 'z': this.position.z};
		if(hitWall == 'l'){
			newPos.x = this.size.x / 2;
			this.vel.x *= -1;
		} else if(hitWall == 'r'){
			newPos.x = SpaceInvaders.getGameSize().x - this.size.x / 2;
			this.vel.x *= -1;
		} else if (hitWall == 't'){
			newPos.y = SpaceInvaders.getGameSize().y - this.size.y / 2;
			this.vel.y *= -1;
		} else if (hitWall == 'b'){
			newPos.y = this.size.y / 2;
			this.vel.y *= -1;
		} else
			return hitWall;
		return newPos;
	}

	calculateStandardPosition(dt){
		this.updateVelocity(this.calculateVel(dt));
		return {'x': this.calcPosEq(this.position.x, this.vel.x, dt),
				'y': this.calcPosEq(this.position.y, this.vel.y, dt),
				'z': this.calcPosEq(this.position.z, this.vel.z, dt)};	 
	}

	updatePosition(newPos){
		this.position.x = newPos.x;
		this.position.y = newPos.y;
		this.position.z = newPos.z;
	}


	// Subclasses should implement this methods!
	createObject(){ console.log("Class \'" + this.constructor.name + "\' did not implement \'createObject()\' method!"); }
	createBoundingSphere(){ console.log("Class \'" + this.constructor.name + "\' did not implement \'createBoundingSphere()\' method!"); }
	static getSize(){ 
		console.log("Calling \'getSize()\' method to a super class, it won't work!"); 
		return {'x': 0, 'y': 0, 'z': 0};
	}

	// Detects colision with another HasPhysics object
	hasCollision(other){ 
		//TO-DO
		return false;
	}
	
	// Methods used to create the object itself
	createCube(x, y, z, dx, dy, dz, material){
		var geometry = new THREE.CubeGeometry(dx,dy,dz);
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