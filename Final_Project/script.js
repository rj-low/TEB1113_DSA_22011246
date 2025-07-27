const rows = 20, cols = 20;
const grid = [
  0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,
  1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,0,
  0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,
  0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,
  0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,
  1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,
  0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,
  0,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,
  0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,
  1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,
  0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,
  0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,
  0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,
  1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,
  0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,
  0,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,
  0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,
  1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,
  0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,
  0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0
];

let pathGridBFS = new Array(rows * cols).fill(0);
let pathGridDFS = new Array(rows * cols).fill(0);
const canvasBFS = document.getElementById("canvasBFS");
const canvasDFS = document.getElementById("canvasDFS");
const ctxBFS = canvasBFS.getContext("2d");
const ctxDFS = canvasDFS.getContext("2d");
const cellSize = canvasBFS.width / cols;
const bfsTimeLabel = document.getElementById("bfsTime");
const dfsTimeLabel = document.getElementById("dfsTime");

let start = [0, 0];
let end = [cols - 1, rows - 1];
let mode = null; // "start" or "end"

const bfsCountLabel = document.getElementById("bfsCount");
const dfsCountLabel = document.getElementById("dfsCount");

function drawGrid(ctx, pathGrid) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      let color = "white";
      if (grid[i] === 1) color = "black";
      else if (pathGrid[i] === 2) color = "purple";
      else if (pathGrid[i] === 1) color = "blue";
      ctx.fillStyle = color;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
  drawCell(ctx, start[0], start[1], "red");
  drawCell(ctx, end[0], end[1], "green");
}

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

canvasBFS.onclick = canvasDFS.onclick = function (e) {
  if (!mode) return;

  const rect = this.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  const idx = y * cols + x;

  if (grid[idx] === 1) return alert("You can't select a wall!");

  if (mode === "start") {
    start = [x, y];
  } else if (mode === "end") {
    end = [x, y];
  }

  drawGrid(ctxBFS, pathGridBFS);
  drawGrid(ctxDFS, pathGridDFS);
  mode = null;
};

function setStartMode() {
  mode = "start";
}

function setEndMode() {
  mode = "end";
}

function resetGrid() {
  pathGridBFS.fill(0);
  pathGridDFS.fill(0);
  mode = null;
  start = [0, 0];
  end = [cols - 1, rows - 1];
  bfsCountLabel.textContent = "0";
  dfsCountLabel.textContent = "0";
  drawGrid(ctxBFS, pathGridBFS);
  drawGrid(ctxDFS, pathGridDFS);
  bfsCountLabel.textContent = "0";
  dfsCountLabel.textContent = "0";
  bfsTimeLabel.textContent = "0";
  dfsTimeLabel.textContent = "0";
}

function runBFS() {
  pathGridBFS.fill(0);
  const bfs = Module.cwrap("bfs", "number", [
    "number", "number", "number", "number", "number",
    "number", "number", "number", "number"
  ]);

  const gridPtr = Module._malloc(grid.length * 4);
  const resultPtr = Module._malloc(grid.length * 4);
  const animPtr = Module._malloc(grid.length * 4);
  Module.HEAP32.set(grid, gridPtr >> 2);

  const startTime = performance.now();
  const animLen = bfs(gridPtr, rows, cols, start[0], start[1], end[0], end[1], resultPtr, animPtr);
  const endTime = performance.now();

  bfsCountLabel.textContent = animLen;
  bfsTimeLabel.textContent = (endTime - startTime).toFixed(6);

  const animArray = new Int32Array(Module.HEAP32.buffer, animPtr, animLen);
  const resultArray = new Int32Array(Module.HEAP32.buffer, resultPtr, grid.length);

  let i = 0;
  function animateStep() {
    if (i < animLen) {
      const idx = animArray[i];
      pathGridBFS[idx] = resultArray[idx];
      drawGrid(ctxBFS, pathGridBFS);
      i++;
      setTimeout(animateStep, 30);
    } else {
      drawGrid(ctxBFS, pathGridBFS);
      Module._free(gridPtr);
      Module._free(resultPtr);
      Module._free(animPtr);
    }
  }

  animateStep();
}


function runDFS() {
  pathGridDFS.fill(0);
  const dfs = Module.cwrap("dfs", "number", [
    "number", "number", "number", "number", "number",
    "number", "number", "number", "number"
  ]);

  const gridPtr = Module._malloc(grid.length * 4);
  const resultPtr = Module._malloc(grid.length * 4);
  const animPtr = Module._malloc(grid.length * 4);
  Module.HEAP32.set(grid, gridPtr >> 2);

  const startTime = performance.now();
  const animLen = dfs(gridPtr, rows, cols, start[0], start[1], end[0], end[1], resultPtr, animPtr);
  const endTime = performance.now();

  dfsCountLabel.textContent = animLen;
  dfsTimeLabel.textContent = (endTime - startTime).toFixed(6);

  const animArray = new Int32Array(Module.HEAP32.buffer, animPtr, animLen);
  const resultArray = new Int32Array(Module.HEAP32.buffer, resultPtr, grid.length);

  let i = 0;
  function animateStep() {
    if (i < animLen) {
      const idx = animArray[i];
      pathGridDFS[idx] = resultArray[idx];
      drawGrid(ctxDFS, pathGridDFS);
      i++;
      setTimeout(animateStep, 30);
    } else {
      drawGrid(ctxDFS, pathGridDFS);
      Module._free(gridPtr);
      Module._free(resultPtr);
      Module._free(animPtr);
    }
  }

  animateStep();
}

resetGrid();
