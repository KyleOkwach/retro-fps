class Wall {
    constructor(ctx, player, height = 40) {
        this.ctx = ctx;
        this.player = player;
        this.wallHeight = height;
        
        this.x1 = [];
        this.y1 = [];
        this.z1 = [];

        this.x2 = [];
        this.y2 = [];
        this.z2 = [];
        this.points = 2;

        // initial player coordinates
        this.pX = this.player.x;
        this.pY = this.player.y;
        this.pZ = this.player.z;
        this.pL = this.player.look;
        this.pA = this.player.angle;

        this.Cos = Math.cos(this.pA);
        this.Sin = Math.sin(this.pA);

        this.pointOffsets = [
            { x: 40, y: 10 },
            { x:40, y: 290 }
        ];
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
        let cords = { x: [], y: [], z: [], z2: [] };

        // wall vertices
        for(let i = 0; i < this.pointOffsets.length; i++) {
            // offset points by player
            const oX = this.pointOffsets[i].x - this.pX;
            const oY = this.pointOffsets[i].y - this.pY;
            
            // rotate points around world origin
            const wX = oX * this.Cos - oY * this.Sin;  // world X position
            const wY = oY * this.Cos - oX * this.Sin;  // world Y position
            const wZ = 0 - this.pZ + ((this.pL * wY/32));  // world Z position
            const wZ2 = wZ + this.wallHeight;  // z coordinates for second line

            cords.x[i] = wX;
            cords.y[i] = wY;
            cords.z[i] = wZ;
            cords.z2[i] = wZ2;
        }

        if(cords.y[0] < 1 && cords.y[1] < 1) { return; }  // if points are behind the player

        let bottomL = {};
        let topL = {};

        // if first point is behind the player
        if(cords.y[0] < 1) {
            bottomL = this.#clipBehindPlayer(cords.x[0], cords.y[0], cords.z[0], cords.x[1], cords.y[1], cords.z[1]);  // bottom line
            topL = this.#clipBehindPlayer(cords.x[0], cords.y[0], cords.z2[0], this.x2[1], cords.y[1], cords.z2[1]);  // top line

            // update coordinates
            cords.x[0] = bottomL.x;
            cords.y[0] = bottomL.y;
            cords.z[0] = bottomL.z;
    
            cords.x[0] = topL.x;
            cords.y[0] = topL.y;
            cords.z2[0] = topL.z;
        }

        if(cords.y[1] < 1) {
            bottomL = this.#clipBehindPlayer(cords.x[1], cords.y[1], cords.z[1], cords.x[0], cords.y[0], cords.z[0]);  // bottom line
            topL = this.#clipBehindPlayer(cords.x[1], cords.y[1], cords.z2[1], cords.x[0], cords.y[0], cords.z2[0]);  // top line
            
            cords.x[0] = bottomL.x;
            cords.y[0] = bottomL.y;
            cords.z[0] = bottomL.z;
    
            cords.x[0] = topL.x;
            cords.y[0] = topL.y;
            cords.z2[0] = topL.z;
        }

        
        for(let i = 0; i < this.points; i++) {
            this.x1[i] = cords.x[i] * settings.FOV/cords.y[i] + settings.screenW/2;  // bottom coordinate
            this.x2[i] = cords.x[i] * settings.FOV/cords.y[i] + settings.screenW/2;  // top coordinate

            this.y1[i] = cords.z[i] * settings.FOV/cords.y[i] + settings.screenH/2;
            this.y2[i] = cords.z2[i] * settings.FOV/cords.y[i] + settings.screenH/2;

            this.z1[i] = cords.z[i];
            this.z2[i] = cords.z2[i];
        }

        // DRAWING POINTS
        this.#drawWall(ctx, this.x1, this.y1, this.y2);
    }

    #clipBehindPlayer(x1, y1, z1, x2, y2, z2) {
        // To prevent weird bahaviour when wall is partially behind the player
        const da = y1;  // distance plane for point a
        const db = y2;  // distance plane for point b
        const d = da - db; if(d == 0) { d = 1; }

        const s = da / (da - db);  // intersection factor(between 0 and 1)

        x1 = x1 + s * (x2 - x1);

        y1 = y1 + s * (y2 - y1);
        if(y1 == 0) { y1 = 1; }  // prevent division by 0

        z1 = z1 + s * (z2 - z1);

        return {
            x: x1,
            y: y2,
            z: z2
        }
    }

    #drawWall(ctx, wX, wY1, wY2) {
        const grad1 = (wY1[1]-wY1[0])/(wX[1] - wX[0]);
        const grad2 = (wY2[1]-wY2[0])/(wX[1] - wX[0]);

        // X clipping
        if(wX[0] < 1) { wX[0] = 1 };  // clip left
        if(wX[1] < 1) { wX[1] = 1 };  // clip left
        if(wX[0] > settings.screenW) { wX[0] = settings.screenW - 1 };  // clip right
        if(wX[1] > settings.screenW) { wX[1] = settings.screenW - 1 };  // clip right
        
        for(let x = wX[0]; x < wX[1]; x++) {
            const y1 = utils.lerp(wX[0], wY1[0], x, grad1);

            const y2 = utils.lerp(wX[0], wY2[0], x, grad2);

            // Y clipping
            if(y1[0] < 1) { y1[0] = 1 };
            if(y2[1] < 1) { y2[1] = 1 };
            if(y1[0] > settings.screenH) { y1[0] = settings.screenH - 1 };
            if(y2[1] > settings.screenH) { y2[1] = settings.screenH - 1 };

            for(let y = y1; y < y2; y++) {
                if(x > 0 && x < settings.screenW && y > 0 && y < settings.screenH) {
                    utils.drawPixel(ctx, x, y, utils.colors[1], settings.pixelScale);
                }
            }
        }
    }
}