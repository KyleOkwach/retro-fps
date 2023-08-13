class Wall {
    constructor(ctx, player, sector, wall, color = utils.colors[1]) {
        this.ctx = ctx;
        this.player = player;
        this.wallHeight = 40;
        this.sector = sector;
        this.wall = wall;
        this.color = utils.colors[this.wall.color] || color;

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
        this.pointOffsets = [
            { x: this.wall.x1, y: this.wall.y1 },
            { x: this.wall.x2, y: this.wall.y2 }
        ];
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
        // wall vertices
        for(let i = 0; i < this.points; i++) {
            // offset points by player
            const oX1 = this.pointOffsets[i].x - this.pX;
            const oX2 = this.pointOffsets[i].x - this.pX;

            const oY1 = this.pointOffsets[i].y - this.pY;
            const oY2 = this.pointOffsets[i].y - this.pY;
            
            // rotate points around world origin
            this.coords.x1[i] = oX1 * this.Cos - oY1 * this.Sin;  // world X position
            this.coords.x2[i] = oX2 * this.Cos - oY2 * this.Sin;

            this.coords.y1[i] = oY1 * this.Cos + oX1 * this.Sin;  // world Y position
            this.coords.y2[i] = oY2 * this.Cos + oX2 * this.Sin;

            this.coords.z1[i] = this.sector.z1 - this.pZ + ((this.pL * this.coords.y1[i]/32));  // world Z position
            this.coords.z2[i] = this.coords.z1[i] + this.sector.z2;  // z coordinates for second line
        }
        
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

        // DRAWING POINTS
        this.#drawWall(ctx, this.coords.x1, this.coords.y1, this.coords.y2);
        this.wallDist /= this.sector.we - this.sector.ws;  // average sector distance
    }

    #clipBehindPlayer(x1, y1, z1, x2, y2, z2) {
        // To prevent weird bahaviour when wall is partially behind the player
        const da = y1;  // distance plane for point a
        const db = y2;  // distance plane for point b
        const d = da - db; if(d == 0) { d = 1; }

        const s = da / (da - db);  // intersection factor(between 0 and 1)

        const clippedX = x1 + s * (x2 - x1);

        const clippedY = y1 + s * (y2 - y1);
        if(this.coords.y1[0] == 0) { this.coords.y1[0] = 1; }  // prevent division by 0

        const clippedZ = z1 + s * (z2 - z1);

        return [clippedX, clippedY, clippedZ];
    }

    #drawWall(ctx, wX, wY1, wY2) {
        const grad1 = (wY1[1]-wY1[0])/(wX[1] - wX[0]);
        const grad2 = (wY2[1]-wY2[0])/(wX[1] - wX[0]);

        // X clipping
        if(wX[0] < 1) { wX[0] = 1 };  // clip left
        if(wX[1] < 1) { wX[1] = 1 };  // clip left
        if(wX[0] > settings.screenW) { wX[0] = settings.screenW - 1 };  // clip right
        if(wX[1] > settings.screenW) { wX[1] = settings.screenW - 1 };  // clip right
        
        // console.log(`[${wX}] [${wY1}] [${wY2}] grad: [${grad1}, ${grad2}]`)
        for(let x = wX[0]; x <= wX[1]; x++) {
            const y1 = utils.lerp(wX[0], wY1[0], x, grad1);

            const y2 = utils.lerp(wX[0], wY2[0], x, grad2);

            // Y clipping
            if(y1[0] < 1) { y1[0] = 1 };
            if(y2[1] < 1) { y2[1] = 1 };
            if(y1[0] > settings.screenH) { y1[0] = settings.screenH - 1 };
            if(y2[1] > settings.screenH) { y2[1] = settings.screenH - 1 };
            
            // console.log(y1, y2)
            for(let y = y1; y < y2; y++) {
                if(x > 0 && x < settings.screenW && y > 0 && y < settings.screenH) {
                    utils.drawPixel(ctx, x, y, this.color, settings.pixelScale);
                }
            }
        }
    }
}