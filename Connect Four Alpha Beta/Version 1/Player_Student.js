// Alpha Beta heuristic for Connect Four
//Author: Sajid Kamadia



Player_Student = function(config) {
    var self = {};
    self.config = config;
    self.searchStartTime = 0;

    self.currentMaxDepth = 0 //max depth for the current iteration of AlphaBeta
    self.currentBestAction = null //best action for current iteration for IDAB
    self.selfPlayerNum = null //our player number


    self.getAction = function(state) {
        self.selfPlayerNum = state.player  
        return self.IDAlphaBeta(state);
    }
    

    self.eval = function(state, player) {
        var winner = state.winner();
        if      (winner == player)      { return 10000; }
        else if (winner == PLAYER_NONE) { return self.countPlayerBlocks(state, player) }
        else if (winner == PLAYER_DRAW) { return 0; }
        else                            { return -10000; }
    }
    
    self.countPlayerBlocks = function(state, player){
        /**
         * This function calculates the number of times it blocks the opponents possible
         * connect-n ranges, and multiplies that by 10 to get a score
         */
        const reach = state.connect-1
        let score = 0

        for(let x = 0; x < state.width; x++){
            for(let y = 0; y < state.height; y++){
                if(state.get(x,y) === player){
                    //Get potential blocks induced by this piece
                    for(let dx=reach; dx >= 0; dx--){
                        for(let dy=reach; dy >= 0; dy--){
                            const notValidAxis = dx*dy !== 0 && dx != dy //not a connect four axis
                            const atPiece = dx === 0 && dy === 0 //we are at the original piece
                            if(notValidAxis || atPiece) { continue }

                            //Bounds for connect 4 range
                            const start = [dx === 0 ? x : x+dx-reach, dy === 0 ? y : y+dy-reach]
                            const end = [x+dx, y+dy]

                            const isRangeValid = state.isValid(...start) && state.isValid(...end)
                            if(isRangeValid){
                                score += 10
                            }
                        }
                    }
                }
            }
        }
        return score
    }


    self.IDAlphaBeta = function(state) {
        bestAction = null
        
        // here is the syntax to record the time in javascript
        self.searchStartTime = performance.now();
        const maxDepth = self.config.maxDepth === 0 ? Infinity : self.config.maxDepth

        for (let depth = 0; depth < maxDepth; depth++){
            self.currentMaxDepth = depth
            try{
                const alpha = -Infinity
                const beta = Infinity
                const bestEval = self.AlphaBeta(state, alpha, beta, 0, true)
                // if (depth % 2 === 0){
                //     bestAction = currentBestAction
                // }
                bestAction = self.currentBestAction
            }
            catch(e){
                if(e instanceof TimeOutException) {
                    break
                }
                else {
                    throw e
                }
            }

            // Ask Dave about skipping optimistic depths.
        

        }

        return bestAction;
    }

    self.getChildren = function(state) {
        const actionToNewState = action => {
            const newState = state.copy()
            newState.doAction(action)
            return newState
        }

        const actions = Array.from(Array(state.width).keys()) //0...state.width
        const validActions = actions.filter(action => state.isLegalAction(action))
        const children = validActions.map( action => ({action, newState: actionToNewState(action)}) )
        return children
    }


    self.AlphaBeta = function(state, alpha, beta, depth, max) {

        // code for AlphaBeta goes here
        const isTerminal = state.winner() !== PLAYER_NONE
        const exceededDepth = depth > self.currentMaxDepth
        if(isTerminal || exceededDepth){
            return self.eval(state, self.selfPlayerNum)
        }

        // here is the syntax to calculate how much time has elapsed since the search began
        // you should compare this to self.config.
        var timeElapsed = performance.now() - self.searchStartTime;
        if(timeElapsed > self.config.timeLimit && self.config.timeLimit !== 0){
            throw new TimeOutException()
        }

        for(let move of self.getChildren(state)){
            const { action, newState: child } = move

            const vPrime = self.AlphaBeta(child, alpha, beta, depth+1, !max)
            if(max && vPrime > alpha){
                alpha = vPrime
                if(depth === 0) { 
                    self.currentBestAction = action
                }
            }

            if(!max && vPrime < beta){
                beta = vPrime
            }

            if(alpha >= beta){ break }
        }

        // return the value
        return max ? alpha : beta;
    }

    return self;
}

// const TimeOutException = () => {}
// TimeOutException.prototype = Object.create(Error.prototype)

class TimeOutException extends Error{

}