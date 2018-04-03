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

	changeBoxColor(boxColors) {
		$(this.elementRef).css('background', this.getNextColor(boxColors));
	}

	getNextColor(boxColors) {
		return boxColors[Math.floor(Math.random() * boxColors.length)]
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

	constructor(colorObject) {
		let colorRef = colorObject;
		this.velocity = -1.5;
		this.position1 = {top: 0, left: 750};
		this.position2 = {top: 135, left: 750};
		this.position3 = {top: 270, left: 750};
		this.hoopColors = colorRef.getHoopColors(3);
		this.hoop1 = this.createHoop(0);
		this.hoop2 = this.createHoop(1);
		this.hoop3 = this.createHoop(2);
		this.setPosition();
	}

	createHoop(colorIndex) {
		let hoop = document.createElement('div');
		$(hoop).addClass('hoops');
		$(hoop).css('background', this.hoopColors[colorIndex]);
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
		this.hoop1.remove();
		this.hoop2.remove();
		this.hoop3.remove();
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

	isPassingOverBox() {
		if(this.leftEdge()<=169 && this.leftEdge()>99) {
			return true;
		}
		return false;
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
		this.colorObj = new Color();
		this.hoopCollection = [];
		this.createHoops();
		this.nextHoopIndex = 0;
		this.boxColorChanged = false;
	}

	createHoops() {
		const that = this;
		this.interval = setInterval(function() {
			that.hoopCollection.push(new Hoops(that.colorObj));
			}, 2000);
	}

	checkValidPlay(box, score) {
		let isHoopPresent = false;
		for(let i=0; i<this.hoopCollection.length; i++) {
			const hoop = this.hoopCollection[i];
			if(hoop.isPassingOverBox()) {
				this.nextHoopIndex = i+1;
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
			this.onPassingEachHoop(box, score);
		}
		return true;
	}

	onPassingEachHoop(box, score) {
		if(this.nextHoopIndex < this.hoopCollection.length) {
			const boxColors = this.getNextHoopColorsByIndex();
			box.changeBoxColor(boxColors); 
			this.boxColorChanged = true;
			score.calculateCurrentScore();
		}
	}

	getNextHoopColorsByIndex() {
		return this.hoopCollection[this.nextHoopIndex].hoopColors;
	}

	restartHoopGeneration() {
		this.createHoops();
	}

	stopHoopGenerationTimer() {
		clearInterval(this.interval);
	}

	clearHoopCollection() {
		this.hoopCollection.forEach(function(hoop) {
			hoop.removeHoops();
		});
		this.hoopCollection = [];
		this.nextHoopIndex = 0;
	}
}

class Color {
	constructor() {
		this.colors = ['red', 'green', 'blue', 'yellow', 'brown', 'orange'];
	}

	getHoopColors(numberOfColors) {
		if(numberOfColors > this.colors.length) {
			return this.colors;
		}
		let hoopColors = [];
		while(hoopColors.length < numberOfColors) {
			const hoopColor = this.getNextColor();
			if(!hoopColors.includes(hoopColor)) {
				hoopColors.push(hoopColor);
			}
		}
		return hoopColors;
	}

	getNextColor() {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
	}
}

class Score  {
	constructor() {
		this.resetScore();
		this.bestScore = 0;
	}

	calculateCurrentScore() {
		this.setCurrentScore(this.currentScore+1);
	}

	calculateBestScore() {
		this.bestScore = Math.max(this.currentScore, this.bestScore);
	}

	resetScore() {
		this.setCurrentScore(-1);
	}

	renderBestScore() {
		this.calculateBestScore();
		$("#bestScore").html(this.bestScore);
	}

	renderCurrentScore() {
		$("#currentScore").html(this.currentScore);
	}

	onGameOver() {
		this.renderBestScore();
		this.renderCurrentScore();
		this.resetScore();
	}

	setCurrentScore(val) {
		this.currentScore = val;
		$("#score").html(this.currentScore);
	}
}

class Game {

	constructor() {
		this.hoops = new HoopCollection();
		this.score = new Score();
		this.box = new Box();
		this.setEvents();
		this.timer = null;
		this.frameRate = 1000.0/60.0;
		this.startRenderTimer();
	}

	startGame() {
		this.hoops.restartHoopGeneration();
		this.startRenderTimer();
	}

	stopGame() {
		clearInterval(this.timer);
		this.hoops.stopHoopGenerationTimer();
		this.hoops.clearHoopCollection();
	}

	setEvents() {
		let that = this;
		$(document).keydown(function(e) {
			if(e.keyCode === 32) {
				that.box.jump();
			}
		});

		$("#resetBtn").click(function() {
			that.showGameContainer();
			that.startGame();
		});
	}

	showScoreContainer() {
		$("#gameContainer").hide();
		$("#scoreContainer").show();

	}

	showGameContainer() {
		$("#scoreContainer").hide();
		$("#gameContainer").show();
	}

	startRenderTimer() {
		const that = this;
		this.timer = setInterval(()=>that.render(), this.frameRate);
	}

	onGameOver() {
		this.stopGame();
		this.score.onGameOver();
		this.showScoreContainer();
	}

	render() { 
		this.hoops.hoopCollection.forEach(function(element) {
			element.render();
		});
		this.box.render();
		if(!this.hoops.checkValidPlay(this.box, this.score)) {
			this.onGameOver();
		}
	}
}

let game;

$(document).ready(function() {

	game = new Game();
});