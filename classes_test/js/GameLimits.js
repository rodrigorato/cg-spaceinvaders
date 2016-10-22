class GameLimits extends HasPhysics{
	constructor(x, y, z){
		super(x, y, z);
	}

	createObject(){
		this.createCube(0, SpaceInvaders.getGameSize().y / 2, 0, 2, SpaceInvaders.getGameSize().y, 2, MATERIALS.white);
		this.createCube(SpaceInvaders.getGameSize().x, SpaceInvaders.getGameSize().y / 2, 0, 2, SpaceInvaders.getGameSize().y, 2, MATERIALS.white);
		this.createCube(SpaceInvaders.getGameSize().x/2, SpaceInvaders.getGameSize().y, 0, SpaceInvaders.getGameSize().x, 2, 2, MATERIALS.white);
		this.createCube(SpaceInvaders.getGameSize().x/2, 0, 0, SpaceInvaders.getGameSize().x, 2, 2, MATERIALS.white);
	}
}