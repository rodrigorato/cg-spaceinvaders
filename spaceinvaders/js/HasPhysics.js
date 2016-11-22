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
		this.vel = {'x': 0, 'y': 0, 'z': 0};
		this.boundingSphereRadius = 0;
		this.accel = {'x': 0, 'y': 0, 'z': 0};	
		this.size = {'x': 0, 'y': 0, 'z': 0};	
	}

	static getSize(){
		return {'x': 0, 'y': 0, 'z': 0}; 
	}

	hitTheWalls(dt){//returns l r b or t if it hits the wall, else returns the next position
		var movement = this.calculateStandardMovement(dt);
		var candPos = movement.pos;
		this.updateVelocity(movement.vel);

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

	whenCollided(other){
		this.vel.x *= -1;
		this.vel.y *= -1;
		this.accel.x = 0;
		this.accel.y = 0;	
	}

	calculatePosition(dt){
		var hitWall = this.hitTheWalls(dt);
		var newPos = {'x': this.position.x, 'y': this.position.y, 'z': this.position.z};
		if(hitWall == 'l'){
			newPos.x = this.size.x / 2;
			this.vel.x *= -1;
			this.accel.x = 0;
		} else if(hitWall == 'r'){
			newPos.x = SpaceInvaders.getGameSize().x - this.size.x / 2;
			this.vel.x *= -1;
			this.accel.x = 0;
		} else if (hitWall == 't'){
			newPos.y = SpaceInvaders.getGameSize().y - this.size.y / 2;
			this.vel.y *= -1;
			this.accel.y = 0;
		} else if (hitWall == 'b'){
			newPos.y = this.size.y / 2;
			this.vel.y *= -1;
			this.accel.y = 0;
		} else
			return hitWall;
		return newPos;
	}

	calculateStandardMovement(dt){
		var velocity =this.calculateVel(dt);

		//this.updateVelocity(this.calculateVel(dt));
		return {'pos': {'x': this.calcPosEq(this.position.x, velocity.x, dt),
						'y': this.calcPosEq(this.position.y, velocity.y, dt),
						'z': this.calcPosEq(this.position.z, velocity.z, dt)},
				'vel': {'x': velocity.x,
						'y': velocity.y,
						'z': velocity.z}
				}

	}

	updatePosition(newPos){
		this.position.x = newPos.x;
		this.position.y = newPos.y;
		this.position.z = newPos.z;
	}


	// Subclasses should implement this methods!
	createObject(has_a_parameter){ console.log("Class \'" + this.constructor.name + "\' did not implement \'createObject()\' method!"); }
	static getSize(){ 
		console.log("Calling \'getSize()\' method to a super class, it won't work!"); 
		return {'x': 0, 'y': 0, 'z': 0};
	}

	changeMaterialListTo(material_list_obj){
		for(var el in this.children){
			if(this.children[el] instanceof THREE.Mesh) {
				//console.log(this.children[el].material.color);
				this.children[el].material = findMaterialInList(this.children[el].material.color, material_list_obj);
			}
		}
		/*
		this.children = new Array();
		this.createObject(material_list_obj);
		*/
	}

	// Detects colision with another HasPhysics object
	hasCollision(other, delta){ 
		var thisPos = this.calculateStandardMovement(delta).pos;
		var otherPos = other.calculateStandardMovement(delta).pos;
		var dist = new THREE.Vector3(otherPos.x - thisPos.x,
									 otherPos.y - thisPos.y,
									 otherPos.z - thisPos.z);
		return dist.length() < (this.boundingSphereRadius + other.boundingSphereRadius);
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

	createSphere(x, y, z, radius, horSegments, verSegments, material) {
		var geometry = new THREE.SphereGeometry(radius, horSegments, verSegments);
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}

	createBoundingSphere(x, y, z, radius, horSegments, verSegments, material){
		var sphere = new THREE.Object3D();
		var geo = new THREE.SphereGeometry(radius, horSegments, verSegments);
		var mesh = new THREE.Mesh(geo, material);
		mesh.position.set(x, y, z);
		sphere.add(mesh);
		this.add(sphere);
		return sphere;
	}
}