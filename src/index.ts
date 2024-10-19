import { drawCheckerboard } from "./draw.js";
const content_div = document.getElementById("screen") as HTMLCanvasElement;
drawCheckerboard(content_div, 3, 3);
