import { GAME_CONFIG, TILE_TYPES } from './constants.js';

export class Camera {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    leftCam() {
        return this.x + (this.width * GAME_CONFIG.CAMERA_OFFSET_X);
    }

    rightCam() {
        return this.x + (this.width * (1 - GAME_CONFIG.CAMERA_OFFSET_X));
    }

    topCam() {
        return this.y + (this.height * GAME_CONFIG.CAMERA_OFFSET_Y);
    }

    bottomCam() {
        return this.y + (this.height * GAME_CONFIG.CAMERA_OFFSET_Y);
    }

    followTarget(target) {
        if (target.X < this.leftCam()) {
            this.x = target.X - (this.width * 0.25);
        }
        if (target.X + target.width > this.rightCam()) {
            this.x = target.X + target.width - (this.width * 1.5);
        }
        if (target.Y < this.topCam()) {
            this.y = target.Y - (this.height * 0.25);
        }
        if (target.Y + target.height > this.bottomCam()) {
            this.y = target.Y + target.height - (this.height * 0.75);
        }
    }
}

export class WorldMap {
    constructor(onImagesLoaded = null) {
        this.tileSize = GAME_CONFIG.TILE_SIZE;
        this.map = this.initializeMap();
        this.tileImages = {};
        this.imagesLoaded = false;
        this.loadingPromises = [];
        this.onImagesLoadedCallback = onImagesLoaded;
        this.loadTileImages();
    }

    initializeMap() {
        return [
            [18, 18, 18, 18, 18, 18, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [18, 1, 2, 1, 3, 2, 1, 1, 2, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 18, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [18, 1, 2, 2, 2, 2, 1, 1, 2, 1, 0, 0, 2, 2, 2, 2, 2, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [18, 1, 2, 3, 1, 1, 4, 1, 2, 5, 1, 0, 2, 5, 2, 19, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 5, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [18, 1, 1, 2, 2, 1, 2, 2, 2, 1, 0, 0, 2, 3, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 2, 18, 18, 18, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [18, 1, 1, 6, 2, 1, 3, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 1, 18, 6, 18, 18, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [18, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 1, 1, 1, 2, 1, 6, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 18, 1, 1, 18, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 0, 13, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 1, 2, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
            [18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
            [18, 1, 1, 1, 2, 1, 1, 1, 1, 1, 8, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 14, 13, 13, 13, 13, 14, 13, 13, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
            [18, 1, 2, 2, 2, 2, 2, 1, 1, 1, 8, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [18, 1, 1, 2, 3, 2, 1, 1, 1, 1, 1, 8, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [18, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 14, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [18, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 14, 13, 13, 14, 3, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
            [18, 2, 1, 1, 4, 1, 1, 1, 1, 1, 2, 2, 1, 1, 8, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
            [18, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
            [18, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
            [18, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 13, 13, 14, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
            [18, 2, 2, 2, 3, 1, 2, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
            [18, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 13, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
            [18, 1, 1, 1, 1, 1, 2, 1, 2, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 13, 14, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 13, 13, 13, 13, 13, 13, 14, 13, 13, 13, 13, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
            [18, 1, 1, 2, 2, 1, 1, 1, 3, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
            [18, 1, 1, 2, 2, 1, 2, 1, 2, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 14, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 8, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 13, 13, 13, 13, 14, 13, 13, 14, 13, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [2, 2, 2, 2, 2, 3, 2, 1, 1, 1, 8, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 8, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 8, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 18, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 18, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 18, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 18, 18, 18, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 0]
        ];
    }

    loadTileImages() {
        // Create loading promises for each image - matching the old implementation exactly
        const imageLoadPromises = [
            this.loadImageWithPromise('grount100x50.png', TILE_TYPES.GROUND_COMMON),           // col == 1
            this.loadImageWithPromise('ground100x50Arvores.png', TILE_TYPES.FOREST),          // col == 2
            this.loadImageWithPromise('ground100x50City.png', TILE_TYPES.CITY),               // col == 3
            this.loadImageWithPromise('ground100x50Mansao.png', TILE_TYPES.MANSION),          // col == 4
            this.loadImageWithPromise('ground100x50DarkCastle.png', TILE_TYPES.DARK_CASTLE),  // col == 5
            this.loadImageWithPromise('ground100x50Tower.png', TILE_TYPES.TOWER),             // col == 6
            this.loadImageWithPromise('sea100x50BronkenBridge.png', TILE_TYPES.WATER),        // col == 7
            this.loadImageWithPromise('groundEdge100x50Bottom.png', TILE_TYPES.BOTTOM_EDGE),  // col == 8
            this.loadImageWithPromise('groundEdge100x50Top.png', TILE_TYPES.TOP_EDGE),        // col == 9
            this.loadImageWithPromise('groundEdge100x50EdgeBottom.png', TILE_TYPES.EDGE_90_DEGREE), // col == 10
            this.loadImageWithPromise('groundEdge100x50Left.png', TILE_TYPES.LEFT_EDGE),      // col == 11
            this.loadImageWithPromise('groundEdge100x50TopRight.png', TILE_TYPES.RIGHT_EDGE_90), // col == 12
            this.loadImageWithPromise('ground100x50DesertMain1.png', TILE_TYPES.DESERT),      // col == 13
            this.loadImageWithPromise('groundDesert100x50CowBones.png', TILE_TYPES.DESERT_COW_BONES), // col == 14
            // Add missing desert tiles
            this.loadImageWithPromise('groundDesert100x50Hole.png', TILE_TYPES.DESERT_HOLE),     // col == 15
            this.loadImageWithPromise('groundDesert100x50House.png', TILE_TYPES.DESERT_HOUSE),   // col == 16
            this.loadImageWithPromise('groundDesert100x50Ruins.png', TILE_TYPES.DESERT_RUINS),   // col == 17
            this.loadImageWithPromise('ground100x50Mountains.png', TILE_TYPES.MOUNTAINS),        // col == 18
            this.loadImageWithPromise('grount100x50lake.png', TILE_TYPES.LITTLE_LAKE),           // col == 19
            // Also load sea image for empty tiles (col == 0 in old code)
            this.loadImageWithPromise('sea100x50.png', TILE_TYPES.EMPTY)  // For empty tiles like old code
        ];

        // Wait for all images to load
        Promise.all(imageLoadPromises)
            .then(() => {
                this.imagesLoaded = true;
                console.log('✅ All tile images loaded successfully!');
                console.log('Loaded tile types:', Object.keys(this.tileImages).map(k => parseInt(k)).sort((a, b) => a - b));
                if (this.onImagesLoadedCallback) {
                    this.onImagesLoadedCallback();
                }
            })
            .catch((error) => {
                console.error('❌ Failed to load some tile images:', error);
                this.imagesLoaded = true; // Still allow rendering with fallbacks
            });
    }

    loadImageWithPromise(src, tileType) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.tileImages[tileType] = img;
                console.log(`✅ Loaded tile image: ${src} -> type ${tileType} (${img.naturalWidth}x${img.naturalHeight})`);
                resolve(img);
            };

            img.onerror = () => {
                console.error(`❌ Failed to load tile image: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };

            // Add timeout for debugging
            setTimeout(() => {
                if (!img.complete) {
                    console.warn(`⏰ Image still loading after 5s: ${src}`);
                }
            }, 5000);

            img.src = src;
        });
    }

    // Legacy method for compatibility
    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    getTileAt(x, y) {
        if (y >= 0 && y < this.map.length && x >= 0 && x < this.map[y].length) {
            return this.map[y][x];
        }
        return TILE_TYPES.EMPTY;
    }

    setTileAt(x, y, tileType) {
        if (y >= 0 && y < this.map.length && x >= 0 && x < this.map[y].length) {
            this.map[y][x] = tileType;
        }
    }

    isWalkable(x, y) {
        const tile = this.getTileAt(x, y);
        return tile !== TILE_TYPES.EMPTY && tile !== TILE_TYPES.WATER;
    }

    render(ctx, camera) {
        // Save context and apply camera translation (like the old implementation)
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        // Use original tile dimensions: 100px wide, 50px tall
        const tileWidth = 100;
        const tileHeight = 50;

        // Fill background color to prevent black spaces
        ctx.fillStyle = "#5B5D5D";
        ctx.fillRect(0, 0, this.getWidth() * tileWidth, this.getHeight() * tileHeight);

        // Render all tiles using the old approach (100 * i, 50 * vl)
        this.map.forEach((row, rowIndex) => {
            row.forEach((tileType, colIndex) => {
                const x = colIndex * tileWidth;  // 100 * colIndex
                const y = rowIndex * tileHeight; // 50 * rowIndex

                // Get the appropriate image for this tile type
                const image = this.tileImages[tileType];

                if (tileType === TILE_TYPES.EMPTY) {
                    // For empty tiles, use sea image like the old implementation (col == 0 -> sea)
                    const seaImage = this.tileImages[TILE_TYPES.EMPTY]; // Now loads sea100x50.png
                    if (seaImage && seaImage.complete && seaImage.naturalWidth > 0) {
                        ctx.drawImage(seaImage, x, y);
                    } else {
                        // Fallback for empty tiles
                        ctx.fillStyle = 'rgba(65, 105, 225, 0.6)'; // Blue like water
                        ctx.fillRect(x, y, tileWidth, tileHeight);
                    }
                } else if (image && image.complete && image.naturalWidth > 0) {
                    // Draw the tile image
                    ctx.drawImage(image, x, y);
                } else {
                    // Fallback color for missing images
                    ctx.fillStyle = this.getTileColor(tileType, 1.0);
                    ctx.fillRect(x, y, tileWidth, tileHeight);
                }
            });
        });

        ctx.restore();
    }

    renderTile(ctx, x, y, tileType, camera) {
        const screenX = x * this.tileSize - camera.x;
        const screenY = y * this.tileSize - camera.y;

        // Handle empty tiles with a proper background
        if (tileType === TILE_TYPES.EMPTY) {
            // Render empty tiles as a more visible sky/void background
            ctx.fillStyle = 'rgba(135, 206, 235, 0.6)'; // More opaque sky blue
            ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

            // Add a subtle pattern to make empty tiles more distinct
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);
            return;
        }

        const image = this.tileImages[tileType];

        // If images are still loading, show loading state
        if (!this.imagesLoaded) {
            this.renderLoadingTile(ctx, screenX, screenY, tileType);
            return;
        }

        // Try to render the actual image
        if (image && image.complete && image.naturalWidth > 0) {
            ctx.drawImage(image, screenX, screenY, this.tileSize, this.tileSize);
        } else {
            // Fallback to colored tile if image failed to load
            this.renderFallbackTile(ctx, screenX, screenY, tileType);
        }
    }

    renderLoadingTile(ctx, screenX, screenY, tileType) {
        // Show a subtle loading pattern while images load
        ctx.fillStyle = this.getTileColor(tileType, 0.3); // 30% opacity
        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // Add a subtle loading indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        const time = Date.now() * 0.005;
        const alpha = (Math.sin(time + screenX * 0.01 + screenY * 0.01) + 1) * 0.05;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
    }

    renderFallbackTile(ctx, screenX, screenY, tileType) {
        // Render solid color fallback
        ctx.fillStyle = this.getTileColor(tileType, 1.0);
        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // Add a subtle border to indicate this is a fallback
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
    }

    getTileColor(tileType, alpha = 1.0) {
        const colors = {
            [TILE_TYPES.GROUND_COMMON]: `rgba(144, 238, 144, ${alpha})`, // Light green
            [TILE_TYPES.FOREST]: `rgba(34, 139, 34, ${alpha})`, // Forest green
            [TILE_TYPES.CITY]: `rgba(128, 128, 128, ${alpha})`, // Gray
            [TILE_TYPES.MANSION]: `rgba(139, 69, 19, ${alpha})`, // Brown
            [TILE_TYPES.DARK_CASTLE]: `rgba(47, 47, 47, ${alpha})`, // Dark gray
            [TILE_TYPES.TOWER]: `rgba(105, 105, 105, ${alpha})`, // Dim gray
            [TILE_TYPES.WATER]: `rgba(65, 105, 225, ${alpha})`, // Blue
            [TILE_TYPES.MOUNTAINS]: `rgba(139, 115, 85, ${alpha})`, // Brown
            [TILE_TYPES.DESERT]: `rgba(244, 164, 96, ${alpha})`, // Sandy brown
            [TILE_TYPES.DESERT_COW_BONES]: `rgba(210, 180, 140, ${alpha})`, // Tan
            [TILE_TYPES.DESERT_HOLE]: `rgba(160, 82, 45, ${alpha})`, // Saddle brown
            [TILE_TYPES.DESERT_HOUSE]: `rgba(205, 133, 63, ${alpha})`, // Peru
            [TILE_TYPES.DESERT_RUINS]: `rgba(188, 143, 143, ${alpha})`, // Rosy brown
            [TILE_TYPES.LITTLE_LAKE]: `rgba(135, 206, 235, ${alpha})`, // Sky blue
            [TILE_TYPES.BOTTOM_EDGE]: `rgba(101, 67, 33, ${alpha})`, // Dark brown
            [TILE_TYPES.TOP_EDGE]: `rgba(101, 67, 33, ${alpha})`, // Dark brown
            [TILE_TYPES.LEFT_EDGE]: `rgba(101, 67, 33, ${alpha})`, // Dark brown
            [TILE_TYPES.EDGE_90_DEGREE]: `rgba(101, 67, 33, ${alpha})`, // Dark brown
            [TILE_TYPES.RIGHT_EDGE_90]: `rgba(101, 67, 33, ${alpha})` // Dark brown
        };

        return colors[tileType] || `rgba(255, 0, 0, ${alpha})`; // Red for unknown
    }

    // Public API to check if images are loaded
    areImagesLoaded() {
        return this.imagesLoaded;
    }

    // Public API to wait for all images to load
    waitForImagesLoaded() {
        if (this.imagesLoaded) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const checkLoaded = () => {
                if (this.imagesLoaded) {
                    resolve();
                } else {
                    setTimeout(checkLoaded, 50); // Check every 50ms
                }
            };
            checkLoaded();
        });
    }

    // Collision detection
    checkCollision(x, y, width, height) {
        const tileWidth = 100;
        const tileHeight = 50;

        const tileX1 = Math.floor(x / tileWidth);
        const tileY1 = Math.floor(y / tileHeight);
        const tileX2 = Math.floor((x + width) / tileWidth);
        const tileY2 = Math.floor((y + height) / tileHeight);

        for (let tileY = tileY1; tileY <= tileY2; tileY++) {
            for (let tileX = tileX1; tileX <= tileX2; tileX++) {
                if (!this.isWalkable(tileX, tileY)) {
                    return true; // Collision detected
                }
            }
        }
        return false; // No collision
    }

    // Get map dimensions
    getWidth() {
        return this.map[0] ? this.map[0].length : 0;
    }

    getHeight() {
        return this.map.length;
    }

    // Save/Load map
    toJSON() {
        return {
            map: this.map,
            tileSize: this.tileSize
        };
    }

    fromJSON(data) {
        this.map = data.map;
        this.tileSize = data.tileSize;
    }
}

export class WorldEnvironment {
    constructor() {
        this.freeWalking = 0;
        this.raining = false;
        this.night = false;
        this.day = true;
        this.wind = false;
        this.storm = false;
        this.inBattle = false;
        this.time = 0; // Game time in minutes
        this.dayNightCycle = 1440; // 24 hours in minutes
    }

    update(deltaTime) {
        this.time += deltaTime;
        if (this.time >= this.dayNightCycle) {
            this.time = 0;
        }

        // Day/Night cycle
        const dayProgress = this.time / this.dayNightCycle;
        if (dayProgress > 0.25 && dayProgress < 0.75) {
            this.day = true;
            this.night = false;
        } else {
            this.day = false;
            this.night = true;
        }

        // Weather system
        if (Math.random() < 0.001) { // 0.1% chance per frame
            this.raining = !this.raining;
        }

        if (this.raining && Math.random() < 0.01) { // 1% chance when raining
            this.storm = true;
        } else {
            this.storm = false;
        }

        // Wind system
        if (Math.random() < 0.005) { // 0.5% chance per frame
            this.wind = !this.wind;
        }
    }

    resetBattleCounter() {
        this.freeWalking = 0;
    }

    toJSON() {
        return {
            freeWalking: this.freeWalking,
            raining: this.raining,
            night: this.night,
            day: this.day,
            wind: this.wind,
            storm: this.storm,
            inBattle: this.inBattle,
            time: this.time
        };
    }

    fromJSON(data) {
        Object.assign(this, data);
    }
} 