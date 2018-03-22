const frameDimensions = {
	height: 380,
	width: 780
};

class Box {

	constructor() {
		this.velocity = 0;
		this.gravity = 0.25;
		this.bounce = -4.6;
		this.boxPosition = {top: 0, left: 150};
		this.colors = ['red', 'green', 'blue'];
		this.elementRef = $("#box");
		this.setPosition();
		this.setColor();
	}

	setPosition() {
		this.limitBounds();
		this.elementRef.offset(this.boxPosition);
	}

	setColor() {
		$(this.elementRef).css('background', this.colors[Math.floor(Math.random() * this.colors.length)]);
	}

	getColor() {
		return $(this.elementRef).css('background');
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
		this.velocity = -1.5;
		this.position1 = {top: 0, left: 750};
		this.position2 = {top: 135, left: 750};
		this.position3 = {top: 270, left: 750};
		this.colors = ['red', 'green', 'blue'];
		this.elementRef1 = this.createHoop(0);
		this.elementRef2 = this.createHoop(1);
		this.elementRef3 = this.createHoop(2);
		this.setPosition();
	}

	createHoop(colorIndex) {
		let hoop = document.createElement('div');
		$(hoop).addClass('hoops');
		$(hoop).css('background', this.colors[colorIndex]);
		$("#gameContainer").append(hoop);
		return $(hoop);
	}

	setPosition() {
		this.limitBounds();
		this.elementRef1.offset(this.position1);
		this.elementRef2.offset(this.position2);
		this.elementRef3.offset(this.position3);
	}

	limitBounds() {
		if(this.position1.left <= 0) {
			$(this.elementRef1).remove();
		}
		if(this.position2.left <= 0) {
			$(this.elementRef2).remove();
		}
		if(this.position3.left <= 0) {
			$(this.elementRef3).remove();
		}
		
	}

	render() {
		this.position1.left += this.velocity;
		this.position2.left += this.velocity;
		this.position3.left += this.velocity;
		this.setPosition();
	}
}

class HoopCollection {

	constructor() {
		this.hoopCollection = [];
		this.createHoops();
	}

	createHoops() {
		let that = this;
		let interval = setInterval(function() {
			that.hoopCollection.push(new Hoops());
			}, 2000);	
	}

	checkValidPlay(box) {
		this.hoopCollection.forEach(function(element) {
			if(element.position1.left<=150 && element.position1.left>=130) {
				if(box.boxPosition.top <= 130) {
					if(box.getColor() != $(element.elementRef1).css('background')) {
						console.log("Should exit here");
						clearInterval(timer);
					}
				}
				else if(box.boxPosition.top >= 135 && box.boxPosition.top < 265) {
					if(box.getColor() != $(element.elementRef2).css('background')) {
						clearInterval(timer);
					}
				}
				else {
					if(box.getColor() != $(element.elementRef3).css('background')) {
						clearInterval(timer);
					}
				}
			}
		});
	}
}

class Game {

	constructor() {
		this.box = new Box();
		this.hoops = new HoopCollection();
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
		this.hoops.hoopCollection.forEach(function(element) {
			element.render();
		});
		this.hoops.checkValidPlay(this.box);
	}
}

let game;
let timer;

$(document).ready(function() {
	game = new Game();
	let frameRate = 1000.0/60.0;
	timer = setInterval(()=> game.render(), frameRate);
});