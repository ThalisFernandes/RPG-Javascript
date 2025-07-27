// Utility functions for RPG Game

export class CollisionUtils {
    /**
     * Check if a point is inside a rectangular area
     * @param {number} pointX - X coordinate of the point
     * @param {number} pointY - Y coordinate of the point
     * @param {Object} area - Rectangle area {x, y, width, height}
     * @returns {boolean} - True if point is inside the area
     */
    static isPointInArea(pointX, pointY, area) {
        return pointX >= area.x &&
            pointX <= area.x + area.width &&
            pointY >= area.y &&
            pointY <= area.y + area.height;
    }

    /**
     * Check if a rectangular object overlaps with an area
     * @param {Object} object - Object with {x, y, width, height}
     * @param {Object} area - Area with {x, y, width, height}
     * @returns {boolean} - True if there's overlap
     */
    static isObjectInArea(object, area) {
        return object.x < area.x + area.width &&
            object.x + object.width > area.x &&
            object.y < area.y + area.height &&
            object.y + object.height > area.y;
    }

    /**
     * Check if player is in shop area (with player dimensions)
     * @param {Object} player - Player object with X, Y, width, height
     * @param {Object} shopArea - Shop area configuration
     * @returns {boolean} - True if player is in shop area
     */
    static isPlayerInShopArea(player, shopArea) {
        const playerRect = {
            x: player.X,
            y: player.Y,
            width: player.width,
            height: player.height
        };

        return this.isObjectInArea(playerRect, shopArea);
    }

    /**
     * Get distance between two points
     * @param {number} x1 - First point X
     * @param {number} y1 - First point Y
     * @param {number} x2 - Second point X
     * @param {number} y2 - Second point Y
     * @returns {number} - Distance between points
     */
    static getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Check if player is near a specific point (within radius)
     * @param {Object} player - Player object
     * @param {number} targetX - Target X coordinate
     * @param {number} targetY - Target Y coordinate
     * @param {number} radius - Detection radius
     * @returns {boolean} - True if player is within radius
     */
    static isPlayerNearPoint(player, targetX, targetY, radius = 20) {
        const playerCenterX = player.X + player.width / 2;
        const playerCenterY = player.Y + player.height / 2;

        const distance = this.getDistance(playerCenterX, playerCenterY, targetX, targetY);
        return distance <= radius;
    }
}

export class DebugUtils {
    /**
     * Draw a rectangle area for debugging purposes
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} area - Area to draw {x, y, width, height}
     * @param {string} color - Color for the debug rectangle
     * @param {Object} camera - Camera object (optional)
     */
    static drawDebugArea(ctx, area, color = 'rgba(255, 0, 0, 0.3)', camera = null) {
        ctx.save();

        // Apply camera offset if provided
        if (camera) {
            ctx.translate(-camera.x, -camera.y);
        }

        // Draw filled rectangle
        ctx.fillStyle = color;
        ctx.fillRect(area.x, area.y, area.width, area.height);

        // Draw border
        ctx.strokeStyle = color.replace('0.3', '1.0'); // Make border opaque
        ctx.lineWidth = 2;
        ctx.strokeRect(area.x, area.y, area.width, area.height);

        ctx.restore();
    }

    /**
     * Draw debug text on screen
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} text - Text to display
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Text color
     */
    static drawDebugText(ctx, text, x, y, color = '#FFFFFF') {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(text, x, y);
        ctx.restore();
    }
} 