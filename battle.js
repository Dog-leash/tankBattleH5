var WINDOW_WIDTH = 400;
var WINDOW_HEIGHT = 400;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

//玩家坦克（重生位置在画布中间,direc 表示坦克朝向 0123分别是上下左右）
var myTank = new MyTank(WINDOW_WIDTH / 2 - 30, WINDOW_HEIGHT - 30, 0, "#DED284");
//玩家射出的子弹
var myBullets = new Array();


//敌人坦克
var enemyTanks = new Array();
//敌人射出子弹
var enemyBullets = new Array();
var level = 4;
for (var i = 0; i < level; i++) {
    var enemyTank = new EnemyTank(WINDOW_WIDTH / level * (i), 50, 1, "#00A2B5");
    enemyTanks[i] = enemyTank;
    window.setInterval("enemyTanks[" + i + "].move()", 50);
    window.window.setInterval("enemyTanks[" + i + "].shotPlayer()", 500);
}


window.onload = function () {


    setInterval(
        function () {
            flashMap();
        },
        50
    );
}


//监听玩家键盘输入
function getCommand() {
    var code = event.keyCode;
    switch (code) {
        //向右键
        case 37:
            myTank.moveLeft();
            break;
            //向上键
        case 38:
            myTank.moveUp();
            break;
            //向左键
        case 39:
            myTank.moveRight();
            break;
            //向下键
        case 40:
            myTank.moveDown();
            break;
        case 32:
            myTank.shotEnemy();
            console.log(enemyBullets);
            break;


    }
    //墙壁碰撞检测
    myTank.judge();
    //清空画布,重新绘制运动后的坦克位置 
    flashMap();

}

//画布刷新
function flashMap() {
    ctx.clearRect(0, 0, 400, 400);
    //画玩家坦克
    drawTank(myTank);
    //画玩家子弹
    drawMyBullet();

    ifHitTank();

    //画敌人坦克
    for (var i = 0; i < level; i++) {
        drawTank(enemyTanks[i]);
    }
    //画出敌方的子弹
    drawEnemyBullet();

    //检测游戏是否结束
    ifGameOver();


}

//定义一个父类的坦克类，x表示坦克的左上角横坐标，y表示坦克的左上角纵坐标，dirc表示移动方向
function Tank(x, y, direc, color) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.direc = direc;
    this.color = color;
    //炮口位置
    this.shotX = null;
    this.shotY = null;

    //是否被击毁
    this.alive = true;

    //坦克移动函数
    //向上移动
    this.moveUp = function () {
        this.y -= this.speed;
        this.direc = 0
    }
    //向右移动
    this.moveRight = function () {
        this.x += this.speed;
        this.direc = 3;
    }
    //向下移动
    this.moveDown = function () {
        this.y += this.speed;
        this.direc = 1;
    }
    //向左移动
    this.moveLeft = function () {
        this.x -= this.speed;
        this.direc = 2;
    }

    //坦克与画布墙壁检测
    this.judge = function () {
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
        if (this.x + 30 >= 400) {
            this.x = 370;
        }
        if (this.y + 30 >= 400) {
            this.y = 370
        }
    }
}

//玩家坦克
function MyTank(x, y, direc, color) {
    //通过对象冒充继承Tank
    this.tank = Tank;
    this.tank(x, y, direc, color)

    this.shotEnemy = function () {
        var myBullet = new Bullet(this.shotX, this.shotY, this.direc);

        myBullets.push(myBullet);
        //使每个子弹定时器变为独立
        var timer = window.setInterval("myBullets[" + (myBullets.length - 1) + "].fire()", 50);
        myBullets[myBullets.length - 1].timer = timer;
    }
}

//敌军坦克
function EnemyTank(x, y, direc, color) {
    //通过对象冒充继承Tank
    this.tank = Tank;
    //给个计数器用于控制敌人坦克移动方向
    this.count = 0;
    this.tank(x, y, direc, color);
    this.speed = 3;
    this.move = function(){
        switch (this.direc) {
            case 0:
                this.y -= this.speed;
                break;
            case 1:
                this.y += this.speed;
                break;
            case 2 :
                this.x -= this.speed;
                break;
            case 3:
                this.x += this.speed;
                break;
        }
        this.judge();
        if(this.count>=10){
            this.direc = Math.round(Math.random()*3);
            
            this.count = 0;
        }
        this.count++; 
    }
    this.shotPlayer = function(){
        var enemyBullet = new Bullet(this.shotX, this.shotY, this.direc);
        enemyBullets.push(enemyBullet);
        var timer = window.setInterval("enemyBullets[" + (enemyBullets.length - 1) + "].fire()", 50);
        enemyBullets[enemyBullets.length - 1].timer = timer;
    }


}

//子弹类 
function Bullet(x, y, direc) {
    this.x = x;
    this.y = y;
    this.direc = direc;
    this.speed = 10;
    //每个子弹有属于自己的计时器
    this.timer = null;
    //判断子弹是否已经出界或者消失
    this.alive = true;
    this.fire = function () {
        //先判断子弹是否到了边界或打中了敌人，关掉该子弹的计时器
        if (this.x < 0 || this.x > 400 || this.y < 0 || this.y > 400 ||this.alive == false) {
            window.clearInterval(this.timer);
            this.alive = false;
        }

        switch (direc) {
            case 0:
                this.y -= this.speed;
                break;
            case 1:
                this.y += this.speed;
                break;
            case 2:
                this.x -= this.speed;
                break;
            case 3:
                this.x += this.speed;
                break;
        }
    }
}

//坦克绘制
function drawTank(tank) {

    //判断坦克是否已经毁灭
    if (tank.alive) {
        //考虑炮口方向
        switch (tank.direc) {
            //向上
            case 0:
                //向下
            case 1:

                //坦克颜色
                ctx.fillStyle = tank.color;
                //绘制坦克的两个履带（左右相隔20，坦克整体是一个30*30）
                ctx.fillRect(tank.x, tank.y, 5, 30);
                ctx.fillRect(tank.x + 25, tank.y, 5, 30);

                //绘制坦克中部矩形，与两履带相隔1px，显得更好看，18*20）
                ctx.fillRect(tank.x + 6, tank.y + 5, 18, 20);

                //炮台的颜色
                ctx.fillStyle = "#FFFA7E";
                //绘制炮台（20/2 = 10，30/2 = 15,半径比主主体要小 ）
                ctx.arc(tank.x + 15, tank.y + 15, 4, 0, 2 * Math.PI);
                ctx.fill();

                //绘制炮管
                ctx.beginPath();
                ctx.moveTo(tank.x + 15, tank.y + 15);
                //根据上下转向不同绘制不同方向的炮管       

                if (tank.direc == 0) {
                    ctx.lineTo(tank.x + 15, tank.y); //线条的结束位置
                    tank.shotX = tank.x + 15;
                    tank.shotY = tank.y
                } else if (tank.direc == 1) {
                    ctx.lineTo(tank.x + 15, tank.y + 30);
                    tank.shotX = tank.x + 15;
                    tank.shotY = tank.y + 30
                }

                ctx.strokeStyle = "#FFFA7E";
                ctx.lineWidth = 2; //设置线条的宽度（粗细）
                ctx.closePath();
                ctx.stroke();
                break;
                //向左    
            case 2:
                //向右
            case 3:


                //坦克颜色
                ctx.fillStyle = tank.color;
                //绘制坦克的两个履带（上下相隔20，坦克整体是一个30*30）
                ctx.fillRect(tank.x, tank.y, 30, 5);
                ctx.fillRect(tank.x, tank.y + 25, 30, 5);

                //绘制坦克中部矩形，与两履带相隔1px，显得更好看，20*18）
                ctx.fillRect(tank.x + 5, tank.y + 6, 20, 18);

                //炮台的颜色
                ctx.fillStyle = "#FFFA7E";
                //绘制炮台（20/2 = 10，30/2 = 15,半径比主主体要小 ）
                ctx.arc(tank.x + 15, tank.y + 15, 4, 0, 2 * Math.PI);
                ctx.fill();

                //绘制炮管
                ctx.beginPath();
                ctx.moveTo(tank.x + 15, tank.y + 15);
                //根据上下转向不同绘制不同方向的炮管       

                if (tank.direc == 2) {
                    ctx.lineTo(tank.x, tank.y + 15); //线条的结束位置
                    tank.shotX = tank.x;
                    tank.shotY = tank.y + 15
                } else if (tank.direc == 3) {
                    ctx.lineTo(tank.x + 30, tank.y + 15);
                    tank.shotX = tank.x + 30;
                    tank.shotY = tank.y + 15;
                }

                ctx.strokeStyle = "#FFFA7E";
                ctx.lineWidth = 2; //设置线条的宽度（粗细）
                ctx.closePath();
                ctx.stroke();
                break;
        }
    }

}

//玩家子弹绘制
function drawMyBullet() {
    for (var i = 0; i < myBullets.length; i++) {
        var bullet = myBullets[i];
        if (bullet.alive && bullet != null) {
            ctx.fillStyle = "#DED289";
            ctx.fillRect(bullet.x, bullet.y, 2, 2);
        }
    }
}

//敌方子弹绘制
function drawEnemyBullet() {
    for (var i = 0; i < enemyBullets.length; i++) {
        var bullet = enemyBullets[i];
        if (bullet.alive && bullet != null) {
            ctx.fillStyle = "#00FEFE";
            ctx.fillRect(bullet.x, bullet.y, 2, 2);
        }
    }
}

function ifHitTank(){
    //遍历玩家射出的每一颗子弹
    for(var i = 0;i<myBullets.length;i++){
        var bullet = myBullets[i];
        if(bullet.alive){
            for(var j = 0;j<enemyTanks.length;j++){
                var enemyTank = enemyTanks[j];
                if(enemyTank.alive){
                    if (bullet.x >= enemyTank.x && bullet.x <= enemyTank.x + 30
                        && bullet.y >= enemyTank.y && bullet.y <= enemyTank.y + 30){
                        enemyTank.alive = false;
                        bullet.alive = false;
                    }
                }
            }
        }
    }

    //判断敌方子弹是否命中我
    for(var i  = 0; i<enemyBullets.length;i++){
        var bullet = enemyBullets[i];
        if (bullet.alive) {
            if (bullet.x >= myTank.x && bullet.x <= myTank.x + 30
                && bullet.y >= myTank.y && bullet.y <= myTank.y + 30) {
                       alert("这么简单的游戏，你都被击中了哎");
                        window.location.reload(); 
                    }
                }
            }
        }


function ifGameOver() {
    var flag = true;
    for(var i=0;i<enemyTanks.length;i++){
        if(enemyTanks[i].alive){
            flag = false;
        }
    }
    if(flag){
        alert("游戏结束");
        window.location.reload(); 
    }
}
