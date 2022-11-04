const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var emCombat = false;
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
var contagem = 0;
/**
 * 
 *  1 ground comon
 *  2 forest
 *  3 city
 *  4 mansion
 *  5 dark castle
 *  6 tower
 */
let map = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,2,2,2,3,1,2,1,0,0,0,0],
    [0,0,0,1,2,1,1,1,2,3,1,0,0,0],
    [0,0,0,1,1,2,3,1,2,1,1,0,0,0],
    [0,0,0,1,1,4,2,1,6,1,1,0,0,0],
    [0,0,0,0,1,2,5,2,1,1,1,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,2,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,7,0,0,0,0,0,0],
    [0,1,1,1,1,1,0,1,0,0,1,1,0,0],
    [0,1,1,1,3,2,1,1,1,1,1,1,0,0],
    [0,1,1,1,2,2,1,6,1,1,1,0,0,0],
    [0,0,1,1,1,2,2,1,3,1,1,1,1,0],
    [0,0,1,1,1,2,2,2,2,1,6,1,1,0]
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

const player = {
    X: 500,
    Y:300,
    width: 33,
    height: 32,
    walking: false,
    frameX: 0,
    speed: 7,
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

function drawBattleGround(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, 600, 600);
}
function drawEnemy(){

    ctx.drawImage(enemyBat, 150, 150, 150, 150)
}
function drawMap(){
    
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
        })
    })
    
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

setInterval(()=> {
    emCombat ? emCombat = false : emCombat = true
},
5000000
)

setInterval( ()=>{
    if(!emCombat){
        draw();
    } else {
        battle();
    }
}, 1)
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
    }

});

