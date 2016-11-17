class TexturedPlane extends THREE.Object3D{
	constructor(x, y, z, dx, dy, texture_path){
		super();
		this.plane = new THREE.PlaneGeometry(dx, dy);
		this.applyTextureAndSet(x, y, z, texture_path);
	}

	applyTextureAndSet(x, y, z, path){
		var loader = new THREE.TextureLoader();
		var me = this;
		loader.load(path, function (texture){
			var material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
			var mesh = new THREE.Mesh(me.plane, material);
			mesh.position.set(x, y, z);
			me.add(mesh);
		});
	}
}