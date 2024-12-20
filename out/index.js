import { drawManager } from "./draw.js";
import { Board, WeightedBoard } from "./board.js";
// Obtain relevant elements
const content_div = document.getElementById("screen");
const column_input = document.getElementById("x_c");
const row_input = document.getElementById("y_c");
const start_button = document.getElementById("start_button");
const plays_first_selection = document.getElementById("player");
const ai_type_selection = document.getElementById("ai");
const turn_indicator = document.getElementById("turner");
const back_button = document.getElementById("back_button");
// Create MANAGER object
const draw_manager = new drawManager(content_div, turn_indicator, ai_type_selection.value == "1" ? new Board(parseInt(row_input.value), parseInt(column_input.value))
    : new WeightedBoard(parseInt(row_input.value), parseInt(column_input.value)), (plays_first_selection.value == "0"));
draw_manager.drawCheckerboard();
// Starting a new game updates dimensions and board
start_button.addEventListener('click', () => {
    draw_manager.updateDims(parseInt(column_input.value), parseInt(row_input.value), (plays_first_selection.value == "0"), (ai_type_selection.value == "1"));
    draw_manager.drawCheckerboard();
});
// Hovering over the canvas makes tentative markers appear
content_div.addEventListener('mousemove', (e) => draw_manager.updateHover(e.offsetX, e.offsetY));
content_div.addEventListener('mouseleave', () => draw_manager.endHover());
// Clicking makes a move
content_div.addEventListener('click', (e) => {
    draw_manager.getClick(e.offsetX, e.offsetY);
});
// Back button undoes a move
back_button.addEventListener('click', (e) => draw_manager.unMove(draw_manager.board.un_move()));
