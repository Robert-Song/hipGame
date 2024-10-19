import { Board } from './board.js';

// Define a function to adjust screen proportions and draw a checkerboard
export function drawCheckerboard(screen: HTMLCanvasElement, m: number, n: number) {
    // Calculate the new dimensions while preserving the area
    const currentArea = screen.width * screen.height;
    const checkerDim = Math.sqrt(currentArea / (m * n));

    // Adjust the screen dimensions
    screen.width = checkerDim * m;
    screen.height = checkerDim * n;


    // Draw the checkerboard
    const ctx = screen.getContext("2d")

    // fillRect(x, y, width, height)
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            ctx.fillStyle = (i + j) % 2 ? "red" : "blue";
            ctx.fillRect(i*checkerDim, j*checkerDim, checkerDim, checkerDim)
        }
    }

}

// Is the canvas's click event handler
export function getClickOnCheckerboard(the_board: Board, x: number, y: number, screen: HTMLCanvasElement) {
    // checks if valid move
    const c = screen.height / the_board.n;
    const i = Math.trunc(x / c);
    const j = Math.trunc(y / c);
    if (the_board.move_valid(i, j)) {
        // if so, make move
        the_board.move(i, j, true)
        // and draw a marker there!
        const ctx = screen.getContext("2d");
        ctx.fillStyle = '#550000';
        const myPath = new Path2D();
        myPath.moveTo((i + 0.8)*c, (j + 0.5)*c);
        myPath.arc((i + 0.5)*c, (j + 0.5)*c, 0.3*c, 0, 2 * Math.PI);
        ctx.fill(myPath);
        return true;
    }
    return false;
}
