class Controls {
    constructor() {
        // normal directions
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;

        // looking
        this.lookUp = false;
        this.lookDown = false;
        this.lookLeft = false;
        this.lookRight = false;

        // physics
        this.jump = false;

        //strafing
        this.strafeLeft = false;
        this.strafeRight = false;

        this.moveCamera = false;

        this.#addInputListeners();
    }

    #addInputListeners() {
        // press key
        document.onkeydown = (e) => {
            switch(e.key) {
                // toggling free roam
                case "m":
                case "M":
                    this.moveCamera = !this.moveCamera;
                    break

                case "w":
                case "W":
                    if(this.moveCamera) {
                        this.lookUp = true;
                    } else {
                        this.forward = true;
                    }
                    break;
                case "s":
                case "S":
                    if(this.moveCamera) {
                        this.lookDown = true;
                    } else {
                        this.backward = true;
                    }
                    break;
                case "a":
                case "A":
                    if(this.moveCamera) {
                        this.lookLeft = true;
                    } else {
                        this.left = true;
                    }
                    break;
                case "d":
                case "D":
                    if(this.moveCamera) {
                        this.lookRight = true;
                    } else {
                        this.right = true;
                    }
                    break;

                //strafing
                case "ArrowLeft":
                    this.strafeLeft = true;
                    break;
                case "ArrowRight":
                    this.strafeRight = true;
                    break;
            }
        }

        // release key
        document.onkeyup = (e) => {
            switch(e.key) {
                case "m":
                case "M":
                    this.moveCamera = !this.moveCamera;
                    break

                case "w":
                case "W":
                    if(this.moveCamera) {
                        this.lookUp = false;
                    } else {
                        this.forward = false;
                    }
                    break;
                case "s":
                case "S":
                    if(this.moveCamera) {
                        this.lookDown = false;
                    } else {
                        this.backward = false;
                    }
                    break;
                case "a":
                case "A":
                    if(this.moveCamera) {
                        this.lookLeft = false;
                    } else {
                        this.left = false;
                    }
                    break;
                case "d":
                case "D":
                    if(this.moveCamera) {
                        this.lookRight = false;
                    } else {
                        this.right = false;
                    }
                    break;
                    
                case "ArrowLeft":
                    this.strafeLeft = false;
                    break;
                case "ArrowRight":
                    this.strafeRight = false;
                    break;
            }
        }
    }
}