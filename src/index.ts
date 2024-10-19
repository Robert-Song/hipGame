import { drawCheckerboard } from "./draw";

const content_div = document.getElementById("screen") as HTMLCanvasElement;

content_div.style.backgroundColor = "red";
drawCheckerboard(content_div, 3, 3);
