class Game {
    constructor(screen, controls) {
        this.ctx = screen;
        this.controls = controls;

        this.pixelScale = settings.pixelScale;

        this.player = new Player(70, -110, 20, 0, 0, controls);
        this.wall = new Wall(this.ctx, this.player);

        // this.player = new Player(50, 50, 20, 0, 0, controls);
        // this.wall = new Wall(this.ctx, this.player.x, this.player.y, 50, 0, 30);
        
        this.#initialize();
    }

    #initialize() {
        this.wall.draw3D(this.ctx);
    }

    update() {
        this.#render(this.player);
    }

    #render(player) {
        this.ctx.clearRect(0, 0, settings.canvasW, settings.canvasH);
        this.player.update();
        this.wall.update(player);
    }

}