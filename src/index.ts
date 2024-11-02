import { drawManager } from "./draw.js";
import { Board } from "./board.js"

// Obtain relevant elements
const content_div = document.getElementById("screen") as HTMLCanvasElement;
const column_input = document.getElementById("x_c") as HTMLInputElement;
const row_input = document.getElementById("y_c") as HTMLInputElement;
const start_button = document.getElementById("start_button") as HTMLButtonElement;
const plays_first_selection = document.getElementById("player") as HTMLSelectElement;
const turn_indicator = document.getElementById("turner") as HTMLDivElement;

// Create MANAGER object
const draw_manager = new drawManager(content_div, turn_indicator, new Board(parseInt(row_input.value), parseInt(column_input.value)), (plays_first_selection.value == "0"));
draw_manager.drawCheckerboard();

// Starting a new game updates dimensions and board
start_button.addEventListener('click', () => { 
    draw_manager.updateDims(parseInt(column_input.value), parseInt(row_input.value), (plays_first_selection.value == "0"));
    draw_manager.drawCheckerboard();
});

// Hovering over the canvas makes tentative markers appear
content_div.addEventListener('mousemove', (e) => draw_manager.updateHover(e.offsetX, e.offsetY));
content_div.addEventListener('mouseleave', () => draw_manager.endHover());

// Clicking makes a move
content_div.addEventListener('click', (e) => {
    draw_manager.getClick(e.offsetX, e.offsetY);
} );
