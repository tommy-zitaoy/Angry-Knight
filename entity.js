/**
 * Basic entity object. Is used to represent entities which do not perform collision 
 * checking (such as platforms, ground, blocks, walls, etc.). All entities have a 
 * bounding box which agents can collide with.
 */
class Entity {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game });
        this.spritesheet = ASSET_MANAGER.getAsset(spritesheet);
        this.pos = { x: x, y: y };
        this.setDimensions(PARAMS.TILE_WIDTH, PARAMS.TILE_WIDTH);
        this.worldBB = this.makeDefaultBoundingBox();
        this.lastWorldBB = this.worldBB;
        this.animations = [];
    }

    setDimensions(width, height) {
        this.scale = 1;
        this.dim = { x: width, y: height };
    }

    /** Updates the bounding box to the current position of the entity. */
    updateBB() {
        this.lastWorldBB = this.worldBB;
        this.worldBB = this.makeDefaultBoundingBox();
    }

    /**
     * Draws the entity's sprite to the screen in the proper location.
     * @param {CanvasImageSource} context Canvas to draw on.
     */
    draw(context) {
        context.drawImage(
            this.spritesheet, 0, 0,   // Draw from top left of source
            this.dim.x, this.dim.y,   // Source image width & height
            this.pos.x,               // Canvas drawing position x
            this.pos.y ,              // Canvas drawing position y
            this.dim.x,               // Canvas drawing width
            this.dim.y);              // Canvas drawing height
    }

    /** Returns a default bounding box for entities. */
    makeDefaultBoundingBox() {
        return new BoundingBox(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
    }

    /**
     * Location to define animations for this entity. This method should be overridden 
     * by the implementing entity if it has animations in its spritesheet.
     */
    loadAnimations() {
        console.log(
            "Animations not defined for Entity at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /**
     * Location to update the internal state of this entity. This method should be 
     * overriden by the implementing entity if it changes over time.
     */
    update() {
        console.log(
            "Update not defined for Entity at x="
            + this.pos.x + ", y=" + this.pos.y);
    }
}

/**
 * Basic agent object. Is used to represent entities which are capable of colliding
 * with other entities (such as enemies, the druid, powerups, etc.). All agents have
 * a bounding box to collide with entities and a bounding circle to collide with other
 * agents. BB is used to stand for both bounding boxes and bounding cicles.
 */ 
class Agent extends Entity {
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);
        this.vel = { x: 0, y: 0 };
        
        this.facing = 0; // Left = 0, Right = 1
        this.loadAnimations();
    }

    /** Updates this entity's facing direction. */
    updateFacing() {
        if (this.vel.x < 0) {
            this.facing = 0;
        } else if (this.vel.x > 0) {
            this.facing = 1;
        }
    }

    /**
     * Moves this entity based on its x and y velocity, then does collision checking and
     * updates the facing direction.
     * @param {number} tick Amount of time which has passed since the last tick in ms.
     */
    move(tick) {
        this.pos.x += this.vel.x * tick;
        this.pos.y += this.vel.y * tick;
        this.updateBB();
        this.checkCollisions();
        this.worldBB = this.makeDefaultBoundingBox();
        this.updateFacing();
        this.updateBB();
    }

    /** Returns a default bounding circle for agents. */
    makeDefaultBoundingCircle() {
        return new BoundingCircle(
            this.pos.x + this.dim.x / 2,
            this.pos.y + this.dim.y / 2,
            Math.min(this.dim.x, this.dim.y) / 2);
    }

    /** @override */
    draw(context) {
        this.animations[this.facing].drawFrame(
            this.game.clockTick, context,
            this.pos.x, this.pos.y,
            this.scale, this.game.camera);
        this.worldBB.display(this.game);
    }

    /** 
     * Checks for when this entity collides with another entity in the game world.
	 * Updates position and variables accordingly.
     */
    checkCollisions() {
        console.log(
            "Collisions not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /** @override */
    loadAnimations() {
        console.log(
            "Animations not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /** @override */
    update() {
        console.log(
            "Update not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }
}

/** Checks collisions with entities. */ 
class BoundingBox {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });

        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    /**
     * Checks if this bounding box is colliding with another.
     * @param {BoundingBox} other Bounds to collide with.
     */
    collide(other) {
        return (this.right > other.left
            && this.left < other.right
            && this.top < other.bottom
            && this.bottom > other.top);
    }

    /**
     * Displays the bounding box for testing purposes.
     * @param {CanvasImageSource} game.context Canvas to draw on.
     */
    display(game) {
        if (PARAMS.DEBUG) {
            game.context.save();
            game.context.strokeStyle = 'red';
            game.context.lineWidth = PARAMS.BB_LINE_WIDTH;
            game.context.strokeRect(
                this.x - game.camera.pos.x,
                this.y - game.camera.pos.y,
                this.width, this.height);
            game.context.restore();
        }
    }
}