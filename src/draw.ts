// Define a function to adjust screen proportions and draw a checkerboard
export function drawCheckerboard(screen: HTMLCanvasElement, m: number, n: number) {
    // Calculate the new dimensions while preserving the area
    const currentArea = screen.width * screen.height;
    const checkerDim = Math.sqrt(currentArea / (m * n));
    console.log("CheckerDim:", checkerDim);

    // Adjust the screen dimensions
    screen.width = checkerDim * m;
    screen.height = checkerDim * n;


    // Draw the checkerboard
    const ctx = screen.getContext("2d")

    // fillRect(x, y, width, height)
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            ctx.fillStyle = (i + j) % 2 ? "red" : "blue";
            console.log(ctx.fillStyle);
            ctx.fillRect(i*checkerDim, j*checkerDim, checkerDim, checkerDim)
        }
    }

}

// Is the canvas's click event handler
export function getClickOnCheckerboard(x: number, y: number, screen: HTMLCanvasElement, m: number, n: number) {
    // checks if valid move
    // if so, make move
    // and draw a marker there!
    return true;
}
