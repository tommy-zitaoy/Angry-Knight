class Taz extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./sprites/idle.png");
		this.setDimensions(32, 32);
		this.scale = 1;
		this.game.taz = this;

		this.state = 0;		// 0 is idle, 1 is running, 2 is jumping, 3 is falling, 4 is attacking
		this.facing = 0;	// 0 is left 1 is right
		this.animations = [];
		this.loadAnimations();
		this.isJumping = false;
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
							that.isJumping = false;
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
							that.isJumping = true;
							that.state = 2;
						}
						// top corners to entity's bottom corners
						if (that.vel.x > 0 && that.lastWorldBB.top < entity.worldBB.bottom
								&& that.lastWorldBB.right > entity.worldBB.left) {
							that.pos.y = entity.worldBB.left - that.dim.x;
							that.vel.y = 0;
						} else if (that.vel.x < 0 && that.lastWorldBB.top < entity.worldBB.bottom
								&& that.lastWorldBB.left < entity.worldBB.right) {
							that.pos.y = entity.worldBB.right;
							that.vel.y = 0;
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
	}

	/** @override */
	update() {
		const FALL_ACC = 1200;
		const WALK_SPEED = 200;
		const JUMP_VEL = 580;
		const TICK = this.game.clockTick;

		if (this.game.right) {
			this.vel.x = WALK_SPEED;
			if (this.isJumping == false) {
				this.state = 1;
			}
		} else if (this.game.left) {
			this.vel.x = -WALK_SPEED;
			if (this.isJumping == false) {
				this.state = 1;
			}
		} else {
			this.vel.x = 0;
			if (this.isJumping == false) {
				this.state = 0;
			}
		}

		if (!this.isJumping && this.game.B) {
			this.vel.y = -JUMP_VEL;
			this.game.B = false;
			this.isJumping = true;
			this.state = 2;
		} else {
			this.vel.y += FALL_ACC * TICK;
			this.isJumping = true;
		}

		this.move(TICK);
	}

	/** @override */
	draw(context) {
		console.log(this.state);
		if (this.state == 0) {
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
        } else {
			if (this.facing == 0) {
				this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
					context, this.pos.x, this.pos.y, this.scale, this.game.camera);
			} else {
				this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
					context, this.pos.x - PARAMS.TILE_WIDTH, this.pos.y, this.scale, this.game.camera);
			}
		}
		this.worldBB.display(this.game);
		this.agentBB.display(this.game);
	}
}