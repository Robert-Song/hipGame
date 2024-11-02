import { Board } from './board.js';

export class drawManager {
    screen: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    board: Board;
    cdim: number;
    hoveri: number;
    hoverj: number;
    constructor(screen: HTMLCanvasElement, board: Board) {
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");
        this.board = board
        this.cdim = Math.sqrt(screen.width * screen.height / (board.m * board.n));
        this.hoveri = -1;
        this.hoverj = -1;
    }

    updateDims(m: number, n: number) {
        // When dimensions change, update the board
        // and the screen
        this.board = new Board(m, n);
        this.cdim = Math.sqrt(this.screen.width * this.screen.height / (this.board.m * this.board.n));
        this.screen.width = this.cdim * m;
        this.screen.height = this.cdim * n;
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
        this.ctx.fillStyle = (i + j) % 2 ? "lightGreen" : "lightBlue";
        this.ctx.fillRect(i*this.cdim, j*this.cdim, this.cdim, this.cdim)
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

    // Is the canvas's click event handler
    getClick(x: number, y: number) {
        const i = Math.trunc(x / this.cdim);
        const j = Math.trunc(y / this.cdim);
        if (this.board.is_empty(i, j)) {
            this.board.move(i, j, true)
            this.drawMarker(i, j, true);
            return true;
        }
        return false;
    }
}
