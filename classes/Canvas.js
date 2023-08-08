class Canvas {
    constructor(container, width, height, color = "black") {
        this.width = width;
        this.heigh = height;
        this.color = color;

        this.canvas = document.createElement("canvas");
        this.canvas.height = height;
        this.canvas.width = width;
        this.canvas.style = `
            background-color: ${color};
        `

        container.appendChild(this.canvas);
    }

    update() {
        this.#redraw();
    }

    #redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}