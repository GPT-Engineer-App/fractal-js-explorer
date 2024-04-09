// Mandelbrot Set Calculation
function mandelbrot(c, maxIterations) {
  let z = { x: 0, y: 0 };
  let i;
  for (i = 0; i < maxIterations; i++) {
    if (z.x * z.x + z.y * z.y > 4) {
      break;
    }
    let temp = z.x * z.x - z.y * z.y + c.x;
    z.y = 2 * z.x * z.y + c.y;
    z.x = temp;
  }
  return i;
}

// Color Schemes
const colorSchemes = {
  rainbow: (iter, maxIter) => {
    let r = (Math.sin(0.05 * iter + 0) * 127 + 128) / 255;
    let g = (Math.sin(0.05 * iter + 2) * 127 + 128) / 255;
    let b = (Math.sin(0.05 * iter + 4) * 127 + 128) / 255;
    return [r, g, b];
  },
  grayscale: (iter, maxIter) => {
    let v = iter / maxIter;
    return [v, v, v];
  },
  fire: (iter, maxIter) => {
    let v = iter / maxIter;
    let r = v * 1.5;
    let g = v * 0.5;
    let b = v * 0.2;
    return [r, g, b];
  },
  ice: (iter, maxIter) => {
    let v = iter / maxIter;
    let r = v * 0.5;
    let g = v;
    let b = v * 1.5;
    return [r, g, b];
  },
};

// Render Mandelbrot Set
function render(canvas, maxIterations, colorScheme, x, y, scale) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(canvas.width, canvas.height);

  for (let py = 0; py < canvas.height; py++) {
    let y0 = y + (py - canvas.height / 2) * scale;
    for (let px = 0; px < canvas.width; px++) {
      let x0 = x + (px - canvas.width / 2) * scale;
      let iterations = mandelbrot({ x: x0, y: y0 }, maxIterations);
      let color = colorSchemes[colorScheme](iterations, maxIterations);
      let index = (py * canvas.width + px) * 4;
      imageData.data[index + 0] = color[0] * 255;
      imageData.data[index + 1] = color[1] * 255;
      imageData.data[index + 2] = color[2] * 255;
      imageData.data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Setup Web Worker
const worker = new Worker("worker.js");

worker.onmessage = function (e) {
  render(e.data.canvas, e.data.maxIterations, e.data.colorScheme, e.data.x, e.data.y, e.data.scale);
};

function startRender(canvas, maxIterations, colorScheme, x, y, scale) {
  worker.postMessage({ canvas, maxIterations, colorScheme, x, y, scale });
}
