function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.targetContainer = document.querySelector(".target-container"); 
  this.currentsumContainer = document.querySelector(".currentsum-container");

  this.score = 0;
  this.cellId = 1;

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
          self.getPieceNo(cell.x,cell.y);
          self.cellId += 1;
        }
      });
    });

$( "#grid-cell12, #grid-cell13, #grid-cell14, #grid-cell15" ).droppable({
            
            drop: function( event, ui ) {
              $( this )

               // var drg = parseInt($(ui.draggable).text(),10);
               // var drp = parseInt($(ui.droppable).text(),10);
                $(ui.draggable).detach().clone($(this));
               // if(isNaN(drp))
               //   drp = 0;
                
               // var sum = drg + drp;

               // $(this).append(drg);
                //$(this).append(drp);
               // grid.addRandomTile();
               // $(ui.droppable).addClass("tile-inner");
            }
          });

    self.updateScore(metadata.score);
    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
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

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.updateTarget = function (target) {
  this.clearContainer(this.targetContainer);
  this.targetContainer.textContent = target;
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

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
