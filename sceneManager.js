class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };

		this.currentLevel = 1;
		this.map = level_1_map;
		this.loadTestLevel();
	}

	loadTestLevel() {

	/* Switch to this once collision detection is handled */

		for (var i = 0; i < this.map[0].length; i++) {
			for (var j = 0; j < this.map.length; j++) {
				var sprite = this.map[j][i];
				if (sprite) {
					console.log("sprite: " + sprite);
					if (sprite == 1) {
						this.game.addEntity(new Ground(
							this.game, i * PARAMS.TILE_WIDTH, j * PARAMS.TILE_WIDTH, false));
					} else if (sprite == 2) {
						this.game.addEntity(new Ground(
							this.game, i * PARAMS.TILE_WIDTH, j * PARAMS.TILE_WIDTH, true));
					}
				}
			}
		}

		let taz = new Taz(this.game, 100, 100);
		this.game.addEntity(taz);

	}

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;

		this.pos.x = this.game.taz.agentBB.x - PARAMS.CANVAS_WIDTH / 2;
		this.pos.y = this.game.taz.agentBB.y - PARAMS.CANVAS_HEIGHT + PARAMS.TILE_WIDTH * 3;
		if (this.pos.x < 0) this.pos.x = 0
		if (this.pos.y < 0) this.pos.y = 0
	}

	draw() {

	}
}
