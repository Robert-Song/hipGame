enum Space_Marker {
    Empty,
    Player,
    AI
}

export class Board {
    m: number; // # of items in row (width)
    n: number; // # of items in column (length)
    contents : Array<Array<Space_Marker>>; // an array with m width and n length

    constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        //this.contents = [];

        //initialize an mxn array, make it empty
        for (let i = 0; i < n; i++) {
            this.contents.push(new Array(m).fill(Space_Marker.Empty));
        }
    }

    move_valid(i: number, j: number) {
        // returns true if the place is empty
        return (this.contents[i][j] == Space_Marker.Empty);
    }

    move(i: number, j: number, isHumanPlayer: boolean) {
        // makes move, changes, returns if square forms
        return false;
    }

}