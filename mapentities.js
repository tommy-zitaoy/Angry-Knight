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
