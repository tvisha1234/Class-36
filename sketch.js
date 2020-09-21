//Create variables here
var dog, happyDog, database, foodS, foodStock, dogImage;
var feed, addFood;
var fedTime, lastFed = 5;
var foodObj;
var changeGameState, readState;
var gameState;
var currentTime;
var bedroomImg, washroomImg, gardenImg;

function preload()
{
  //load images here
  dogImage = loadImage('images/dogImg.png');
  happyDog = loadImage('images/dogImg1.png');
  bedroomImg = loadImage('images/bedroom.png');
  washroomImg = loadImage('images/washroom.png');
  gardenImg = loadImage('images/Garden.png'); 

}

function setup() {

  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  readState = database.ref('gameState');
  readState.on("value", function(data) {
    gameState = data.val();
  });
  
  dog = createSprite(840,200,150,150);
  dog.addImage(dogImage);
  dog.scale = 0.3;

  feed = createButton("Feed Tom");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  
  background(46,139,87);
  
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data) {
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12) {
    text("Last Feed: " + lastFed%12 + "PM", 350, 30);
  }
  else if (lastFed === 0) {
    text("Last Feed: 12 AM", 350, 30);
  }
  else {
    text("Last Feed: " + lastFed + "AM" , 350, 30);
  }

  if(gameState !== "Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  }

  else {
    feed.show();
    addFood.show();
    dog.addImage(dogImage);
  }

  currentTime = hour();
  if(currentTime === (lastFed + 1)) {
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed + 2)) {
    update("Sleeping");
    foodObj.garden();
  }
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
    update("Bathing");
    foodObj.washroom();
  }
  else {
    update("Hungry");
    foodObj.display();
  }

  drawSprites();

}

function update(state) {
  database.ref('/').update({
    gameState:state
  });
}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x) {
  if(x <= 0) {
    x = 0;
  }
  else{
    x = x-1;
  }
  database.ref('/').update({
    Food:x
  })
}*/



