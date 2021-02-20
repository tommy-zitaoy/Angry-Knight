class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };

		this.currentLevel = 1;
		this.map = level_1_map;
		this.loadTestLevel();

		this.score = 0;
		this.timer = 30;
		this.highestCombo = 0;
		this.isGameOver = false;
	}

	loadTestLevel() {

		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer1.png", 2048, 1546, -110));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer2.png", 2048, 1546, -100));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer3.png", 2048, 1546, -90));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer4.png", 2048, 1546, -80));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer5.png", 2048, 1546, -70));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer6.png", 2048, 1546, -60));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer7.png", 2048, 1546, -50));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer8.png", 2048, 1546, -40));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer9.png", 2048, 1546, -30));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./sprites/layer10.png", 2048, 1546, -10));


		for (var i = 0; i < this.map[0].length; i++) {
			for (var j = 0; j < this.map.length; j++) {
				var sprite = this.map[j][i];
				if (sprite) {
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

		this.game.addEntity(new Golem(this.game, 200, 400));

		this.game.knight = new Knight(this.game, 100, 100);
		this.game.addEntity(this.game.knight);

	}

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;
		this.timer -= this.game.clockTick;
		if (this.timer <= 0) {
			this.isGameOver = true;
        }
	}

	draw(ctx) {
		if (!this.isGameOver) {
			ctx.font = "15px Arial";
			ctx.fillText(("Score: " + this.score), PARAMS.TILE_WIDTH, 1.5 * PARAMS.TILE_WIDTH);
			ctx.fillText(("Combo: " + this.game.knight.combo), PARAMS.TILE_WIDTH, 2 * PARAMS.TILE_WIDTH);
			ctx.fillText(("Timer: " + this.timer), 17 * PARAMS.TILE_WIDTH, 1.5 * PARAMS.TILE_WIDTH);
			ctx.stroke();
		} else {
			this.showResult(ctx);
        }
	}

	/** Show result after game is over. */
	showResult(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/end game GUI.png"), 150, 150);
		ctx.font = "30px Arial";
		ctx.fillText(("Score: " + this.score), 200, 225);
		ctx.fillText(("Highest combo: " + this.highestCombo), 200, 275);
		ctx.stroke();
    }
}
