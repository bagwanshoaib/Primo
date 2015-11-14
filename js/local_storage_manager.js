window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";
  this.gametargetKey    = "gameTarget";
  this.drp1Key             = "drp1";
  this.drp2Key             = "drp2";
  this.drp3Key             = "drp3";
  this.drp4Key             = "drp4";
  this.currentLevelKey     = "currentLevel";
  this.currentMoveKey      = "currentMove";
  this.currentScoreKey     = "currentScore";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

LocalStorageManager.prototype.clearBestScore = function () {
  this.storage.removeItem(this.bestScoreKey);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};

// Game target getters/setters and clearing
LocalStorageManager.prototype.getDrp1 = function () {
  var drp1JSON = this.storage.getItem(this.drp1Key);
  return drp1JSON ? JSON.parse(drp1JSON) : null;
};

LocalStorageManager.prototype.setDrp1 = function (drp1) {
  this.storage.setItem(this.drp1Key, JSON.stringify(drp1));
};

// Game target getters/setters and clearing
LocalStorageManager.prototype.getDrp2 = function () {
  var drp2JSON = this.storage.getItem(this.drp2Key);
  return drp2JSON ? JSON.parse(drp2JSON) : null;
};

LocalStorageManager.prototype.setDrp2 = function (drp2) {
  this.storage.setItem(this.drp2Key, JSON.stringify(drp2));
};

// Game target getters/setters and clearing
LocalStorageManager.prototype.getDrp3 = function () {
  var drp3JSON = this.storage.getItem(this.drp3Key);
  return drp3JSON ? JSON.parse(drp3JSON) : null;
};

LocalStorageManager.prototype.setDrp3 = function (drp3) {
  this.storage.setItem(this.drp3Key, JSON.stringify(drp3));
};

// Game target getters/setters and clearing
LocalStorageManager.prototype.getDrp4 = function () {
  var drp4JSON = this.storage.getItem(this.drp4Key);
  return drp4JSON ? JSON.parse(drp4JSON) : null;
};

LocalStorageManager.prototype.setDrp4 = function (drp4) {
  this.storage.setItem(this.drp4Key, JSON.stringify(drp4));
};

LocalStorageManager.prototype.clearDrp = function () {
  this.storage.removeItem(this.drp1Key);
  this.storage.removeItem(this.drp2Key);
  this.storage.removeItem(this.drp3Key);
  this.storage.removeItem(this.drp4Key);
};

// Game level getters/setters and clearing
LocalStorageManager.prototype.getCurrentLevel = function () {
  var currentLevelJSON = this.storage.getItem(this.currentLevelKey);
  return currentLevelJSON ? JSON.parse(currentLevelJSON) : null;
};

LocalStorageManager.prototype.setCurrentLevel = function (currentLevel) {
  this.storage.setItem(this.currentLevelKey, JSON.stringify(currentLevel));
};

LocalStorageManager.prototype.clearCurrentLevel = function () {
  this.storage.removeItem(this.currentLevelKey);
};

LocalStorageManager.prototype.getCurrentMove = function () {
  var currentMoveJSON = this.storage.getItem(this.currentMoveKey);
  return currentMoveJSON ? JSON.parse(currentMoveJSON) : null;
};

LocalStorageManager.prototype.setCurrentMove = function (currentMove) {
  this.storage.setItem(this.currentMoveKey, JSON.stringify(currentMove));
};

LocalStorageManager.prototype.clearCurrentMove = function () {
  this.storage.removeItem(this.currentMoveKey);
};

LocalStorageManager.prototype.getCurrentScore = function () {
  var currentScoreJSON = this.storage.getItem(this.currentScoreKey);
  return currentScoreJSON ? JSON.parse(currentScoreJSON) : null;
};

LocalStorageManager.prototype.setCurrentScore = function (currentScore) {
  this.storage.setItem(this.currentScoreKey, JSON.stringify(currentScore));
};

LocalStorageManager.prototype.clearCurrentScore = function () {
  this.storage.removeItem(this.currentScoreKey);
};

// Game target getters/setters and clearing
LocalStorageManager.prototype.getGameTarget = function () {
  var targetJSON = this.storage.getItem(this.gametargetKey);
  return targetJSON ? JSON.parse(targetJSON) : null;
};

LocalStorageManager.prototype.setGameTarget = function (gameTarget) {
  this.storage.setItem(this.gametargetKey, JSON.stringify(gameTarget));
};

LocalStorageManager.prototype.clearGameTarget = function () {
  this.storage.removeItem(this.gametargetKey);
};

LocalStorageManager.prototype.setLevel = function (level) {
  var levelMul = 10;
  if(level > 1)
   levelMul = levelMul + ((level-1) * 2);

  var scoreMul = 1000;
  if(level > 1)
    scoreMul = scoreMul + ((level-1) * 200);

  levelMul = levelMul + new Number(this.getBestScore() != null ? this.getBestScore()/100 : 0);
  scoreMul = scoreMul + new Number(this.getBestScore());

  this.clearCurrentMove();
  this.clearCurrentScore();
  this.clearCurrentLevel();
  
  this.setCurrentLevel(level);
  this.setCurrentMove(levelMul);
  this.setCurrentScore(scoreMul);
};