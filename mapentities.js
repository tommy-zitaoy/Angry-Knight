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
		if (this.game.knight.vel.x > 0) {
			this.speed = this.game.clockTick * -this.speedRate;
		} else if (this.game.knight.vel.x < 0) {
			this.speed = this.game.clockTick * this.speedRate;
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

class Golem extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./sprites/jake.png");
		this.hitWallCount = 0;
		this.lastHit = new Ground(this.game, 0, 0, false);
	}

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 52, 68,
			this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
			this.dim.y, this.dim.y);
		this.worldBB.display(this.game);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& that !== entity) {
				if (entity instanceof Ground) {
					if (that.vel.y > 0) {
						if (that.lastWorldBB.bottom <= entity.worldBB.top
							&& (that.lastWorldBB.left) < entity.worldBB.right
							&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
							that.pos.y = entity.worldBB.top - that.dim.y;
							that.vel.y = -300;
						}
					}
					if (that.vel.y < 0) {
						if ((that.lastWorldBB.top) >= entity.worldBB.bottom
							&& (that.lastWorldBB.left) != entity.worldBB.right
							&& (that.lastWorldBB.right) != entity.worldBB.left) { // jumping up
							that.pos.y = entity.worldBB.bottom;
							that.vel.y = 300;
						}
					}
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right
						&& that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.bottom > entity.worldBB.top) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = 300;
					}
					if (that.vel.x > 0 && (that.lastWorldBB.right) <= entity.worldBB.left
						&& that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.bottom > entity.worldBB.top) { // going right
						that.pos.x = entity.worldBB.left - that.dim.x;
						that.vel.x = -300;
					}
					that.hitWallCount++;
					that.lastHit = entity;
				}
				if (entity instanceof MeleeAttack) {
					if (entity.vel.x > 0) {
						if (entity.pos.y > that.pos.y) {
							that.vel.x += 300;
							that.vel.y += 300;
                        } else {
							that.vel.x += 300;
							that.vel.y += -300;
						}
						that.pos.x = entity.pos.x + PARAMS.TILE_WIDTH;
					} else {
						if (entity.pos.y > that.pos.y) {
							that.vel.x += -300;
							that.vel.y += 300;
						} else {
							that.vel.x += -300;
							that.vel.y += -300;
						}
						that.pos.x = entity.pos.x - PARAMS.TILE_WIDTH;
					}
					if (that.lastHit instanceof Ground) {
						that.game.camera.score += 100;
						if (that.hitWallCount < 7) {
							that.game.camera.score += that.game.knight.combo * 100;
							that.game.knight.combo++;
							if (that.game.knight.combo > that.game.camera.highestCombo) {
								that.game.camera.highestCombo = that.game.knight.combo;
							}
						} else {
							that.game.knight.combo = 0;
                        }
					}
					that.hitWallCount = 0;
					that.lastHit = entity;
				}
			}
		});
		console.log("HitWallCount: " + this.hitWallCount);
		console.log("LastHit: " + this.lastHit);
		console.log("Current combo: " + this.game.knight.combo);

	}

	/** @override */
	update() {
		const TICK = this.game.clockTick;
		this.move(TICK);
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
