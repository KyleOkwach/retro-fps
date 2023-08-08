class Player {
    constructor(x, y, z, look, angle, controls) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.look = look;
        this.angle = angle;
        this.controls = controls;

        this.speed = 10.0;
    }

    update() {
        this.#physicsUpdate();
    }

    #physicsUpdate() {
        // movement
        if(this.controls.left) {
            this.angle -= 0.03;
        };
        if(this.controls.right) {
            this.angle += 0.03;
        };

        const dx = Math.sin(this.angle) * this.speed;
        const dy = Math.cos(this.angle) * this.speed;

        if(this.controls.forward) {
            this.x += dx;
            this.y += dy;
        }
        if(this.controls.backward) {
            this.x -= dx;
            this.y -= dy;
        }

        // strafing
        if(this.controls.strafeRight) {
            this.x += dx;
            this.y -= dy;
        }
        if(this.controls.strafeLeft) {
            this.x -= dx;
            this.y += dy;
        }

        // looking
        if(this.controls.lookLeft) { this.look -= 1; }
        if(this.controls.lookRight) { this.look += 1; }
        if(this.controls.lookUp) { this.z -= 4; }
        if(this.controls.lookDown) { this.z += 4; }
    }
}