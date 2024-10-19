import { drawCheckerboard } from "./draw.js";
const content_div = document.getElementById("screen") as HTMLCanvasElement;
const row_input = document.getElementById("x_c") as HTMLInputElement;
const column_input = document.getElementById("y_c") as HTMLInputElement;
const start_button = document.getElementById("start_button") as HTMLButtonElement;
start_button.addEventListener('click', () => { drawCheckerboard(content_div, row_input.value as unknown as number, parseInt(column_input.value)); });
content_div.addEventListener('click', (e) => { console.log(e.offsetX); })
