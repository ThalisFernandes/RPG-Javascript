const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;
var emCombat = false;
var menuGame = true;
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
var contagem = 0;
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
 * 
 */
let map = [
    [18,18,18,18,18,18,18,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [18,1,2,1,3,2,1,1,2,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [18,1,2,2,2,2,1,1,2,1,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [18,1,2,3,1,1,4,1,2,5,1,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [18,1,1,2,2,1,2,2,2,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [18,1,1,6,2,1,3,2,0,0,0,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [18,1,1,1,1,1,2,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,0,13,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,13,0,13,13,13,13,13,13,0,0,0,0,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,0,0],
    [1,1,1,1,2,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,14,13,13,13,13,14,13,13,0,0,0,0,1,1,1,1,0,0],
    [1,1,2,2,2,2,2,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,1,0],
    [1,1,1,2,3,2,1,1,1,1,1,8,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,1,0],
    [1,1,1,1,2,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,13,13,14,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,6,1,1,1,1,1,8,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,14,13,13,14,03,0,0,0,1,0,1,1,1,1,0],
    [1,2,1,1,4,1,1,1,1,1,2,2,1,1,8,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,1,0],
    [1,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,1,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,1,1,1,1,0,0],
    [1,2,2,1,2,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,8,0,0,0,1,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,0,0],
    [1,2,2,2,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,1,1,1,1,0,0,0,13,13,14,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,0,0],
    [1,2,2,2,3,1,2,1,1,1,1,1,8,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,0,0],
    [1,2,1,1,1,1,2,1,1,1,1,8,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,2,1,1,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,14,13,0,0,0,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,2,1,2,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,13,14,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,1,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,14,13,13,13,13,0,0,0,1,1,1,0,0,0,0],
    [1,1,1,2,2,1,1,1,3,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,1,1,1,0,0,0,0],
    [1,1,1,2,2,1,2,1,2,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,13,13,14,13,13,13,13,13,13,13,13,0,0,0,0,1,1,0,0,0,0],
    [2,2,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,3,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,1,1,2,1,1,1,1,8,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0,1,1,1,0],
    [1,2,2,2,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,14,13,13,13,13,14,13,13,14,13,0,0,0,0,0,0,1,1,1,0],
    [2,2,2,2,2,3,2,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0,1,1,1,0],
    [2,2,1,2,2,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,8,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]   
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
desertGround.src="groundDesert100x50.png";
desertWithCowBones.src="groundDesert100x50CowBones.png";
mountains.src="ground100x50Mountains.png";
const cam  = {
    x:0,
    y:0,
    width: canvas.width,
    height: canvas.height,
    leftCam: ()=>{
        return cam.x + (cam.width * 0.50)
    },
    rightCam: ()=>{
        return cam.x + (cam.width * 0.95)
    },
    topCam: ()=>{
        return cam.y + (cam.height * 0.50)
    },
    bottomCam: ()=>{
        return cam.y + (cam.height * 0.95)
    }
};

const player = {
    X: 100,
    Y: 100,
    width: 33,
    height: 32,
    walking: false,
    frameX: 0,
    speed: 2,
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
function drawMenu(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, canvas.width, canvas.height)
    ctx.drawImage(menuImage, canvas.width /2 - 150, 200,300,300)
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
    console.log(player.X + player.width > cam.rightCam())
}

// setInterval(()=> {
//     emCombat ? emCombat = false : emCombat = true
// },
// 5000000
// )

setInterval( ()=>{
    if(menuGame){
        drawTelaInicial();
    } else {
        if(!emCombat){
            draw();
        } else {
            battle();
        }
    }
}, 0.2)
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
    }
    
    if (player.X < cam.leftCam()){
        cam.x = player.X - (cam.width * 0.25);
    } else if(player.X + player.width > cam.rightCam()){
        cam.x = player.X + player.width - (cam.width * 0.75)
    } else if (player.Y < cam.topCam()){
        cam.y = player.Y - (cam.width * 0.25);
    } else if(player.Y + player.width > cam.rightCam()){
        cam.Y = player.Y + player.width - (cam.width * 0.75)
    }

});

