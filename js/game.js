import { AudioManager } from './audio.js';
import { GAME_STATES, KEY_CODES, SHOP_CONFIG, VIDEO_FILES } from './constants.js';
import { EnemyFactory } from './enemies.js';
import { MagicSystem } from './magic.js';
import { Camera, WorldEnvironment, WorldMap } from './map.js';
import { Player } from './player.js';
import { Shop, ShopUI } from './shop.js';
import { UI } from './ui.js';
import { CollisionUtils, DebugUtils } from './utils.js';

// Save Manager Class for handling all save/load operations
class SaveManager {
    constructor() {
        this.savePrefix = 'rpg_save_';
        this.maxSaveSlots = 3;
        this.metadataKey = 'rpg_save_metadata';
    }

    // Save game to specific slot
    saveGame(gameInstance, slot = 1) {
        try {
            const saveData = {
                version: '1.0',
                timestamp: Date.now(),
                playTime: this.calculatePlayTime(gameInstance),
                player: gameInstance.player.toJSON(),
                worldEnvironment: gameInstance.worldEnvironment.toJSON ? gameInstance.worldEnvironment.toJSON() : {},
                audioState: gameInstance.audioManager.getAudioState ? gameInstance.audioManager.getAudioState() : {},
                gameState: gameInstance.gameState,
                currentLocation: {
                    x: gameInstance.player.X,
                    y: gameInstance.player.Y
                }
            };

            // Save the game data
            const saveKey = `${this.savePrefix}slot_${slot}`;
            localStorage.setItem(saveKey, JSON.stringify(saveData));

            // Update metadata
            this.updateSaveMetadata(slot, saveData);

            console.log(`Game saved successfully to slot ${slot}`);
            return { success: true, message: `Jogo salvo no slot ${slot}!` };

        } catch (error) {
            console.error('Error saving game:', error);
            return { success: false, message: 'Erro ao salvar o jogo!' };
        }
    }

    // Load game from specific slot
    loadGame(gameInstance, slot = 1) {
        try {
            const saveKey = `${this.savePrefix}slot_${slot}`;
            const savedData = localStorage.getItem(saveKey);

            if (!savedData) {
                return { success: false, message: `Nenhum save encontrado no slot ${slot}` };
            }

            const gameData = JSON.parse(savedData);

            // Validate save data
            if (!this.validateSaveData(gameData)) {
                return { success: false, message: 'Dados de save corrompidos!' };
            }

            // Load player data
            gameInstance.player.fromJSON(gameData.player);

            // Load world environment if available
            if (gameData.worldEnvironment && gameInstance.worldEnvironment.fromJSON) {
                gameInstance.worldEnvironment.fromJSON(gameData.worldEnvironment);
            }

            // Load audio state if available
            if (gameData.audioState && gameInstance.audioManager.setAudioState) {
                gameInstance.audioManager.setAudioState(gameData.audioState);
            }

            // Set game state to playing
            gameInstance.gameState = GAME_STATES.PLAYING;
            gameInstance.inCombat = false;
            gameInstance.currentEnemy = null;

            // Update camera to follow player
            gameInstance.camera.followTarget(gameInstance.player);

            console.log(`Game loaded successfully from slot ${slot}`);
            return { success: true, message: `Jogo carregado do slot ${slot}!` };

        } catch (error) {
            console.error('Error loading game:', error);
            return { success: false, message: 'Erro ao carregar o jogo!' };
        }
    }

    // Get save metadata for all slots
    getSaveMetadata() {
        try {
            const metadata = localStorage.getItem(this.metadataKey);
            return metadata ? JSON.parse(metadata) : {};
        } catch (error) {
            console.error('Error reading save metadata:', error);
            return {};
        }
    }

    // Update save metadata
    updateSaveMetadata(slot, saveData) {
        try {
            const metadata = this.getSaveMetadata();
            metadata[slot] = {
                timestamp: saveData.timestamp,
                playTime: saveData.playTime,
                playerLevel: saveData.player.level,
                playerName: 'Jogador', // Could be customizable
                location: saveData.currentLocation,
                version: saveData.version
            };
            localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
        } catch (error) {
            console.error('Error updating save metadata:', error);
        }
    }

    // Validate save data integrity
    validateSaveData(data) {
        return data &&
            data.version &&
            data.player &&
            data.player.level !== undefined &&
            data.player.hp !== undefined &&
            data.player.mp !== undefined;
    }

    // Calculate play time (simplified - could be enhanced)
    calculatePlayTime(gameInstance) {
        // This is a simple implementation - could track actual play time
        return Math.floor((Date.now() - (gameInstance.startTime || Date.now())) / 1000);
    }

    // Delete save from specific slot
    deleteSave(slot) {
        try {
            const saveKey = `${this.savePrefix}slot_${slot}`;
            localStorage.removeItem(saveKey);

            // Update metadata
            const metadata = this.getSaveMetadata();
            delete metadata[slot];
            localStorage.setItem(this.metadataKey, JSON.stringify(metadata));

            return { success: true, message: `Save do slot ${slot} deletado!` };
        } catch (error) {
            console.error('Error deleting save:', error);
            return { success: false, message: 'Erro ao deletar save!' };
        }
    }

    // Check if save exists in slot
    saveExists(slot) {
        const saveKey = `${this.savePrefix}slot_${slot}`;
        return localStorage.getItem(saveKey) !== null;
    }

    // Format timestamp for display
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR');
    }

    // Format play time for display
    formatPlayTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
}

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameState = GAME_STATES.INTRO;
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.startTime = Date.now(); // Track when game started

        // Initialize save manager
        this.saveManager = new SaveManager();

        // Initialize modules
        this.player = new Player();
        this.camera = new Camera(canvas);
        this.worldMap = new WorldMap(() => this.render());
        this.worldEnvironment = new WorldEnvironment();
        this.audioManager = new AudioManager();
        this.ui = new UI(canvas);
        this.magicSystem = new MagicSystem();
        this.shop = new Shop();
        this.shopUI = new ShopUI(canvas);

        // Game state variables
        this.currentEnemy = null;
        this.inCombat = false;
        this.showMenu = false;
        this.showIntro = true;
        this.introVideo = null;
        this.introVideoLoaded = false;
        this.showClickToStartMessage = false;
        this.inShop = false;
        this.shopMessage = '';
        this.shopMessageTimer = 0;
        this.wasInShopArea = false; // Track if player was in shop area last frame

        // Debug settings
        this.showDebugInfo = false; // Set to true to show shop area debug
        this.debugMode = false; // Enable with 'D' key

        // Save/Load UI state
        this.showSaveMenu = false;
        this.showLoadMenu = false;
        this.selectedSaveSlot = 1;
        this.saveMessage = '';
        this.saveMessageTimer = 0;

        // Input handling
        this.keys = {};
        this.setupEventListeners();

        // Asset loading
        this.assets = {};
        this.loadAssets();
        this.loadIntroVideo();
    }

    // Asset loading
    loadAssets() {
        this.assets.playerImg = this.loadImage('heroic_01.png');
        this.assets.menuImage = this.loadImage('blackHole.png');
        this.assets.battleBackground = this.loadImage('backgroundTeste.jpg');
        this.assets.enemyBat = this.loadImage('bat.png');
        this.assets.enemySlime = this.loadImage('slime.png');

        // Load enemy images with filename as property name
        this.assets['bat.png'] = this.loadImage('bat.png');
        this.assets['slime.png'] = this.loadImage('slime.png');
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            console.log(`Image loaded successfully: ${src}`);
        };

        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };

        return img;
    }

    loadIntroVideo() {
        // Load intro video
        this.introVideo = document.createElement('video');
        this.introVideo.src = VIDEO_FILES.INTRO_VIDEO;
        this.introVideo.muted = true; // Start muted to allow autoplay
        this.introVideo.preload = 'auto';
        this.introVideo.autoplay = true; // Auto-play when loaded
        this.introVideo.playsInline = true; // Important for mobile
        this.introVideo.volume = 0.7; // Set volume to 70%

        console.log('Loading intro video from:', VIDEO_FILES.INTRO_VIDEO);

        // Set up video event listeners
        this.introVideo.addEventListener('loadstart', () => {
            console.log('Video load started');
        });

        this.introVideo.addEventListener('loadedmetadata', () => {
            console.log('Video metadata loaded, duration:', this.introVideo.duration);
        });

        this.introVideo.addEventListener('loadeddata', () => {
            this.introVideoLoaded = true;
            console.log('Intro video loaded successfully, attempting to play...');
            // Try to play the video
            this.playIntroVideo();
        });

        this.introVideo.addEventListener('canplay', () => {
            console.log('Video can play');
        });

        this.introVideo.addEventListener('canplaythrough', () => {
            console.log('Video can play through');
        });

        this.introVideo.addEventListener('error', (e) => {
            console.error('Error loading intro video:', e);
            console.error('Video error details:', this.introVideo.error);
            // Fallback to main menu if video fails
            this.introVideoLoaded = false;
            this.gameState = GAME_STATES.MENU;
        });

        this.introVideo.addEventListener('ended', () => {
            console.log('Video ended, going to main menu');
            // Video ended, go to main menu
            this.gameState = GAME_STATES.MENU;
            this.audioManager.playMenuMusic();
        });

        // Handle autoplay restrictions
        this.introVideo.addEventListener('play', () => {
            console.log('Intro video started playing');
            // Unmute the video after it starts playing
            setTimeout(() => {
                if (this.introVideo && !this.introVideo.paused) {
                    this.introVideo.muted = false;
                    console.log('Video unmuted');
                }
            }, 100);
        });

        this.introVideo.addEventListener('pause', () => {
            console.log('Intro video paused');
        });

        this.introVideo.addEventListener('waiting', () => {
            console.log('Video waiting for data');
        });

        this.introVideo.addEventListener('stalled', () => {
            console.log('Video stalled');
        });
    }

    playIntroVideo() {
        if (this.introVideo && this.introVideoLoaded) {
            console.log('Attempting to play video...');
            console.log('Video state before play:', {
                readyState: this.introVideo.readyState,
                paused: this.introVideo.paused,
                currentTime: this.introVideo.currentTime,
                duration: this.introVideo.duration
            });

            const playPromise = this.introVideo.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video autoplay successful');
                    // Unmute the video after successful play
                    setTimeout(() => {
                        if (this.introVideo && !this.introVideo.paused) {
                            this.introVideo.muted = false;
                            console.log('Video unmuted after autoplay');
                        }
                    }, 100);
                }).catch(error => {
                    console.warn('Autoplay failed, waiting for user interaction:', error);
                    // Show a message to click to start
                    this.showClickToStartMessage = true;
                });
            } else {
                console.log('Video play() returned undefined, video may already be playing');
            }
        } else {
            console.warn('Cannot play video - not loaded or not available');
            console.log('Video loaded:', this.introVideoLoaded);
            console.log('Video element:', this.introVideo);
        }
    }

    // Event listeners
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('click', () => this.handleMouseClick());

        // Add user interaction listener to unmute video
        const unmuteVideo = () => {
            if (this.introVideo && this.introVideoLoaded && this.introVideo.muted) {
                this.introVideo.muted = false;
                console.log('Video unmuted by user interaction');
                // Remove the listeners after unmuting
                document.removeEventListener('click', unmuteVideo);
                document.removeEventListener('keydown', unmuteVideo);
            }
        };

        document.addEventListener('click', unmuteVideo);
        document.addEventListener('keydown', unmuteVideo);
    }

    handleKeyDown(e) {
        this.keys[e.keyCode] = true;
        this.handleInput(e.keyCode);
    }

    handleKeyUp(e) {
        this.keys[e.keyCode] = false;
        this.player.stopWalking();
    }

    handleInput(keyCode) {
        switch (this.gameState) {
            case GAME_STATES.INTRO:
                this.handleIntroInput(keyCode);
                break;
            case GAME_STATES.MENU:
                this.handleMenuInput(keyCode);
                break;
            case GAME_STATES.PLAYING:
                this.handlePlayingInput(keyCode);
                break;
            case GAME_STATES.COMBAT:
                this.handleCombatInput(keyCode);
                break;
            case GAME_STATES.SHOP:
                this.handleShopInput(keyCode);
                break;
        }
    }

    handleIntroInput(keyCode) {
        if (keyCode === KEY_CODES.SPACE) {
            // Unmute video first in case user wants to hear it
            if (this.introVideo && this.introVideoLoaded) {
                this.introVideo.muted = false;
            }

            // Skip intro video and go to main menu
            if (this.introVideo) {
                this.introVideo.pause();
                this.introVideo.currentTime = 0;
            }
            this.gameState = GAME_STATES.MENU;
            this.audioManager.playMenuMusic();
        }
    }

    // Add mouse click handler for video autoplay
    handleMouseClick() {
        if (this.gameState === GAME_STATES.INTRO && this.showClickToStartMessage) {
            this.showClickToStartMessage = false;
            this.playIntroVideo();
        }
    }

    handleMenuInput(keyCode) {
        console.log(`Menu input: keyCode=${keyCode}, showSaveMenu=${this.showSaveMenu}, showLoadMenu=${this.showLoadMenu}`);

        if (this.showSaveMenu) {
            this.handleSaveMenuInput(keyCode);
        } else if (this.showLoadMenu) {
            this.handleLoadMenuInput(keyCode);
        } else {
            // Main menu handling
            switch (keyCode) {
                case KEY_CODES.ENTER:
                    console.log('Starting new game');
                    this.gameState = GAME_STATES.PLAYING;
                    this.audioManager.playExplorationMusic();
                    break;
                case 76: // Key 'L' - Load Game
                    console.log('Opening load menu');
                    this.showLoadMenu = true;
                    break;
                case 83: // Key 'S' - Save Game (only if in game)
                    if (this.player.level > 1 || this.player.xp > 0) {
                        console.log('Opening save menu');
                        this.showSaveMenu = true;
                    } else {
                        console.log('No progress to save yet');
                    }
                    break;
                default:
                    console.log(`Unhandled key in main menu: ${keyCode}`);
            }
        }
    }

    handleLoadMenuInput(keyCode) {
        console.log(`Load menu input: keyCode=${keyCode}, ESC code=${KEY_CODES.ESC}`);

        switch (keyCode) {
            case 49: // Key '1' - Load Slot 1
                console.log('Loading from slot 1');
                this.loadFromSlot(1);
                break;
            case 50: // Key '2' - Load Slot 2
                console.log('Loading from slot 2');
                this.loadFromSlot(2);
                break;
            case 51: // Key '3' - Load Slot 3
                console.log('Loading from slot 3');
                this.loadFromSlot(3);
                break;
            case KEY_CODES.ESC: // ESC - Back to main menu
                console.log('ESC pressed - returning to main menu');
                this.showLoadMenu = false;
                this.showSaveMenu = false; // Make sure both are false
                this.saveMessage = ''; // Clear any save messages
                break;
            default:
                console.log(`Unhandled key in load menu: ${keyCode}`);
        }
    }

    handleSaveMenuInput(keyCode) {
        console.log(`Save menu input: keyCode=${keyCode}, ESC code=${KEY_CODES.ESC}`);

        switch (keyCode) {
            case 49: // Key '1' - Save Slot 1
                console.log('Saving to slot 1');
                this.saveToSlot(1);
                break;
            case 50: // Key '2' - Save Slot 2
                console.log('Saving to slot 2');
                this.saveToSlot(2);
                break;
            case 51: // Key '3' - Save Slot 3
                console.log('Saving to slot 3');
                this.saveToSlot(3);
                break;
            case KEY_CODES.ESC: // ESC - Back to main menu
                console.log('ESC pressed - returning to main menu');
                this.showSaveMenu = false;
                this.showLoadMenu = false; // Make sure both are false
                this.saveMessage = ''; // Clear any save messages
                break;
            default:
                console.log(`Unhandled key in save menu: ${keyCode}`);
        }
    }

    // Save game to specific slot
    saveToSlot(slot) {
        const result = this.saveManager.saveGame(this, slot);
        this.saveMessage = result.message;
        this.saveMessageTimer = 3000; // Show message for 3 seconds

        if (result.success) {
            this.showSaveMenu = false;
        }
    }

    // Load game from specific slot
    loadFromSlot(slot) {
        const result = this.saveManager.loadGame(this, slot);
        this.saveMessage = result.message;
        this.saveMessageTimer = 3000;

        if (result.success) {
            this.showLoadMenu = false;
            this.audioManager.playExplorationMusic();
        }
    }

    handlePlayingInput(keyCode) {
        if (this.inCombat) return;

        let battleTriggered = false;

        switch (keyCode) {
            case KEY_CODES.LEFT:
                battleTriggered = this.player.move('left', this.worldEnvironment);
                break;
            case KEY_CODES.UP:
                battleTriggered = this.player.move('up', this.worldEnvironment);
                break;
            case KEY_CODES.RIGHT:
                battleTriggered = this.player.move('right', this.worldEnvironment);
                break;
            case KEY_CODES.DOWN:
                battleTriggered = this.player.move('down', this.worldEnvironment);
                break;
            case 66: // Key 'B' - Debug battle trigger
                console.log('Manual battle trigger (B key pressed)');
                battleTriggered = true;
                break;
            case 68: // Key 'D' - Toggle debug mode
                this.debugMode = !this.debugMode;
                this.showDebugInfo = this.debugMode;
                console.log(`🔧 Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
                break;
            case 83: // Key 'S' - Quick Save
                this.quickSave();
                break;
            case 76: // Key 'L' - Quick Load
                this.quickLoad();
                break;
            case KEY_CODES.ESC: // ESC - Return to menu
                this.gameState = GAME_STATES.MENU;
                this.audioManager.playMenuMusic();
                break;
        }

        // Check for shop area after movement
        this.checkShopAreaInteraction();

        if (battleTriggered) {
            console.log('Starting battle from handlePlayingInput');
            this.startBattle();
        }

        // Update camera
        this.camera.followTarget(this.player);
    }

    // Check if player enters or leaves shop area
    checkShopAreaInteraction() {
        const isInShopArea = CollisionUtils.isPlayerInShopArea(this.player, SHOP_CONFIG.AREA);

        // Player just entered shop area (wasn't in before, now is)
        if (isInShopArea && !this.wasInShopArea) {
            console.log(`🏪 Player entered shop area at (${this.player.X}, ${this.player.Y})`);
            this.enterShop();
        }

        // Update tracking variable
        this.wasInShopArea = isInShopArea;

        // Debug logging
        if (this.debugMode) {
            console.log(`Shop area check: Player(${this.player.X}, ${this.player.Y}) - InArea: ${isInShopArea}`);
        }
    }

    handleShopInput(keyCode) {
        const items = this.shop.getShopItems();

        switch (keyCode) {
            case KEY_CODES.UP:
                this.shopUI.selectPreviousItem();
                break;
            case KEY_CODES.DOWN:
                this.shopUI.selectNextItem(items.length);
                break;
            case KEY_CODES.ENTER:
                this.purchaseSelectedItem();
                break;
            case KEY_CODES.ESC:
                this.exitShop();
                break;
        }
    }

    // Shop management methods
    enterShop() {
        console.log(`🏪 Entering shop at position (${this.player.X}, ${this.player.Y})`);
        console.log('🔄 Changing game state from', this.gameState, 'to', GAME_STATES.SHOP);

        this.inShop = true;
        this.gameState = GAME_STATES.SHOP;
        this.shopUI.reset();

        // Hide controls during shop
        const controlsElement = document.getElementById('controls');
        if (controlsElement) {
            controlsElement.style.display = 'none';
        }

        console.log('✅ Shop entered successfully. Game state:', this.gameState, 'inShop:', this.inShop);
    }

    exitShop() {
        console.log('🚪 Exiting shop');
        this.inShop = false;
        this.gameState = GAME_STATES.PLAYING;

        // Move player using configured offset to avoid re-entering shop immediately
        this.player.X += SHOP_CONFIG.EXIT_OFFSET.x;
        this.player.Y += SHOP_CONFIG.EXIT_OFFSET.y;

        // Reset shop area tracking
        this.wasInShopArea = false;

        // Show controls again
        const controlsElement = document.getElementById('controls');
        if (controlsElement) {
            controlsElement.style.display = 'block';
        }

        this.shopMessage = '';
        this.shopMessageTimer = 0;

        console.log(`📍 Player moved to (${this.player.X}, ${this.player.Y}) after exiting shop`);
    }

    purchaseSelectedItem() {
        const items = this.shop.getShopItems();
        const selectedIndex = this.shopUI.getSelectedItemIndex();
        const selectedItem = items[selectedIndex];

        if (!selectedItem) return;

        const result = this.shop.purchaseItem(this.player, selectedItem.id);

        this.shopMessage = result.message;
        this.shopMessageTimer = 3000; // Show message for 3 seconds

        if (result.success && result.autoEquip) {
            // Auto-equip equipment items
            this.player.equipItem(result.item);
        }

        console.log(`🛒 Purchase attempt: ${result.message}`);
    }

    // Quick save to slot 1
    quickSave() {
        const result = this.saveManager.saveGame(this, 1);
        this.saveMessage = result.message;
        this.saveMessageTimer = 2000; // Show for 2 seconds
    }

    // Quick load from slot 1
    quickLoad() {
        const result = this.saveManager.loadGame(this, 1);
        this.saveMessage = result.message;
        this.saveMessageTimer = 2000;

        if (result.success) {
            this.audioManager.playExplorationMusic();
        }
    }

    handleCombatInput(keyCode) {
        if (!this.inCombat || !this.currentEnemy) {
            console.warn('Combat input received but not in combat state');
            return;
        }

        switch (keyCode) {
            case 49: // Key '1' - Attack
                console.log('Player chose to attack');
                this.playerAttack();
                break;
            case 50: // Key '2' - Magic
                console.log('Player chose magic');
                this.playerMagic();
                break;
            case 51: // Key '3' - Items
                console.log('Player chose items');
                this.playerItems();
                break;
            case 52: // Key '4' - Kinesis
                console.log('Player chose kinesis');
                this.playerKinesis();
                break;
            case 53: // Key '5' - Flee
                console.log('Player chose to flee');
                this.playerFlee();
                break;
        }
    }

    // Game loop
    start() {
        this.isRunning = true;

        // Try to start the video after a short delay
        setTimeout(() => {
            if (this.introVideo && this.introVideoLoaded) {
                console.log('Attempting to play video from start method...');
                this.playIntroVideo();
            } else {
                console.log('Video not ready in start method, will try when loaded');
            }
        }, 1000);

        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;

        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update();
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update() {
        // Update world environment
        this.worldEnvironment.update(this.deltaTime);

        // Update player animation
        this.player.updateAnimation();

        // Update enemy if in combat
        if (this.currentEnemy) {
            this.currentEnemy.updateAnimation();
        }

        // Update save message timer
        if (this.saveMessageTimer > 0) {
            this.saveMessageTimer -= this.deltaTime;
            if (this.saveMessageTimer <= 0) {
                this.saveMessage = '';
            }
        }

        // Update shop message timer
        if (this.shopMessageTimer > 0) {
            this.shopMessageTimer -= this.deltaTime;
            if (this.shopMessageTimer <= 0) {
                this.shopMessage = '';
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.gameState) {
            case GAME_STATES.INTRO:
                this.renderIntro();
                break;
            case GAME_STATES.MENU:
                this.renderMenu();
                break;
            case GAME_STATES.PLAYING:
                this.renderGame();
                break;
            case GAME_STATES.COMBAT:
                this.renderCombat();
                // Render the polished combat menu AFTER everything else
                if (this.gameState === GAME_STATES.COMBAT && this.inCombat) {
                    this.renderPolishedCombatMenu();
                }
                break;
            case GAME_STATES.SHOP:
                console.log('🎨 Rendering shop screen');
                this.renderShop();
                break;
        }
    }

    renderPolishedCombatMenu() {
        // Save canvas state
        this.ctx.save();
        this.ctx.resetTransform();

        const menuHeight = 120;
        const menuY = this.canvas.height - menuHeight;

        // Draw semi-transparent dark background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, menuY, this.canvas.width, menuHeight);

        // Draw elegant border
        this.ctx.strokeStyle = '#FFD700'; // Gold border
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(3, menuY + 3, this.canvas.width - 6, menuHeight - 6);

        // Menu title
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('AÇÕES DE COMBATE', this.canvas.width / 2, menuY + 25);

        // Combat action buttons
        const buttonWidth = 140;
        const buttonHeight = 35;
        const spacing = 15;
        const totalWidth = (buttonWidth * 5) + (spacing * 4);
        const startX = (this.canvas.width - totalWidth) / 2;
        const buttonY = menuY + 40;

        const actions = [
            { key: '1', text: 'ATACAR', icon: '⚔️', color: '#DC143C' },
            { key: '2', text: 'MAGIA', icon: '🔮', color: '#4169E1' },
            { key: '3', text: 'ITENS', icon: '🧪', color: '#32CD32' },
            { key: '4', text: 'KINESIS', icon: '✨', color: '#9932CC' },
            { key: '5', text: 'FUGIR', icon: '🏃', color: '#FF8C00' }
        ];

        actions.forEach((action, index) => {
            const x = startX + (index * (buttonWidth + spacing));

            // Button background with gradient effect
            this.ctx.fillStyle = action.color;
            this.ctx.fillRect(x, buttonY, buttonWidth, buttonHeight);

            // Button highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.fillRect(x, buttonY, buttonWidth, 8);

            // Button border
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, buttonY, buttonWidth, buttonHeight);

            // Key number background
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(x + 5, buttonY + 5, 25, 25);
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x + 5, buttonY + 5, 25, 25);

            // Key number
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(action.key, x + 17, buttonY + 22);

            // Action icon
            this.ctx.font = '16px Arial';
            this.ctx.fillText(action.icon, x + 45, buttonY + 22);

            // Action text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText(action.text, x + buttonWidth / 2 + 10, buttonY + 22);
        });

        // Instructions
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Pressione as teclas 1-5 para escolher sua ação', this.canvas.width / 2, menuY + 95);

        // Restore canvas state
        this.ctx.restore();
    }

    renderShop() {
        // Render the shop UI
        this.shopUI.drawShop(this.shop, this.player);

        // Draw shop message if active
        if (this.shopMessage) {
            this.drawShopMessage(this.shopMessage);
        }
    }

    drawShopMessage(message) {
        const messageWidth = 400;
        const messageHeight = 60;
        const x = (this.canvas.width - messageWidth) / 2;
        const y = 20;

        // Message background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(x, y, messageWidth, messageHeight);

        // Message border
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, messageWidth, messageHeight);

        // Message text
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.canvas.width / 2, y + 35);
    }

    renderIntro() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw intro video if available and playing
        if (this.introVideo && this.introVideoLoaded && !this.introVideo.paused) {
            console.log('Drawing video frame, video state:', {
                readyState: this.introVideo.readyState,
                paused: this.introVideo.paused,
                currentTime: this.introVideo.currentTime,
                duration: this.introVideo.duration
            });
            this.ctx.drawImage(this.introVideo, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Fallback: draw a gradient background
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(1, '#16213e');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Show debug info
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`Video loaded: ${this.introVideoLoaded}`, 10, 30);
            this.ctx.fillText(`Video paused: ${this.introVideo ? this.introVideo.paused : 'N/A'}`, 10, 50);
            this.ctx.fillText(`Video readyState: ${this.introVideo ? this.introVideo.readyState : 'N/A'}`, 10, 70);
        }

        // Show click to start message if autoplay was blocked
        if (this.showClickToStartMessage) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Clique para iniciar o vídeo', this.canvas.width / 2, this.canvas.height / 2 - 20);

            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = '16px Arial';
            this.ctx.fillText('ou pressione ESPAÇO para pular', this.canvas.width / 2, this.canvas.height / 2 + 20);
        } else {
            // Draw skip instruction
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Pressione ESPAÇO para pular', this.canvas.width / 2, this.canvas.height - 20);
        }
    }

    renderMenu() {
        if (this.showSaveMenu) {
            this.ui.drawSaveMenu(this.saveManager);
        } else if (this.showLoadMenu) {
            this.ui.drawLoadMenu(this.saveManager);
        } else {
            this.ui.drawMainMenu();
        }
    }

    renderGame() {
        // Render world
        this.worldMap.render(this.ctx, this.camera);

        // Render player
        this.renderPlayer();

        // Render HUD
        this.ui.drawHUD(this.player);

        // Render save message if active
        if (this.saveMessage) {
            this.ui.drawSaveMessage(this.saveMessage);
        }

        // Debug rendering
        if (this.showDebugInfo) {
            this.renderDebugInfo();
        }
    }

    renderDebugInfo() {
        // Draw shop area
        DebugUtils.drawDebugArea(
            this.ctx,
            SHOP_CONFIG.AREA,
            'rgba(0, 255, 0, 0.3)', // Green for shop area
            this.camera
        );

        // Draw player collision box
        const playerArea = {
            x: this.player.X,
            y: this.player.Y,
            width: this.player.width,
            height: this.player.height
        };

        DebugUtils.drawDebugArea(
            this.ctx,
            playerArea,
            'rgba(0, 0, 255, 0.3)', // Blue for player
            this.camera
        );

        // Draw shop approach area (larger area to show when player is getting close)
        const approachArea = {
            x: SHOP_CONFIG.AREA.x - 20,
            y: SHOP_CONFIG.AREA.y - 20,
            width: SHOP_CONFIG.AREA.width + 40,
            height: SHOP_CONFIG.AREA.height + 40
        };

        const isNearShop = CollisionUtils.isPlayerInShopArea(this.player, approachArea);
        if (isNearShop && !this.inShop) {
            DebugUtils.drawDebugArea(
                this.ctx,
                approachArea,
                'rgba(255, 255, 0, 0.2)', // Yellow for approach area
                this.camera
            );
        }

        // Draw debug text
        const isInShopArea = CollisionUtils.isPlayerInShopArea(this.player, SHOP_CONFIG.AREA);
        const debugTexts = [
            `Player: (${this.player.X}, ${this.player.Y})`,
            `Shop Area: (${SHOP_CONFIG.AREA.x}, ${SHOP_CONFIG.AREA.y}) ${SHOP_CONFIG.AREA.width}x${SHOP_CONFIG.AREA.height}`,
            `In Shop Area: ${isInShopArea}`,
            `Near Shop: ${isNearShop}`,
            `Was In Shop Area: ${this.wasInShopArea}`,
            `Game State: ${this.gameState}`,
            `In Shop: ${this.inShop}`,
            `Debug Mode: Press 'D' to toggle`
        ];

        debugTexts.forEach((text, index) => {
            DebugUtils.drawDebugText(this.ctx, text, 10, 150 + (index * 20), '#FFFF00');
        });
    }

    renderPlayer() {
        if (this.assets.playerImg) {
            const spriteWidth = 33;
            const spriteHeight = 32;
            const frameX = this.player.frameX * spriteWidth;
            const frameY = this.player.frameY * spriteHeight;

            this.ctx.drawImage(
                this.assets.playerImg,
                frameX, frameY, spriteWidth, spriteHeight,
                this.player.X - this.camera.x,
                this.player.Y - this.camera.y,
                this.player.width,
                this.player.height
            );
        }
    }

    renderCombat() {
        // Render battle background
        if (this.assets.battleBackground) {
            this.ctx.drawImage(this.assets.battleBackground, 0, 0,
                this.canvas.width, this.canvas.height);
        } else {
            // Fallback background
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Render enemy first (behind UI)
        this.renderEnemy();

        // Render combat UI components separately to ensure visibility
        this.ui.drawCombatBars(this.player, this.currentEnemy);
        this.ui.drawCombatLog();
    }

    renderEnemy() {
        if (!this.currentEnemy) return;

        // Position enemy in the center-right area
        const enemyX = this.canvas.width * 0.65;
        const enemyY = this.canvas.height * 0.4;
        const enemySize = 120; // Larger size for better visibility

        console.log(`Rendering enemy: ${this.currentEnemy.name} at (${enemyX}, ${enemyY})`);

        // Try to get the enemy image
        let enemyImage = null;

        // First try the specific image property
        if (this.currentEnemy.image && this.assets[this.currentEnemy.image]) {
            enemyImage = this.assets[this.currentEnemy.image];
            console.log(`Found enemy image: ${this.currentEnemy.image}`);
        }
        // Fallback to enemy type
        else if (this.currentEnemy.type === 'bat' && this.assets.enemyBat) {
            enemyImage = this.assets.enemyBat;
            console.log('Using bat image fallback');
        }
        else if (this.currentEnemy.type === 'slime' && this.assets.enemySlime) {
            enemyImage = this.assets.enemySlime;
            console.log('Using slime image fallback');
        }
        // Final fallback to bat image
        else if (this.assets.enemyBat) {
            enemyImage = this.assets.enemyBat;
            console.log('Using final bat image fallback');
        }

        if (enemyImage && enemyImage.complete && enemyImage.naturalWidth > 0) {
            this.ctx.drawImage(enemyImage, enemyX, enemyY, enemySize, enemySize);
            console.log('Enemy image drawn successfully');
        } else {
            // Draw a visible fallback rectangle
            this.ctx.fillStyle = '#ff4444';
            this.ctx.fillRect(enemyX, enemyY, enemySize, enemySize);

            // Add enemy name text
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.currentEnemy.name || 'Enemy', enemyX + enemySize / 2, enemyY + enemySize / 2);

            console.warn('Using fallback rectangle for enemy');
        }
    }

    // Combat system
    startBattle() {
        this.inCombat = true;
        this.gameState = GAME_STATES.COMBAT;

        // Create level-appropriate enemy
        this.currentEnemy = EnemyFactory.getLevelAppropriateEnemy(this.player.level);

        this.worldEnvironment.resetBattleCounter();
        this.audioManager.playBattleMusic();
        this.audioManager.playBattleStartSound();

        // Hide the HTML controls box during combat
        const controlsElement = document.getElementById('controls');
        if (controlsElement) {
            controlsElement.style.display = 'none';
        }

        console.log(`⚔️ Battle started! Player Level: ${this.player.level}`);
        console.log(`👹 Enemy: ${this.currentEnemy.name} (Level ${this.currentEnemy.level})`);
        console.log(`📊 Enemy Stats: HP=${this.currentEnemy.hp}, ATK=${this.currentEnemy.atck}, DEF=${this.currentEnemy.def}, XP=${this.currentEnemy.xp}`);

        // Get difficulty rating for display
        const difficulty = EnemyFactory.getEnemyDifficulty(this.currentEnemy.level, this.player.level);
        console.log(`⚖️ Battle Difficulty: ${difficulty.text}`);
    }

    endBattle() {
        this.inCombat = false;
        this.gameState = GAME_STATES.PLAYING;
        this.currentEnemy = null;
        this.audioManager.playExplorationMusic();
        this.audioManager.playBattleEndSound();

        // Show the HTML controls box again after combat
        const controlsElement = document.getElementById('controls');
        if (controlsElement) {
            controlsElement.style.display = 'block';
        }
    }

    playerAttack() {
        if (!this.currentEnemy) return;

        const damage = this.player.attack(this.currentEnemy);
        this.audioManager.playAttackSound();

        // Check if enemy is defeated
        if (this.currentEnemy.isDead()) {
            // Award gold based on enemy level
            const goldReward = Shop.calculateGoldReward(this.currentEnemy.level);
            this.player.addGold(goldReward);

            // Award XP
            this.player.gainExperience(this.currentEnemy.xp);
            this.audioManager.playLevelUpSound();

            console.log(`💰 Victory! Earned ${goldReward} gold and ${this.currentEnemy.xp} XP`);
            this.endBattle();
        } else {
            // Enemy turn
            this.enemyTurn();
        }
    }

    playerMagic() {
        if (!this.currentEnemy || this.player.spells.length === 0) return;

        const spell = this.player.spells[0]; // Use first spell for now
        const result = this.player.castSpell(0, this.currentEnemy);

        if (result > 0) {
            this.audioManager.playMagicSound();
        }

        // Check if enemy is defeated
        if (this.currentEnemy.isDead()) {
            // Award gold based on enemy level
            const goldReward = Shop.calculateGoldReward(this.currentEnemy.level);
            this.player.addGold(goldReward);

            // Award XP
            this.player.gainExperience(this.currentEnemy.xp);
            this.audioManager.playLevelUpSound();

            console.log(`💰 Victory! Earned ${goldReward} gold and ${this.currentEnemy.xp} XP`);
            this.endBattle();
        } else {
            // Enemy turn
            this.enemyTurn();
        }
    }

    playerItems() {
        // Item system not implemented yet
        this.enemyTurn();
    }

    playerKinesis() {
        // Kinesis system not implemented yet
        this.enemyTurn();
    }

    playerFlee() {
        const fleeChance = Math.random();
        if (fleeChance > 0.5) {
            this.endBattle();
        } else {
            this.enemyTurn();
        }
    }

    enemyTurn() {
        if (!this.currentEnemy) return;

        const action = this.currentEnemy.chooseAction(this.player);

        if (action.action === 'attack') {
            const damage = this.currentEnemy.attack(this.player);
            this.audioManager.playAttackSound();
        } else if (action.action === 'spell') {
            const damage = this.currentEnemy.castSpell(action.spellIndex, this.player);
            this.audioManager.playMagicSound();
        }

        // Check if player is defeated
        if (this.player.isDead()) {
            this.gameOver();
        }
    }

    gameOver() {
        this.gameState = GAME_STATES.MENU;
        this.inCombat = false;
        this.currentEnemy = null;
        this.player.hp = this.player.maxHp;
        this.player.mp = this.player.maxMp;
        this.audioManager.playMenuMusic();

        // Show the HTML controls box again after game over
        const controlsElement = document.getElementById('controls');
        if (controlsElement) {
            controlsElement.style.display = 'block';
        }
    }

    // Save/Load system
    saveGame(slot = 1) {
        return this.saveManager.saveGame(this, slot);
    }

    loadGame(slot = 1) {
        return this.saveManager.loadGame(this, slot);
    }

    // Utility methods
    getGameState() {
        return this.gameState;
    }

    setGameState(state) {
        this.gameState = state;
    }

    isInCombat() {
        return this.inCombat;
    }

    getPlayer() {
        return this.player;
    }

    getCurrentEnemy() {
        return this.currentEnemy;
    }

    openShop() {
        this.gameState = GAME_STATES.SHOP;
        this.shopUI.show();
        this.audioManager.playShopMusic();
    }

    closeShop() {
        this.gameState = GAME_STATES.PLAYING;
        this.shopUI.hide();
        this.audioManager.playExplorationMusic();
    }
} 