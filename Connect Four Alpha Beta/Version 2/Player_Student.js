// Player_Student.js
// Author(s): Sajid Kamadia (201558798)


Player_Student = function(config) {
    var self = {};
    self.config = config;
    self.searchStartTime = 0;
    self.currentMax = 0;
    self.bestAction = 0;
    self.currentBest = 0;
    self.currentPlayer = null //variable to hold the current player of the state
    self.dirs = [[1,0], [0,1], [1,1], [1,-1]]; //Directions that the player can go
 
    self.getAction = function(state) {
        self.currentPlayer = state.player // This prevents toggling of players
        return self.IDAlphaBeta(state)
    }
  
    self.eval = function(state, player) {
        var winner = state.winner();
        if      (winner == player)      { return 10000; }
        else if (winner == PLAYER_NONE) {
            var b = 0;
            var opp = 1;
            var me = 1;
            for(var dir of self.dirs){
                for (var x=0; x<state.width; x++) {
                    for (var y=0; y<state.height; y++) {
                        b = self.returnScore(x, y, dir, player, state);
                        if (b == 0){
                            me = me + 50
                        }
                        else if (b == 1){
                            opp = opp + 50
                        }
                        else {continue; }
                    }
                }
            }
            return me - opp;
         
        }
        else if (winner == PLAYER_DRAW) { return 0; }
        else { return -10000; }
    }
 
    /* This function takes in x and y representing the position on the board,
    the player, and the current state of the board it calculates if a player
    got three in a row after checking to see if its three in a row it checks
    to see what player got the three in a row by checking to see what number
    the player is and returns a value based on if its the opponent or the
    player, eval then gets the return value and chooses what value gets a 1 */
 
    self.returnScore = function(x, y, dir, player, state){
        cx = x; cy = y;
        playerh = state.get(cx,cy);
        var i = 0
        for (c=0; c<2; c++) {
            cx += dir[0]; cy += dir[1];
            if(state.isValid(cx, cy)){
                if(state.get(cx, cy) == playerh){
                    i++;
                }
            }
        }
        if(playerh == player && i == 2){
            return 0
        }
        else if(playerh != player && i == 2){
            return 1
        }
        return ;
    }
    self.IDAlphaBeta = function(state) {
        var a = Number.NEGATIVE_INFINITY;
        var b = Number.POSITIVE_INFINITY;
        self.searchStartTime = performance.now();
        for(var d = 1; d <= config.maxDepth; d++)
        {
            self.currentMax = d;
            try{
                self.AlphaBeta(state, a, b, 0, true)
                self.bestAction = self.currentBest            
            }
            catch(err){break;}
        }
        return self.bestAction;
    }
     self.AlphaBeta = function(state, alpha, beta, depth, max) {
        if(depth >= self.currentMax || state.winner == PLAYER_NONE){
            return self.eval(state, self.currentPlayer);
        }
        var timeElapsed = performance.now() - self.searchStartTime;
        if(timeElapsed > config.timeLimit) throw(err)
        for (var act of state.getLegalActions()){
            var child = state.copy();
            child.doAction(act);
            var vp = self.AlphaBeta(child, alpha, beta, depth+1, !max);
            if(max && vp > alpha){
                alpha = vp;
                if(depth == 0){
                    self.currentBest = act;
                }
            }
            if(!max && vp < beta){
                beta = vp;
            }
            if(alpha >= beta) {break;}     
        }
        return max ? alpha : beta;
    }
   
    return self;
 }
 
 
