/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

class SpaceInvaders {
	static getGameSize(){
		return {'x': 15*GameShip.getSize().x, 'y':10*GameShip.getSize().y, 'z':10*GameShip.getSize().y};
	}

	constructor(){
		this.eventHandler = new EventHandler(this);
		this.eventHandler.addListeners();

		this.renderer = new THREE.WebGLRenderer({antialias : true});
		this.renderer.setSize(window.innerWidth , window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		
		var size = {'x': 15*GameShip.getSize().x, 'y':10*GameShip.getSize().y, 'z':10*GameShip.getSize().y};
		this.game = {'sceneObj': null, 'size': size,
					 'aliens': new Array(), 'bullets': new Array(),
					 'player': null, 'corners': new Array(),
					 'bulletTime': 1, 'timeBetweenBullets': 0.2,
					 'paused': false, 'totalAliens': 0,'aliensHit': 0, 
					 'numlifes': 3, 'lifeShips': new Array(),  'over': false};
		
		this.cameras = {'ortho': null, 'persp': null, 'player': null, 'lifes':null, 'paused':false, 'pause':null, 'gameover':null, 
						'active': null, 'fov': 65, 'near': 1, 'far': 1000, 'ar': size.x/size.y};

		this.lights = {'dlight': null, 'dlight_intens': 2, 'dlight_color': 0xffffff, 'plights': null,
					   'plight_color': 0xffffff, 'plight_intens': 1, 'plight_decay': 2, // apperantly this value creates "physically realistic" decay 
					   'plight_z': 60, 'slight': null, 'slight_intens': 2};

		this.hudElements = {'pausedPlane': null, 'gameOverPlane': null,'gameOverPlaneWin': null,'shipsStartX':2000, 'shipsStartY':-150};

		this.createScene();

		this.createCameras();

		this.createLights();
		
		this.clock = new THREE.Clock();
		this.clock.start();
		
		this.render();
	}

	render() {	
		'use strict';
		this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
		this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight	);
		this.renderer.setScissorTest(true);
		this.renderer.render(this.game.sceneObj, this.cameras.active);

		this.renderer.setViewport(window.innerWidth - (GameShip.getSize().x + 5),
								  window.innerHeight - this.game.numlifes*GameShip.getSize().y*1.5,
								  GameShip.getSize().x +5,
								  this.game.numlifes*GameShip.getSize().y*1.5);
		this.renderer.setScissor(window.innerWidth - (GameShip.getSize().x + 5),
								  window.innerHeight - this.game.numlifes*GameShip.getSize().y*1.5,
								  GameShip.getSize().x +5,
								  this.game.numlifes*GameShip.getSize().y*1.5);
		this.renderer.setScissorTest(true);
		this.renderer.render(this.game.sceneObj, this.cameras.lifes);
		if(this.game.paused)
		{
			this.renderer.setViewport(0,
									  window.innerHeight/3,
									  window.innerWidth,
									  window.innerHeight/3);
			this.renderer.setScissor(0,
									  window.innerHeight/3,
									  window.innerWidth,
									  window.innerHeight/3);
			this.renderer.setScissorTest(true);
			this.renderer.render(this.game.sceneObj, this.cameras.pause);
		}
		if(this.game.over)
			{
				this.renderer.setViewport(0,
									  window.innerHeight/3,
									  window.innerWidth,
									  window.innerHeight/3);
				this.renderer.setScissor(0,
									  window.innerHeight/3,
									  window.innerWidth,
									  window.innerHeight/3);
				this.renderer.setScissorTest(true);
				this.renderer.render(this.game.sceneObj, this.cameras.gameover);
			}

		
	}
		
	createScene() {
		'use strict';

		this.game.sceneObj = new THREE.Scene();

		this.game.sceneObj.add(new GameLimits(0, 0, 0));
		this.game.sceneObj.add(new TexturedPlane(this.game.size.x / 2, this.game.size.y / 2, 0, this.game.size.x, this.game.size.y, 'res/textures/bg.jpg'));

		this.game.player = new GameShip(this.game.size.x / 2, GameShip.getSize().y / 1.5, 10);

		this.hudElements.pausedPlane = new TexturedPlane(this.game.size.x / 2, this.game.size.y / 2, 1000, this.game.size.x/2, this.game.size.y/2, 'res/textures/paused.png');
		this.game.sceneObj.add(this.hudElements.pausedPlane);
		//this.hudElements.pausedPlane.visible = false;

		this.hudElements.gameOverPlane = new TexturedPlane(this.game.size.x / 2, this.game.size.y / 2, 1010, this.game.size.x, this.game.size.y, 'res/textures/game_over_lost.png');
		this.game.sceneObj.add(this.hudElements.gameOverPlane);
		//this.hudElements.gameOverPlane.visible = false;

		this.hudElements.gameOverPlaneWin = new TexturedPlane(this.game.size.x / 2, this.game.size.y / 2, 1010, this.game.size.x, this.game.size.y, 'res/textures/game_over_won.png');
		this.game.sceneObj.add(this.hudElements.gameOverPlaneWin);
		this.hudElements.gameOverPlaneWin.visible = false;

		this.createLifesShips(this.game.numlifes);

		this.game.sceneObj.add(this.game.player);

		this.createRowOfAliens(700, 12);	
		this.createRowOfAliens(600, 12);		
	}

	createLights(){
		//Directional Light - Sun
		this.lights.dlight = new THREE.DirectionalLight(this.lights.dlight_color, // White light
		 												this.lights.dlight_intens /* Default is 2 */);
		//this.lights.dlight.position.set(-this.game.size.x, 0, 1);
		
		this.lights.dlight.position.set(0, 0, 1);
		/*var tempObj = new GameBullet(this.game.size.x,0 ,0);
		this.game.sceneObj.add(tempObj);
		this.lights.dlight.target = tempObj;
		tempObj.visible = false;*/

		this.game.sceneObj.add(this.lights.dlight);

		this.lights.plights = new Array(); // placing pointlights in an array. since we only to turn them all off at once there should be no problems

		var plight_colors = [0x555555,
							 0x555555,
							 0x555555,
							 0x555555,
							 0x5555ff,
							 0x5555ff];

		//creating six pointlights, pushing them and adding them to scene
		for (var i = 0; i < 6; i++) {
			var l = new THREE.PointLight(plight_colors[i],this.lights.plight_intens,this.lights.plight_deacy);
			this.lights.plights.push(l);
			this.game.sceneObj.add(l);
		}

		/*
		this.game.sceneObj.add(new THREE.PointLightHelper(this.lights.plights[0],5));
		this.game.sceneObj.add(new THREE.PointLightHelper(this.lights.plights[1],5));
 		this.game.sceneObj.add(new THREE.PointLightHelper(this.lights.plights[2],5));
		this.game.sceneObj.add(new THREE.PointLightHelper(this.lights.plights[3],5));
		this.game.sceneObj.add(new THREE.PointLightHelper(this.lights.plights[4],5));
		this.game.sceneObj.add(new THREE.PointLightHelper(this.lights.plights[5],5));
		*/

		// placing lights (uncomment helper to see postions)
		this.lights.plights[0].position.set(SpaceInvaders.getGameSize().x * 0.1,
											SpaceInvaders.getGameSize().y * 0.1,
											this.lights.plight_z); // bottom left corner

		this.lights.plights[1].position.set(SpaceInvaders.getGameSize().x * 0.9,
											SpaceInvaders.getGameSize().y * 0.1,
											this.lights.plight_z); // bottom right corner

 		this.lights.plights[2].position.set(SpaceInvaders.getGameSize().x * 0.1,
 											SpaceInvaders.getGameSize().y * 0.9,
 											this.lights.plight_z);  // top left corner

		this.lights.plights[3].position.set(SpaceInvaders.getGameSize().x * 0.9,
											SpaceInvaders.getGameSize().y * 0.9,
											this.lights.plight_z); // top right corner

		// placing these in these places because i dont know where to put them

		this.lights.plights[4].position.set(SpaceInvaders.getGameSize().x / 2,
											SpaceInvaders.getGameSize().y / 4,
											this.lights.plight_z);

		this.lights.plights[5].position.set(SpaceInvaders.getGameSize().x / 2,
											SpaceInvaders.getGameSize().y * 0.75,
											this.lights.plight_z);
		//Spotligth for the ship
		this.lights.slight = new THREE.SpotLight(0xffffff);
		this.lights.slight.position.set(this.game.player.position.x,this.game.player.position.y,
										this.game.player.position.z+40);
		this.game.sceneObj.add(this.lights.slight);
		this.lights.slight.distance=this.game.size.y/2;
		this.lights.slight.intensity=this.lights.slight_intens;

		var tempObj = new GameBullet(this.game.player.position.x,this.game.size.y,this.game.player.position.z);
		this.game.sceneObj.add(tempObj);
		this.lights.slight.target = tempObj;
		tempObj.visible = false;
		
	}

	setCameraLifes(){
		this.cameras.lifes = new THREE.OrthographicCamera(-GameShip.getSize().x/2 - 5,
														  GameShip.getSize().x/2 + 5,
														  0,
														  -(this.game.numlifes*GameShip.getSize().y*1.5),
														  this.cameras.near,
														  this.cameras.far);
		//this.cameras.lifes.position.set(0,0,0);
		this.cameras.lifes.position.x = this.hudElements.shipsStartX;
		this.cameras.lifes.position.y = -90;
		this.cameras.lifes.position.z = 50;
	}

	createCameras() {
		'use strict';

		this.cameras.ortho = new THREE.OrthographicCamera(this.game.size.x / -2, // Limite esquerdo
														  this.game.size.x /  2, //      e direito
														  this.game.size.y /  2, // Limite superior
														  this.game.size.y / -2, //      e inferior
														  this.cameras.near, // Limite frontal
														  this.cameras.far); //  	  e traseiro

		this.cameras.active = this.cameras.ortho;

		this.cameras.persp = new THREE.PerspectiveCamera(this.cameras.fov, window.innerWidth / window.innerHeight, this.cameras.near, this.cameras.far);
		this.cameras.player = new THREE.PerspectiveCamera(this.cameras.fov, window.innerWidth / window.innerHeight, this.cameras.near, this.cameras.far);
		
		this.setCameraLifes();

		this.cameras.pause = new THREE.OrthographicCamera(-this.game.size.x ,
														  this.game.size.x,
														  this.game.size.y /  3,
														  this.game.size.y / -3,
														  200,
														  1002);


		this.cameras.pause.position.x = (SpaceInvaders.getGameSize().x / 2);
		this.cameras.pause.position.y = (SpaceInvaders.getGameSize().y / 2);
		this.cameras.pause.position.z = 1200;

		this.cameras.pause.lookAt(new THREE.Vector3(SpaceInvaders.getGameSize().x / 2, SpaceInvaders.getGameSize().y / 2, 0));

		this.cameras.gameover = new THREE.OrthographicCamera(-this.game.size.x,
														  this.game.size.x,
														  this.game.size.y /  3,
														  this.game.size.y / -3,
														  1,
														  199);


		this.cameras.gameover.position.x = (SpaceInvaders.getGameSize().x / 2);
		this.cameras.gameover.position.y = (SpaceInvaders.getGameSize().y / 2);
		this.cameras.gameover.position.z = 1200;

		this.cameras.gameover.lookAt(new THREE.Vector3(SpaceInvaders.getGameSize().x / 2, SpaceInvaders.getGameSize().y / 2, 0));

		this.cameras.ortho.position.x = (SpaceInvaders.getGameSize().x / 2);
		this.cameras.ortho.position.y = (SpaceInvaders.getGameSize().y / 2);
		this.cameras.ortho.position.z = SpaceInvaders.getGameSize().z;

		this.cameras.persp.position.x = (SpaceInvaders.getGameSize().x / 2);
		this.cameras.persp.position.y = -100;
		this.cameras.persp.position.z = 600;

		this.cameras.player.position.x = this.game.player.position.x;
		this.cameras.player.position.y = this.game.player.position.y - 150;
		this.cameras.player.position.z = this.game.player.position.z + 500;

		

		this.cameras.persp.lookAt(new THREE.Vector3(SpaceInvaders.getGameSize().x / 2, 300, 0));
		this.cameras.player.lookAt(new THREE.Vector3(this.game.player.position.x, 
													 this.game.player.position.y + 200,
													 this.game.player.position.z));
		this.cameras.ortho.lookAt(new THREE.Vector3(SpaceInvaders.getGameSize().x / 2, SpaceInvaders.getGameSize().y / 2, 0));
		this.onResize();	// Para acertar o aspect ratio.
		console.log(this.cameras.pause.up)
		console.log(this.cameras.ortho.up)
	}


	createRowOfAliens(y, quant){
		'use strict';
		for(var i = 0; i < quant; i++){
			var alien =  new GameAlien((GameAlien.getSize().x * 2) + (i * ((this.game.size.x - GameAlien.getSize().x) / quant)), y, 10)
			this.game.sceneObj.add(alien);
			this.game.aliens.push(alien);
		}
		this.game.totalAliens += quant;
	}

	createLifesShips(quant){
		'use strict';
		for(var i = 0; i < quant; i++){
			var ship =  new GameShip(this.hudElements.shipsStartX, this.hudElements.shipsStartY-i*GameShip.getSize().y*1.5, 0)
			this.game.sceneObj.add(ship);
			this.game.lifeShips.push(ship);
		}
	}

	animateGame(){

			stats.begin();

			if(game.clock.running){

				var delta = game.clock.getDelta();

				// Shoots the bullet from the ship
				var bullet = game.game.player.shoot(delta);
				if(bullet != null){
					game.game.sceneObj.add(bullet);
					game.game.bullets.push(bullet);
				}

				
				// Moves the aliens
				for (var i = 0; i < game.game.aliens.length; i++) {
					for (var j = i + 1; j < game.game.aliens.length; j++) {
						if(game.game.aliens[i].hasCollision(game.game.aliens[j], delta)){
							game.game.aliens[i].whenCollided(game.game.aliens[j]);
							game.game.aliens[j].whenCollided(game.game.aliens[i]);
								
						}
						
					}
					if(game.game.aliens[i].hasCollision(game.game.player, delta)){

						game.game.aliens[i].whenCollided(game.game.player);
						game.game.sceneObj.remove(game.game.aliens[i]);
						game.game.aliens.splice(i, 1);
						game.game.aliensHit++;
						if(game.game.numlifes>0){
							game.game.sceneObj.remove(game.game.lifeShips[game.game.numlifes-1]);
							game.game.lifeShips.splice(game.game.numlifes-1, 1);
							game.game.numlifes--;
							game.setCameraLifes();
							if(game.game.numlifes == 0){
								game.clock.stop();
								game.game.over = true;
							}
						}
					}
					else
						game.game.aliens[i].updatePosition(game.game.aliens[i].calculatePosition(delta));
				}

				// Moves the ship and the camera attached to it
				game.game.player.updatePosition(game.game.player.calculatePosition(delta));
				game.cameras.player.position.x = game.game.player.position.x;
				game.lights.slight.position.x=game.game.player.position.x;
				game.lights.slight.target.position.x=game.game.player.position.x;

				for(var b in game.game.bullets){
					var didRemoveBullet = false;
					for (var i = 0; i < game.game.aliens.length; i++) {
						if(game.game.aliens[i].hasCollision(game.game.bullets[b], delta)){
							didRemoveBullet = true;
							game.game.sceneObj.remove(game.game.bullets[b]);
							game.game.bullets.splice(b, 1);
							game.game.sceneObj.remove(game.game.aliens[i]);
							game.game.aliens.splice(i, 1);
							game.game.aliensHit++;
							game.deathSound();
							break;
						}
					}
					if(!didRemoveBullet){
						if(game.game.bullets[b].hitTheWalls(delta) == 't'){
							game.game.sceneObj.remove(game.game.bullets[b]);
							game.game.bullets.splice(b, 1);
						} else
						game.game.bullets[b].updatePosition(game.game.bullets[b].calculatePosition(delta));
					}

				if(game.game.totalAliens == game.game.aliensHit){
					game.hudElements.gameOverPlaneWin.visible = true;
					game.hudElements.gameOverPlane.visible = false;
					game.clock.stop();
					game.game.over = true;
				}
					
			}

			/*/ Debug - view the model on every angle 
			game.game.player.rotateZ(-0.01);
			game.game.player.rotateX(-0.01);
			game.game.player.rotateY(-0.01);
			/**/

		}


			game.render();
			stats.end();
			game.frameId = requestAnimationFrame(game.animateGame);
	}

	deathSound(){
		var snd = new Audio("res/death.wav"); 
      	snd.volume = deathSoundVolume;
      	snd.playbackRate = 1;
      	snd.play();
	}

	onResize(){
		// we need because window calling resize stuff
		var me;
		if(this instanceof SpaceInvaders) me = this;
		else me = game;

		me.renderer.setSize(window.innerWidth, window.innerHeight);

		var aspect_ratio =(window.innerWidth / window.innerHeight);
		
		if(me.cameras.active == me.cameras.ortho){
			if(aspect_ratio>me.cameras.ar){
				me.cameras.active.top = me.game.size.y/ 2;
				me.cameras.active.bottom = me.game.size.y/ -2 ;
				me.cameras.active.left = -me.cameras.active.top * aspect_ratio;
				me.cameras.active.right = me.cameras.active.top * aspect_ratio;
		
			}else{
				me.cameras.active.left = (me.game.size.x / -2) ;
				me.cameras.active.right = (me.game.size.x / 2) ;
				me.cameras.active.top = -me.cameras.active.left / aspect_ratio;
				me.cameras.active.bottom = me.cameras.active.left /aspect_ratio;
			}
			me.cameras.active.near = me.cameras.near;
			me.cameras.active.far = me.cameras.far;
		} else 
			me.cameras.active.aspect = aspect_ratio;
		me.cameras.active.updateProjectionMatrix();
	}

	onKeyUp(key){
		var me;
		if(this instanceof SpaceInvaders) me = this;
		else me = game;

		switch (key.keyCode){
			case 39: //-->
				me.game.player.moving.right = false;
				break;
			case 37: //<--
				me.game.player.moving.left = false;
				break;
			case 32: case 66: // B or Space to fire a bullet
				me.game.player.shootRules.shooting = false;
			default:
				break;
		}
	}

	updateMaterials(mats){
		for(var al in this.game.aliens){
			this.game.aliens[al].changeMaterialListTo(mats);
		}
		
		for(var bu in this.game.bullets)
			this.game.bullets[bu].changeMaterialListTo(mats);

		this.game.player.changeMaterialListTo(mats);
	}
	
	onKeyDown(key){
		var me;
		if(this instanceof SpaceInvaders) me = this;
		else me = game;

		switch (key.keyCode){
			case 82: // r
				document.body.removeChild(game.renderer.domElement);
				me.game.over = true;
				cancelAnimationFrame(game.frameId);
				MATERIALS = MATERIALS_BASIC;			
				game = new SpaceInvaders();
				game.animateGame();
				break;
			case 83: // S
				me.clock.running ? me.clock.stop() : me.clock.start();
				//if (!me.game.over ) me.hudElements.pausedPlane.visible = !me.hudElements.pausedPlane.visible;
				me.game.paused = !(me.game.paused);
				break;

			case 78: // N
				me.lights.dlight.intensity = (me.lights.dlight.intensity == 0 ? me.lights.dlight_intens : 0);
				break;
			case 72: //h
				me.lights.slight.intensity = (me.lights.slight.intensity == 0 ? me.lights.slight_intens : 0);
				break;
			case 71: // g
				if(MATERIALS == MATERIALS_GOURAUD){
					MATERIALS = MATERIALS_PHONG;
					fancyMaterial = 'phong';
				}
				else if(MATERIALS == MATERIALS_PHONG){
					MATERIALS = MATERIALS_GOURAUD;
					fancyMaterial = 'gouraud';
				}

				me.updateMaterials(MATERIALS);

				break;

			case 86: // v
				bulletSoundVolume = (bulletSoundVolume == 0 ? 0.03 : 0);
				deathSoundVolume = (deathSoundVolume == 0 ? 0.05 : 0);
				break;

			case 76: // L
				if(MATERIALS == MATERIALS_BASIC){
					if(fancyMaterial == 'gouraud')
						MATERIALS = MATERIALS_GOURAUD;
					else
						MATERIALS = MATERIALS_PHONG;
				} else MATERIALS = MATERIALS_BASIC;

				
				me.updateMaterials(MATERIALS);

				break;

			case 65: // A or a
				for(var i in MATERIALS)
					MATERIALS[i].wireframe = !MATERIALS[i].wireframe;
				break;

			case 67: // C
				for (var i = 0; i < me.lights.plights.length; i++) {
					me.lights.plights[i].intensity = (me.lights.plights[i].intensity == 0 ? me.lights.plight_intens : 0)
				}
				break;

			case 32: case 66: // B or Space to fire a bullet
				me.game.player.shootRules.shooting = true;
				break;

			case 68: // d for collision spheres
				for(var alien in me.game.aliens)
					me.game.aliens[alien].toggleBoundingSphere();
				break;

			case 39: //-->
				me.game.player.moving.right = true;
				break;

			case 37: //<--
				me.game.player.moving.left = true;
				break;

			case 52:
				me.cameras.active = me.cameras.gameover;
				break;
			case 51: // 3 - Perspective camera following the player
				me.cameras.active = me.cameras.player;
				break;

			case 50: // 2 - Perspective camera of all the field
				me.cameras.active = me.cameras.persp;
				break;

			case 49: // 1 - Orthographic camera
				me.cameras.active = me.cameras.ortho;
				break;

			default:
				break;
		}
	}	
}