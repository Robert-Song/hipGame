var Space_Marker;
(function (Space_Marker) {
    Space_Marker[Space_Marker["Empty"] = 0] = "Empty";
    Space_Marker[Space_Marker["Player"] = 1] = "Player";
    Space_Marker[Space_Marker["AI"] = 3] = "AI";
})(Space_Marker || (Space_Marker = {}));
export class Board {
    //general constructor, makes an empty m x n 2D array
    constructor(m, n) {
        this.m = m;
        this.n = n;
        this.contents = [];
        this.max_sqr = Math.min(this.m, this.n) - 1;
        //initialize an mxn array, make it empty
        for (let i = 0; i < m; i++) {
            this.contents.push(new Array(n).fill(Space_Marker.Empty));
        }
        this.init_weights();
    }
    //check if (i, j) is empty
    is_empty(i, j) {
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
    check_sqr(player, i_new, j_new) {
        let marker = Space_Marker.AI;
        if (player) {
            marker = Space_Marker.Player;
        }
        //traverse through the 2D array
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                //only check for same type of marker
                if (this.contents[i][j] != marker) {
                    continue;
                }
                //we don't consider one dot as a square
                if (i == i_new && j == j_new) {
                    continue;
                }
                //check if the edge is too long, not able to form a square
                if (Math.sqrt(Math.pow((i - i_new), 2) + Math.pow((j - j_new), 2)) > this.max_sqr) {
                    continue;
                }
                //square length
                let x = i - i_new;
                let y = j - j_new;
                //used to check conditions
                let slope = 1; //positive slope
                //(negative shaped, but in 2D array representation, it is positive)
                if (x * y < 0) {
                    slope = 0;
                }
                x = Math.abs(x);
                y = Math.abs(y);
                //FIXME: remove try catch after debugging!!!
                try {
                    if (slope) {
                        if (i + y < this.n && i_new + y < this.n && j - x >= 0 && j_new - x >= 0) {
                            if (this.contents[i + y][j - x] == marker
                                && this.contents[i_new + y][j_new - x] == marker) {
                                console.log("square found! (%d, %d), (%d, %d)", i_new, j_new, i, j);
                                return true;
                            }
                        }
                        else if (i - y >= 0 && i_new - y >= 0 && j + x < this.m && j_new + x < this.m) {
                            if (this.contents[i - y][j + x] == marker
                                && this.contents[i_new - y][j_new + x] == marker) {
                                console.log("square found! (%d, %d), (%d, %d)", i_new, j_new, i, j);
                                return true;
                            }
                        }
                    }
                    else {
                        if (i + y < this.n && i_new + y < this.n && j + x < this.m && j_new + x < this.m) {
                            if (this.contents[i + y][j + x] == marker
                                && this.contents[i_new + y][j_new + x] == marker) {
                                console.log("square found! (%d, %d), (%d, %d)", i_new, j_new, i, j);
                                return true;
                            }
                        }
                        else if (i - y >= 0 && i_new - y >= 0 && j - x >= 0 && j_new - x >= 0) {
                            if (this.contents[i - y][j - x] == marker
                                && this.contents[i_new - y][j_new - x] == marker) {
                                console.log("square found! (%d, %d), (%d, %d)", i_new, j_new, i, j);
                                return true;
                            }
                        }
                    }
                }
                catch (error) {
                    if (error instanceof TypeError) {
                        console.error("index out of bound");
                    }
                    else {
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
    move(i, j, isHumanPlayer) {
        // makes move, changes, returns if square forms
        //FIXME: remove this condition before the end of project
        if (!this.is_empty(i, j)) {
            console.error("this should not happen");
        }
        if (isHumanPlayer) {
            this.contents[i][j] = Space_Marker.Player;
        }
        else {
            this.contents[i][j] = Space_Marker.AI;
        }
        // update the board weighting
        this.update_weights(i, j, isHumanPlayer);
        //check for possible square formed
        return this.check_sqr(isHumanPlayer, i, j);
    }
    choose_ai_move() {
        var i = -1;
        var j = -1;
        var best = 2147483647;
        for (let k = 0; k < this.m; ++k) {
            for (let l = 0; l < this.n; ++l) {
                if (this.is_empty(k, l) && this.weights[k][l] < best) {
                    i = k;
                    j = l;
                    best = this.weights[k][l];
                }
            }
        }
        return [i, j];
    }
    get_weights(i, j) {
        var weights = [];
        for (let i = 0; i < this.m; i++) {
            weights.push(new Array(this.n).fill(0));
        }
        var k = Math.max(0, i - j);
        const KMAX = Math.min(this.m - 1, this.n - 1 + i - j);
        console.log(`i: ${i}\tj: ${j}\tk: ${k}\tKMAX: ${KMAX}`);
        while (k <= KMAX) {
            var l = Math.max(0, j - this.m + k + 1, i + j - this.m + 1, i - k);
            const LMAX = Math.min(this.n - 1, i + j, k + j, this.n - k + i - 1);
            console.log(`k: ${k}\tl: ${l}\tLMAX: ${LMAX}`);
            while (l <= LMAX) {
                weights[k][l] += 1;
                var a = k - i;
                var b = l - j;
                if (l + a >= this.n)
                    console.log(`l + a >= this.n\t\tk: ${k}\tl: ${l}`);
                if (j + a >= this.n)
                    console.log(`j + a >= this.n\t\tk: ${k}\tl: ${l}`);
                weights[k - b][l + a] += 1;
                weights[i - b][j + a] += 1;
                l++;
            }
            k++;
        }
        for (var q = 0; q < this.m; q++) {
            console.log(weights[q]);
        }
        return weights;
    }
    init_weights() {
        this.weights = [];
        for (let i = 0; i < this.m; i++) {
            this.weights.push(new Array(this.n).fill(0));
        }
        var new_weights;
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                new_weights = this.get_weights(i, j);
                this.weights = this.weights.map((col, x_ind) => {
                    return col.map((val, y_ind) => val + new_weights[x_ind][y_ind]);
                });
            }
        }
        // for (var q = 0; q < this.m; q++) {
        //     console.log(weights[q])
        // }
    }
    update_weights(i, j, player) {
        var k = Math.max(0, i - j);
        const KMAX = Math.min(this.m - 1, this.n - 1 + i - j);
        while (k <= KMAX) {
            var l = Math.max(0, j - this.m + k + 1, i + j - this.m + 1, i - k);
            const LMAX = Math.min(this.n - 1, i + j, k + j, this.n - k + i - 1);
            while (l <= LMAX) {
                var a = k - i;
                var b = l - j;
                var coords = [[i, j], [k, l], [k - b, l + a], [i - b, j + a]];
                var corners = coords.map((val) => this.contents[val[0]][val[1]]);
                var mod = corners.reduce((prev, cur) => prev + cur);
                coords.forEach((val) => this.weights[val[0]][val[1]] += mod);
                l++;
            }
            k++;
        }
    }
}
