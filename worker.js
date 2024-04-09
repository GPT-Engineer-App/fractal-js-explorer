onmessage = function (e) {
  const { canvas, maxIterations, colorScheme, x, y, scale } = e.data;
  postMessage({ canvas, maxIterations, colorScheme, x, y, scale });
};
