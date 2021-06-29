var MENU = 1;
var PLAY = 2;
var END = 3;
var gameState = MENU;

var RUN = 1;
var JUMP = 2;
var SLIDE = 3;
var runnerState = RUN;

var score = 0;
var D = 3;
var fc = 120;

var floorImg, floor2, box1, box2, box1Img, box1Group, box3, box4, box3Group, invis, a;

var spaceB, space, window1, windowImg;

var runner, runnerImg, runnerJump, runnerSlide;

var runningSound;

function preload(){
   runnerImg = loadAnimation("runner1.png","runner2.png","runner3.png","runner2.png");

  spaceB = loadImage ("Space.png")
  
  windowImg = loadImage ("windoww.png");

  runnerJump = loadAnimation("runner3.png");

  runnerSlide = loadAnimation("slide.png");

  floorImg = loadImage("floor1.png");

  box1Img = loadImage("box1.png")

  //runningSound = loadSound("running.mp3")

  box1Group = new Group();
  box3Group = new Group();
  
} 

function setup() {
  createCanvas(windowWidth, windowHeight);

  space = createSprite (width/2,height/2,30,30);
  space.addImage(spaceB);

  window1 = createSprite (width + 265,height/2,10,10);
  window1.velocityX = -18;
  window1.addImage(windowImg);
  
  //floor1
  floor1 = createSprite (width/2,height - 370,500,500);
  floor1.velocityX = -18;
  floor1.addImage(floorImg)
  floor1.setCollider("rectangle",0,340,6000,67);
  //floor1.debug = true;

  //floor2
  floor2 = createSprite (width,height - 370,500,500);
  floor2.velocityX = -18;
  floor2.addImage(floorImg);
  floor2.setCollider("rectangle",0,340,1,1);
  //floor2.debug = true;

  //runner
  runner = createSprite (width/6,height - 130,40,40);
  runner.addAnimation("running",runnerImg);
  runner.addAnimation("jumping",runnerJump);
  runner.addAnimation("sliding",runnerSlide);
  //runner.debug = true;

  invis = createSprite(-10,300,50,1000);
  invis.visible = false;

  a = createSprite (450,-1000,10,10)
  a.addImage(box1Img);

  slideTimer = createSprite (width/2,0,20,20)
  slideTimer.visible = false;

  

  score = 0;

}

function draw() {
  background("black");

  if (gameState === MENU) {
    invis.x = -1000;
    box1Group.destroyEach();
    box3Group.destroyEach();
    score = 0
    fc = 120;
    D = 3;
    runner.x = 180;
    runner.setCollider("rectangle",1,1,1,400)
    a.y = height - 150;


    if (keyDown("space") && gameState === MENU) {
      gameState = PLAY;
    }

    runner.x = width/6;

    window1.x = width +1000;
    
    runner.changeAnimation("jumping",runnerJump);
    runner.scale = 1.4;

    box1Group.setVelocityEach(0,0);

    box3Group.setVelocityEach(0,0);

    floor1.velocityX = 0;

    floor2.velocityX = 0;

    window1.velocityX = 0;
 
  }


  if (gameState === PLAY) {
    invis.x = -20;
    runner.x = width/6;
    runner.scale = 1;

    a.y = -1000;

    box1Group.setVelocityEach(-18,0);

    box3Group.setVelocityEach(-18,0);

    floor1.velocityX = -18;

    floor2.velocityX = -18;

    window1.velocityX = -18;



    
    runner.setCollider("rectangle",-20,15,110,120);
       
    runner.changeAnimation("running",runnerImg)


    score = score + Math.round(getFrameRate()/60);

    //function 
    spawnBox();

    if (window1.width/2 < -window1.x + 1785) {
      window1.x = window1.width/2;
    }

    //run state
    if (runnerState === RUN) {
      
      //runningSound.play();

      //controls 
      if (runnerState === RUN) {
        if (keyDown(UP_ARROW)) {  
          runner.velocityY = -60;
          runnerState = JUMP;
        }
      }
      

    } 
   
    //jump state
    if (runnerState === JUMP) {
       runner.changeAnimation("jumping",runnerJump);
       if (runner.y < height - 400) {
         runner.velocityY = runner.velocityY + 4;
       
       }
       
    }

    //slide state
    if (runnerState === SLIDE) {
      runner.changeAnimation("sliding",runnerSlide);
      slideTimer.velocityY = 20;
      runner.setCollider("rectangle",-20,25,110,85);
    }

    //so runner will appear to be running while touching the floor or the boxes
      if (runner.isTouching(floor1) || runner.isTouching(floor2) || runner.isTouching(box3Group)) {
        // runningSound.play();
         runnerState = RUN;
        //controls
        if (keyDown(DOWN_ARROW)) {
          runnerState = SLIDE;
          runner.velocityY = runner.velocityY + 10;
        } 

      } 
 
    if (runner.isTouching(box1Group) || runner.isTouching(invis)) {
      gameState = END;
    }


    //floor
    if (floor1.x < 0) {
      floor1.x = width;
    }

    if (floor2.x < 0) {
      floor2.x = width;
    } 
  
  }

  else if(gameState === END) {
    if (keyDown("space")) {
      gameState = MENU;
    }

    box1Group.setLifetimeEach(-1);

    box1Group.setVelocityEach(0,0);

    box3Group.setVelocityEach(0,0);

    runner.velocityY = runner.velocityY + 10;

    runner.changeAnimation("sliding",runnerSlide)

    floor1.velocityX = 0;

    floor2.velocityX = 0;

    window1.velocityX = 0;
  }

  runner.velocityY = runner.velocityY + 1.8;
  
  runner.collide(floor1);
  runner.collide(floor2);

  runner.collide(box1Group);

  runner.collide(box3Group);

  runner.collide(invis);

  drawSprites();

  if (gameState === END || gameState === PLAY) {
     textSize(30);
     text("Score: "+ score, width/2 - 60, 50);
  }

  if (gameState === END) {
     textSize(40);
     text("Press 'space' to continue", width/2 - 200, height/2);

  }

  if (gameState === MENU) {
     textSize(40);
     text("Press 'space' to play", width/2 - 200, height/2);
     textSize(30);
     text("Up arrow to jump", width/2 - 130, height/2 + 50);
     text("Down arrow to slide", width/2 - 140, height/2 + 100);

  }


}

function spawnBox() {
  if(frameCount % fc === 0) {
    var box1 = createSprite (width + 140,height - 150,10,10)
  // box1.debug = true;
    box1.velocityX = -18;

    box1.setCollider("rectangle",-10,56,225,150);
    box1Group.add(box1);
    
    var box2 = createSprite (width + 140,height + 150,10,10)
    box2.velocityX = -18

    box2.setCollider("rectangle",-10,56,225,150);
    box1Group.add(box2);   

    var box3 = createSprite (width + 120,height - 150,230,40);
    box3.velocityX = -18;
    box3Group.add(box3);
    box3.visible = false

    var box4 = createSprite (width + 120,height - 750,230,40);
    box4.velocityX = -18;
    box3Group.add(box4);
    box4.visible = false
    

    if (score > 400) {
      D = 6;
    }

    if (score > 800) {
      D = 9;
    }

    if (score > 1200) {
      fc = 100;
    }

    if (score > 1600) {
      fc = 90;
    }

    if (score > 2000) {
      fc = 80;
    }

    if (score > 2800) {
      fc = 60;
    }

    if (score > 3400) {
      fc = 45;
    }

    box1Group.setLifetimeEach(150)
    box3Group.setLifetimeEach(150)
    
    
    //generate random obstacles
    var rand = Math.round(random(1,D));
    switch(rand) {
      case 1: box1.y = height - 150;
              box1.addImage(box1Img);
              box3.y = height - 230;
              break;

      case 2: box1.y = height - 285;
              box1.addImage(box1Img);
              box3.y = height - 365;
              break;

      case 3: box1.y = 100;
              box1.addImage(box1Img);
              box3.y = 20;
              break;

      case 4: box1.y = height - 285;
              box2.y = height - 500;
              box2.x = box1.x + 330;
              box3.y = height - 375;
              box4.y = height - 590;
              box4.x = box1.x + 300;
              box1.addImage(box1Img);
              box2.addImage(box1Img);    
              break;

      case 5: box1.y = height - 285;
              box2.y = height - 150;
              box2.x = box1.x + 450;
              box3.y = height - 375;
              box4.y = height - 240;
              box4.x = box1.x + 420;
              box1.addImage(box1Img);
              box2.addImage(box1Img);
              break;

      case 6: box1.y = height - 150;
              box2.y = height - 285;
              box2.x = box1.x + 550;
              box3.y = height - 240;
              box4.y = height - 375;
              box4.x = box1.x + 520;
              box1.addImage(box1Img);
              box2.addImage(box1Img);
              break;

      case 7: box1.y = height - 285;
              box2.y = height - 620;
              box2.x = box1.x + 280;
              box3.y = height - 285 - 90;
              box4.y = height - 590 - 90;
              box4.x = box1.x + 280 - 30;
              box1.addImage(box1Img);
              box2.addImage(box1Img);
              break;

      case 8: box1.y = height - 287;
              box2.y = height - 466;
              box3.y = height - 287 - 90;
              box4.y = height - 466 - 90;
             // box4.x = box1.x + 280 - 30;
              box1.addImage(box1Img);
              box2.addImage(box1Img);
              break;

      case 9: box2.y = 100;
              box1.y = box2.y + 180;
              box3.y = height - 100 - 90;
              box4.y = height - 180 - 90;
             // box4.x = box1.x + 280 - 30;
              box1.addImage(box1Img);
              box2.addImage(box1Img);
              break;

      default: break;
    }
  
  }
}

