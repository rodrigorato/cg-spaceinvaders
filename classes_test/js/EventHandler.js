/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

class EventHandler {
	constructor(gameObj){
		this.gameObj = gameObj;
	}	

	addListeners(){
		this.addResizeListener();
		this.addKeyDownListener();
		this.addKeyUpListener();
	}

	addResizeListener(){
		window.addEventListener("resize", this.gameObj.onResize);
	}

	addKeyDownListener(){
		window.addEventListener("keydown", this.gameObj.onKeyDown);
	}

	addKeyUpListener(){
		window.addEventListener("keyup", this.gameObj.onKeyUp);
	}	
}
