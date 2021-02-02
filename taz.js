class Taz extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./sprites/idle1.png");
		this.setDimensions(32, 64);
		this.scale = 2;
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
					if (that.vel.y > 0 && that.lastWorldBB.bottom <= entity.worldBB.top
						&& (that.lastWorldBB.left) < entity.worldBB.right
						&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
						that.pos.y = entity.worldBB.top - that.dim.y;
						that.vel.y = 0;
						that.isJumping = false;
					}
					if (that.vel.y < 0 && (that.lastWorldBB.top) >= entity.worldBB.bottom
						&& (that.lastWorldBB.left) != entity.worldBB.right
						&& (that.lastWorldBB.right) != entity.worldBB.left) { // jumping up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = 0;
						that.isJumping = true;
						that.state = 2;
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
					// bottom corners to entity's top corners
					if (that.vel.y > 0 && that.vel.x > 0 && that.lastWorldBB.bottom > entity.worldBB.top
						&& that.lastWorldBB.right > entity.worldBB.left) {
						that.pos.x = entity.worldBB.left - that.dim.x;
						that.vel.x = 0;
					}
					if (that.vel.y > 0 && that.vel.x < 0 && that.lastWorldBB.bottom > entity.worldBB.top
						&& that.lastWorldBB.left < entity.worldBB.right) {
						that.pos.x = entity.worldBB.right;
						that.vel.x = 0;
					}
					// top corners to entity's bottom corners
					if (that.vel.y < 0 && that.vel.x > 0 && that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.right > entity.worldBB.left) {
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = 0;
					}
					if (that.vel.y < 0 && that.vel.x < 0 && that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.left < entity.worldBB.right) {
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = 0;
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
			this.spritesheet, 0, 0, 60, 40, 4, 0.5, 0, false, true, true);
		this.animations[0][1] = new Animator(
			this.spritesheet, 0, 0, 60, 40, 4, 0.5, 0, false, true, false);

		// running
		this.spritesheet_run = ASSET_MANAGER.getAsset("./sprites/run.png");
		this.animations[1][0] = new Animator(
			this.spritesheet_run, 0, 0, 60, 40, 4, 0.20, 0, false, true, true);
		this.animations[1][1] = new Animator(
			this.spritesheet_run, 0, 0, 60, 40, 4, 0.20, 0, false, true, false);

		// jumping
		this.spritesheet_run = ASSET_MANAGER.getAsset("./sprites/jump.png");
		this.animations[2][0] = new Animator(
			this.spritesheet_run, 180, 0, 60, 40, 1, 0.5, 0, false, true, true);
		this.animations[2][1] = new Animator(
			this.spritesheet_run, 180, 0, 60, 40, 1, 0.5, 0, false, true, false);
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
		if (this.state == 1) {
			this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
				context, this.pos.x - 44, this.pos.y - 16, this.scale, this.game.camera);
		} else {
			this.animations[this.state][this.facing].drawFrame(this.game.clockTick,
				context, this.pos.x - 44, this.pos.y - 16, this.scale, this.game.camera);
		}
		this.worldBB.display(this.game);
		this.agentBB.display(this.game);
	}
}