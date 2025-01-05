const canvas = document.getElementById('tspCanvas');
const ctx = canvas.getContext('2d');
const speedSlider = document.getElementById('speedSlider');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const currentPathDiv = document.getElementById('currentPath');
const resultsDiv = document.getElementById('results');

canvas.width = 600;
canvas.height = 600;

let points = [];
let isRunning = false;
let animationSpeed = 5;
let allPermutations = [];
let currentIndex = 0;
let labels = [];
let results = []; // Store all results

// Generate random points and assign labels
function generatePoints(numPoints) {
  points = Array.from({ length: numPoints }, () => ({
    x: Math.random() * (canvas.width - 40) + 20,
    y: Math.random() * (canvas.height - 40) + 20,
  }));
  labels = Array.from({ length: numPoints }, (_, i) => String.fromCharCode(65 + i));
}

// Draw points, all connections, and labels
function drawAllLines() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all lines connecting points
  points.forEach((p1, i) => {
    points.forEach((p2, j) => {
      if (i !== j) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = '#ddd';
        ctx.stroke();
      }
    });
  });

  // Draw points and labels
  points.forEach((point, i) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();

    // Draw labels
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(labels[i], point.x + 10, point.y - 10);
  });
}

// Highlight a path
function highlightPath(path, color = 'blue') {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.moveTo(points[path[0]].x, points[path[0]].y);

  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(points[path[i]].x, points[path[i]].y);
  }
  ctx.lineTo(points[path[0]].x, points[path[0]].y);
  ctx.stroke();
}

// Calculate distance of a path
function calculateDistance(path) {
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = points[path[i]];
    const b = points[path[i + 1]];
    distance += Math.hypot(a.x - b.x, a.y - b.y);
  }
  const start = points[path[0]];
  const end = points[path[path.length - 1]];
  distance += Math.hypot(start.x - end.x, start.y - end.y);
  return distance.toFixed(2);
}

// Update the current path output
function updateOutput(path, distance) {
  const pathString = path.map((i) => labels[i]).join(' → ');
  currentPathDiv.innerHTML = `
    <p><strong>Path:</strong> ${pathString}</p>
    <p><strong>Distance:</strong> ${distance}</p>
  `;
}

// Save and display the result in the results section
function saveResult(path, distance) {
  const pathString = path.map((i) => labels[i]).join(' → ');
  const result = `<p><strong>Path:</strong> ${pathString} | <strong>Distance:</strong> ${distance}</p>`;
  results.push(result);
  resultsDiv.innerHTML = results.join('');
}

// Generate permutations
function permute(array) {
  if (array.length <= 1) return [array];
  const permutations = [];
  for (let i = 0; i < array.length; i++) {
    const rest = array.slice(0, i).concat(array.slice(i + 1));
    const perms = permute(rest);
    perms.forEach((perm) => permutations.push([array[i], ...perm]));
  }
  return permutations;
}

// Animation loop
function animate() {
  if (!isRunning || currentIndex >= allPermutations.length) {
    isRunning = false;
    return;
  }

  drawAllLines(); // Draw all connections
  const currentPath = allPermutations[currentIndex];
  const distance = calculateDistance(currentPath);

  highlightPath(currentPath, 'blue'); // Highlight current path
  updateOutput(currentPath, distance); // Update current path output
  saveResult(currentPath, distance); // Save result to history

  currentIndex++;
  setTimeout(animate, 1000 / animationSpeed);
}

// Event listeners
startBtn.addEventListener('click', () => {
  if (isRunning) return;
  isRunning = true;

  generatePoints(5); // Set number of points
  drawAllLines();
  allPermutations = permute(points.map((_, i) => i));
  currentIndex = 0;
  results = []; // Clear previous results
  resultsDiv.innerHTML = ''; // Clear results display

  animate();
});

stopBtn.addEventListener('click', () => {
  isRunning = false;
});

speedSlider.addEventListener('input', (e) => {
  animationSpeed = parseInt(e.target.value, 10);
});
