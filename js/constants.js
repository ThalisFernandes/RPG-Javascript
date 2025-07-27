// Game Constants and Configuration
export const GAME_CONFIG = {
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 100, // Changed from 50 to 100 to match original 100x50 tiles
    PLAYER_SPEED: 0.9,
    CAMERA_OFFSET_X: 0.55,
    CAMERA_OFFSET_Y: 0.75,
    FREE_WALKING_LIMIT: 20, // Reduced from 100 to make battles more frequent
    BATTLE_CHANCE_INCREMENT: 2
};

// Shop Area Configuration
export const SHOP_CONFIG = {
    AREA: {
        x: 280,      // Shop area top-left X coordinate
        y: 230,      // Shop area top-left Y coordinate
        width: 30,   // Shop area width (30 pixels wide)
        height: 20   // Shop area height (20 pixels tall)
    },
    EXIT_OFFSET: {
        x: 0,        // X offset when exiting shop
        y: -25       // Y offset when exiting shop (move player up)
    }
};

// Tile Types for Map Rendering
export const TILE_TYPES = {
    EMPTY: 0,
    GROUND_COMMON: 1,
    FOREST: 2,
    CITY: 3,
    MANSION: 4,
    DARK_CASTLE: 5,
    TOWER: 6,
    WATER: 7,
    BOTTOM_EDGE: 8,
    TOP_EDGE: 9,
    EDGE_90_DEGREE: 10,
    LEFT_EDGE: 11,
    RIGHT_EDGE_90: 12,
    DESERT: 13,
    DESERT_COW_BONES: 14,
    DESERT_HOLE: 15,
    DESERT_HOUSE: 16,
    DESERT_RUINS: 17,
    MOUNTAINS: 18,
    LITTLE_LAKE: 19
};

// Magic Schools
export const MAGIC_SCHOOLS = {
    ILLUSION: "Ilusão",
    ELEMENTAL: "Elemental",
    DESTRUCTION: "Destruição",
    PROFANATION: "Profanação",
    RESTORATION: "Restauração"
};

// Game States
export const GAME_STATES = {
    INTRO: 'intro',
    MENU: 'menu',
    PLAYING: 'playing',
    COMBAT: 'combat',
    SHOP: 'shop',
    PAUSED: 'paused'
};

// Audio Files
export const AUDIO_FILES = {
    DARK_MAGIC: './music/The Dark Amulet.mp3',
    WINDS_OF_STORIES: './music/Winds Of Stories.mp3',
    MENU_MUSIC: './music/song18.mp3',
    INVASION_OF_CHAOS: './music/invasionOfChaos.mp3',
    BATTLE_MUSIC: './music/BattleRPGtheme.mp3' // Using the correct battle music file
};

// Video Files
export const VIDEO_FILES = {
    INTRO_VIDEO: './video/intro.mp4'
};

// Image Files
export const IMAGE_FILES = {
    PLAYER: 'heroic_01.png',
    WORLD: 'teste1.png',
    GROUND_WORLD: 'grount100x50.png',
    SEA: 'sea100x50.png',
    FOREST: 'ground100x50Arvores.png',
    CITY: 'ground100x50City.png',
    TOWER: 'ground100x50Tower.png',
    DARK_CASTLE: 'ground100x50DarkCastle.png',
    BROKEN_BRIDGE: 'sea100x50BronkenBridge.png',
    ENEMY_BAT: 'bat.png',
    ENEMY_SLIME: 'slime.png',
    BATTLE_BACKGROUND: 'backgroundTeste.jpg',
    BOTTOM_GROUND: 'groundEdge100x50Bottom.png',
    TOP_EDGE: 'groundEdge100x50Top.png',
    EDGE_BOTTOM_90: 'groundEdge100x50EdgeBottom.png',
    LEFT_EDGE: 'groundEdge100x50Left.png',
    LEFT_EDGE_90: 'groundEdge100x50TopRight.png',
    DESERT_GROUND: 'ground100x50DesertMain1.png',
    DESERT_COW_BONES: 'groundDesert100x50CowBones.png',
    MOUNTAINS: 'ground100x50Mountains.png',
    LITTLE_LAKE: 'grount100x50lake.png',
    MENU_IMAGE: 'blackHole.png'
};

// Intro Images
export const INTRO_IMAGES = {
    UNIVERSE_BEGIN: './Intro_imgs/img_universe_begin.jpg',
    GODS_SEEN_UNIVERSE: 'gods_seen_universe.jpg',
    PLANET: 'planet.jpg',
    ELF: './elf.jpg',
    ULTRIERT: './Ultrierlt.jpg',
    CONSELHO_10: './conselho_dos_10.jpg',
    CIDADE_ULTRAIM: './Cidade.jpg',
    DESERTO: './deserto_desespero.jpg',
    ULTRIEM: './Ultraim.jpg',
    ZULTHUN: './Zultun.jpg',
    ELFOS_TRANSFORMADOS: './elfos_transformados.jpg',
    IKSU: './iksu.jpg',
    ZALTAUT: './zalTaraut.jpg',
    REBELIAO_IRA: './rebelian_da_ira.jpg',
    FIM_REBELIAO: './rebeliao_da_ira.jpg',
    CAVALEIROS_PENUMBRA: './img_cavaleiros_da_penumbra.jpg'
};

// Keyboard Codes
export const KEY_CODES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    SPACE: 32,
    ESC: 27
};

// Combat Options
export const COMBAT_OPTIONS = {
    ATTACK: 1,
    MAGIC: 2,
    ITEMS: 3,
    KINESIS: 4,
    FLEE: 5
}; 