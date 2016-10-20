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
		super(x,y,z)
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