class GameLimits extends HasPhysics{
	constructor(x, y, z){
		super(x, y, z);
	}

	createObject(material_obj){
		var material_type_obj = (material_obj == null ? MATERIALS : material_obj);
		this.createCube(0, SpaceInvaders.getGameSize().y / 2, 0, 2, SpaceInvaders.getGameSize().y, 2, material_type_obj.white);
		this.createCube(SpaceInvaders.getGameSize().x, SpaceInvaders.getGameSize().y / 2, 0, 2, SpaceInvaders.getGameSize().y, 2, material_type_obj.white);
		this.createCube(SpaceInvaders.getGameSize().x/2, SpaceInvaders.getGameSize().y, 0, SpaceInvaders.getGameSize().x, 2, 2, material_type_obj.white);
		this.createCube(SpaceInvaders.getGameSize().x/2, 0, 0, SpaceInvaders.getGameSize().x, 2, 2, material_type_obj.white);
	}
}