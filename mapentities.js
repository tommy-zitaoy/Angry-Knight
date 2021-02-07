class Ground extends Entity {
	constructor(game, x, y, hasGrass) {
		if (hasGrass) {
			var sprite = "./sprites/grass-ground.png";
		} else {
			var sprite = "./sprites/ground.png";
        }
		super(game, x, y, sprite);
		this.updateBB();
		this.update = function () { /* Do nothing. */ };
	};

	/** @override */
	updateBB(context) {
		this.worldBB = new BoundingBox(
			this.pos.x, this.pos.y, PARAMS.TILE_WIDTH, PARAMS.TILE_WIDTH);
		this.lastWorldBB = this.worldBB;
		this.drawWorldBB(context);
    }

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 128, 128,
				this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
				this.dim.y, this.dim.y);
		this.worldBB.display(this.game);
	}

	/** @override */
	drawWorldBB(context) {
		if (PARAMS.DEBUG) {
			context.save();
			context.strokeStyle = 'red';
			context.lineWidth = PARAMS.BB_LINE_WIDTH;
			context.strokeRect(
				this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y, PARAMS.TILE_WIDTH, PARAMS.TILE_WIDTH);
			context.restore();
		}
	}
}

//class Background extends Entity {
//	constructor(game, x, y) {
//		super(game, x, y, "./sprites/background.png");
//		this.update = function () { /* Do nothing. */ };
//	};

//	/** @override */
//	draw(context) {
//		context.drawImage(this.spritesheet, 600, 0, 600, 329,
//			this.pos.x, this.pos.y, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
//	}
//}

// parallax background entity
class Background extends Entity {
	constructor(game, x, y, spriteSheetName, spriteWidth, spriteLength, speedRate) {
		super(game, x, y, spriteSheetName);

		this.setDimensions(PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
		this.spriteWidth = spriteWidth;		// picture width (different background might have different ratio)
		this.spriteLength = spriteLength;	// picture length (different background might have different ratio)
		this.speedRate = speedRate;					// background scrolling speed (different layer needs different speed)
		this.speed = 0;
		// to make the horizontal parallax scrolling effect, we use three images leftImage, midImage, rightImage
		this.leftImagePos = { x: this.pos.x - PARAMS.CANVAS_WIDTH, y: y };	// left to the camera
		this.midImagePos = { x: x, y: y };									// at the camera position
		this.rightImagePos = { x: this.pos.x + PARAMS.CANVAS_WIDTH, y: y };	// right to the camera

	};

	/** @override */
	update() {
		if (this.game.taz.vel.x > 0) {
			this.speed = this.game.clockTick * this.speedRate;
		} else if (this.game.taz.vel.x < 0) {
			this.speed = this.game.clockTick * -this.speedRate;
		} else {
			this.speed = 0;
		}

		this.leftImagePos.x = this.leftImagePos.x + this.speed;
		this.midImagePos.x = this.midImagePos.x + this.speed;
		this.rightImagePos.x = this.rightImagePos.x + this.speed;

		// camera reach the left or right image then reposition the three images
		if (this.game.camera.pos.x >= this.rightImagePos.x) {
			this.leftImagePos = this.midImagePos;
			this.midImagePos = this.rightImagePos;
			this.rightImagePos = {
				x: this.midImagePos.x + PARAMS.CANVAS_WIDTH,
				y: this.midImagePos.y
			};
		} else if (this.game.camera.pos.x <= this.leftImagePos.x) {
			this.rightImagePos = this.midImagePos;
			this.midImagePos = this.leftImagePos;
			this.leftImagePos = {
				x: this.midImagePos.x - PARAMS.CANVAS_WIDTH,
				y: this.midImagePos.y
			};
		}

	}

	/** @override */
	draw(context) {
		// leftImage:
		context.drawImage(this.spritesheet, 0, 0, this.spriteWidth, this.spriteLength,
			this.leftImagePos.x - this.game.camera.pos.x + this.speed, this.leftImagePos.y,
			this.dim.x, this.dim.y);
		// midImage:
		context.drawImage(this.spritesheet, 0, 0, this.spriteWidth, this.spriteLength,
			this.midImagePos.x - this.game.camera.pos.x + this.speed, this.midImagePos.y,
			this.dim.x, this.dim.y);
		// rightImage:
		context.drawImage(this.spritesheet, 0, 0, this.spriteWidth, this.spriteLength,
			this.rightImagePos.x - this.game.camera.pos.x + this.speed, this.rightImagePos.y,
			this.dim.x, this.dim.y);
	}
}
