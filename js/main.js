const repoBaseUrl = 'https://raw.githubusercontent.com/OrangeAnime/MyAnime/main/';

const shows = ["testicle"]; // Your folders

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
  const episodeList = document.getElementById("episode-list");
  const videoPlayer = document.getElementById("video-player");
  episodeList.innerHTML = "";
  const episodeCount = 5; // You can customize this

  for (let i = 1; i <= episodeCount; i++) {
    const episodeButton = document.createElement("button");
    episodeButton.textContent = "Episode " + i;
    episodeButton.onclick = () => {
      videoPlayer.src = `${repoBaseUrl}${showName}/Episode${i}.mp4`;
      videoPlayer.load();
      videoPlayer.play();
    };
    episodeList.appendChild(episodeButton);
  }

  document.getElementById("suggestions").innerHTML = "";
}
