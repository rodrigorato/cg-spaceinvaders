/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/


class GameBullet extends HasPhysics{
	constructor(x, y, z){
		super(x, y, z);

		this.size = {'x': 8, 'y': 8, 'z': 8};
		this.vel = {'x': 0, 'y': 500, 'z': 0};
		this.boundingSphereRadius = 8; 
	}


	createObject(material_obj){
		var material_type_obj = (material_obj == null ? MATERIALS : material_obj);
		//createSphere(x, y, z, radius, horSegments, verSegments, material) {
		this.createSphere(0, 0, 0, 8, 4, 4, material_type_obj.lightblue);
		this.createSound();
	}

	createSound(){
		var snd = new Audio("res/blast.wav"); 
      	snd.volume = bulletSoundVolume;
      	snd.playbackRate = 1 + (Math.random()*0.2*(Math.random() >= 0.5 ? -1 : 1));
      	snd.play();
	}
}