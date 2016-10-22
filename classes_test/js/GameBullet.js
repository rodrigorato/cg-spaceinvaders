class GameBullet extends HasPhysics{
	constructor(x, y, z){
		super(x, y, z);

		this.size = {'x': 8, 'y': 8, 'z': 8};
		this.vel = {'x': 0, 'y': 500, 'z': 0};
		this.boundingSphereRadius = 4; 
		this.createBoundingSphere();
	}


	createObject(){
		//createSphere(x, y, z, radius, horSegments, verSegments, material) {
		this.createSphere(0, 0, 0, 4, 8, 8);
	}
}