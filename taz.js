class Taz extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./sprites/idle.png");
		this.setDimensions(32, 32);
		this.scale = 1;
		this.game.taz = this;

		this.state = 0;		// 0 is idle, 1 is running, 2 is jumping, 3 is attacking
		this.facing = 0;	// 0 is left 1 is right
		this.animations = [];
		this.loadAnimations();
		this.attackCoolDown = 0;
		//this.isAttacking
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
							that.vel.y = 0;
							if (that.state == 2) that.state = 0;
						}
						// for corner to corner collision
						if (that.lastWorldBB.bottom > entity.worldBB.top) {
							if (that.vel.x > 0 && that.lastWorldBB.right > entity.worldBB.left) {
								that.pos.x = entity.worldBB.left - that.dim.x;
								that.vel.x = 0;
							} else if (that.vel.x < 0 && that.lastWorldBB.left < entity.worldBB.right) {
								that.pos.x = entity.worldBB.right;
								that.vel.x = 0;
							}
                        }
					}
					if (that.vel.y < 0) {
						if ((that.lastWorldBB.top) >= entity.worldBB.bottom
							&& (that.lastWorldBB.left) != entity.worldBB.right
							&& (that.lastWorldBB.right) != entity.worldBB.left) { // jumping up
							that.pos.y = entity.worldBB.bottom;
							that.vel.y = 0;
							that.state = 2;
						}
						// top corners to entity's bottom corners
						if (that.vel.x > 0 && that.lastWorldBB.top < entity.worldBB.bottom
							&& that.lastWorldBB.right > entity.worldBB.left) {
							that.pos.x = entity.worldBB.left - that.dim.x;
							that.vel.x = 0;
						} else if (that.vel.x < 0 && that.lastWorldBB.top < entity.worldBB.bottom
							&& that.lastWorldBB.left < entity.worldBB.right) {
							that.pos.x = entity.worldBB.right;
							that.vel.x = 0;
						}
					}
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right
						&& that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.bottom > entity.worldBB.top) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = 0;
					}
					if (that.vel.x > 0 && (that.lastWorldBB.right) <= entity.worldBB.left
						&& that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.bottom > entity.worldBB.top) { // going right
						that.pos.x = entity.worldBB.left - that.dim.x;
						that.vel.x = 0;
					}
				}
			}
		});
	}

	/** @override */
	loadAnimations() {
		for (var i = 0; i < 6; i++) { // six states
			this.animations.push([]);
			for (var j = 0; j < 2; j++) { // three sizes (star-power not implemented yet)
				this.animations[i].push([]);
			}
		}
		// idle
		this.animations[0][0] = new Animator(
			this.spritesheet, 0, 0, 64, 32, 6, 0.5, 0, false, true, false);
		this.animations[0][1] = new Animator(
			this.spritesheet, 0, 0, 64, 32, 6, 0.5, 0, false, true, true);

		// running
		this.spritesheet_run = ASSET_MANAGER.getAsset("./sprites/run.png");
		this.animations[1][0] = new Animator(
			this.spritesheet_run, 0, 0, 64, 33, 8, 0.1, 0, false, true, false);
		this.animations[1][1] = new Animator(
			this.spritesheet_run, 0, 0, 64, 33, 8, 0.1, 0, false, true, true);

		// jumping
		this.spritesheet_jump = ASSET_MANAGER.getAsset("./sprites/jump.png");
		this.animations[2][0] = new Animator(
			this.spritesheet_jump, 0, 0, 48, 48, 2, 0.1, 0, false, true, false);
		this.animations[2][1] = new Animator(
			this.spritesheet_jump, 0, 0, 48, 48, 2, 0.1, 0, false, true, true);

		// jumping
		this.spritesheet_attack = ASSET_MANAGER.getAsset("./sprites/attack.png");
		this.animations[3][0] = new Animator(
			this.spritesheet_attack, 0, 0, 128, 64, 15, 0.07, 0, false, true, true);
		this.animations[3][1] = new Animator(
			this.spritesheet_attack, 0, 0, 128, 64, 15, 0.07, 0, false, true, false);
	}

	/** @override */
	update() {
		const FALL_ACC = 1200;
		const WALK_SPEED = 200;
		const JUMP_VEL = 580;
		const TICK = this.game.clockTick;

		this.attackCoolDown -= TICK;

		if (this.game.right && this.state != 3) {
			this.vel.x = WALK_SPEED;
			if (this.state != 2) {
				this.state = 1;
			}
		} else if (this.game.left && this.state != 3) {
			this.vel.x = -WALK_SPEED;
			if (this.state != 2) {
				this.state = 1;
			}
		} else if (this.game.A && this.state != 2 && this.attackCoolDown <= 0) {
			this.state = 3;
			this.attackCoolDown = 1.05;
			this.game.A = false;
			this.vel.x = 0;
			if (this.facing == 0) { // left
				this.game.addEntity(new MeleeAttack(this.game, this.pos.x + PARAMS.TILE_WIDTH, this.pos.y - PARAMS.TILE_WIDTH, this.facing));
			} else { // right
				this.game.addEntity(new MeleeAttack(this.game, this.pos.x - PARAMS.TILE_WIDTH, this.pos.y - PARAMS.TILE_WIDTH, this.facing));
            }
		} else if (this.attackCoolDown <= 0){
			this.vel.x = 0;
			if (this.state != 2) {
				this.state = 0;
			}
		}

		if (this.game.B && this.state != 2 && this.state != 3) {
			this.vel.y = -JUMP_VEL;
			this.game.B = false;
			this.state = 2;
		} else {
			this.vel.y += FALL_ACC * TICK;
		}

		this.move(TICK);
	}

	/** @override */
	draw(context) {
		if (this.state == 0 || this.state == 1) {
			if (this.facing == 0) { // idle
				this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
					context, this.pos.x, this.pos.y, this.scale, this.game.camera);
			} else {
				this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
					context, this.pos.x - PARAMS.TILE_WIDTH, this.pos.y, this.scale, this.game.camera);
            }
		} else if (this.state == 2) { // jump
			if (this.facing == 0) {
				this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
					context, this.pos.x, this.pos.y - 12, this.scale, this.game.camera);
			} else {
				this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
					context, this.pos.x - 16, this.pos.y - 12, this.scale, this.game.camera);
			}
		} else if (this.state == 3) { // attack
			if (this.facing == 0) {
				this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
					context, this.pos.x - 64, this.pos.y - 32, this.scale, this.game.camera);
			} else {
				this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
					context, this.pos.x - 32, this.pos.y - 32, this.scale, this.game.camera);
			}
		}
		this.worldBB.display(this.game);
		this.agentBB.display(this.game);
	}
}


// for testing
class MeleeAttack extends Agent{
	constructor(game, x, y, direction) {
		super(game, x, y);
		this.setDimensions(32, 64);
		this.worldBB = this.makeDefaultBoundingBox();
		this.existTime = 0.7;
		if (direction == 0) {
			this.vel.x = -256;
			this.MIN_X = x - PARAMS.TILE_WIDTH * 2;
		} else {
			this.vel.x = 256;
			this.MAX_X = x + PARAMS.TILE_WIDTH * 2;
        }
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& that !== entity) {
				if (entity instanceof Golem) {
					entity.removeFromWorld = true;
				}
			}
		});
	}

	/** @override */
	update() {
		const TICK = this.game.clockTick;
		this.existTime -= TICK;
		if (this.existTime <= 0) {
			this.removeFromWorld = true;
		}
		this.checkCollisions();
		if (this.vel.x > 0 && this.pos.x >= this.MAX_X) this.vel.x = 0;
		if (this.vel.x < 0 && this.pos.x <= this.MIN_X) this.vel.x = 0;
		this.move(TICK);
	}

	/** @override */
	draw() {
		this.worldBB.display(this.game);
		this.agentBB.display(this.game);
	}

}

// for testing
class Golem extends Entity {
	constructor(game, x, y) {
		super(game, x, y, "./sprites/ground.png");
		//this.vel.x = PARAMS.TILE_WIDTH;
		//this.vel.y = PARAMS.TILE_WIDTH;
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