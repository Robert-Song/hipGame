import { Board, WeightedBoard } from './board.js';

export class drawManager {
    screen: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    indicator: HTMLDivElement;
    board: Board | WeightedBoard;
    cdim: number;
    hoveri: number;
    hoverj: number;
    player_turn: boolean;
    game_over: boolean;
    constructor(screen: HTMLCanvasElement, indicator: HTMLDivElement, board: Board | WeightedBoard, player_turn: boolean) {
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");
        this.indicator = indicator;
        this.board = board
        this.cdim = Math.sqrt(screen.width * screen.height / (board.m * board.n));
        this.hoveri = -1;
        this.hoverj = -1;
        this.player_turn = player_turn;
        this.game_over = false;
    }

    updateDims(m: number, n: number, player_turn: boolean, isRecursive: boolean) {
        // When dimensions change, update the board
        // and the screen
        this.board = isRecursive ? new Board(m, n) : new WeightedBoard(m, n);
        this.cdim = Math.sqrt(this.screen.width * this.screen.height / (this.board.m * this.board.n));
        this.screen.width = this.cdim * m;
        this.screen.height = this.cdim * n;
        this.player_turn = player_turn;
        this.game_over = false;
    }

    updatePlayerTurn(isPlayerTurn: boolean, isOver: boolean) {
        if (isPlayerTurn) {
            this.player_turn = true;
            this.indicator.style.backgroundColor = "green"
            this.indicator.innerHTML = isOver ? "AI wins" : "Your turn"
        }
        else {
            this.player_turn = false;
            this.indicator.style.backgroundColor = "blue"
            this.indicator.innerHTML = isOver ? "You win!" : "AI's turn"
        }
        this.game_over = isOver;
    }

    drawCheckerboard() {
        for (let i = 0; i < this.board.m; i++) {
            for (let j = 0; j < this.board.n; j++) {
                this.ctx.fillStyle = (i + j) % 2 ? "lightGreen" : "lightBlue";
                this.ctx.fillRect(i*this.cdim, j*this.cdim, this.cdim, this.cdim)
            }
        }
    }

    drawTentativeMarker(i: number, j: number) {
        const myPath = new Path2D();
        myPath.moveTo((i + 0.75)*this.cdim, (j + 0.5)*this.cdim);
        myPath.arc((i + 0.5)*this.cdim, (j + 0.5)*this.cdim, 0.25*this.cdim, 0, 2 * Math.PI);
        this.ctx.fillStyle = "green"
        this.ctx.fill(myPath);
    }

    coverTentativeMarker(i: number, j: number) {
        if (i < 0 || j < 0) return;
        if (this.board.is_empty(i, j)) {
            this.ctx.fillStyle = (i + j) % 2 ? "lightGreen" : "lightBlue";
            this.ctx.fillRect(i*this.cdim, j*this.cdim, this.cdim, this.cdim)
        }
    }

    drawMarker(i: number, j: number, isHumanPlayer: boolean) {
        const myPath = new Path2D();
        myPath.moveTo((i + 0.8)*this.cdim, (j + 0.5)*this.cdim);
        myPath.arc((i + 0.5)*this.cdim, (j + 0.5)*this.cdim, 0.3*this.cdim, 0, 2 * Math.PI);
        this.ctx.fillStyle = isHumanPlayer ? "darkgreen" : "darkblue"
        this.ctx.fill(myPath);
    }

    updateHover(x: number, y: number) {
        // When hovering - find checker over which being hovered
        if (this.game_over || !this.player_turn) return;
        const i = Math.trunc(x / (this.cdim + 1));
        const j = Math.trunc(y / (this.cdim + 1));
        if (!(i == this.hoveri && j == this.hoverj)) { // If it's changed,
            if (this.hoveri >= 0 && this.board.is_empty(this.hoveri, this.hoverj)) {
                this.coverTentativeMarker(this.hoveri, this.hoverj); // hide old hover (if applicable)
            }
            if (this.board.is_empty(i, j)) { // and if this one is an empty square,
                this.drawTentativeMarker(i, j); // tentatively mark it
                this.hoveri = i;
                this.hoverj = j;
            }
        }
    }

    endHover() {
        this.coverTentativeMarker(this.hoveri, this.hoverj);
        this.hoveri = -1;
        this.hoverj = -1;
    }

    drawSquare(coordinates: Array<Array<number>>, isHumanPlayer: boolean) {
        coordinates = coordinates.map( (location) => [(location[0]+0.5)*this.cdim, (location[1]+0.5)*this.cdim])
        this.ctx.strokeStyle = isHumanPlayer ? "darkgreen" : "darkblue"
        this.ctx.lineWidth = this.cdim / 8;
        this.ctx.moveTo(coordinates[3][0], coordinates[3][1]);
        coordinates.forEach( (location) => { this.ctx.lineTo(location[0], location[1]); })
        this.ctx.stroke();
    }

    unMove(r: Array<Array<number>>) {
        if (r.length = 0) return;
        this.coverTentativeMarker(r[0][0], r[0][1]);
        this.coverTentativeMarker(r[1][0], r[1][1]);
    }

    // Is the canvas's click event handler
    getClick(x: number, y: number) {
        if (this.game_over || !this.player_turn) return;
        const i = Math.trunc(x / (this.cdim + 1));
        const j = Math.trunc(y / (this.cdim + 1));
        if (this.board.is_empty(i, j)) {
            this.drawMarker(i, j, true);
            var coords = this.board.move(i, j, true);
            if (coords) {
                this.drawSquare(coords, true);
                this.updatePlayerTurn(true, true);
            }
            else this.getAIMove();
        }
        return false;
    }

    getAIMove() {
        this.updatePlayerTurn(false, false);
        const [i, j] = this.board.choose_ai_move();
        var coords = this.board.move(i, j, false);
        setTimeout(() => { 
            this.drawMarker(i, j, false);
            if (coords) {
                this.drawSquare(coords as number[][], false);
                this.updatePlayerTurn(false, true);
            }
            else this.updatePlayerTurn(true, false);
        }, 500);
    }
}
