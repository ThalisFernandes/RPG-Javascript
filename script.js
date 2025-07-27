import { Game } from './js/game.js';

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Set canvas size
    canvas.width = 900;
    canvas.height = 600;

    // Create and start the game
    const game = new Game(canvas);
    game.start();

    // Make game globally accessible for debugging
    window.game = game;

    console.log('RPG Game initialized successfully!');
    console.log('Game modules loaded:', {
        player: game.player,
        worldMap: game.worldMap,
        audioManager: game.audioManager,
        ui: game.ui,
        magicSystem: game.magicSystem
    });
});

// Handle page visibility changes (pause/resume)
document.addEventListener('visibilitychange', () => {
    if (window.game) {
        if (document.hidden) {
            window.game.audioManager.pauseMusic();
        } else {
            window.game.audioManager.resumeMusic();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.game) {
        // Could implement responsive canvas sizing here
        console.log('Window resized');
    }
});

// Handle page unload (save game state)
window.addEventListener('beforeunload', () => {
    if (window.game) {
        window.game.saveGame();
        window.game.audioManager.dispose();
    }
});

// Export for potential use in other modules
export { Game };

