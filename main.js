var GAME_ENGINE = new GameEngine();
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/idle.png");
ASSET_MANAGER.queueDownload("./sprites/ground.png");
ASSET_MANAGER.queueDownload("./sprites/grass-ground.png");
ASSET_MANAGER.queueDownload("./sprites/run.png");
ASSET_MANAGER.queueDownload("./sprites/jump.png");
ASSET_MANAGER.queueDownload("./sprites/background.png");
ASSET_MANAGER.queueDownload("./sprites/attack.png");
ASSET_MANAGER.queueDownload("./sprites/j1.png");
ASSET_MANAGER.queueDownload("./sprites/j2.png");
ASSET_MANAGER.queueDownload("./sprites/j3.png");
ASSET_MANAGER.queueDownload("./sprites/j4.png");
ASSET_MANAGER.queueDownload("./sprites/layer1.png");
ASSET_MANAGER.queueDownload("./sprites/layer2.png");
ASSET_MANAGER.queueDownload("./sprites/layer3.png");
ASSET_MANAGER.queueDownload("./sprites/layer4.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var context = canvas.getContext('2d');

	GAME_ENGINE.init(context);
	new SceneManager(GAME_ENGINE);
	GAME_ENGINE.start();
});
