const utils = {}

utils.colors = [
    "#703075", "#CC3184", "#E87D43", "#FFCE6B", "#DAF0D1",
    "#5DD477", "#25A2A8", "#4B56EB", "#2F328F", "#2C203D",
    "#7A8799", "#AEC2C2"
];

utils.drawPixel = (ctx, x, y, color, size=settings.pixelScale) => {  // default pixel scale is 3 pixels
    var roundedX = Math.round(x) * size;
    var roundedY = Math.round(y) * size;
    ctx.fillStyle = color || '#000';
    ctx.fillRect(roundedX, roundedY, size, size);
}

utils.lerp = (xi, yi, x, d) => {
    return yi + (x - xi) * d;
}

utils.degsToRads = (deg) => {
    return (deg * (Math.PI / 180));
}

utils.distance = (x1, y1, x2, y2) => {
    distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    return distance;
}

utils.textOutput = (container, label, text) => {
    container.innerText = `${label}: ${text}`;
}