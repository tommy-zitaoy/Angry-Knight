var GAME_ENGINE = new GameEngine();
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/idle.png");
ASSET_MANAGER.queueDownload("./sprites/ground.png");
ASSET_MANAGER.queueDownload("./sprites/grass-ground.png");
ASSET_MANAGER.queueDownload("./sprites/run.png");
ASSET_MANAGER.queueDownload("./sprites/jump.png");
ASSET_MANAGER.queueDownload("./sprites/attack.png");
ASSET_MANAGER.queueDownload("./sprites/layer1.png");
ASSET_MANAGER.queueDownload("./sprites/layer2.png");
ASSET_MANAGER.queueDownload("./sprites/layer3.png");
ASSET_MANAGER.queueDownload("./sprites/layer4.png");
ASSET_MANAGER.queueDownload("./sprites/layer5.png");
ASSET_MANAGER.queueDownload("./sprites/layer6.png");
ASSET_MANAGER.queueDownload("./sprites/layer7.png");
ASSET_MANAGER.queueDownload("./sprites/layer8.png");
ASSET_MANAGER.queueDownload("./sprites/layer9.png");
ASSET_MANAGER.queueDownload("./sprites/layer10.png");
ASSET_MANAGER.queueDownload("./sprites/layer11.png");
ASSET_MANAGER.queueDownload("./sprites/end game GUI.png");
ASSET_MANAGER.queueDownload("./sprites/jake.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var context = canvas.getContext('2d');

	GAME_ENGINE.init(context);
	new SceneManager(GAME_ENGINE);
	GAME_ENGINE.start();
});
