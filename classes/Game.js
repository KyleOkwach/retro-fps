class Game {
    constructor(canvas, controls) {
        this.canvas = canvas;
        this.ctx = canvas.canvas.getContext("2d");
        this.controls = controls;

        this.pixelScale = settings.pixelScale;

        this.loadWalls = [
            // x1, y1, x2, y2, color
            { x1: 0, y1: 0, x2: 32, y2: 0, color: 0 },
            { x1: 32, y1: 0, x2: 32, y2: 32, color: 1 },
            { x1: 32, y1: 32, x2: 0, y2: 32, color: 0 },
            { x1: 0, y1: 32, x2: 0, y2: 0, color: 1 },

            { x1: 64, y1: 0, x2: 96, y2: 0, color: 2 },
            { x1: 96, y1: 0, x2: 96, y2: 32, color: 3 },
            { x1: 96, y1: 32, x2: 64, y2: 32, color: 2 },
            { x1: 64, y1: 32, x2: 64, y2: 0, color: 3 },

            { x1: 64, y1: 64, x2:96, y2: 64, color: 4 },
            { x1: 96, y1: 64, x2: 96, y2: 96, color: 5 },
            { x1: 96, y1: 96, x2: 64, y2: 96, color: 4 },
            { x1: 64, y1: 96, x2: 64, y2: 64, color: 5 },

            { x1: 0, y1: 64, x2: 32, y2: 64, color: 6 },
            { x1: 32, y1: 64, x2: 32, y2: 96, color: 7 },
            { x1: 32, y1: 96, x2: 0, y2: 96, color: 6 },
            { x1: 0, y1: 96, x2: 0, y2: 64, color: 7 },
        ];
        this.loadSectors = [
            // ws, we, z1, z2
            { ws: 0, we: 4, z1: 0, z2:  40 },  // sector 1
            { ws: 4, we: 8, z1: 0, z2:  40 },  // sector 2
            { ws: 8, we: 12, z1:  0, z2:  40} ,  // sector 3
            { ws: 12, we:16, z1: 0, z2: 40 },  // sector 4
        ]

        this.walls = [];
        this.sectors = this.loadSectors;

        // math variables
        this.cos = [];
        this.sin = [];

        this.#initialize();
    }

    #initialize() {
        // store sin/cos in degrees
        for(let x = 0; x < 360; x++) {
            this.cos[x] = Math.cos(x / 180 * Math.PI);
            this.sin[x] = Math.sin(x / 180 * Math.PI);
        }

        // initialize player
        this.player = new Player(70, -110, 20, 0, 0, this.controls);
        
        // load sectors
        for(let s = 0; s < this.loadSectors.length; s++) {
            this.sectors[s].ws = this.loadSectors[s].ws;
            this.sectors[s].we = this.loadSectors[s].we;
            this.sectors[s].z1 = this.loadSectors[s].z1;  // sector bottom height
            this.sectors[s].z2 = this.loadSectors[s].z2 - this.loadSectors[s].z1; // sector top height
        }

        this.#mapGen();

        this.#loadWalls();
    }

    update() {
        this.canvas.update();
        this.player.update();
    
        this.#sortSectors();
        this.#updateWalls()
    }

    #mapGen() {
        for(let s = 0; s < this.sectors.length; s++) {
            this.sectors[s].d = 0;
            for(let w = this.sectors[s].ws; w < this.sectors[s].we; w++) {
                // append walls to an array
                this.walls[w] = new Wall(this.ctx, this.player, this.sectors[s], this.loadWalls[w].x1, this.loadWalls[w].x2, this.loadWalls[w].y1, this.loadWalls[w].y2, this.loadWalls[w].color);

                this.#sectDistance(s, w);
            }
        }
    }

    // walls
    #loadWalls() {
        // load wall values
        for(let s = 0; s < this.sectors.length; s++) {
            for(let w = this.sectors[s].ws; w < this.sectors[s].we; w++) {
                // draw walls
                this.walls[w].draw3D(this.ctx);
                // this.#sectDistance(s, w);
            }
        }
    }

    #updateWalls() {
        // load wall values
        for(let s = 0; s < this.sectors.length; s++) {
            for(let w = this.sectors[s].ws; w < this.sectors[s].we; w++) {
                // update walls
                this.walls[w].update(this.player);
                this.#sectDistance(s, w);
            }
        }
    }

    // sectors
    #sortSectors() {
        const numSect = this.sectors.length;

        // order sectors by distance
        for(let s = 0; s < numSect; s++) {
            for(let w = 0; w < numSect - s - 1; w++) {
                if(this.sectors[w].d < this.sectors[w + 1].d) {
                    const st = this.sectors[w]; // temporary sector for sorting
                    this.sectors[w] = this.sectors[w + 1];
                    this.sectors[w + 1] = st;
                }
            }
        }
    }

    #sectDistance(s, w) {
        // updates the sector distance
        this.sectors[s].d = this.walls[w].wallDist;
    }
}