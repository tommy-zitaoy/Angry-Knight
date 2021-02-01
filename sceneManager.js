class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };

		this.sprites = new Array(2);

		this.currentLevel = 1;
		this.map = level_1_map;

		mapLevel1(game, this);

		this.sprites[0] = null;
		this.sprites[1] = 1;

		this.loadTestLevel();
	}

	loadTestLevel() {

	/* Switch to this once collision detection is handled */

		for (var i = 0; i < this.map[0].length; i++) {
			for (var j = 0; j < this.map.length; j++) {
				var sprite = this.sprites[this.map[j][i]];
				//var currentLevel = this.currentLevel;
				if (sprite) {
					if (sprite == 1) {
						this.game.addEntity(new Ground(
							this.game, i * PARAMS.TILE_WIDTH, j * PARAMS.TILE_WIDTH, 1));
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
