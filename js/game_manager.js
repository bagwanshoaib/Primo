function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.startTiles     = 4;
  this.currentLevel   = 1;

 //this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
  this.inputManager.on("tutorial", this.tutorial.bind(this));
  this.inputManager.on("closeButton", this.closeButton.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  $('#grid-cell12').empty();
  $('#grid-cell13').empty();
  $('#grid-cell14').empty();
  $('#grid-cell15').empty();
  this.currentLevel   = 1;

  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  
  this.setup();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  $('#grid-cell12').empty();
  $('#grid-cell13').empty();
  $('#grid-cell14').empty();
  $('#grid-cell15').empty();

  this.actuator.continueGame(); // Clear the game won/lost message
  this.currentLevel = this.storageManager.getCurrentLevel() + 1;
  this.bonus = this.storageManager.getCurrentScore();
  this.setup();
  this.storageManager.setBestScore(this.bonus);
  this.actuator.updateBestScore(this.bonus);
  this.storageManager.setLevel(this.currentLevel); 
  this.actuator.updateGameLevel();
  this.actuator.updateScore(0);
  this.actuator.updatetotalMoves(0);
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }
  this.storageManager.clearDrp();
  this.storageManager.clearCurrentLevel();
  this.storageManager.clearCurrentMove();
  this.storageManager.clearBestScore();
  this.storageManager.clearCurrentScore();
  
  var lev = this.storageManager.getCurrentLevel();
  if (lev == 0 || lev == null) {lev = 1;};
  this.storageManager.setLevel(lev);
  this.actuator.updateGameLevel();
  this.actuator.updateScore(0);
  this.actuator.updatetotalMoves(0);
  this.actuator.updateBestScore(0);


  this.addTarget();
  
  this.actuator.updatePrimoSum(0);
  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
     var value = Math.floor(Math.random() * 9) + 1;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Set up the target
GameManager.prototype.addTarget = function () {

  var num1=0, num2=0, num3=0, num4=0;
  var lev = this.currentLevel; //this.storageManager.getCurrentLevel(); //$('.gameLevel-container').text();
  if (lev == null) {lev = 1;};
  
  var min = 1;
  //if (lev > 1) {min = (10 * lev) + 5;};
  var max =  25;
  //if (lev > 1) {max = (10 * (lev + 1)) + 5;};
  if (lev > 1) {max = (25 + ((lev-1) * 5));};

  num1 = Math.floor(Math.random()*(max-min+1)+min);
  while(!isPrime(num1)){
    num1 = Math.floor(Math.random()*(max-min+1)+min);
  } 

  num2 = Math.floor(Math.random()*(max-min+1)+min);
  while(!isPrime(num2)){
    num2 = Math.floor(Math.random()*(max-min+1)+min);
  }

  num3 = Math.floor(Math.random()*(max-min+1)+min);
  while(!isPrime(num3)){
    num3 = Math.floor(Math.random()*(max-min+1)+min);
  }

  num4 = Math.floor(Math.random()*(max-min+1)+min);
  while(!isPrime(num4)){
    num4 = Math.floor(Math.random()*(max-min+1)+min);
  }

  //alert(max +" "+ num1 +" "+ num2 +" "+ num3 +" "+ num4 +" "+min);

  this.gameTarget = num1 + num2 + num3 + num4;
  if (lev > 1) {if (this.gameTarget <= this.storageManager.getGameTarget()) {this.gameTarget =0; this.addTarget();}};  
  this.actuator.updateTarget(this.gameTarget);
};

function isPrime(n) {
 if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
 var m=Math.sqrt(n);
 for (var i=2;i<=m;i++) if (n%i==0) return false;
 return true;
}

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });
};

GameManager.prototype.tutorial = function() {
 this.actuator.tutorial();
};

GameManager.prototype.closeButton = function() {
 this.actuator.closeButton();
};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};
