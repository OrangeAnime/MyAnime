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
  document.getElementById("show-title").innerText = showName;
  const seasonList = document.getElementById("season-list");
  seasonList.innerHTML = "";

  const seasons = Object.keys(episodeCounts[showName] || {});
  seasons.forEach(season => {
    const seasonBtn = document.createElement("button");
    seasonBtn.textContent = season;
    seasonBtn.onclick = () => loadSeason(showName, season);
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
