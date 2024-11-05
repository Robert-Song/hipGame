import { Board } from './board.js';

export class drawManager {
    screen: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    indicator: HTMLDivElement;
    board: Board;
    cdim: number;
    hoveri: number;
    hoverj: number;
    player_turn: boolean;
    constructor(screen: HTMLCanvasElement, indicator: HTMLDivElement, board: Board, player_turn: boolean) {
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");
        this.indicator = indicator;
        this.board = board
        this.cdim = Math.sqrt(screen.width * screen.height / (board.m * board.n));
        this.hoveri = -1;
        this.hoverj = -1;
        this.player_turn = player_turn;
    }

    updateDims(m: number, n: number, player_turn: boolean) {
        // When dimensions change, update the board
        // and the screen
        this.board = new Board(m, n);
        this.cdim = Math.sqrt(this.screen.width * this.screen.height / (this.board.m * this.board.n));
        this.screen.width = this.cdim * m;
        this.screen.height = this.cdim * n;
        this.player_turn = player_turn;
    }

    updatePlayerTurn(isPlayerTurn: boolean) {
        if (isPlayerTurn) {
            this.player_turn = true;
            this.indicator.style.backgroundColor = "green"
            this.indicator.innerHTML = "Your turn"
        }
        else {
            this.player_turn = false;
            this.indicator.style.backgroundColor = "blue"
            this.indicator.innerHTML = "AI's turn"
        }
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
        if (!this.player_turn) return;
        const i = Math.trunc(x / (this.cdim + 1));
        const j = Math.trunc(y / (this.cdim + 1));
        if (this.board.is_empty(i, j)) {
            this.board.move(i, j, true)
            this.drawMarker(i, j, true);
            this.getAIMove();
        }
        console.log(this.board.get_weights(i, j))
        return false;
    }

    getAIMove() {
        this.updatePlayerTurn(false);
        const [i, j] = this.board.make_ai_move();
        setTimeout(() => { this.drawMarker(i, j, false); this.updatePlayerTurn(true); }, 500);
    }
}
