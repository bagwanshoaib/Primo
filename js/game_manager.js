function GameManager(size, InputManager, Actuator, StorageManager, v, drp1, drp2, drp3, drp4) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.v = v;
  this.currentLevel = this.storageManager.getCurrentLevel() + 1;
  
  if(drp1==0)
  {
    this.drp1 = this.storageManager.getDrp1();
  }
  else
  {
   this.drp1 = this.storageManager.getDrp1() + drp1; 
  }
  
  if(drp2==0)
  {
    this.drp2 = this.storageManager.getDrp2();
  }
  else
  {
   this.drp2 = this.storageManager.getDrp2() + drp2; 
  }

  if(drp3==0)
  {
    this.drp3 = this.storageManager.getDrp3();
  }
  else
  {
   this.drp3 = this.storageManager.getDrp3() + drp3; 
  }

  if(drp4==0)
  {
    this.drp4 = this.storageManager.getDrp4();
  }
  else
  {
   this.drp4 = this.storageManager.getDrp4() + drp4; 
  }


  this.startTiles = 4;
  
  this.prevGameTarget = 0;

  //this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
  this.inputManager.on("tutorial", this.tutorial.bind(this));
  this.inputManager.on("closeButton", this.closeButton.bind(this));

  this.setup();
                              
}

// g the game
GameManager.prototype.restart = function () {
  $('#grid-cell12').empty();
  $('#grid-cell13').empty();
  $('#grid-cell14').empty();
  $('#grid-cell15').empty();
  
  this.v = 0;
  this.currentLevel = 0;
  this.drp1 = 0;
  this.drp2 = 0;
  this.drp3 = 0;
  this.drp4 = 0;
  
  this.prevGameTarget = 0;
  this.storageManager.clearCurrentLevel();
  this.storageManager.clearGameState();
  this.storageManager.clearDrpState();
  this.storageManager.clearGameTarget();
  this.storageManager.clearBestScore();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
  this.actuator.updateScore(0);
  this.actuator.updatePrimoSum(0);
  this.storageManager.setLevel(1); 
  this.actuator.updateGameLevel();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () { 
  this.keepPlaying = true;
  $('#grid-cell12').empty();
  $('#grid-cell13').empty();
  $('#grid-cell14').empty();
  $('#grid-cell15').empty();

  this.v = 0;
  this.drp1 = 0;
  this.drp2 = 0;
  this.drp3 = 0;
  this.drp4 = 0;
  this.prevGameTarget = this.storageManager.getGameTarget();
  this.storageManager.clearGameState();
  this.storageManager.clearDrpState();
  this.storageManager.clearGameTarget();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
  this.actuator.updateScore(0);
  this.actuator.updatePrimoSum(0);
  this.storageManager.setLevel(this.currentLevel); 
};

GameManager.prototype.tutorial = function() {
 this.actuator.tutorial();
};

GameManager.prototype.closeButton = function() {
 this.actuator.closeButton();
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();
  this.storageManager.clearDrpState();
  // Reload the game from a previous game if present
  if (previousState && this.v == 0) {
    this.storageManager.clearMovesState();
    this.storageManager.clearBestScore();
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
    this.gameTarget  = previousState.gameTarget;
    this.currentSum  = previousState.currentSum;
    this.storageManager.clearCurrentMove();
    this.storageManager.setLevel(1);
    this.actuator.updateGameLevel();
    
  } else if(this.v == 1){
    this.storageManager.clearGameState();
    this.storageManager.clearDrpState();
    this.storageManager.setDrp1(this.drp1);
    this.storageManager.setDrp2(this.drp2);
    this.storageManager.setDrp3(this.drp3);
    this.storageManager.setDrp4(this.drp4);

    this.grid        = new Grid(this.size);
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
    this.gameTarget  = previousState.gameTarget;
    this.currentSum  = previousState.currentSum;
    this.addStartTiles();
  }
  else
  {
    this.storageManager.clearDrpState();
    this.storageManager.clearMovesState();
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;
    this.gameTarget  = 0;
    this.currentSum  = 0;
    // Add the initial tiles
    var lev = this.storageManager.getCurrentLevel();
    if (lev == 0 || lev == null) {lev = 1;};
    
    this.storageManager.setLevel(lev);
    this.actuator.updateGameLevel();
    this.addStartTiles();
  }
  
  this.addTarget();
  this.setupPrimoSum();
  // Update the actuator
  this.actuate();
};

// Set up the target
GameManager.prototype.addTarget = function () {

 if(this.gameTarget == ""){
  var num1=0, num2=0, num3=0, num4=0;
  var lev = this.storageManager.getCurrentLevel(); //$('.gameLevel-container').text();
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

}
  //alert(this.prevGameTarget +" "+this.gameTarget);
  if (this.prevGameTarget != 0 && this.gameTarget <= this.prevGameTarget ) {this.gameTarget =0; this.addTarget();};
  this.actuator.updateTarget(this.gameTarget);
};

function isPrime(n) {
 if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
 var m=Math.sqrt(n);
 for (var i=2;i<=m;i++) if (n%i==0) return false;
 return true;
}

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

  this.storageManager.setGameTarget(this.gameTarget);
  this.storageManager.setCurrentSum(this.currentSum);

  this.actuator.actuate(this.grid, {
    score:        this.score,
    over:         this.over,
    won:          this.won,
    bestScore:    this.storageManager.getBestScore(),
    gameTarget:   this.storageManager.getGameTarget(),
    currentSum:   this.storageManager.getCurrentSum(),
    terminated:   this.isGameTerminated()
  });
};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying,
    gameTarget:  this.gameTarget,
    currentSum:  this.currentSum
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

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value + next.value);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          self.setupPrimoSum();

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
   // 0: { x: 0,  y: -1 }, // Up
   // 1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
   // 3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

// Setup current prime no sum
GameManager.prototype.setupPrimoSum = function () {
  this.currentSum = 0;
/*  for (var x = 0; x < 4; x++) {
    // alert(this.currentSum);
    for (var y = 3; y < 4; y++) {
         //alert(x +","+y +"-->"+this.grid.cellContent({ x: x, y: y }));
      tile = this.grid.cellContent({ x: x, y: y });
    
      if (tile != null) {
         if(isPrime(tile.value)){
            this.currentSum += tile.value;
           //alert(x +","+y +"-->"+tile.value +"--->"+ this.currentSum);
          }
        }
      }
    } */

  if(isPrime(this.drp1))
  {
    this.currentSum += this.drp1;
  }

  if(isPrime(this.drp2))
  {
    this.currentSum += this.drp2;
  }
  
  if(isPrime(this.drp3))
  {
    this.currentSum += this.drp3;
  }
  
  if(isPrime(this.drp4))
  {
    this.currentSum += this.drp4;
  }
  this.actuator.updatePrimoSum(this.currentSum);
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
