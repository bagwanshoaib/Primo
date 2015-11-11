function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.targetContainer = document.querySelector(".target-container"); 
  this.currentsumContainer = document.querySelector(".currentsum-container");
  this.totalMovesContainer = document.querySelector(".totalMoves-container");
  this.gameLevelContainer = document.querySelector(".gameLevel-container");
  this.gameTutorialContainer = document.querySelector(".game-tutorial");
  this.storageManager = new LocalStorageManager();

  this.score = 0;
  this.cellId = 1;
  this.drp1 = 0;
  this.drp2 = 0;
  this.drp3 = 0;
  this.drp4 = 0;
  this.chkPrimoSum = 0;
  this.totalMoves = 0;
  this.gameLevel = 0;
}

HTMLActuator.prototype.getPieceNo = function (x, y){
    return (4 * y) + x;
};

HTMLActuator.prototype.buildPieces = function (x, y){
   var i;
    this._pieces = [];
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < 16 ;i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        this._pieces.push(piece);
        xPos += this._pieceWidth;
        if(xPos >= this._puzzleWidth){
            xPos = 0;
            yPos += this._pieceHeight;
        }
    }
}; 

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;
  self.updateScore(0);
  self.updatetotalMoves(0);
  self.updateGameLevel();
  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
          $('#grid-cell'+self.cellId).draggable({
             revert: true ,
             helper: "clone",
             containment: "#grid-container"
            });
          self.cellId += 1;
        }
      });
    });

$( "#grid-cell12" ).droppable({

            drop: function( event, ui ) {
              $( this )
                var v1 = $(ui.draggable).text()+"";
                var drg = new Number(v1);
                self.drp1 = drg;
                grid.addRandomTiles(self.drp1,self.drp2,self.drp3,self.drp4);
                
                if (self.isPrime(self.storageManager.getDrp1()))
                  $(this).append("<div class='tile tile-prime tile-position-1-1 tile-merged'><div class='tile-inner'>"+self.storageManager.getDrp1()+"</div></div>");
                else
                  $(this).append("<div class='tile tile-32 tile-position-1-1 tile-merged'><div class='tile-inner'>"+self.storageManager.getDrp1()+"</div></div>");
                
                self.updatetotalMoves(1);
                self.updateScore(100);
            }
          });

$( "#grid-cell13" ).droppable({
            drop: function( event, ui ) {
              $( this )
                var v1 = $(ui.draggable).text()+"";
                var drg = new Number(v1);
                self.drp2 = drg;
                grid.addRandomTiles(self.drp1,self.drp2,self.drp3,self.drp4);

                if (self.isPrime(self.storageManager.getDrp2()))
                  $(this).append("<div class='tile tile-prime tile-position-1-1 tile-merged'><div class='tile-inner'>"+self.storageManager.getDrp2()+"</div></div>");
                else
                  $(this).append("<div class='tile tile-32 tile-position-1-1 tile-merged'><div class='tile-inner'>"+self.storageManager.getDrp2()+"</div></div>");
                
                self.updatetotalMoves(1);
                self.updateScore(100);
            }
          });
$( "#grid-cell14" ).droppable({
            drop: function( event, ui ) {
              $( this )
                var v1 = $(ui.draggable).text()+"";
                var drg = new Number(v1);
                self.drp3 = drg;
                grid.addRandomTiles(self.drp1,self.drp2,self.drp3,self.drp4);

                 if (self.isPrime(self.storageManager.getDrp3()))
                  $(this).append("<div class='tile tile-prime tile-position-1-1 tile-merged'><div class='tile-inner'>"+self.storageManager.getDrp3()+"</div></div>");
                else
                  $(this).append("<div class='tile tile-32 tile-position-1-1 tile-merged'><div class='tile-inner'>"+self.storageManager.getDrp3()+"</div></div>");
                 
                self.updatetotalMoves(1);
                self.updateScore(100);
            }
          });

$( "#grid-cell15" ).droppable({
            drop: function( event, ui ) {
              $( this )
                var v1 = $(ui.draggable).text()+"";
                var drg = new Number(v1);
                self.drp4 = drg;
                grid.addRandomTiles(self.drp1,self.drp2,self.drp3,self.drp4);

                if (self.isPrime(self.storageManager.getDrp4()))
                  $(this).append("<div class='tile tile-prime tile-position-1-1 tile-merged'><div class='tile-inner'>"+self.storageManager.getDrp4()+"</div></div>");
                else
                  $(this).append("<div class='tile tile-32 tile-position-1-1 tile-merged'><div class='tile-inner'>"+self.storageManager.getDrp4()+"</div></div>");
               
               self.updatetotalMoves(1);
                self.updateScore(100);
            }
          });

    //self.updateScore(metadata.score);
    //self.updateScore(self.score);
    //self.updateBestScore(metadata.bestScore);
    self.GameStatus();
   
   /* if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    } */

  });
};

HTMLActuator.prototype.GameStatus = function() {

  if(this.isPrime(this.storageManager.getDrp1()))
  {
    this.chkPrimoSum += this.storageManager.getDrp1();
  }

  if(this.isPrime(this.storageManager.getDrp2()))
  {
    this.chkPrimoSum += this.storageManager.getDrp2();
  }
  
  if(this.isPrime(this.storageManager.getDrp3()))
  {
    this.chkPrimoSum += this.storageManager.getDrp3();
  }
  
  if(this.isPrime(this.storageManager.getDrp4()))
  {
    this.chkPrimoSum += this.storageManager.getDrp4();
  }
 
  //alert("sum:- "+this.chkPrimoSum +" target:-"+this.storageManager.getGameTarget() +" current move:-"+this.storageManager.getCurrentMove());
  if (this.chkPrimoSum == this.storageManager.getGameTarget()) {
  // if (this.chkPrimoSum > 10) {
    this.storageManager.clearDrpState();
    this.chkPrimoSum = 0;
    this.message(true);
  }
  else if (this.chkPrimoSum > this.storageManager.getGameTarget()){
    this.storageManager.clearDrpState();
    this.chkPrimoSum = 0;
    this.message(false);
  }
  else if(this.storageManager.getCurrentMove() <= 0){
    this.storageManager.clearDrpState();
    this.chkPrimoSum = 0;
    this.message(false);
  }

/*    this.message(true);
  else
    this.message(false);
*/
}

HTMLActuator.prototype.isPrime = function(n) {
 if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
 var m=Math.sqrt(n);
 for (var i=2;i<=m;i++) if (n%i==0) return false;
 return true;
};

HTMLActuator.prototype.isPrime = function(n) {
 if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
 var m=Math.sqrt(n);
 for (var i=2;i<=m;i++) if (n%i==0) return false;
 return true;
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  inner.id = "grid-cell"+self.cellId;
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);
  
  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);

};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {

  this.clearContainer(this.scoreContainer);

  var difference = score;
  this.score = this.storageManager.getCurrentScore() - difference;

  this.scoreContainer.textContent = this.score;
  this.storageManager.setCurrentScore(this.score);
  
  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "-" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.storageManager.setBestScore(bestScore); 
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.updateTarget = function (target) {
  this.clearContainer(this.targetContainer);
  this.targetContainer.textContent = target;
};

HTMLActuator.prototype.updatetotalMoves = function (move) {
  this.totalMoves = this.storageManager.getCurrentMove() - move;
  this.clearContainer(this.totalMovesContainer);
  this.totalMovesContainer.textContent = this.totalMoves;
  this.storageManager.setCurrentMove(this.totalMoves);
};

HTMLActuator.prototype.updateGameLevel = function () {
  this.gameLevel = this.storageManager.getCurrentLevel();
  this.clearContainer(this.gameLevelContainer);
  this.gameLevelContainer.textContent = this.gameLevel;
  this.storageManager.setCurrentLevel(this.gameLevel);
};

HTMLActuator.prototype.updatePrimoSum = function (primoSum) {
  this.clearContainer(this.currentsumContainer);

  var difference = primoSum - this.currentSum;
  this.currentSum = primoSum;

  this.currentsumContainer.textContent = this.currentSum;

  var addition = document.createElement("div");
  addition.classList.add("currentSum-addition");
  if (difference > 0) {
    addition.textContent = "+" + difference;
     this.currentsumContainer.appendChild(addition);
  }
  else if(difference < 0){
     addition.textContent = difference;
     this.currentsumContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!"; 
  var highscore = won ? this.updateBestScore(this.storageManager.getCurrentScore()) : this.updateBestScore(0);

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.tutorial = function () {
  this.gameTutorialContainer.classList.add("show");
};

HTMLActuator.prototype.closeButton = function () {
  // IE only takes one value to remove at a time.
  this.gameTutorialContainer.classList.remove("show");
};

