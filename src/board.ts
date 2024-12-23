enum Space_Marker {
    Empty,
    Player = 2,
    AI = 6
}

export class Board {
    m: number; // # of items in row (width)
    n: number; // # of items in column (length)
    contents : Array<Array<Space_Marker>>; // an array with m width and n length
    max_sqr : number; // possible maximum length of a square's edge (in real length)
    weights: Array<Array<number>>; // reason not to move there
    moves: Array<Array<number>>; // list of previous moves

    //general constructor, makes an empty m x n 2D array
    constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        this.contents = [];
        this.max_sqr = Math.min(this.m, this.n) - 1;
        this.moves = [];

        //initialize an mxn array, make it empty
        for (let i = 0; i < m; i++) {
            this.contents.push(new Array(n).fill(Space_Marker.Empty));
        }
    }

    //check if (i, j) is empty
    is_empty(i: number, j: number) {
        //returns true if the place is empty
        return (this.contents[i][j] == Space_Marker.Empty);
    }
    
    //TODO
    /*
    move_valid(i: number, j: number) {
        // returns true if the place is empty
        return true;
    }
    */

    choose_ai_move() {
        return [0, 0]
    }

    //check if square is formed after new marker played
    //new marker's location is saved as (i_new, j_new)
    check_sqr(player: boolean, i_new:number, j_new:number) {

        let marker = Space_Marker.AI;
        if(player) {
            marker = Space_Marker.Player;
        }
        
        //traverse through the 2D array
        for(let i= 0; i<this.m; i++) {
            for(let j=0; j<this.n; j++) {

                //only check for same type of marker
                if(this.contents[i][j] != marker) {
                    continue;
                }
                //we don't consider one dot as a square
                if(i == i_new && j == j_new) {
                    continue;
                }
                //check if the edge is too long, not able to form a square
                if(Math.sqrt(Math.pow((i - i_new), 2)+Math.pow((j - j_new), 2)) > this.max_sqr) {
                    continue;
                }

                //square length
                let x = j - j_new;
                let y = i - i_new;

                //used to check conditions
                let slope = 1; //positive slope
                if(x * y > 0) {
                    slope = 0; //negative slope
                }

                x = Math.abs(x);
                y = Math.abs(y);

                //FIXME: remove try catch after debugging!!!
                try{
                    if(slope == 0) {
                        if(i+x < this.n && i_new+x < this.n && j-y >= 0 && j_new-y >= 0) {
                            if(this.contents[i + x][j - y] == marker 
                                && this.contents[i_new + x][j_new - y] == marker) {
                                    console.log("square found! 1");
                                    return [[i_new + x, j_new - y], [i_new, j_new], [i, j], [i + x, j - y]];
                            }
                        } 
                        if(i-x >= 0 && i_new-x >= 0 && j+y < this.m && j_new+y < this.m) {
                            if(this.contents[i - x][j + y] == marker 
                                && this.contents[i_new - x][j_new + y] == marker) {
                                    console.log("square found! 2");
                                    return [[i_new - x, j_new + y], [i_new, j_new], [i, j], [i - x, j + y]];
                            }
                        }
                    } else {
                        if(i+x < this.n && i_new+x < this.n && j+y < this.m && j_new+y < this.m) {
                            if(this.contents[i + x][j + y] == marker 
                                && this.contents[i_new + x][j_new + y] == marker) {
                                    console.log("square found! 3");
                                    return [[i_new + x, j_new + y], [i_new, j_new], [i, j], [i + x, j + y]];
                            }
                        }
                        if(i-x >= 0 && i_new-x >= 0 && j-y >= 0 && j_new-y >= 0) {
                            if(this.contents[i - x][j - y] == marker 
                                && this.contents[i_new - x][j_new - y] == marker) {
                                    console.log("square found! 4");
                                    return [[i_new - x, j_new - y], [i_new, j_new], [i, j], [i - x, j - y]];
                            }
                        }
                    }
                } catch(error) {
                    if(error instanceof TypeError) {
                        console.error("index out of bound");
                    } else {
                        console.error("unpredicted error...");
                        console.log((error).message);
                    }
                }
            }
        }
        //after traverse, no square found!
        return false;
    }

    //add a new piece on the board
    move(i: number, j: number, isHumanPlayer: boolean) {
        // makes move, changes, returns if square forms

        //FIXME: remove this condition before the end of project
        if(!this.is_empty(i, j)) {
            console.error("trying to move where there's already a mark. This should not happen");
        }
        
        if(isHumanPlayer) {
            this.contents[i][j] = Space_Marker.Player;
        } else {
            this.contents[i][j] = Space_Marker.AI;
        }

        this.moves.push([i, j]);

        //check for possible square formed
        return this.check_sqr(isHumanPlayer, i, j);
    }

    un_move() {
        // removes last player move & the AI move that followed it
        if (this.moves.length > 1) {
            let last_two_moves = this.moves.slice(-2);
            this.contents[last_two_moves[0][0]][last_two_moves[0][1]] = Space_Marker.Empty;
            this.contents[last_two_moves[1][0]][last_two_moves[1][1]] = Space_Marker.Empty;
            this.moves = this.moves.slice(0, -2);
            return last_two_moves;
        }
        return [];
    }

    get_weights(i: number, j: number) {
        var weights = [];
        for (let i = 0; i < this.m; i++) {
            weights.push(new Array(this.n).fill(0));
        }

        var k = Math.max(0, i - j)
        const KMAX = Math.min(this.m - 1, this.n - 1 + i - j)
        console.log(`i: ${i}\tj: ${j}\tk: ${k}\tKMAX: ${KMAX}`)
        while (k <= KMAX) {
            var l = Math.max(0, j - this.m + k + 1, i + j - this.m + 1, i - k)
            const LMAX = Math.min(this.n - 1, i + j, k + j, this.n - k + i - 1)
            console.log(`k: ${k}\tl: ${l}\tLMAX: ${LMAX}`)
            while (l <= LMAX) {
                weights[k][l] += 1
                var a = k - i
                var b = l - j 
                if (l + a >= this.n) console.log(`l + a >= this.n\t\tk: ${k}\tl: ${l}`);
                if (j + a >= this.n) console.log(`j + a >= this.n\t\tk: ${k}\tl: ${l}`);
                weights[k - b][l + a] += 1
                weights[i - b][j + a] += 1

                l++;
            }

            k++;
        }

        for (var q = 0; q < this.m; q++) {
            console.log(weights[q])
        }

        return weights;
    }
}

export class WeightedBoard extends Board {
    constructor(m: number, n: number) {
        super(m, n);
        this.init_weights();
    }

    init_weights() {
        this.weights = [];
        for (let i = 0; i < this.m; i++) {
            this.weights.push(new Array(this.n).fill(0));
        }

        var new_weights : Array<Array<number>>;
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                new_weights = this.get_weights(i, j);
                this.weights = this.weights.map( (col, x_ind) => {
                    return col.map( (val, y_ind) => val + new_weights[x_ind][y_ind])
                })
            }
        }
    }

    update_weights(i: number, j: number, player: boolean, reverse: boolean = false) {
        var k = Math.max(0, i - j)
        const KMAX = Math.min(this.m - 1, this.n - 1 + i - j)
        while (k <= KMAX) {
            var l = Math.max(0, j - this.m + k + 1, i + j - this.m + 1, i - k)
            const LMAX = Math.min(this.n - 1, i + j, k + j, this.n - k + i - 1)
            while (l <= LMAX) {
                var a = k - i
                var b = l - j

                var coords = [[i, j], [k, l], [k-b,l+a], [i-b, j+a]];
                var corners = coords.map( (val) => this.contents[val[0]][val[1]]);
                var mod = corners.reduce( (prev, cur) => prev as number + cur as number) as number;
                if (mod == 3 * Space_Marker.AI) mod = 120;
                else if (corners.indexOf(Space_Marker.AI) >= 0 && corners.indexOf(Space_Marker.Player) >= 0) {
                    mod = -3;
                }
                if (reverse) mod *= -1;
                coords.forEach( (val) => this.weights[val[0]][val[1]] += mod);

                l++;
            }
            k++;
        }
        for (var q = 0; q < this.m; q++) {
            console.log(this.weights[q])
        }
    }

    choose_ai_move() {
        console.log("Weighted board is choosing move.");
        var i = -1;
        var j = -1;
        var best = 2147483647;
        for (let k = 0; k < this.m; ++k) {
            for (let l = 0; l < this.n; ++l) {
                if (this.is_empty(k, l) && this.weights[k][l] < best) {
                    i = k;
                    j = l;
                    best = this.weights[k][l]
                }
            }
        }
        return [i, j]
    }

    //add a new piece on the board
    move(i: number, j: number, isHumanPlayer: boolean) {
        let m = super.move(i, j, isHumanPlayer);
        this.update_weights(i, j, isHumanPlayer);
        return m;
    }

    un_move(): number[][] {
        let r = super.un_move();
        this.update_weights(r[0][0], r[0][1], true, true);
        this.update_weights(r[1][0], r[1][1], false, true);
        return r;
    }
}

//let sqrCount: Array<Array<number>>;
let sqrCount = [];


export class RecurBoard extends Board {
    maxDepth: number;

    constructor(m: number, n: number, depth: number) {
        super(m, n);
        //TODO: get maxDepth from user and update it instead of just setting into 3
        this.maxDepth = depth;
    }

    initSqrCount () {
        for (let i = 0; i < this.m; i++) {
            sqrCount[i] = [];
            for(let j=0; j<this.n; j++) {
                sqrCount[i][j]=0;
            }
        }
    }

    //XXX: -
    deepCopy() {
        var tempBoard = new RecurBoard(this.m, this.n, this.maxDepth);
        tempBoard.max_sqr = Math.min(this.m, this.n) - 1;
        tempBoard.moves = this.moves.slice();

        for(let i = 0; i<this.m; i++) {
            for(let j = 0; j<this.n; j++) {
                tempBoard.contents[i][j] = JSON.parse(JSON.stringify(this.contents[i][j]));
            }
        }
        return tempBoard;
    }

    choose_ai_move() {
        console.log("Recursive board is choosing move with depth " + this.maxDepth);

        //First, duplicate the board
        var tempBoard: RecurBoard;
        tempBoard = this.deepCopy();

        //initialize sqrCount
        this.initSqrCount();

        //recursively count possible squares formed
        for(let i=0; i<this.m; i++) {
            for(let j=0; j<this.n; j++) {
                this.recurChild(tempBoard, 0, i, j);
            }
        }

        //traverse the sqrCount[][] and find the least possible square formed spot, return that
        var i = -1;
        var j = -1;
        var best = 2147483647;
        for(let k=0; k<this.m; k++) {
            for(let l=0; l<this.n; l++) {
                if(this.is_empty(k, l) && sqrCount[k][l] < best) {
                    i = k;
                    j = l;
                    best = sqrCount[k][l]
                }
            }
        }
        return [i, j];
    }

    recurChild(tempBoard: RecurBoard, depth: number, i: number, j: number)  {
        //return when max depth has reached
        if(depth >= this.maxDepth) {
            return;
        }
        //don't need to calculate when there's already a marker
        if(tempBoard.contents[i][j] != Space_Marker.Empty) {
            return;
        }

        //add a new piece on i, j (ai)
        var newTempBoard = tempBoard.deepCopy();
        
        //if that move forms a square, add that to the sqrCount and return
        if(newTempBoard.move(i, j, false) != false) {
            if(depth == 0) {
                sqrCount[i][j] += 999;
            }
            sqrCount[i][j]++;
            return;
        }

        //if that move didn't formed any square, keep that marker and continue into next depth
        for(let k=0; k<this.m; k++) {
            for(let l=0; l<this.n; l++) {
                this.recurChild(newTempBoard, depth+1, k, l);
            }
        }
        
    }
}

export class RandomBoard extends Board {
    constructor(m: number, n: number) {
        super(m, n);
    }

    choose_ai_move(): number[] {

        //when the board is full, while loop will become an infinite loop
        var takenPlaces = 0;
        for(let k = 0; k<this.m; k++) {
            for(let l = 0; l<this.n; l++) {
                if(!this.is_empty(k, l)) {
                    takenPlaces++;
                }
            }
        }
        if(takenPlaces == this.m * this.n) {
            return [-1, -1];
        }

        var i;
        var j;

        do {
            i = Math.floor(Math.random()*this.m)
            j = Math.floor(Math.random()*this.n)
        } while (!(this.is_empty(i, j)));
        console.log("Choosing a random move");
        return [i, j]
    }
}