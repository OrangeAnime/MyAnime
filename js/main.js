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
    seasons: [ { name: "Season1", episodes: 12 } ]
  }
  // Add more shows here as needed
];

let currentShow = null;
let currentSeasonIdx = 0;

function showSection(section) {
  document.getElementById("welcome-message").style.display = section === "welcome" ? "block" : "none";
  document.getElementById("home").style.display = section === "shows" ? "flex" : "none";
  document.getElementById("search").style.display = section === "shows" ? "block" : "none";
  document.getElementById("manga-section").style.display = section === "manga" ? "flex" : "none";
  document.getElementById("player-container").style.display = "none";
  document.getElementById("nav-home").classList.toggle("active", section === "welcome");
  document.getElementById("nav-shows").classList.toggle("active", section === "shows");
  document.getElementById("nav-manga").classList.toggle("active", section === "manga");
}

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

function showWelcome() {
  showSection("welcome");
}

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

  seasonList.innerHTML = "";
  show.seasons.forEach((season, idx) => {
    const btn = document.createElement("button");
    btn.className = "season-btn" + (idx === currentSeasonIdx ? " active" : "");
    btn.textContent = season.name.replace(/([a-zA-Z])(\d)/, "$1 $2");
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
  episodeList.firstChild && episodeList.firstChild.click();
}

// --- MangaDex Search & Grid with Reliable Covers (with fallback API call) ---

function renderMangaSearchBar(onSearch) {
  let searchBar = document.getElementById("manga-search-bar");
  if (!searchBar) {
    searchBar = document.createElement("input");
    searchBar.id = "manga-search-bar";
    searchBar.type = "text";
    searchBar.placeholder = "Search manga on MangaDex...";
    searchBar.autocomplete = "off";
    searchBar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onSearch(searchBar.value);
    });
    searchBar.addEventListener("input", (e) => {
      if (!searchBar.value.trim()) onSearch("");
    });
    document.getElementById("manga-section").prepend(searchBar);
  }
  return searchBar;
}

async function fetchManga(query) {
  const base = "https://api.mangadex.org/manga";
  const params = [
    "limit=18",
    "includes[]=cover_art",
    "availableTranslatedLanguage[]=en",
    "order[followedCount]=desc"
  ];
  if (query) params.push("title=" + encodeURIComponent(query.trim()));
  const apiUrl = `${base}?${params.join("&")}`;
  const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(apiUrl);
  const resp = await fetch(proxyUrl);
  if (!resp.ok) throw new Error("Fetch failed");
  return await resp.json();
}

async function getMangaCoverUrl(manga) {
  // Try to get from relationships first
  const rel = (manga.relationships||[]).find(r => r.type === "cover_art" && r.attributes && r.attributes.fileName);
  if (rel) {
    return `https://uploads.mangadex.org/covers/${manga.id}/${rel.attributes.fileName}.256.jpg`;
  }
  // Fallback: fetch from /cover API
  try {
    const resp = await fetch("https://corsproxy.io/?" + encodeURIComponent(`https://api.mangadex.org/cover?manga[]=${manga.id}`));
    if (!resp.ok) return "https://mangadex.org/img/avatar.png";
    const data = await resp.json();
    if (data.data && data.data.length && data.data[0].attributes && data.data[0].attributes.fileName) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${data.data[0].attributes.fileName}.256.jpg`;
    }
  } catch (e) {}
  return "https://mangadex.org/img/avatar.png";
}

async function showManga(query="") {
  showSection("manga");
  const mangaSection = document.getElementById("manga-section");
  mangaSection.innerHTML = ""; // clear previous
  renderMangaSearchBar(q => showManga(q));
  const resultMsg = document.createElement("div");
  resultMsg.style = "color:#b98aff;font-size:1.4em;";
  resultMsg.textContent = query ? `Searching "${query}"...` : "Loading manga from MangaDex...";
  mangaSection.appendChild(resultMsg);

  try {
    const data = await fetchManga(query);
    if (!data.data || !data.data.length) {
      resultMsg.textContent = "No manga found.";
      return;
    }
    resultMsg.remove();

    const grid = document.createElement("div");
    grid.className = "manga-grid";
    // Async load covers
    await Promise.all(data.data.map(async manga => {
      const mangaId = manga.id;
      const coverUrl = await getMangaCoverUrl(manga);
      const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "Untitled";

      const card = document.createElement("div");
      card.className = "manga-card";
      card.onclick = () => window.open(`https://mangadex.org/title/${mangaId}`, "_blank");

      const img = document.createElement("img");
      img.src = coverUrl;
      img.alt = title;
      img.onerror = function() { this.src = "https://mangadex.org/img/avatar.png"; };
      card.appendChild(img);

      const h3 = document.createElement("h3");
      h3.textContent = title.length > 40 ? title.slice(0, 37) + "..." : title;
      card.appendChild(h3);

      grid.appendChild(card);
    }));
    mangaSection.appendChild(grid);
  } catch (e) {
    resultMsg.textContent = "Failed to load MangaDex data :(";
  }
}

// --- Nav ---
document.getElementById("nav-home").onclick = showWelcome;
document.getElementById("nav-shows").onclick = loadHomePage;
document.getElementById("nav-manga").onclick = () => showManga("");

// --- Search logic for anime shows ---
const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
searchInput.oninput = function() {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 1) {
    suggestions.style.display = "none";
    return;
  }
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
