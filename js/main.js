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
	}

	setPosition() {
		this.limitBounds();
		this.elementRef.offset(this.boxPosition);
	}

	getColor() {
		return $(this.elementRef).css('background');
	}

	changeColor() {
		$(this.elementRef).css('background', this.colors[Math.floor(Math.random() * this.colors.length)]);
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
		this.hoop1 = this.createHoop(0);
		this.hoop2 = this.createHoop(1);
		this.hoop3 = this.createHoop(2);
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
		this.hoop1.offset(this.position1);
		this.hoop2.offset(this.position2);
		this.hoop3.offset(this.position3);
	}

	limitBounds() {
		if(this.position1.left <= 0) {
			this.removeHoops();
		}
	}

	removeHoops() {
		$(this.hoop1).remove();
		$(this.hoop2).remove();
		$(this.hoop3).remove();
	}

	leftEdge() {
		return this.position1.left;
	}

	rightEdge() {
		return this.position1.left + 50;
	}

	getBottomCoordinate(hoopNumber) {
		switch(hoopNumber) {
			case 1:
				return this.position1.top + 130;
				break;
			case 2:
				return this.position2.top + 130;
				break;
			default:
				return this.position3.top + 130;
				break;
		}
	}

	getUpperCoordinate(hoopNumber) {
		switch(hoopNumber) {
			case 1:
				return this.position1.top;
				break;
			case 2:
				return this.position2.top;
				break;
			default:
				return this.position3.top ;
				break;
		}
	}

	getColor(hoopNumber) {
		switch(hoopNumber) {
			case 1:
				return $(this.hoop1).css('background');
				break;
			case 2:
				return $(this.hoop2).css('background');
				break;
			default:
				return $(this.hoop3).css('background');
				break;
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
		this.boxColorChanged = false;
		this.interval = null;
	}

	createHoops() {
		const that = this;
		this.interval = setInterval(function() {
			that.hoopCollection.push(new Hoops());
			}, 2000);
	}

	checkValidPlay(box, score) {
		let isHoopPresent = false;
		for(let i=0; i<this.hoopCollection.length; i++) {
			const hoop = this.hoopCollection[i];
			if(hoop.leftEdge()<=169 && hoop.leftEdge()>99) {
				isHoopPresent = true;
				this.boxColorChanged = false;
				if(box.boxPosition.top <= hoop.getBottomCoordinate(1)) {
					if(box.getColor() != hoop.getColor(1)) {
						return false;
					}
				}
				else if(box.boxPosition.top >= hoop.getUpperCoordinate(2) && box.boxPosition.top < hoop.getBottomCoordinate(2)) {
					if(box.getColor() != hoop.getColor(2)) {
						return false;
					}
				}
				else {
					if(box.getColor() != hoop.getColor(3)) {
						return false;
					}
				}
			}
		};
		if(!isHoopPresent && !this.boxColorChanged) {
			box.changeColor();
			this.boxColorChanged = true;
			score.calculateScore();
		}
		return true;
	}

	clearHoopCollection() {
		this.hoopCollection.forEach(function(hoop) {
			hoop.removeHoops();
		});
		this.hoopCollection = [];
	}
}

class Score  {
	constructor() {
		this.currentScore = -1;
		this.bestScore = 0;
		this.render();
	}

	calculateScore() {
		this.currentScore += 1;
		this.render();
	}

	calculateBestScore() {
		this.bestScore = Math.max(this.currentScore, this.bestScore);
	}

	resetScore() {
		this.currentScore = -1;
		this.render();
	}

	render() {
		$("#score").html(this.currentScore);
	}
}

class Game {

	constructor() {
		this.box = new Box();
		this.hoops = new HoopCollection();
		this.score = new Score();
		this.setEvents();
		this.timer = null;
		this.frameRate = 1000.0/60.0;
		this.startRenderTimer();
	}

	restartGame() {
		this.hoops.clearHoopCollection();
		clearInterval(this.timer);
		this.startRenderTimer();
	}

	setEvents() {
		let that = this;
		$(document).keydown(function(e) {
			if(e.keyCode === 32) {
				that.box.jump();
			}
		});
	}

	startRenderTimer() {
		const that = this;
		this.timer = setInterval(()=>that.render(), this.frameRate);
	}

	render() {
		this.box.render(); 
		this.hoops.hoopCollection.forEach(function(element) {
			element.render();
		});
		if(!this.hoops.checkValidPlay(this.box, this.score)) {
			this.restartGame();
			this.score.resetScore();
		}
	}
}

let game;

$(document).ready(function() {

	game = new Game();
});