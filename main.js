const canvas = document.getElementById("canvas");
const toggleSettingsBtn = document.getElementById("toggle-settings");
const settingsPanel = document.getElementById("settings-panel");
const maxIterationsInput = document.getElementById("max-iterations");
const colorSchemeSelect = document.getElementById("color-scheme");
const zoomSpeedInput = document.getElementById("zoom-speed");
const resetBtn = document.getElementById("reset-fractal");
const coordsDiv = document.getElementById("coords");

let x = -0.5;
let y = 0;
let scale = 0.007;
let maxIterations = 100;
let colorScheme = "rainbow";
let zoomSpeed = 1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dragging = false;
let lastX, lastY;

canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    let deltaX = (e.clientX - lastX) * scale;
    let deltaY = (e.clientY - lastY) * scale;
    x -= deltaX;
    y += deltaY;
    lastX = e.clientX;
    lastY = e.clientY;
    requestAnimationFrame(() => {
      startRender(canvas, maxIterations, colorScheme, x, y, scale);
    });
  }
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
});

canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    let zoom = Math.exp(-e.deltaY * 0.001 * zoomSpeed);
    let pointX = (e.clientX - canvas.width / 2) * scale + x;
    let pointY = (e.clientY - canvas.height / 2) * scale + y;
    x = pointX - (e.clientX - canvas.width / 2) * scale * zoom;
    y = pointY - (e.clientY - canvas.height / 2) * scale * zoom;
    scale *= zoom;
    requestAnimationFrame(() => {
      startRender(canvas, maxIterations, colorScheme, x, y, scale);
    });
  },
  { passive: false },
);

toggleSettingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("translate-x-full");
});

maxIterationsInput.addEventListener("change", (e) => {
  maxIterations = parseInt(e.target.value);
  requestAnimationFrame(() => {
    startRender(canvas, maxIterations, colorScheme, x, y, scale);
  });
});

colorSchemeSelect.addEventListener("change", (e) => {
  colorScheme = e.target.value;
  requestAnimationFrame(() => {
    startRender(canvas, maxIterations, colorScheme, x, y, scale);
  });
});

zoomSpeedInput.addEventListener("input", (e) => {
  zoomSpeed = parseFloat(e.target.value);
});

resetBtn.addEventListener("click", () => {
  x = -0.5;
  y = 0;
  scale = 0.007;
  requestAnimationFrame(() => {
    startRender(canvas, maxIterations, colorScheme, x, y, scale);
  });
});

function updateCoords() {
  coordsDiv.textContent = `X: ${x.toFixed(3)}, Y: ${y.toFixed(3)}, Scale: ${scale.toExponential(2)}`;
}

function loop() {
  updateCoords();
  requestAnimationFrame(loop);
}

startRender(canvas, maxIterations, colorScheme, x, y, scale);
loop();
