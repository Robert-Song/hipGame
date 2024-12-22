import { drawManager } from "./draw.js";
import { RandomBoard, RecurBoard, WeightedBoard } from "./board.js"

// Obtain relevant elements
const content_div = document.getElementById("screen") as HTMLCanvasElement;
const column_input = document.getElementById("x_c") as HTMLInputElement;
const row_input = document.getElementById("y_c") as HTMLInputElement;
const start_button = document.getElementById("start_button") as HTMLButtonElement;
const plays_first_selection = document.getElementById("player") as HTMLSelectElement;
const ai_type_selection = document.getElementById("ai") as HTMLSelectElement;
const turn_indicator = document.getElementById("turner") as HTMLDivElement;
const back_button = document.getElementById("back_button") as HTMLButtonElement;
const warning_indicator = document.getElementById("warning") as HTMLHeadingElement;
const about_button = document.getElementById("about_button") as HTMLButtonElement;
const about_section = document.getElementById("about_section") as HTMLDivElement;

// Create MANAGER object
const draw_manager = new drawManager(content_div, turn_indicator,
    ai_type_selection.value == "2" ? new RandomBoard(parseInt(row_input.value), parseInt(column_input.value)) :
    ai_type_selection.value == "0" ? new WeightedBoard(parseInt(row_input.value), parseInt(column_input.value))
    : new RecurBoard(parseInt(row_input.value), parseInt(column_input.value), parseInt(ai_type_selection.value)), 
    (plays_first_selection.value == "0"));
draw_manager.drawCheckerboard();

const update_warning = () => {
    warning_indicator.hidden =
    draw_manager.board.m == parseInt(row_input.value) && draw_manager.board.n == parseInt(column_input.value) &&
    draw_manager.board_type == parseInt(ai_type_selection.value) && draw_manager.player_turn == (plays_first_selection.value == "0");
}
[row_input, column_input, plays_first_selection, ai_type_selection].forEach( (obj) => {
    obj.addEventListener('change', update_warning);
})


// Starting a new game updates dimensions and board
start_button.addEventListener('click', () => { 
    draw_manager.updateDims(parseInt(column_input.value), parseInt(row_input.value), (plays_first_selection.value == "0"), parseInt(ai_type_selection.value));
    draw_manager.drawCheckerboard();
    warning_indicator.hidden = true;
});

// Also focuses player on the board, so the turn thing is visible
start_button.addEventListener('click', () => content_div.scrollIntoView({ behavior: "smooth", block: "center"}));

// Hovering over the canvas makes tentative markers appear
content_div.addEventListener('mousemove', (e) => draw_manager.updateHover(e.offsetX, e.offsetY));
content_div.addEventListener('mouseleave', () => draw_manager.endHover());

// Clicking makes a move
content_div.addEventListener('click', (e) => {
    draw_manager.getClick(e.offsetX, e.offsetY);
} );

// Back button undoes a move
back_button.addEventListener('click', (e) => draw_manager.unMove(draw_manager.board.un_move()));

// About button scrolls to about section
about_button.addEventListener('click', () => about_section.scrollIntoView({behavior: "smooth", block: "start"}))