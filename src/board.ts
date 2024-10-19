enum Space_Marker {
    Empty,
    Player,
    AI
}

export class Board {
    m: number;
    n: number;
    contents: Array<Array<Space_Marker>>

    constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        this.contents = []; // initialize to be an mxn array of Empty
    }

    move_valid(i: number, j: number) {
        // returns if space is empty
    }

    move(i: number, j: number, isHumanPlayer: boolean) {
        // makes move, changes, returns if square forms
        return false;
    }

}