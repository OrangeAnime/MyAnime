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
    '#c18aff', '#8e24aa', '#a020f0', '#6a1b9a', '#e040fb', "#1a002b", "#23232d"
  ];
  return c[Math.floor(Math.random() * c.length)];
}

function createBubbles(n) {
  bubbles = [];
  for (let i = 0; i < n; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 36 + Math.random() * 70,
      s: 0.6 + Math.random() * 1.5,
      dx: (Math.random()-0.5)*0.7,
      dy: (Math.random()*0.9 + 0.3),
      color: randomColor(),
      alpha: 0.16 + Math.random() * 0.21
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
    ctx.shadowBlur = 44;
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.restore();

    b.x += b.dx;
    b.y -= b.s * 0.58;
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
createBubbles(Math.floor(window.innerWidth / 95) + 22);
window.addEventListener('resize', ()=>createBubbles(Math.floor(window.innerWidth / 95) + 22));
animateBubbles();

// --- Core Anime site logic ---

const shows = [
  {
    name: "KissXSis",
    cover: "https://raw.githubusercontent.com/OrangeAnime/MyAnime/main/KissXSis/cover.jpg",
    seasons: [
      { name: "Season1", episodes: 12 }
    ]
  }
  // Add more shows here as needed
];

let currentShow = null;
let currentSeasonIdx = 0;

// Utility to show/hide sections
function showSection(section) {
  document.getElementById("welcome-message").style.display = section === "welcome" ? "block" : "none";
  document.getElementById("home").style.display = section === "shows" ? "flex" : "none";
  document.getElementById("search").style.display = section === "shows" ? "block" : "none";
  document.getElementById("manga-section").style.display = section === "manga" ? "flex" : "none";
  document.getElementById("player-container").style.display = "none";
  // Set active nav
  document.getElementById("nav-home").classList.toggle("active", section === "welcome");
  document.getElementById("nav-shows").classList.toggle("active", section === "shows");
  document.getElementById("nav-manga").classList.toggle("active", section === "manga");
}

// Shows grid
function loadHomePage() {
  showSection("shows");
  document.getElementById("suggestions").style.display = "none";
  document.getElementById("search").value = "";

  const home = document.getElementById("home");
  home.innerHTML = "";

  shows.forEach(show => {
    const showCard = document.createElement("div");
    showCard.className = "show-card";

    const img = document.createElement("img");
    img.src = show.cover;
    img.alt = show.name;

    const title = document.createElement("h3");
    title.textContent = show.name;

    const totalEpisodes = show.seasons.reduce((a, s) => a + s.episodes, 0);
    const info = document.createElement("p");
    info.textContent = show.seasons.length > 1
      ? `${show.seasons.length} Seasons – ${totalEpisodes} Episodes`
      : `${show.seasons[0].name} – ${show.seasons[0].episodes} Episodes`;

    showCard.appendChild(img);
    showCard.appendChild(title);
    showCard.appendChild(info);
    showCard.onclick = () => loadPlayer(show, 0);

    home.appendChild(showCard);
  });
}

// Home (welcome) tab
function showWelcome() {
  showSection("welcome");
}

// Manga tab: fetch and display manga from MangaDex via CORS proxy
async function showManga() {
  showSection("manga");
  const mangaSection = document.getElementById("manga-section");
  mangaSection.innerHTML = `<div style="color:#b98aff;font-size:1.4em;">Loading manga from MangaDex...</div>`;

  // Use a public CORS proxy for development/preview (do NOT use for production)
  const apiUrl = "https://api.mangadex.org/manga?limit=18&order[followedCount]=desc&includes[]=cover_art&availableTranslatedLanguage[]=en";
  const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(apiUrl);

  try {
    const resp = await fetch(proxyUrl);
    if (!resp.ok) {
      mangaSection.innerHTML = `<div style="color:#b98aff;font-size:1.4em;">Failed to fetch: ${resp.status}</div>`;
      return;
    }
    const data = await resp.json();
    if (!data.data || !data.data.length) {
      mangaSection.innerHTML = `<div style="color:#b98aff;font-size:1.4em;">No manga found.</div>`;
      return;
    }
    // Build the manga grid
    const grid = document.createElement("div");
    grid.style.display = "flex";
    grid.style.flexWrap = "wrap";
    grid.style.justifyContent = "center";
    grid.style.gap = "28px";
    grid.style.margin = "30px auto";
    data.data.forEach(manga => {
      const coverRel = manga.relationships.find(r => r.type === "cover_art");
      const coverId = coverRel?.attributes?.fileName;
      const mangaId = manga.id;
      const coverUrl = coverId
        ? `https://uploads.mangadex.org/covers/${mangaId}/${coverId}.256.jpg`
        : "https://mangadex.org/img/avatar.png";
      const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "Untitled";

      const card = document.createElement("div");
      card.style.background = "linear-gradient(120deg,#220046 20%,#a020f099 100%)";
      card.style.borderRadius = "22px";
      card.style.boxShadow = "0 0 50px #a020f077,0 2px 16px #2a0050cc";
      card.style.padding = "12px 12px 10px 12px";
      card.style.width = "170px";
      card.style.cursor = "pointer";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.alignItems = "center";
      card.style.transition = "transform 0.22s cubic-bezier(.5,2,.5,1), box-shadow 0.2s";
      card.style.border = "2px solid #ad47f250";
      card.onmouseover = () => card.style.transform = "scale(1.045) translateY(-6px)";
      card.onmouseleave = () => card.style.transform = "";
      card.onclick = () => window.open(`https://mangadex.org/title/${mangaId}`, "_blank");

      const img = document.createElement("img");
      img.src = coverUrl;
      img.alt = title;
      img.style.width = "100%";
      img.style.borderRadius = "13px";
      img.style.marginBottom = "14px";
      img.style.boxShadow = "0 0 20px #ad47f244,0 2px 8px #2a005022";
      card.appendChild(img);

      const h3 = document.createElement("h3");
      h3.style.color = "#e6ccff";
      h3.style.margin = "0 0 7px 0";
      h3.style.fontSize = "1em";
      h3.style.textShadow = "0 0 7px #c18aff99";
      h3.style.textAlign = "center";
      h3.textContent = title.length > 40 ? title.slice(0, 37) + "..." : title;
      card.appendChild(h3);

      grid.appendChild(card);
    });
    mangaSection.innerHTML = "";
    mangaSection.appendChild(grid);
  } catch (e) {
    mangaSection.innerHTML = `<div style="color:#b98aff;font-size:1.4em;">Failed to load MangaDex data :(</div>`;
  }
}

// Player with seasons
function loadPlayer(show, seasonIdx = 0) {
  currentShow = show;
  currentSeasonIdx = seasonIdx;

  document.getElementById("player-container").style.display = "block";
  document.getElementById("home").style.display = "none";
  document.getElementById("welcome-message").style.display = "none";
  document.getElementById("manga-section").style.display = "none";
  document.getElementById("suggestions").style.display = "none";
  document.getElementById("search").style.display = "none";

  const title = document.getElementById("show-title");
  const episodeList = document.getElementById("episode-list");
  const video = document.getElementById("video-player");
  const seasonList = document.getElementById("season-list");

  // Always show the season select button(s)
  seasonList.innerHTML = "";
  show.seasons.forEach((season, idx) => {
    const btn = document.createElement("button");
    btn.className = "season-btn" + (idx === currentSeasonIdx ? " active" : "");
    btn.textContent = season.name.replace(/([a-zA-Z])(\d)/, "$1 $2"); // "Season1" -> "Season 1"
    btn.onclick = () => {
      if (currentSeasonIdx !== idx) {
        loadPlayer(show, idx);
      }
    };
    seasonList.appendChild(btn);
  });

  const currentSeason = show.seasons[currentSeasonIdx];
  title.textContent = `${show.name} – ${currentSeason.name.replace(/([a-zA-Z])(\d)/, "$1 $2")}`;
  episodeList.innerHTML = "";

  for (let i = 1; i <= currentSeason.episodes; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Episode ${i}`;
    btn.onclick = () => {
      Array.from(episodeList.children).forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      video.src = `https://raw.githubusercontent.com/OrangeAnime/MyAnime/main/${show.name}/${currentSeason.name}/Episode${i}.mp4`;
      video.load();
      video.play();
    };
    episodeList.appendChild(btn);
  }
  // Auto-play episode 1 for convenience
  episodeList.firstChild && episodeList.firstChild.click();
}

// --- Nav ---
document.getElementById("nav-home").onclick = showWelcome;
document.getElementById("nav-shows").onclick = loadHomePage;
document.getElementById("nav-manga").onclick = showManga;

// --- Search logic ---
const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
searchInput.oninput = function() {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 1) {
    suggestions.style.display = "none";
    return;
  }
  // Filter shows by name.
  let filtered = shows.filter(show =>
    show.name.toLowerCase().includes(q)
  );
  suggestions.innerHTML = "";
  filtered.forEach(show => {
    const li = document.createElement("li");
    li.textContent = show.name;
    li.onclick = () => {
      suggestions.style.display = "none";
      loadPlayer(show, 0);
    };
    suggestions.appendChild(li);
  });
  suggestions.style.display = filtered.length ? "block" : "none";
};
searchInput.onblur = () => setTimeout(()=>suggestions.style.display="none", 150);
searchInput.onfocus = () => {
  if (suggestions.children.length) suggestions.style.display = "block";
};

window.onload = showWelcome;
