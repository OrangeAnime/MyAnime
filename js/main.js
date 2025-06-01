const repoBaseUrl = 'https://raw.githubusercontent.com/OrangeAnime/MyAnime/main/';
const show = {
  name: "KissXSis",
  cover: `${repoBaseUrl}KissXSis/cover.jpg`,
  season: "Season1",
  episodes: 12
};

function loadHomePage() {
  const home = document.getElementById("home");

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
}

function loadPlayer(show) {
  document.getElementById("player-container").style.display = "block";
  document.getElementById("home").style.display = "none";

  const title = document.getElementById("show-title");
  const episodeList = document.getElementById("episode-list");
  const video = document.getElementById("video-player");

  title.textContent = `${show.name} – ${show.season}`;
  episodeList.innerHTML = "";

  for (let i = 1; i <= show.episodes; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Episode ${i}`;
    btn.onclick = () => {
      video.src = `${repoBaseUrl}${show.name}/${show.season}/Episode${i}.mp4`;
      video.load();
      video.play();
    };
    episodeList.appendChild(btn);
  }
}

window.onload = loadHomePage;
