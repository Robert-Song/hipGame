enum Space_Marker {
    Empty,
    Player,
    AI
}

export class Board {
    m: number; // # of items in row (width)
    n: number; // # of items in column (length)
    contents : Array<Array<Space_Marker>>; // an array with m width and n length
    max_sqr : number; // possible maximum length of a square's edge (in real length)

    //general constructor, makes an empty m x n 2D array
    constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        this.contents = [];
        this.max_sqr = Math.min(this.m, this.n) - 1;

        //initialize an mxn array, make it empty
        for (let i = 0; i < n; i++) {
            this.contents.push(new Array(m).fill(Space_Marker.Empty));
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
                let x = Math.abs(i - i_new);
                let y = Math.abs(j - j_new);

                //FIXME: remove try catch after debugging!!!
                try{
                    if(i+y < this.m && i_new+y < this.m) {
                        if(j+x < this.n && j_new+x < this.n) {
                            if(this.contents[i + y][j + x] == marker 
                                && this.contents[i_new + y][j_new + x] == marker) {
                                    console.log("square found!");
                                    return true;
                            }
                        }
                        if(j-x >= 0 && j_new-x >= 0) {
                            if(this.contents[i + y][j - x] == marker 
                                && this.contents[i_new + y][j_new - x] == marker) {
                                    console.log("square found!");
                                    return true;
                            }
                        }
                    }
                    if(i-y >= 0 && i_new-y >= 0) {
                        if(j+x < this.n && j_new+x < this.n) {
                            if(this.contents[i - y][j + x] == marker 
                                && this.contents[i_new - y][j_new + x] == marker) {
                                    console.log("square found!");
                                    return true;
                            }
                        }
                        if(j-x >= 0 && j_new-x >= 0) {
                            if(this.contents[i - y][j - x] == marker 
                                && this.contents[i_new - y][j_new - x] == marker) {
                                    console.log("square found!");
                                    return true;
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
            console.error("this should not happen");
        }
        
        if(isHumanPlayer) {
            this.contents[i][j] = Space_Marker.Player;
        } else {
            this.contents[i][j] = Space_Marker.AI;
        }

        //check for possible square formed
        this.check_sqr(isHumanPlayer, i, j);
    }

}