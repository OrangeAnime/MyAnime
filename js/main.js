// --- Bubble background animation ---
const canvas = document.getElementById('bg-bubbles');
const ctx = canvas.getContext('2d');
let bubbles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomColor() {
  const c = [
    '#c18aff', '#8e24aa', '#a020f0', '#6a1b9a', '#e040fb'
  ];
  return c[Math.floor(Math.random() * c.length)];
}

function createBubbles(n) {
  bubbles = [];
  for (let i = 0; i < n; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 32 + Math.random() * 52,
      s: 0.5 + Math.random() * 1.4,
      dx: (Math.random()-0.5)*0.6,
      dy: (Math.random()*0.7 + 0.2),
      color: randomColor(),
      alpha: 0.15 + Math.random() * 0.18
    });
  }
}
function animateBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let b of bubbles) {
    ctx.save();
    ctx.globalAlpha = b.alpha;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.closePath();
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 30;
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.restore();

    b.x += b.dx;
    b.y -= b.s * 0.6;
    if (b.y + b.r < 0) {
      b.y = canvas.height + b.r;
      b.x = Math.random() * canvas.width;
    }
    if (b.x < -b.r || b.x > canvas.width + b.r) {
      b.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(animateBubbles);
}
createBubbles(Math.floor(window.innerWidth / 120) + 16);
window.addEventListener('resize', ()=>createBubbles(Math.floor(window.innerWidth / 120) + 16));
animateBubbles();

// --- Core Anime site logic ---

const repoBaseUrl = 'https://raw.githubusercontent.com/OrangeAnime/MyAnime/main/';

const shows = [
  {
    name: "KissXSis",
    cover: `${repoBaseUrl}KissXSis/cover.jpg`,
    season: "Season1",
    episodes: 12
  }
  // You can add more shows here!
];

let currentShow = null;

function loadHomePage() {
  // Reset UI
  document.getElementById("home").style.display = "flex";
  document.getElementById("player-container").style.display = "none";
  document.getElementById("suggestions").style.display = "none";
  document.getElementById("search").value = "";

  const home = document.getElementById("home");
  home.innerHTML = ""; // Clear any previous shows

  shows.forEach(show => {
    const showCard = document.createElement("div");
    showCard.className = "show-card";

    const img = document.createElement("img");
    img.src = show.cover;
    img.alt = show.name;

    const title = document.createElement("h3");
    title.textContent = show.name;

    const info = document.createElement("p");
    info.textContent = `${show.season} – ${show.episodes} Episodes`;

    showCard.appendChild(img);
    showCard.appendChild(title);
    showCard.appendChild(info);
    showCard.onclick = () => loadPlayer(show);

    home.appendChild(showCard);
  });
}

function loadPlayer(show) {
  currentShow = show;
  document.getElementById("player-container").style.display = "block";
  document.getElementById("home").style.display = "none";
  document.getElementById("suggestions").style.display = "none";

  const title = document.getElementById("show-title");
  const episodeList = document.getElementById("episode-list");
  const video = document.getElementById("video-player");
  title.textContent = `${show.name} – ${show.season}`;
  episodeList.innerHTML = "";

  // Display episode buttons
  for (let i = 1; i <= show.episodes; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Episode ${i}`;
    btn.onclick = () => {
      Array.from(episodeList.children).forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      video.src = `${repoBaseUrl}${show.name}/${show.season}/Episode${i}.mp4`;
      video.load();
      video.play();
    };
    episodeList.appendChild(btn);
  }
  // Auto-play episode 1 for convenience
  episodeList.firstChild && episodeList.firstChild.click();
}

// --- Nav Home ---
document.getElementById("nav-home").onclick = loadHomePage;

// --- Search (stubbed for now) ---
const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
searchInput.oninput = function() {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 1) {
    suggestions.style.display = "none";
    return;
  }
  // For now, just filter shows by name.
  let filtered = shows.filter(show =>
    show.name.toLowerCase().includes(q)
  );
  suggestions.innerHTML = "";
  filtered.forEach(show => {
    const li = document.createElement("li");
    li.textContent = show.name;
    li.onclick = () => {
      suggestions.style.display = "none";
      loadPlayer(show);
    };
    suggestions.appendChild(li);
  });
  suggestions.style.display = filtered.length ? "block" : "none";
};
// Hide suggestions on blur
searchInput.onblur = () => setTimeout(()=>suggestions.style.display="none", 150);
searchInput.onfocus = () => {
  if (suggestions.children.length) suggestions.style.display = "block";
};

window.onload = loadHomePage;
