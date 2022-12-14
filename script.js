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
    [18,1,1,1,1,1,1,6,1,1,1,1,1,8,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,14,13,13,14,03,0,0,0,1,0,1,1,1,1,0],
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
menuImage.src="blackHole.png";
desertGround.src="ground100x50DesertMain1.png";
desertWithCowBones.src="groundDesert100x50CowBones.png";
mountains.src="ground100x50Mountains.png";
groundLittleLake.src="grount100x50lake.png";
scriptIntro.src="./intro.js";
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

const player = {
    X: 300,
    Y: 150,
    width: 33,
    height: 32,
    walking: false,
    frameX: 0,
    speed: 0.9,
    frameY: 0,
    hp: 50,
    atck: 11,
    def: 10
}
const enemy = {
    width: 30,
    height: 31,
    moving: true,
    frameX: 0,
    speed: 7,
    frameY: 3
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

    "No come??o tudo era apenas trevas...",
    
    "e os Deuses viviam no vazio...",
    
    "at?? que uma grande luz surgiu do\n abismo de trevas...",
    
    "trazendo consigo algo... a VIDA...",
    
    "os Deuses olharam a explos??o de luz que gerou o universo...",
    
    "por??m, eles n??o sabiam oque fazer ap??s aquela explos??o...",
    
    "no meio de tudo isso um pequeno planeta...",
    
    "sozinho no extremo canto direito, ao fim de todo o espa??o...",
    
    "com sua pr??pria lua, e um sol, chamou a aten????o dos Deuses...",
    
    "pois este planeta tinha algo de especial...",
    
    "os Deuses tiveram uma ideia", 
    
    "criar uma ra??a, para viver nesse planeta...",
    
    "Alhtrora a Deusa da sabedoria, concedeu a", 
    
    "essas criaturas capacidade de pensar...",
    
    "drauthor o Deus da for??a e virtude, concedeu a essa ra??a, for??a... ",
    
    "zuldazar o Deus das florestas, concedeu a eles", 
    
    "habilidade de se comunicar com a floresta...",
    
    "Therathor o Criador Divino, os ensinou a criatividade... ",
    
    "Lathare o Deus dos ventos, fez com que ",
    
    "os ventos ficassem agradaveis e n??o muito fortes...",
    
    "Drathur-alor Deus dos mares, concedeu", 
    
    "sabedoria para poderem velejar e criar embarca????es...",
    
    "para que assim eles pudessem desbravar o planeta deles..",
    
    "Arth-azarir-dratur Filha de Alhtrora e Drauthor", 
    
    "os concedeu a capacidade de amar uns aos outros...",
    
    "Os demais Deuses evitaram ter contato com a ra??a criada...",
    
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
    
    "um continent desertico, cheio de  vulc??es", 
    
    "e  cercado pelo deserto que ficou conhecido como", 
    
    "\"deserto do desespero\"...",
    
    "Onde diversos \"filhos\", se mataram por n??o", 
    
    "verem esperan??a ao tentar atravesar o deserto ...",
    
    "Ultrierlt criou a cidade de VulDrathug, conhecida", 
    
    "como a cidade dos filhos de Ultrierlt...",
    
    "no ano de 3000 a.R, se iniciou a primeira guerra dos filhos...",
    
    "uma guerra que separou ainda mais os povos,", 
    
    "fazendo com que os filhos de Ultrierlt...",
    
    "se auto intitulassem de \"os Ultriem\"", 
    
    "suas peles ap??s anos expostas ao calor...",
    
    "e vivendo perto de enorme vulc??o, come??ou a escurecer...",
    
    "e os filhos come??aram a n??o ver mais os Ultriem como naturais...",
    
    "no ano de 2000 a.R, outra divis??o ocorreu,", 
    
    "Filhos que come??aram a se envolver com necromancia...",
    
    "e magias profanas aos Deuses, ",
    
    "foram explusos da escola de Magia de DrunDahlMor,", 
    
    "e foram chamados de \"ZulDamor\"...",
    
    "os ZulDamor conseguiram contato ",
    
    "com uma criatura ancestral chamada Zul'thum, o senhor da escurid??o...",
    
    "Zul'thum profanou os ZulDamor", 
    
    "fazendo com que crescecem chifres em suas cabe??as...",
    
    "explusos e agora transformados,", 
    
    "eles se exilaram para uma ilha muito distante, chamada de Zaltror...",
    
    "uma ilha com criaturas ferrozes e seres das", 
    
    "trevas escondidos dentro de suas cavernas...",
    
    "nessa ilha eles criaram o templo de zul'thum...",
    
    "no ano 1501 a.R, os Ultriem come??aram a negociar com os Zuldamor....",
    
    "no Ano 500 a.R, nasceu Iksu Darthu'zaldor", 
    
    "filho de Naena Zaltrugir (Zuldamor) e Naramos TheraDhur'zal(Ultriem)...",
    
    "Iksu, come??ou um levante aos 20 anos,", 
    
    "incitando os exercitos para que eles pudessem se rebelar contra os filhos ...",
    
    "no ano de 350 a.R Iksu se encontrou com Zul'thum no templo", 
    
    "onde o mesmo o nomeou o comandante dos exercitos ddas sombras...",
    
    "no ano 100 a.R as tropas dos Zuldamor e Ultriem,", 
    
    "come??aram a se preparar para a grande guerra...",
    
    "no ano 50 a.R, Zul'thum ordenou que fosse criado", 
    
    "um enorme portal chamado de Zal'taraut,", 
    
    "para que assim ele pudesse sair do abismo das trevas ...",
    
    "no ano 10 a.R os Zuldamor e Ultriem", 
    
    "iniciaram a guerra chamada de Rebeli??o das Trevas...",
    
    "uma batalha que durou 10 longos anos", 
    
    "que terminou com uma interven????o dos Deuses...",
    
    "a guerra acabou com a extin????o de ambas as ra??as...",
    
    "por??m com a destrui????o e o caos...", 
    
    "quando n??o parecia ter mais esperan??a para o mundo...",
    
    "o mundo estava em ruinas, e n??o existia", 
    
    "mais nenhuma ra??a para viver nele...",
    
    "uma nova ra??a, chamada de Dhameri,", 
    
    "filhos de Alhtrora, foi trazida ao mundo...",
    
    " hoje no ano 2000 d.R, o mundo est?? a beira de um novo caos...",
    
    "um grupo chamado Cavaleiros da penumbra,", 
    
    "est?? buscando reviver Iksu, e liberar Zul'thum...",
    
    "Para iniciar um reinado de Caos...",
    
    "resta apenas uma esperan??a para o mundo...", 
    
    "Voc??...", 
    
    "Heroi ?? seu dever acabar com os cavaleiros da penumbra", 
    
    "e impedir que eles revivam Iksu...",
    
    "Salve o mundo da escurid??o eterna...",
    "N??o falhe, pois essa ?? a ??nica esperan??a..."
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
            if(introCount > 0 && introCount < 50) windsOfStories.play();
            if(introCount > 55  && introCount < 80){
                windsOfStories.pause();
                darkMagic.play();
            }
            if(introCount > 81){
                darkMagic.pause();
                InvasioOfChaos.play();
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
}
function drawEnemy(){

    ctx.drawImage(enemyBat, 150, 150, 150, 150);
}
function menuItens(){
    ctx.fillStyle="#808080";
    ctx.font = "25px comic sans"
    ctx.fillText('Aperte [Enter] para come??ar o Jogo', canvas.width/2 - 200, 550);
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

function battle(){
    drawBattleGround();
    drawEnemy();
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




window.addEventListener('keyup', e =>  player.walking = false)
window.addEventListener('keydown', (e)=>{
    if(e.keyCode === 37) {
        player.X -= player.speed
        player.frameY = 1
        player.walking = true
    } else if(e.keyCode === 38) {
        player.Y -= player.speed
        player.frameY = 3
        player.walking = true
    } else if(e.keyCode === 39) {
        player.X += player.speed
        player.frameY = 2
        player.walking = true
    } else if(e.keyCode === 40) {
        player.Y += player.speed
        player.frameY = 0
        player.walking = true
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

