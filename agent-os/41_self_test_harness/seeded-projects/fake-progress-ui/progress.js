// SEEDED DEFECT: fake progress - timer only, no real work units
// Expected detection: fake-progress domain

let progress = 0;

// This is a fake progress pattern: setInterval drives progress, not real work
const interval = setInterval(() => {
  progress += 10;
  updateProgressBar(progress);
  if (progress >= 100) {
    clearInterval(interval);
  }
}, 100);

function updateProgressBar(value) {
  const bar = document.getElementById('progress');
  if (bar) bar.style.width = value + '%';
}
