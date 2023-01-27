// canvas setup 
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = 1600;
canvas.height = 1000;

let score = 0;
let gameframe = 0;
ctx.font = '60px Georgia bold';
let gamespeed = 1;
let gameover = false;
let stonefish = false;
let drop = false;
let gamepause = false;
let color = Math.floor(Math.random() * 3);
let lives = 5;

// UI

function isInsideButton(pos, rect){
    return pos.x > rect.x && pos.x < rect.x + rect.width &&
    pos.y < rect.y+rect.height && pos.y>rect.y;
}

var quit = {
    x: canvas.width - 300,
    y: 20,
    width: 70,
    height: 50,
    text: "退出"
}


var restart = {
    x: canvas.width - 200,
    y: 20,
    width: 130,
    height: 50,
    text: "重新开始"
}

function drawButton(name){
    ctx.fillStyle = '#93FFE8';
    ctx.strokeStyle = "black";
    ctx.fillRect(name.x, name.y, name.width, name.height);
    ctx.lineWidth = 4;
    ctx.strokeRect(name.x, name.y, name.width, name.height);
    ctx.fillStyle = '#000'
    ctx.font = '27px Georgia red';
    ctx.fillText(name.text, name.x+10, name.y+30);
    ctx.font = '60px Georgia';
    ctx.restore();
}

function drawTextBG(ctx, txt, font, x, y) {      
    ctx.save();
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#93FFE8';
    var width = ctx.measureText(txt).width;
    ctx.fillRect(x, y, width, parseInt(font, 10));
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, parseInt(font, 10));
    ctx.fillStyle = '#000';
    ctx.fillText(txt, x, y);
    ctx.restore();
}


// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function(event){
    
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    console.log(mouse.x,mouse.y);
    if(isInsideButton(mouse, quit)){
        location.href='/games'
    } 
    if(isInsideButton(mouse, restart)){
        location.href='/games/fish'
    } 
})

canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})

// Player
var playerLeft = new Image();
var playerRight = new Image();
const playerLeft_blue = new Image();
playerLeft_blue.src = '../data/fish/blue_fish_left.png';
const playerRight_blue = new Image();
playerRight_blue.src = '../data/fish/blue_fish_right.png';

const playerLeft_green = new Image();
playerLeft_green.src = '../data/fish/green_fish_left.png';
const playerRight_green = new Image();
playerRight_green.src = '../data/fish/green_fish_right.png';

const playerLeft_purple= new Image();
playerLeft_purple.src = '../data/fish/purple_fish_left.png';
const playerRight_purple = new Image();
playerRight_purple.src = '../data/fish/purple_fish_right.png';

const playerLeft_black= new Image();
playerLeft_black.src = '../data/fish/black_fish_left.png';
const playerRight_black = new Image();
playerRight_black.src = '../data/fish/black_fish_right.png';

const playerLeft_stone = new Image();
playerLeft_stone.src = '../data/fish/stonefish_left.png';
const playerRight_stone = new Image();
playerRight_stone.src = '../data/fish/stonefish_right.png';

const playerLeft_bluestone = new Image();
playerLeft_bluestone.src = '../data/fish/bluestone_left.png';
const playerRight_bluestone = new Image();
playerRight_bluestone.src = '../data/fish/bluestone_right.png';

class Player{
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 20;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498; 
        this.spriteHeight = 327; 
    }

    update(){
        if(stonefish == true){
            this.spriteWidth = 570;
            this.spriteHeight = 546;
        }
        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if(mouse.x != this.x){
            this.x -= dx/30;
        }
        if(mouse.y != this.y){
            this.y -= dy/30;
        }
    }

    draw(){
        //ctx.fillstyle = 'red';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        //ctx.closePath();
        //ctx.fillRect(this.x, this.y, this.radius, 10);
        if(stonefish == true){
            if(score > 100){
                playerLeft = playerLeft_bluestone;
                playerRight = playerRight_bluestone;
            }else{
                playerLeft = playerLeft_stone;
                playerRight = playerRight_stone;
            }
        }else{
            if(score >= 0 && score < 10){
                playerLeft = playerLeft_blue;
                playerRight = playerRight_blue;
            }else if(score >= 10 && score < 20){
                playerLeft = playerLeft_green;
                playerRight = playerRight_green;            
            }else if(score >= 20 && score < 30){
                playerLeft = playerLeft_purple;
                playerRight = playerRight_purple;   
            }else if(score >= 30 && score < 40){
                playerLeft = playerLeft_black;
                playerRight = playerRight_black;   
            }
        }
        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight
                , this.spriteWidth, this.spriteHeight, this.x-60, this.y-45, this.spriteWidth/4, this.spriteHeight/4);
        }
        else{
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight
                , this.spriteWidth, this.spriteHeight, this.x-60, this.y-45, this.spriteWidth/4, this.spriteHeight/4);
        }
    }
}

const player = new Player();

// Puffer
const pufferArray = [];

var pufferImg = new Image();
const pufferImage_deflated = new Image();
pufferImage_deflated.src = '../data/fish/deflated.png';

const pufferImage_inflated = new Image();
pufferImage_inflated.src = '../data/fish/inflated.png';

class Puffer{
    constructor(){
        this.x = -500;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 40;
        this.speed = Math.random() * 2 + 1;
        this.distance;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 634; 
        this.spriteHeight = 640; 
        this.inflated = false;
    }
    update(){
        this.x += this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);

        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }
    }
    draw(){
        if(this.inflated == false){
            pufferImg = pufferImage_deflated;
        }
        else{
            pufferImg = pufferImage_inflated;
        }
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        //ctx.closePath();
        //ctx.stroke();
        ctx.drawImage(pufferImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight
            , this.spriteWidth, this.spriteHeight, this.x-90, this.y-90, this.spriteWidth/4, this.spriteHeight/4);
    }
}

const hurtSound = document.createElement('audio');
hurtSound.src = '../data/fish/hurt.wav';

function handlePuffers(){
    if(gameframe % 100 == 0){
       pufferArray.push(new Puffer());
    }
    for(let i = 0;i < pufferArray.length;i++){
        pufferArray[i].update();
        pufferArray[i].draw();
    }
    for(let i = 0;i < pufferArray.length;i++){
        if(pufferArray[i].x > canvas.width + 300){
            pufferArray.splice(i,1);
        }
        if(pufferArray[i].distance < pufferArray[i].radius + player.radius){
            if(pufferArray[i].inflated == false) 
            {
                hurtSound.play();
                lives--;
            }
            pufferArray[i].inflated = true;
            if(lives == 0){
                handleGameOver();
            }
        }
    }       
}

// diamonds
const diamondArray = [];
const diamondImage = new Image();
diamondImage.src = '../data/fish/jelleyfish.png';

class diamond{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 2 + 1;
        this.distance;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 295; 
        this.spriteHeight = 500; 
        this.counted = false;
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);

        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 10) this.frame = 0;
            if(this.frame == 4 || this.frame == 9){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
            if(this.frame < 5) this.frameY = 0;
            else if (this.frame < 10) this.frameY = 1;
            else this.frameY = 0;
        }
    }
    draw(){
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        //ctx.closePath();
        //ctx.stroke();
        ctx.drawImage(diamondImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight
            , this.spriteWidth, this.spriteHeight, this.x-40, this.y-45, this.spriteWidth/4, this.spriteHeight/4);
    }
}

const diamondAcquire1 = document.createElement('audio');
diamondAcquire1.src = '../data/fish/diamond.wav';

function handleDiamonds(){
    if(gameframe % 50 == 0){
       diamondArray.push(new diamond());
    }
    for(let i = 0;i < diamondArray.length;i++){
        diamondArray[i].update();
        diamondArray[i].draw();
    }
    for(let i = 0;i < diamondArray.length;i++){
        if(diamondArray[i].y < 0 - this.radius * 2){
            diamondArray.splice(i,1);
        }
        if(diamondArray[i].distance < diamondArray[i].radius + player.radius){
            if(diamondArray[i].counted == false){
                diamondAcquire1.play();
                score++;
                diamondArray[i].counted == true;
                diamondArray.splice(i,1);
            }
            
        }
    }       
}

// SUBMARINE
const submarineImg = new Image();
submarineImg.src = '../data/fish/submarine.png';

const submarinesound = document.createElement('audio');
submarinesound.src = '../data/fish/submarinesound.mp3';

class Submarine{
    constructor(){
        this.x = canvas.width + 500;
        this.y = 150;
        this.radius = 200;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 512;
        this.spriteHeight = 322;
        this.drop_loc = Math.random()*(canvas.width - 100) + 50;
        this.treasure = false;
    }
    draw(){
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.drawImage(submarineImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.x-300, this.y-150, this.spriteWidth, this.spriteHeight);
    }
    update(){
        if(this.x <= this.drop_loc && this.treasure){
            handleTreasure(this.x, this.y);
        }
        if(this.x <= this.drop_loc && !this.treasure){
            handleBomb1(this.x, this.y);
        }
        this.x -= this.speed;
        if(this.x < 0 - this.radius * 2 && gameframe % 2000 == 0){
            this.drop_loc = Math.random()*(canvas.width - 100) + 50;
            this.treasure = Math.random() >= 0.5 ? true : false;
            drop = false;
            this.x = canvas.width + 500;
            this.y = 150;
            this.speed = Math.random() * 2  + 2; 
        }
        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 2 || this.frame == 5 || this.frame == 8 || this.frame == 11){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 6) this.frameY = 1;
            else if (this.frame < 9) this.frameY = 2;
            else if (this.frame < 12) this.frameY = 3;
            else this.frameY = 0;
        }
        //collision 
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < this.radius + player.radius){
            $.ajax({
                url:"/games/fish",
                type:"POST",
                data: {
                    result: score
                    },
                success: function (response) {
                },
                error: function (response) {
                }
                });
            eat.play();
            handleGameOver();
        }
    }
}

const submarine = new Submarine();
function handleSubmarine(){
    submarine.draw();
    submarine.update();
}

// missile
var missileImg = new Image();
const missileYellowImg = new Image();
missileYellowImg.src = '../data/fish/yellow_fish.png'

const missileBlueImg = new Image();
missileBlueImg.src = '../data/fish/blue_fish.png'

const missilePinkImg = new Image();
missilePinkImg.src = '../data/fish/pink_fish.png'

const eat = document.createElement('audio');
eat.src = '../data/fish/eat.ogg';


class Missile{
    constructor(){
        this.x = canvas.width + 300;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }
    draw(color){
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        if(color == 0){
            missileImg = missileBlueImg;
        }else if(color == 1){
            missileImg = missileYellowImg;
        }else if(color == 2){
            missileImg = missilePinkImg;
        }
        ctx.drawImage(missileImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.x-50, this.y-50, this.spriteWidth/4, this.spriteHeight/4);
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.radius * 2){
            color = Math.floor(Math.random() * 3);
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2  + 2; 
        }
        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }
        //collision
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < this.radius + player.radius){
            if(stonefish == true){
                score += 3;
                eat.play();
                this.x = -100;
            }else{
                $.ajax({
                    url:"/games/fish",
                    type:"POST",
                    data: {
                        result: score
                      },
                    success: function (response) {
                    },
                    error: function (response) {
                    }
                    });
                eat.play();
                handleGameOver();
            }
        }
    }
}

const missile1 = new Missile();
function handleMissile(color){
    missile1.draw(color);
    missile1.update();
}

// Angeler Fish
const angelerImg = new Image();
angelerImg.src = '../data/fish/angler_fish.png'

class Angeler{
    constructor(){
        this.x = -300;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 70;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 622;
        this.spriteHeight = 451;
    }
    draw(){
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.drawImage(angelerImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.x-80, this.y-70, this.spriteWidth/3, this.spriteHeight/3);
    }
    update(){
        this.x += this.speed;
        if(this.x > canvas.width + 300){
            this.x = -300;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2  + 2; 
        }
        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 16) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11 || this.frame == 15){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else if (this.frame < 15) this.frameY = 3;
            else this.frameY = 0;
        }
        //collision
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < this.radius + player.radius){
            $.ajax({
                url:"/games/fish",
                type:"POST",
                data: {
                    result: score
                    },
                success: function (response) {
                },
                error: function (response) {
                }
                });
            eat.play();
            handleGameOver();
        }
    }
}

const angeler = new Angeler();
function handleAngeler(){
    angeler.draw();
    angeler.update();
}

// Sword Fish
const swordImg = new Image();
swordImg.src = '../data/fish/sword_fish.png'

class Sword{
    constructor(){
        this.x = canvas.width + 300;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 80;
        this.speed = Math.random() * 2 + 8;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 1033;
        this.spriteHeight = 413;
    }
    draw(){
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.drawImage(swordImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.x-180, this.y-70, this.spriteWidth/3, this.spriteHeight/3);
    }
    update(){
        this.x -= this.speed;
        if(this.x < -300 && gameframe % 1300){
            this.x = canvas.width + 300;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2  + 8; 
        }
        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 16) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11 || this.frame == 15){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else if (this.frame < 15) this.frameY = 3;
            else this.frameY = 0;
        }
        //collision
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < this.radius + player.radius){
            $.ajax({
                url:"/games/fish",
                type:"POST",
                data: {
                    result: score
                    },
                success: function (response) {
                },
                error: function (response) {
                }
                });
            eat.play();
            handleGameOver();
        }
    }
}

const sword = new Sword();
function handleSword(){
    sword.draw();
    sword.update();
}

// Bomb
const bombImg = new Image();
bombImg.src = '../data/fish/bomb.png'

const bombTouch = document.createElement('audio');
bombTouch.src = '../data/fish/explode.wav';

const missileSound = document.createElement('audio');
missileSound.src = '../data/fish/missile.wav';

class Bomb{
    constructor(){
        this.x;
        this.y;
        this.radius = 40;
        this.speed = Math.random() * 2 + 5;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 439;
        this.spriteHeight = 1042;
    }
    draw(){
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.drawImage(bombImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.x-50, this.y-200, this.spriteWidth/4, this.spriteHeight/4);
    }
    update(x_pos, y_pos){
        if(this.y > canvas.height + 200){
            this.x = -500;
            this.y = -500;
        }else{
            if(drop == false){
                drop = true;
                missileSound.play();
                this.x = x_pos;
                this.y = y_pos + 200;
            }
            this.y += this.speed;
        }
        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 6) this.frame = 0;
            if(this.frame == 5){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
        }
        //collision
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < this.radius + player.radius){
            $.ajax({
                url:"/games/fish",
                type:"POST",
                data: {
                    result: score
                    },
                success: function (response) {
                },
                error: function (response) {
                }
                });
            bombTouch.play();
            handleGameOver();
        }
    }
}

const bomb1 = new Bomb();
function handleBomb1(x_pos, y_pos){
    bomb1.draw();
    bomb1.update(x_pos, y_pos);
}

// Treasure
const treasureImg = new Image();
treasureImg.src = '../data/fish/treasure.png'

const treasureSound = document.createElement('audio');
treasureSound.src = '../data/fish/treasureSound.wav';

class Treasure{
    constructor(){
        this.x;
        this.y;
        this.radius = 80;
        this.speed = Math.random() * 2 + 1;
    }
    draw(){
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.drawImage(treasureImg, 0, 0, 566, 525, this.x-70, this.y-80, 566/4, 525/4);
    }
    update(x_pos, y_pos){
        if(this.y > canvas.height - 10){
            this.x = -200;
            this.y = -200;
        }else{
            if(drop == false){
                drop = true;
                this.x = x_pos;
                this.y = y_pos + 200;
            }
            this.y += this.speed;
        }
        //collision
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < this.radius + player.radius){
            treasureSound.play();
            score += 10;
            this.x = -300;
            this.y = -300;
        }
    }
}

const treasure = new Treasure();
function handleTreasure(x_pos, y_pos){
    treasure.draw();
    treasure.update(x_pos, y_pos);
}

// Shark 
var sharkImg = new Image();
const sharkImg_left = new Image();
sharkImg_left.src = '../data/fish/shark_left.png'

const sharkImg_right = new Image();
sharkImg_right.src = '../data/fish/shark_right.png'

const sharkeat = document.createElement('audio');
sharkeat.src = '../data/fish/sharkeat.ogg';

class Shark{
    constructor(){
        this.x = -300;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 130;
        this.speed = Math.random() * 2 + 1;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 608;
        this.spriteHeight = 372;
    }
    draw(){
        if(this.speed > 0){
            sharkImg = sharkImg_right;
        }
        else{
            sharkImg = sharkImg_left;
        }
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.drawImage(sharkImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.x-140, this.y-100, this.spriteWidth/2, this.spriteHeight/2);
    }
    update(){
        if(this.x > canvas.width / 2 && this.x < canvas.width / 2 + 100){
            console.log("sss");
            this.speed = -this.speed;
        }
        this.x += this.speed;
        if(this.x < -320){
            this.x = -300;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2  + 1; 
        }
        
        if(gameframe % 5 == 0){
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }

        //collision
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < this.radius + player.radius){
            $.ajax({
                url:"/games/fish",
                type:"POST",
                data: {
                    result: score
                  },
                success: function (response) {
                },
                error: function (response) {
                }
                });
            sharkeat.play();
            handleGameOver();
        }
    }
}

const shark = new Shark();
function handleShark(){
    shark.draw();
    shark.update();
}

// Pearl
const pearlImg = new Image();
pearlImg.src = '../data/fish/pearl.png'

const pearlEmptyImg = new Image();
pearlEmptyImg.src = '../data/fish/pearlempty.png'

const pearlsound = document.createElement('audio');
pearlsound.src = '../data/fish/pearlsound.wav';

class Pearl{
    constructor(){
        this.x;
        this.y;
        this.radius = 80;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 606;
        this.spriteHeight = 557;
        this.img = pearlImg;
        this.counted = false;
    }
    draw(){
        //ctx.fillstyle = 'blue';
        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.drawImage(this.img, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.x-100, this.y-100, this.spriteWidth/3, this.spriteHeight/3);
    }
    update(){
        if(gameframe % 800 == 0 && gameframe > 100){
            this.counted = false;
            this.img = pearlImg;
            this.y = canvas.height - 568/3;
            this.x = Math.random() * (canvas.width - 300) + 150;
        }else if(gameframe % 1000 == 0){
            this.x = -800;
            this.y = -800;
        }
        
        if(gameframe % 10 == 0){
            this.frame++;
            if(this.frame >= 5) this.frame = 0;
            if(this.frame == 4){
                this.frameX = 0;
            }else{
                this.frameX++;
            }
        }
        //collision
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < this.radius + player.radius){
            this.img = pearlEmptyImg;
            if(this.counted == false){
                score += 30;
                pearlsound.play();
                this.counted = true;
            }
            $.ajax({
                url:"/games/fish",
                type:"POST",
                data: {
                    result: score
                  },
                success: function (response) {
                },
                error: function (response) {
                }
                });
        }
    }
}
const pearl = new Pearl();
function handlePearl(){
    pearl.draw();
    pearl.update();
}

const victorySound = document.createElement('audio');
victorySound.src = '../data/fish/Victory.wav';




function handleGameOver(){
    ctx.fillStyle = "#FFFFFF";
    drawTextBG(ctx, '得分 ' + score + ' 💴+' + score*100000, '60px Georgia', 600, 400)
    gameover = true;
    victorySound.play();
}


// Animation Loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(score > 50) stonefish = true;
    drawButton(quit);
    drawButton(restart);
    handleDiamonds();
    if(score > 50) handlePuffers();
    handleShark();
    if(score > 20) handleSword();
    if(score > 30) handleAngeler();
    pearl.draw();
    player.update();
    player.draw();
    handleMissile(color);
    handlePearl();
    handleSubmarine();
    drawTextBG(ctx, "得分: " + score, '60px Georgia', 10, 10)
    drawTextBG(ctx, "生命: " + lives, '60px Georgia', 300, 10)
    gameframe++;
    if(!gameover) requestAnimationFrame(animate);
}

animate();