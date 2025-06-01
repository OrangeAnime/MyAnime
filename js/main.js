const repoBaseUrl = 'https://raw.githubusercontent.com/OrangeAnime/MyAnime/main/';
const shows = [
  {
    name: "KissXSis",
    cover: `${repoBaseUrl}KissXSis/cover.jpg`,
    seasons: {
      Season1: 12
    }
  }
];

const episodeCounts = {
  KissXSis: {
    Season1: 12
  }
};

document.getElementById("search").addEventListener("input", function () {
  const input = this.value.toLowerCase();
  const suggestions = shows.filter(show => show.toLowerCase().includes(input));
  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = "";
  suggestions.forEach(show => {
    const li = document.createElement("li");
    li.textContent = show;
    li.onclick = () => loadShow(show);
    suggestionsList.appendChild(li);
  });
});

function loadShow(showName) {
  const show = shows.find(s => s.name === showName);
  if (!show) return;

  document.getElementById("home").style.display = "none";
  document.getElementById("player-container").style.display = "block";

  document.getElementById("show-title").innerText = show.name;
  const seasonList = document.getElementById("season-list");
  seasonList.innerHTML = "";

  const seasons = Object.keys(show.seasons || {});
  seasons.forEach(season => {
    const seasonBtn = document.createElement("button");
    seasonBtn.textContent = season;
    seasonBtn.onclick = () => loadSeason(show.name, season);
    seasonList.appendChild(seasonBtn);
  });

  document.getElementById("episode-list").innerHTML = "";
  document.getElementById("video-player").src = "";
  document.getElementById("suggestions").innerHTML = "";
}


function loadSeason(showName, seasonName) {
  const episodeList = document.getElementById("episode-list");
  const videoPlayer = document.getElementById("video-player");
  episodeList.innerHTML = "";

  const episodeCount = episodeCounts[showName][seasonName] || 0;

  for (let i = 1; i <= episodeCount; i++) {
    const episodeButton = document.createElement("button");
    episodeButton.textContent = "Episode " + i;
    episodeButton.onclick = () => {
      videoPlayer.src = `${repoBaseUrl}${showName}/${seasonName}/Episode${i}.mp4`;
      videoPlayer.load();
      videoPlayer.play();
    };
    episodeList.appendChild(episodeButton);
  }
}

function loadHomePage() {
  const home = document.getElementById("home");
  home.innerHTML = ""; // Clear previous

  shows.forEach(show => {
    const showCard = document.createElement("div");
    showCard.className = "show-card";

    const img = document.createElement("img");
    img.src = show.cover;
    img.alt = show.name;

    const title = document.createElement("h3");
    title.textContent = show.name;

    const episodeCount = Object.values(show.seasons).reduce((a, b) => a + b, 0);
    const epInfo = document.createElement("p");
    epInfo.textContent = `${Object.keys(show.seasons).length} season(s), ${episodeCount} episode(s)`;

    showCard.appendChild(img);
    showCard.appendChild(title);
    showCard.appendChild(epInfo);

    showCard.onclick = () => loadShow(show.name);

    home.appendChild(showCard);
  });
}

window.onload = loadHomePage;

