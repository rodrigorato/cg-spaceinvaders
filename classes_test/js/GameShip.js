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
		this.moving = {'left': false, 'right': false};
	}	

	static getSize(){ 
		return {'x': 90, 'y': 80, 'z': 25};
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

	createObject(){
		'use strict';
		this.createCube(0,   0,  0, 30, 60, 20, MATERIALS.blue);
		this.createCube(0, -15, -5, 90, 10, 10, MATERIALS.blue);

		this.createCube( 40, -25, -5, 10, 10, 10, MATERIALS.blue);
		this.createCube(-40, -25, -5, 10, 10, 10, MATERIALS.blue);

		this.createCylinder(-30,  -5, -5, 0,  5, 10, 3, 2,  true, MATERIALS.purpleish);
		this.createCylinder( 30,  -5, -5, 0,  5, 10, 3, 2,  true, MATERIALS.purpleish);
		this.createCylinder(  0, -35, -5, 5,  0, 10, 3, 2,  true, MATERIALS.red);
		this.createCylinder(  0,  40,  0, 0, 10, 20, 3, 2,  true, MATERIALS.purpleish);

		this.createCylinder(  0,  10, 10, 5,  5, 20, 3, 2, false, MATERIALS.white);
	}
}