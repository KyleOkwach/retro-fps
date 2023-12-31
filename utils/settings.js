const settings = {};

settings.resolution = 1;
settings.FPS = 60;

settings.screenW = 160 * settings.resolution;
settings.screenH = 120 * settings.resolution;

settings.pixelScale = 4;

settings.canvasW = settings.screenW * settings.pixelScale;
settings.canvasH = settings.screenH * settings.pixelScale;

settings.FOV = 200;