class Wall {
    constructor(ctx, player, sector, x1, x2, y1, y2, color = 1) {
        this.ctx = ctx;
        this.player = player;
        this.wallHeight = 40;
        this.sector = sector;
        this.x1 = x1; this.x2 = x2;
        this.y1 = y1; this.y2 = y2;
        this.color = utils.colors[color];
        this.bCulling = false;

        // initial player coordinates
        this.pX = this.player.x;
        this.pY = this.player.y;
        this.pZ = this.player.z;
        this.pL = this.player.look;
        this.pA = this.player.angle;

        this.Cos = Math.cos(this.pA);
        this.Sin = Math.sin(this.pA);

        this.wallDist = 0;

        this.points = 2;
        this.coords = {
            x1: [], y1: [], z1: [],
            x2: [], y2: [], z2: [] 
        };  // vertex coordinates
        this.top = [];
        this.bottom = [];
    }

    update(player) {
        // updated values
        this.player = player;

        this.pX = this.player.x;
        this.pY = this.player.y;
        this.pZ = this.player.z;
        this.pL = this.player.look;
        this.pA = this.player.angle;

        this.Cos = Math.cos(this.pA);
        this.Sin = Math.sin(this.pA);

        this.draw3D(this.ctx);
    }

    draw3D(ctx) {
        for(let face = 0; face < 2; face++) {
            // WALL VERTICES
            // offset points by player
            let oX1 = this.x1 - this.pX;
            let oX2 = this.x2 - this.pX;

            let oY1 = this.y1 - this.pY;
            let oY2 = this.y2 - this.pY;

            if (face === 0 && this.bCulling) {
                // swap vertices
                let swap = 0;
                swap = oX2;
                oX2 = oX1;
                oX1 = swap;

                swap = oY2;
                oY2 = oY1;
                oY1 = swap;
            }
            
            // rotate points around world origin
            this.coords.x1[0] = oX1 * this.Cos - oY1 * this.Sin;  // world X position
            this.coords.x1[1] = oX2 * this.Cos - oY2 * this.Sin;
            this.coords.x2[0] = oX1 * this.Cos - oY1 * this.Sin;
            this.coords.x2[1] = oX2 * this.Cos - oY2 * this.Sin;

            this.coords.y1[0] = oY1 * this.Cos + oX1 * this.Sin;  // world Y position
            this.coords.y1[1] = oY2 * this.Cos + oX2 * this.Sin;
            this.coords.y2[0] = oY1 * this.Cos + oX1 * this.Sin;
            this.coords.y2[1] = oY2 * this.Cos + oX2 * this.Sin;

            this.coords.z1[0] = this.sector.z1 - this.pZ + ((this.pL * this.coords.y1[0]/64));  // world Z position
            this.coords.z1[1] = this.sector.z1 - this.pZ + ((this.pL * this.coords.y1[1]/64));
            this.coords.z2[0] = this.coords.z1[0] + this.sector.z2;  // z coordinates for second line
            this.coords.z2[1] = this.coords.z1[1] + this.sector.z2;
            
            this.wallDist = utils.distance(
                0, 0,
                (this.coords.x1[0] + this.coords.x1[1])/2,
                (this.coords.y1[0] + this.coords.y1[1])/2
            );  //store the wall distance
    
            if(this.coords.y1[0] < 1 && this.coords.y1[1] < 1) { return; }  // if points are behind the player
    
            // if first point is behind the player
            if(this.coords.y1[0] < 1) {
                this.bottom = this.#clipBehindPlayer(this.coords.x1[0], this.coords.y1[0], this.coords.z1[0], this.coords.x1[1], this.coords.y1[1], this.coords.z1[1]);  // bottom line
                this.coords.x1[0] = this.bottom[0];
                this.coords.y1[0] = this.bottom[1];
                this.coords.z1[0] = this.bottom[2];
    
                this.top = this.#clipBehindPlayer(this.coords.x2[0], this.coords.y2[0], this.coords.z2[0], this.coords.x2[1], this.coords.y2[1], this.coords.z2[1]);  // top line
                this.coords.x2[0] = this.top[0];
                this.coords.y2[0] = this.top[1];
                this.coords.z2[0] = this.top[2];
            }
    
            if(this.coords.y1[1] < 1) {
                this.#clipBehindPlayer(this.coords.x1[1], this.coords.y1[1], this.coords.z1[1], this.coords.x1[0], this.coords.y1[0], this.coords.z1[0]);  // bottom line
                this.coords.x1[1] = this.bottom[0];
                this.coords.y1[1] = this.bottom[1];
                this.coords.z1[1] = this.bottom[2];
    
                this.#clipBehindPlayer(this.coords.x2[1], this.coords.y2[1], this.coords.z2[1], this.coords.x2[0], this.coords.y2[0], this.coords.z2[0]);  // top line
                this.coords.x2[1] = this.top[0];
                this.coords.y2[1] = this.top[1];
                this.coords.z2[1] = this.top[2];
            }
            
            for(let i = 0; i < this.points; i++) {
                this.coords.x1[i] = this.coords.x1[i] * settings.FOV/this.coords.y1[i] + settings.screenW/2;  // bottom coordinate
                this.coords.x2[i] = this.coords.x2[i] * settings.FOV/this.coords.y2[i] + settings.screenW/2;  // top coordinate
                
                this.coords.y1[i] = this.coords.z1[i] * settings.FOV/this.coords.y1[i] + settings.screenH/2;
                this.coords.y2[i] = this.coords.z2[i] * settings.FOV/this.coords.y2[i] + settings.screenH/2;
                
                this.coords.z1[i] = this.coords.z1[i];
                this.coords.z2[i] = this.coords.z2[i];
            }

            this.#drawWall(ctx, this.coords.x1, this.coords.x2, this.coords.y1, this.coords.y2);
            this.#drawWall(ctx, this.coords.x2, this.coords.x1, this.coords.y2, this.coords.y1);
            this.wallDist /= this.sector.we - this.sector.ws;  // average sector distance
        }
    }

    #clipBehindPlayer(x1, y1, z1, x2, y2, z2) {
        // To prevent weird bahaviour when wall is partially behind the player
        const da = y1;  // distance plane for point a
        const db = y2;  // distance plane for point b
        var d = da - db; if(d == 0) { d = 1; }

        const s = da / (da - db);  // intersection factor(between 0 and 1)

        const clippedX = x1 + s * (x2 - x1);

        const clippedY = y1 + s * (y2 - y1);
        if(this.coords.y1[0] == 0) { this.coords.y1[0] = 1; }  // prevent division by 0

        const clippedZ = z1 + s * (z2 - z1);

        return [clippedX, clippedY, clippedZ];
    }

    #drawWall(ctx, wX1, wX2, wY1, wY2) {
        const grad1 = (wY1[1]-wY1[0])/(wX1[1] - wX1[0]);
        const grad2 = (wY2[1]-wY2[0])/(wX1[1] - wX1[0]);

        // X clipping
        if(wX1[0] < 1) { wX1[0] = 1 };  // clip left
        if(wX1[1] < 1) { wX1[1] = 1 };  // clip left
        if(wX1[0] > settings.screenW) { wX1[0] = settings.screenW - 1; }  // clip right
        if(wX1[1] > settings.screenW) { wX1[1] = settings.screenW - 1; }  // clip right

        for(let x = wX1[0]; x <= wX1[1]; x++) {
            let y1 = utils.lerp(wX1[0], wY1[0], x, grad1);

            let y2 = utils.lerp(wX1[0], wY2[0], x, grad2);

            // Y clipping
            if(y1 < 1) { y1 = 1 };
            if(y2 < 1) { y2 = 1 };
            if(y1 > settings.screenH) { y1 = settings.screenH - 1 };
            if(y2 > settings.screenH) { y2 = settings.screenH - 1 };

            for(let y = y1; y < y2; y++) {
                if(x > 0 && x < settings.screenW && y > 0 && y < settings.screenH) {
                    utils.drawPixel(ctx, x, y, this.color, settings.pixelScale);
                }
            }
        }
    }
}