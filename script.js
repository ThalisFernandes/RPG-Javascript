const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;
var emCombat = false;
var menuGame = false;
var introText = true;
const playerImg = new Image();
const world = new Image();
const groundWorld = new Image();
const sea = new Image();
const forest = new Image();
const city = new Image();
const tower = new Image();
const darkCastle = new Image();
const brokenBridge = new Image();
const enemyBat = new Image();
const enemySlime = new Image();
const battleBattleground = new Image();
const bottomGround = new Image();
const topEdge = new Image();
const edgeBottom90 = new Image();
const leftEdge = new Image();
const leftEdge90 = new Image();
const menuBackground = new Image();
const menuImage = new Image();
const desertGround = new Image();
const desertWithCowBones = new Image();
const mountains = new Image();
const groundLittleLake = new Image();
const darkMagic = new Audio('./music/The Dark Amulet.mp3');
const windsOfStories = new Audio('./music/Winds Of Stories.mp3');
const menuMusic = new Audio('./music/song18.mp3');
const InvasioOfChaos = new Audio('./music/invasionOfChaos.mp3');
var contagem = 0;
var introCount = 0;
const scriptIntro = document.createElement('script');
//--------iMAGENS DA INTRO ABAIXO--------------------
const img_universe_begin = new Image();
const img_gods_seen_universe = new Image();
const img_planet = new Image();
const img_elf = new Image();
const Ultriert = new Image();
const conselho_10 = new Image();
const Ilha_morte = new Image();
const Iksu = new Image();
const deserto = new Image();
const cidade_ultraim = new Image();
const ultriem = new Image();
const zulthun = new Image();
const elfos_transformados = new Image();
const zalTaraut = new Image();
const rebeliao_ira = new Image();
const fim_rebeliao = new Image();
const cavaleiros_penumbra = new Image();

//=========== Itens para batalha ================//
const battleMusic = new Audio('./music/battleRPGtheme.mp3');
const imageBattleGround1 = new Image();
/**
 * 
 *  1 ground comon
 *  2 forest
 *  3 city
 *  4 mansion
 *  5 dark castle
 *  6 tower
 *  8 bottom-edge
 *  9 top-edge
 *  10 edge-90degree
 *  11 leftEdge
 *  12 right edge 90
 *  13 desert 
 *  14 cow bones Desert
 *  15 hole
 *  16 House Desert
 *  17 Ruins  
 *  18 mountains 
 *  19 little lake       
 * 
 */
let map = [
    [18,18,18,18,18,18,18,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [18,1,2,1,3,2,1,1,2,1,0,0,1,1,1,1,1,1,1,18,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [18,1,2,2,2,2,1,1,2,1,0,0,2,2,2,2,2,3,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0],
    [18,1,2,3,1,1,4,1,2,5,1,0,2,5,2,19,1,1,2,1,1,1,0,0,0,0,0,0,1,1,2,2,2,2,2,2,2,5,1,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0],
    [18,1,1,2,2,1,2,2,2,1,0,0,2,3,2,2,1,1,1,1,0,0,0,0,0,0,0,0,1,2,5,2,18,18,18,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0],
    [18,1,1,6,2,1,3,2,0,0,0,0,2,2,2,2,2,2,2,1,1,1,0,0,0,0,0,0,1,2,1,18,6,18,18,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0],
    [18,1,1,1,1,1,2,1,0,0,0,0,1,1,1,2,1,6,2,1,0,0,0,0,0,0,0,0,1,2,1,18,1,1,18,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,2,1,1,1,1,0,0,0,0,0,0,1,2,1,1,1,2,2,2,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,0,13,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,2,1,2,1,2,1,1,0,0,0,0,0,0,0,0,13,0,13,13,13,13,13,13,0,0,0,0,1,1,1,1,0,0],
    [18,1,1,1,1,1,1,1,1,1,8,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,0,0],
    [18,1,1,1,2,1,1,1,1,1,8,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,14,13,13,13,13,14,13,13,0,0,0,0,1,1,1,1,0,0],
    [18,1,2,2,2,2,2,1,1,1,8,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,1,0],
    [18,1,1,2,3,2,1,1,1,1,1,8,0,0,0,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,1,0],
    [18,1,1,1,2,1,1,1,1,1,1,1,8,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,13,13,14,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,1,0],
    [18,1,1,1,1,1,1,6,1,1,1,1,1,8,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,14,13,13,14,3,0,0,0,1,0,1,1,1,1,0],
    [18,2,1,1,4,1,1,1,1,1,2,2,1,1,8,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,1,0],
    [18,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,1,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,0,0],
    [18,2,2,1,2,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,1,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,0,0],
    [18,2,2,2,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,1,1,1,1,0,0,0,13,13,14,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,0,0],
    [18,2,2,2,3,1,2,1,1,1,1,1,8,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,0,0],
    [18,2,1,1,1,1,2,1,1,1,1,8,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,0,0],
    [18,1,1,1,1,1,2,1,1,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,14,13,0,0,0,1,1,1,1,1,0,0],
    [18,1,1,1,1,1,2,1,2,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,1,1,1,0,13,14,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,0,0,0],
    [18,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,1,1,1,0,13,13,13,13,13,13,14,13,13,13,13,0,0,0,1,1,1,0,0,0,0],
    [18,1,1,2,2,1,1,1,3,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,1,1,1,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,0,0,0,0],
    [18,1,1,2,2,1,2,1,2,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,13,13,14,13,13,13,13,13,13,13,13,0,0,0,0,1,1,0,0,0,0],
    [2,2,1,1,1,1,1,1,1,1,8,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,3,1,1,1,1,1,1,8,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,1,1,2,1,1,1,1,8,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0,1,1,1,0],
    [1,2,2,2,1,1,1,1,1,1,8,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,14,13,13,13,13,14,13,13,14,13,0,0,0,0,0,0,1,1,1,0],
    [2,2,2,2,2,3,2,1,1,1,8,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0,1,1,1,0],
    [2,2,1,2,2,1,1,1,1,1,8,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,8,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,0,0,7,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,2,2,2,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,2,3,2,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,2,2,2,1,0,0,1,1,1,1,1,1,1,1,18,1,1,1,1,1,1,1,18,0],
    [0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,18,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,18,1,1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,18,18,18,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,18,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,0]   
]
//------------------------- In game Images ------------------------------
playerImg.src ="heroic_01.png";
world.src="teste1.png";
groundWorld.src="grount100x50.png";
sea.src = "sea100x50.png";
forest.src="ground100x50Arvores.png";
city.src="ground100x50City.png";
tower.src="ground100x50Tower.png";
darkCastle.src="ground100x50DarkCastle.png";
brokenBridge.src="sea100x50BronkenBridge.png";
enemyBat.src = 'bat.png';
enemySlime.src="slime.png";
battleBattleground.src="backgroundTeste.jpg";
bottomGround.src="groundEdge100x50Bottom.png";
topEdge.src="groundEdge100x50Top.png";
edgeBottom90.src="groundEdge100x50EdgeBottom.png";
leftEdge.src="groundEdge100x50Left.png";
leftEdge90.src="groundEdge100x50TopRight.png";

desertGround.src="ground100x50DesertMain1.png";
desertWithCowBones.src="groundDesert100x50CowBones.png";
mountains.src="ground100x50Mountains.png";
groundLittleLake.src="grount100x50lake.png";
scriptIntro.src="./intro.js";
//----------------- Menu Image -------------------------//

menuImage.src="blackHole.png";

//-------------------Battle ground Images -------------------- // 

imageBattleGround1.src="./backgroundTeste.jpg";

//------------- Intro Images ----------------// 

img_universe_begin.src="./Intro_imgs/img_universe_begin.jpg";
img_gods_seen_universe.src="gods_seen_universe.jpg";
img_planet.src="planet.jpg";
img_elf.src="./elf.jpg";
Ultriert.src="./Ultrierlt.jpg";
conselho_10.src="./conselho_dos_10.jpg";
cidade_ultraim.src="./Cidade.jpg";
deserto.src="./deserto_desespero.jpg";
ultriem.src="./Ultraim.jpg";
zulthun.src="./Zultun.jpg";
elfos_transformados.src="./elfos_transformados.jpg";
Iksu.src="./iksu.jpg";
zalTaraut.src="./zalTaraut.jpg";
rebeliao_ira.src="./rebelian_da_ira.jpg";
fim_rebeliao.src="./rebeliao_da_ira.jpg";
cavaleiros_penumbra.src="./img_cavaleiros_da_penumbra.jpg";


const cam  = {
    x:0,
    y:0,
    width: canvas.width,
    height: canvas.height,
    leftCam: ()=>{
        return cam.x + (cam.width * 0.55)
    },
    rightCam: ()=>{
        return cam.x + (cam.width * 0.45)
    },
    topCam: ()=>{
        return cam.y + (cam.height * 0.75)
    },
    bottomCam: ()=>{
        return cam.y + (cam.height * 0.75)
    }
};
//========= Todas as magias do jogo =============//
const Magias = [
    {nome: "Fera interior", escola: "Ilusão", custo: 50, efeito: "Aumenta o dano do personagem em 50 ao custo de ", efct:{dano: 500, efeito: "buff"}, valor:300, alvo: "player"},
    {nome: "Sopro de Lathare", escola: "Elemental", custo: 100, efeito: "Lança um vento poderoso contra os inimigos que causa 150 de dano", efct:{dano: 150, efeito: null}, valor:600, alvo: "enemy"},
    {nome: "Benção de zuldazar", escola: "Elemental", custo: 100, efeito: "Lança uma enorme onda sobre os inimigos, que causa 150 de dano", efct:{dano: 150, efeito: null}, valor:600, alvo: "enemy"},
    {nome: "Lança Eteril", escola: "Destruição", custo: 20, efeito: "Dispara uma lança de caos, que ignora defesa, e causa 10 de dano",efct:{dano: 10, efeito: null}, valor:100},
    {nome: "Lança Negra de Zulthun", escola: "Profanação", custo: 30, efeito: "Invoca os poderes malignos de zulthun, para inflingir 50 de dano aos inimigos (Não afeta seres das trevas)",efct:{dano: 50, efeito: null}, valor:1000, alvo: "enemy"},
    {nome: "Escuridão interior", escola: "Profanação", custo: 50, efeito: "Encha seu corpo com energia maligna, aumentando seu dano por 50 (Não afeta seres das trevas)", efct:{dano: 50, efeito: null}, valor:1500, alvo: "player"},
    {nome: "Lua Negra", escola: "Profanação", custo: 150, efeito: "Invoca a lua negra de Zal'Taraut, causando sono profundo em seus inimigos (Não afeta seres das trevas)", valor:1000, alvo: "enemy", efct:{dano: 0, efeito: "debuff"}},
    {nome: "Durmstrang", escola: "Profanação", custo: 200, efeito: "Cause dor e agonia aos seus inimigos, fazendo-os morrer lentamente, cause 500 de dano, caso o inimigo tenha  (Não afeta seres das trevas)", valor:1000, alvo: "enemy", efct:{dano: 500, efeito: null}},
    {nome: "Mors impia", escola: "Profanação", custo: 50, efeito: "Cause dor e agonia aos seus inimigos,  (Não afeta seres das trevas)", valor:1000, alvo: "enemy", efct:{dano: 500, efeito: null}},
    {nome: "Luz de Anathor", escola: "Restauração", custo: 50, efeito: "Cure suas feridas, lave sua alma, receba 100 pontos de vida", valor:1000, alvo: "player", efct:{dano: 100, efeito: "buff"}}
]
//======================================================//
//=======================Todas as kinesis do Jogo =====================//

const kinesis = [

]
//==========================================
const player = {
    X: 300,
    Y: 150,
    width: 33,
    height: 32,
    walking: false,
    frameX: 0,
    speed: 0.9,
    frameY: 0,
    level:1,
    hp: 50,
    mp:50,
    atck: 11,
    def: 8,
    xp:0,
    spells: [
        {nome: "cura", afeito: "cura 10 de hp", efct: 10, sound: true, custo: 10}, 
        {nome: "FireBall", afeito: "Ataque Mágico de fogo, causa 10 de dano", efct: 10, sound: true, custo: 30},
        {nome: "Explosão de gelo", afeito: "Causa 20 de dano de gelo", efct: 20, sound: true, custo: 30}
    ]
}
const enemyTipo1 = {
    width: 30,
    height: 31,
    moving: true,
    frameX: 0,
    speed: 7,
    frameY: 3,
    level:1,
    hp: 50,
    mp:0,
    atck: 10,
    def: 5,
    xp:15,
    spells: []
}
const enemyTipo2 = {
    width: 30,
    height: 31,
    moving: true,
    frameX: 0,
    speed: 7,
    frameY: 3,
    level: 6,
    hp: 150,
    mp:0,
    atck: 20,
    def: 15,
    xp:50,
    spells: []
}

const enemyTipo3 = {
    width: 30,
    height: 31,
    moving: true,
    frameX: 0,
    speed: 7,
    frameY: 3,
    level: 10,
    hp: 150,
    mp: 100,
    atck: 20,
    def: 15,
    xp:100,
    spells: [
        {nome: "cura", afeito: "cura 10 de hp", efct: 10, sound: true, custo: 10},
        {nome: "Lança Eteril", afeito: "Causa 15 de dano no inimigo", efct: 10, sound: true, custo: 30}
    ]
}

const enemyTipo4 = {
    width: 30,
    height: 31,
    moving: true,
    frameX: 0,
    speed: 7,
    frameY: 3,
    level: 15,
    hp: 300,
    mp: 100,
    atck: 20,
    def: 15,
    xp:150,
    spells: [
        {nome: "cura", afeito: "cura 10 de hp", efct: 10, sound: true, custo: 10},
        {nome: "Lança Eteril", afeito: "Causa 15 de dano no inimigo", efct: 10, sound: true, custo: 30}
    ]
}
const enemyTipo5 = {
    width: 30,
    height: 31,
    moving: true,
    frameX: 0,
    speed: 7,
    frameY: 3,
    level:20,
    hp: 550,
    mp: 250,
    atck: 20,
    def: 15,
    xp:200,
    spells: [
        {nome: "cura", afeito: "cura 50 de hp", efct: 10, sound: true, custo: 10},
        {nome: "Lança Eteril", afeito: "Causa 15 de dano no inimigo", efct: 10, sound: true, custo: 30}
    ]
}
const enemyTipo6 = {
    width: 30,
    height: 31,
    moving: true,
    frameX: 0,
    speed: 7,
    frameY: 3,
    hp: 150,
    mp: 100,
    atck: 20,
    def: 15,
    spells: [
        {nome: "cura", afeito: "cura 10 de hp", efct: 10, sound: true, custo: 10},
        {nome: "Lança Eteril", afeito: "Causa 15 de dano no inimigo", efct: 10, sound: true, custo: 30}
    ]
}
const Baltazar = {
    width: 30,
    height: 31,
    moving: false,
    frameX: 0,
    speed: 7,
    frameY: 3,
    hp: 5000,
    mp: 1500,
    atck: 20,
    def: 15,
    spells: [
        {nome: "ad eforum", afeito: "cura 500 de hp", efct: 500, sound: true, custo: 150},
        {nome: "Et Engler braur", afeito: "Causa 400 de dano mágico", efct: 400, sound: true, custo: 200},
        {nome: "Sanctus Dominium", afeito: "Causa 400 de dano mágico", efct: 400, sound: true, custo: 200}
    ]
}


const worldEnviroment =  {
    freeWalking : 0,
    raining: false,
    night: false,
    day: true,
    wind: false,
    storm: false,
    inBattle: false
}
const bestiario = {
    1: "morcego",
    2: "slime",
    3: "bandidos"
}

function drawTelaInicial(){
    drawMenu();
    gameName();
    menuItens();
}
function drawIntro(){
    drawIntroScreen();
}
function drawIntroScreen(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(menuImage, canvas.width /2 - 150, 200,300,300);
    if(introCount > gameIntro.length){
        menuGame = false;
        ctx.clearRect()
    }
}
var gameIntro = [

    "No começo tudo era apenas trevas...",
    
    "e os Deuses viviam no vazio...",
    
    "até que uma grande luz surgiu do\n abismo de trevas...",
    
    "trazendo consigo algo... a VIDA...",
    
    "os Deuses olharam a explosão de luz que gerou o universo...",
    
    "porém, eles não sabiam oque fazer após aquela explosão...",
    
    "no meio de tudo isso um pequeno planeta...",
    
    "sozinho no extremo canto direito, ao fim de todo o espaço...",
    
    "com sua própria lua, e um sol, chamou a atenção dos Deuses...",
    
    "pois este planeta tinha algo de especial...",
    
    "os Deuses tiveram uma ideia", 
    
    "criar uma raça, para viver nesse planeta...",
    
    "Alhtrora a Deusa da sabedoria, concedeu a", 
    
    "essas criaturas capacidade de pensar...",
    
    "drauthor o Deus da força e virtude, concedeu a essa raça, força... ",
    
    "zuldazar o Deus das florestas, concedeu a eles", 
    
    "habilidade de se comunicar com a floresta...",
    
    "Therathor o Criador Divino, os ensinou a criatividade... ",
    
    "Lathare o Deus dos ventos, fez com que ",
    
    "os ventos ficassem agradaveis e não muito fortes...",
    
    "Drathur-alor Deus dos mares, concedeu", 
    
    "sabedoria para poderem velejar e criar embarcações...",
    
    "para que assim eles pudessem desbravar o planeta deles..",
    
    "Arth-azarir-dratur Filha de Alhtrora e Drauthor", 
    
    "os concedeu a capacidade de amar uns aos outros...",
    
    "Os demais Deuses evitaram ter contato com a raça criada...",
    
    "que foi chamada de \"Os filhos\" ...",
    
    "os Filhos viveram 5000 anos, desbravaram", 
    
    "o planeta, criaram outras tribos...",
    
    "criaram reinos e cidades ...",
    
    "no ano 5000 a.R, o \"Filho\" chamado", 
    
    "Ultrierl, filho de UrtGarzelg e MirthGranzirdth...",
    
    "contra o conselho dos dez, o governo liderado", 
    
    "pelos herdeiros dos \"Primeiros Filhos\"...",
    
    "Ultrierlt liderou um grupo para viverem", 
    
    "no continente de Dralzar...",
    
    "um continente desertico, cheio de  vulcões", 
    
    "e  cercado pelo deserto que ficou conhecido como", 
    
    "\"deserto do desespero\"...",
    
    "Onde diversos \"filhos\", se mataram por não", 
    
    "verem esperança ao tentar atravesar o deserto ...",
    
    "Ultrierlt criou a cidade de VulDrathug, conhecida", 
    
    "como a cidade dos filhos de Ultrierlt...",
    
    "no ano de 3000 a.R, se iniciou a primeira guerra dos filhos...",
    
    "uma guerra que separou ainda mais os povos,", 
    
    "fazendo com que os filhos de Ultrierlt...",
    
    "se auto intitulassem de \"os Ultriem\"", 
    
    "suas peles após anos expostas ao calor...",
    
    "e vivendo perto de enorme vulcão, começou a escurecer...",
    
    "e os filhos começaram a não ver mais os Ultriem como naturais...",
    
    "no ano de 2000 a.R, outra divisão ocorreu,", 
    
    "Filhos que começaram a se envolver com necromancia...",
    
    "e magias profanas aos Deuses, ",
    
    "foram explusos da escola de Magia de DrunDahlMor,", 
    
    "e foram chamados de \"ZulDamor\"...",
    
    "os ZulDamor conseguiram contato ",
    
    "com uma criatura ancestral chamada Zul'thum, o senhor da escuridão...",
    
    "Zul'thum profanou os ZulDamor", 
    
    "fazendo com que crescecem chifres em suas cabeças...",
    
    "explusos e agora transformados,", 
    
    "eles se exilaram para uma ilha muito distante, chamada de Zaltror...",
    
    "uma ilha com criaturas ferrozes e seres das", 
    
    "trevas escondidos dentro de suas cavernas...",
    
    "nessa ilha eles criaram o templo de zul'thum...",
    
    "no ano 1501 a.R, os Ultriem começaram a negociar com os Zuldamor....",
    
    "no Ano 500 a.R, nasceu Iksu Darthu'zaldor", 
    
    "filho de Naena Zaltrugir (Zuldamor) e Naramos TheraDhur'zal(Ultriem)...",
    
    "Iksu, começou um levante aos 20 anos,", 
    
    "incitando os exercitos para que eles pudessem se rebelar contra os filhos ...",
    
    "no ano de 350 a.R Iksu se encontrou com Zul'thum no templo", 
    
    "onde o mesmo o nomeou o comandante dos exercitos ddas sombras...",
    
    "no ano 100 a.R as tropas dos Zuldamor e Ultriem,", 
    
    "começaram a se preparar para a grande guerra...",
    
    "no ano 50 a.R, Zul'thum ordenou que fosse criado", 
    
    "um enorme portal chamado de Zal'taraut,", 
    
    "para que assim ele pudesse sair do abismo das trevas ...",
    
    "no ano 10 a.R os Zuldamor e Ultriem", 
    
    "iniciaram a guerra chamada de Rebelião das Trevas...",
    
    "uma batalha que durou 10 longos anos", 
    
    "que terminou com uma intervenção dos Deuses...",
    
    "a guerra acabou com a extinção de ambas as raças...",
    
    "porém com a destruição e o caos...", 
    
    "quando não parecia ter mais esperança para o mundo...",
    
    "o mundo estava em ruinas, e não existia", 
    
    "mais nenhuma raça para viver nele...",
    
    "uma nova raça, chamada de Dhameri,", 
    
    "filhos de Alhtrora, foi trazida ao mundo...",
    
    " hoje no ano 2000 d.R, o mundo está a beira de um novo caos...",
    
    "um grupo chamado Cavaleiros da penumbra,", 
    
    "está buscando reviver Iksu, e liberar Zul'thum...",
    
    "Para iniciar um reinado de Caos...",
    
    "resta apenas uma esperança para o mundo...", 
    
    "Você...", 
    
    "Heroi é seu dever acabar com os cavaleiros da penumbra", 
    
    "e impedir que eles revivam Iksu...",
    
    "Salve o mundo da escuridão eterna...",
    "Não falhe, pois essa é a única esperança..."
    ];
    var intro = (bool)=>{
     var executarIntro = bool ? bool : false;
     if(!executarIntro){
        var timer  = setInterval(()=>{
            ctx.fillStyle="#000000";
            ctx.fillRect(0,0, canvas.width, canvas.height)
            ctx.fillStyle="#FFFFFF";
            ctx.font = "25px comic sans"
            ctx.fillText(`${gameIntro[introCount]}`, 10, 550);
            console.log(introCount, `introText: ${introText} / menuGame: ${menuGame}`);
            introCount++
            // Draw the Images int the Screen Logic
           

            // End Images logic
            if(introCount > 0 && introCount < 50){
                ctx.fillStyle = "#000000";
                ctx.fillRect(0,0, canvas.width, canvas.height/ 2);
                if(introCount > 3 && introCount < 6){
                    ctx.drawImage(img_universe_begin, 0, 0,900,500);
                } else if (introCount > 8 && introCount < 11){
                    ctx.drawImage(img_gods_seen_universe, 0, 0,900,500);
                } else if (introCount > 11 && introCount < 30){
                    ctx.drawImage(img_planet, 0, 0,900,500);
                } else if (introCount > 30 && introCount < 39){
                    ctx.drawImage(Ultriert, 0, 0,900,500);
                } else if (introCount > 39 && introCount < 43){
                    ctx.drawImage(deserto, 0, 0,900,500);
                } else if (introCount > 44 && introCount < 48){
                    ctx.drawImage(cidade_ultraim, 0, 0,900,500);
                } else if (introCount > 50 && introCount < 54){
                    ctx.drawImage(ultriem, 0, 0,900,500);
                } 
                
                windsOfStories.play();
            }
                
            if(introCount > 55  && introCount < 80){
                windsOfStories.pause();
                darkMagic.play();
                if (introCount > 55 && introCount < 59){
                    ctx.drawImage(zulthun, 0, 0,900,500);
                } else if (introCount > 60 && introCount < 64){
                    ctx.drawImage(elfos_transformados, 0, 0,900,500);
                } else if (introCount > 65 && introCount < 69){
                    ctx.drawImage(Iksu, 0, 0,900,500);
                } else if (introCount > 70 && introCount < 73){
                    ctx.drawImage(zalTaraut, 0, 0,900,500);
                } else if (introCount > 74 && introCount < 80){
                    ctx.drawImage(fim_rebeliao, 0, 0,900,500);
                }
            }
            if(introCount > 81){
                darkMagic.pause();
                InvasioOfChaos.play();
                if (introCount > 81 && introCount < 86){
                    ctx.drawImage(img_planet, 0, 0,900,500);
                } else if (introCount > 87 || introCount == 95){
                    ctx.drawImage(cavaleiros_penumbra, 0, 0,900,500);
                }

            }
            if(introCount >= gameIntro.length){
                    introText = false;
                    menuGame = true;
                    executarIntro = true;
                    clearInterval(timer);
                    game();
                }
        },6000)
     }

     var stopTimer = (intv)=> clearInterval(intv);
     
    }
    

function drawMenu(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, canvas.width, canvas.height)
    ctx.drawImage(menuImage, canvas.width /2 - 150, 200,300,300);
    InvasioOfChaos.pause();
    menuMusic.play();
}
function gameName(){
    ctx.fillStyle="#808080";
    ctx.font = "50px comic sans"
    ctx.fillText('O Despertar das Kineses', canvas.width/2 - 250, 150)
}
function drawBattleGround(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(imageBattleGround1, 0, 0,900,600);
}

function drawEnemy(monster){
    let monsterImg;
    switch (monster) {
        case 1:
            monsterImg = enemyBat;
            break;
        case 2:
            monsterImg = enemySlime;
            break;
        case 3: 
            monsterImg = "";
            break;
        
        default:
            monsterImg = enemyBat;
            break;
    }

    ctx.drawImage(monsterImg, 150, 150, 150, 150);
}
function menuItens(){
    ctx.fillStyle="#808080";
    ctx.font = "25px comic sans"
    ctx.fillText('Aperte [Enter] para começar o Jogo', canvas.width/2 - 200, 550);
}
function drawMap(){
    ctx.save();
    ctx.translate(-cam.x, -cam.y);
    ctx.fillStyle= "#5B5D5D";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    map.forEach((row,i)=>{
        row.forEach((col, vl)=>{
            if(col == 0){
                ctx.drawImage(sea, 100 * i, 50 * vl)
            } 
            else if( col == 1 ){
                ctx.drawImage(groundWorld, 100 * i, 50 * vl)
            }
            else if( col == 2 ){
                ctx.drawImage(forest, 100 * i, 50 * vl)
            }
            else if( col == 3 ){
                ctx.drawImage(city, 100 * i, 50 * vl)
            }
            else if( col == 4 ){
                ctx.drawImage(groundWorld, 100 * i, 50 * vl)
            }
            else if( col == 5 ){
                ctx.drawImage(darkCastle, 100 * i, 50 * vl)
            }
            else if( col == 6 ){
                ctx.drawImage(tower, 100 * i, 50 * vl)
            }
            else if( col == 7 ){
                ctx.drawImage(brokenBridge, 100 * i, 50 * vl)
            }
            else if( col == 8 ){
                ctx.drawImage(bottomGround, 100 * i, 50 * vl)
            }
            else if( col == 9 ){
                ctx.drawImage(topEdge, 100 * i, 50 * vl)
            }
            else if( col == 10 ){
                ctx.drawImage(edgeBottom90, 100 * i, 50 * vl)
            }
            else if( col == 11 ){
                ctx.drawImage(leftEdge, 100 * i, 50 * vl)
            }
            else if( col == 12 ){
                ctx.drawImage(leftEdge90, 100 * i, 50 * vl)
            }
            else if( col == 13 ){
                ctx.drawImage(desertGround, 100 * i, 50 * vl)
            }
            else if( col == 14 ){
                ctx.drawImage(desertWithCowBones, 100 * i, 50 * vl)
            }
            else if( col == 18 ){
                ctx.drawImage(mountains, 100 * i, 50 * vl)
            }
            else if( col == 19 ){
                ctx.drawImage(groundLittleLake, 100 * i, 50 * vl)
            }
        })
    })
    ctx.restore();
    
}
function drawPlayer(){
    ctx.drawImage(playerImg, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.X, player.Y, player.width, player.height);
}

function battle(monster){
    battleMusic.play();
    drawBattleGround();
    drawEnemy(monster);
    drawCombatMenu()
}

function hpMpBar(){

}
function drawCombatMenu(){
    ctx.fillStyle = "#0D64C1";
    ctx.beginPath();
    ctx.moveTo(0, 399);
    ctx.lineTo(canvas.width,400);
    ctx.strokeStyle = "White";
    ctx.stroke();
    ctx.fillRect(0,400, canvas.width, 200);
    // ===== Desenhando as opções de batalha ====//
    ctx.fillStyle="White";
    ctx.font = "25px comic sans"
    ctx.fillText('1 - Atacar ⚔️', 10, 440);
    ctx.fillText('2 - Magia 🪄', 250, 440);
    ctx.fillText('3 - Usar Itens ⚗️', 450, 440);
    ctx.fillText('4 - Kinesis ✨', 660, 440);
    ctx.fillText('5 - Fugir 🏃🏾', 10, 500);

}

function draw(){
    drawMap();
    movimento();
    drawPlayer();
}
if(introText){
    intro();
}
let  game = ()=>{
    if(introText == false){
        setInterval( ()=>{
            if(menuGame && introText == false){
                 drawTelaInicial();
             } else {
                 if(!emCombat){
                     draw();
                 } else {
                     battle();
                 }
             }
         }, 0.2);
    }
}

function movimento(){
    if (player.frameX < 3 && player.walking) player.frameX ++ 
    else player.frameX = 0
}
function escolherInimigo(){
    let monstroNumero = Math.floor((Math.random() * 3)+ 1);
    return monstroNumero;
}

function callBattle(){
    let monstroEscolhido = escolherInimigo();
    battle(monstroEscolhido)

}


window.addEventListener('keyup', e =>  player.walking = false)
window.addEventListener('keydown', (e)=>{
    if(e.keyCode === 37) {
        if(worldEnviroment.freeWalking <= 100){
            player.X -= player.speed;
            player.frameY = 1;
            player.walking = true;
            worldEnviroment.freeWalking += 2
        } else {
            emCombat= true;
        }
       
    } else if(e.keyCode === 38) {
        if(worldEnviroment.freeWalking <= 100){
            player.Y -= player.speed;
            player.frameY = 3;
            player.walking = true;
            worldEnviroment.freeWalking += 1;
        } else {
            emCombat= true;
        }
    } else if(e.keyCode === 39) {
        if(worldEnviroment.freeWalking <= 100){
            player.X += player.speed;
            player.frameY = 2;
            player.walking = true;
            worldEnviroment.freeWalking += 2
        } else {
            emCombat= true;
        }
        
    } else if(e.keyCode === 40) {
        if(worldEnviroment.freeWalking <= 100){
            player.Y += player.speed;
            player.frameY = 0;
            player.walking = true;
            worldEnviroment.freeWalking += 1;
        } else {
            emCombat= true
        }
        
    } else if (e.keyCode === 13 && menuGame){
        menuGame = false;
        executarIntro = true;
        menuMusic.pause();
        windsOfStories.pause();        
    } else if (e.keyCode === 32 && introText){
        menuGame = true;
        introText = false;
        windsOfStories.pause();
        game();
        stopTimer(intro.timer);
        executarIntro = true;

    }
    
    if (player.X < cam.leftCam()){
        cam.x = player.X - (cam.width * 0.25);
    } 
    if(player.X + player.width > cam.rightCam()){
        cam.x = player.X + player.width - (cam.width * 1.5)
    } 
    if (player.Y < cam.topCam()){
        cam.y = player.Y - (cam.height * 0.25);
    } 
    if(player.Y + player.height > cam.bottomCam()){
        cam.y = player.Y + player.height - (cam.height * 0.75)
    }

});

