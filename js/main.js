const frameDimensions = {
	height: 390,
	width: 790
};

class Box {

	constructor() {
		this.velocity = 0;
		this.gravity = 0.25;
		this.bounce = -4.6;
		this.boxPosition = {top: 0, left: 150};
		this.elementRef = $("#box");
		this.setPosition();
	}

	setPosition() {
		this.limitBounds();
		this.elementRef.offset(this.boxPosition);
	}

	limitBounds() {
		if(this.boxPosition.top > frameDimensions.height) {
			this.boxPosition.top = frameDimensions.height;
		}

		if(this.boxPosition.top < 0) {
			this.boxPosition.top = 0;
		}
	}

	jump() {
		this.velocity = this.bounce;
	}

	render() {
		this.velocity += this.gravity;
		this.boxPosition.top += this.velocity;
		this.setPosition();
	}
}

class Hoops {

	constructor() {
		this.velocity = -0.5;
		this.position = {top: 0, left: 750};
		this.elementRef = $("#hoops");
		this.setPosition();
	}

	setPosition() {
		this.limitBounds();
		this.elementRef.offset(this.position);
	}

	limitBounds() {
	}

	render() {
		this.position.left += this.velocity;
		this.setPosition();
	}
}

class Game {

	constructor() {
		this.box = new Box();
		this.hoops = new Hoops();
		this.setEvents();
	}

	setEvents() {
		let that = this;
		$(document).keydown(function(e) {
			if(e.keyCode === 32) {
				that.box.jump();
			}
		});
	}

	render() {
		this.box.render();
		this.hoops.render();
	}
}

let game;

$(document).ready(function() {
	game = new Game();
	let frameRate = 1000.0/60.0;
	let timer = setInterval(()=> game.render(), frameRate);
});