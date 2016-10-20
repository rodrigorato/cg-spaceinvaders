/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

class SpaceInvaders {
	constructor(){
		this.eventHandler = new EventHandler(this);
		this.eventHandler.addListeners();
	}

	onResize(){
		console.log("resized!");
	}

	onKeyUp(keyCode){
		console.log(keyCode + " up!");
	}
	
	onKeyDown(keyCode){
		console.log(keyCode + " down!");
	}	

	init(){
		
			
	}

	movePlayer(){
		console.log("move.");
	}
}