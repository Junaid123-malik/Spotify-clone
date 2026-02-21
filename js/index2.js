console.log("Lets write JavaScript");
let songs = [];
let currfolder;
let currentIndex = 0;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
}

let currentSong = new Audio();

async function getsongs(folder) {
  currfolder = folder;
  try {
    let response = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let html = await response.text();
    
    // Parse HTML to extract song files
    let div = document.createElement("div");
    div.innerHTML = html;
    let links = div.querySelectorAll("a");
    songs = [];
    
    for (let link of links) {
      if (link.href.endsWith(".mp3")) {
        songs.push(link.href.split(`/${folder}/`)[1]);
      }
    }
    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

function playmusic(track, pause = false) {
  currentSong.src = `http://127.0.0.1:3000/${currfolder}/${track}`;
  if (!pause) {
    currentSong.play();
    document.getElementById("play").src = "img/pause.svg";
  }
  
  // Update current song display
  document.querySelector(".songinfo").innerHTML = track;
}

async function displayalbums() {
  const cardcontainer = document.querySelector(".cardcontainer");
  
  try {
    let response = await fetch(`http://127.0.0.1:3000/songs/`);
    let html = await response.text();
    
    let div = document.createElement("div");
    div.innerHTML = html;
    let links = div.querySelectorAll("a");
    
    for (let link of links) {
      let folder = link.href.split("/").slice(-2)[0];
      if (folder.startsWith("ncs") || folder === "csharks" || folder === "arijit") {
        try {
          let response = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
          let data = await response.json();
          
          cardcontainer.insertAdjacentHTML(
            "beforeend",
            `
            <div data-folder="${folder}" class="card js-card">
              <div class="play">
                <img src="img/play.svg" alt="">
              </div>
              <img src="http://127.0.0.1:3000/songs/${folder}/cover.jpg" alt="">
              <h2>${data.title}</h2>
              <p>${data.description}</p>
            </div>
            `
          );
        } catch (error) {
          console.error(`Error loading album ${folder}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error displaying albums:", error);
  }
}

// Initialize Controls
function initializeControls() {
  const play = document.getElementById("play");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  const hamburger = document.querySelector(".hamburger");
  const close = document.querySelector(".close");
  const volumeSlider = document.querySelector(".range input");
  const volumeIcon = document.querySelector(".volume>img");
  const seekbar = document.querySelector(".seekbar");

  // Play/Pause
  if (play) {
    play.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play();
        play.src = "img/pause.svg";
      } else {
        currentSong.pause();
        play.src = "img/play1.svg";
      }
    });
  }

  // Time update
  currentSong.addEventListener("timeupdate", () => {
    const songtime = document.querySelector(".songtime");
    const circle = document.querySelector(".circle");
    
    if (songtime) {
      songtime.innerHTML =
        `${secondsToMinutesSeconds(currentSong.currentTime)}/` +
        `${secondsToMinutesSeconds(currentSong.duration)}`;
    }
    if (circle && !isNaN(currentSong.duration)) {
      circle.style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
    }
  });

  // Seekbar
  if (seekbar) {
    seekbar.addEventListener("click", e => {
      const circle = document.querySelector(".circle");
      let percent = (e.offsetX / seekbar.getBoundingClientRect().width) * 100;
      if (circle) circle.style.left = percent + "%";
      currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
  }

  // Hamburger menu
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      document.querySelector(".left").style.left = "0";
    });
  }

  if (close) {
    close.addEventListener("click", () => {
      document.querySelector(".left").style.left = "-120%";
    });
  }

  // Previous
  if (previous) {
    previous.addEventListener("click", () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
      playmusic(songs[currentIndex]);
    });
  }

  // Next
  if (next) {
    next.addEventListener("click", () => {
      currentIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
      playmusic(songs[currentIndex]);
    });
  }

  // Volume slider
  function updateVolumeColor(value) {
    if (volumeSlider) {
      volumeSlider.style.background =
        `linear-gradient(to right, #f88c0f ${value}%, black ${value}%)`;
    }
  }

  if (volumeSlider) {
    updateVolumeColor(volumeSlider.value);
    volumeSlider.addEventListener("input", e => {
      const value = e.target.value;
      currentSong.volume = value / 100;
      if (volumeIcon) {
        volumeIcon.src = value == 0 ? "img/mute.svg" : "img/volume.svg";
      }
      updateVolumeColor(value);
    });
  }

  // Volume icon mute toggle
  if (volumeIcon) {
    volumeIcon.addEventListener("click", () => {
      if (currentSong.volume > 0) {
        currentSong.volume = 0;
        if (volumeSlider) volumeSlider.value = 0;
        volumeIcon.src = "img/mute.svg";
        updateVolumeColor(0);
      } else {
        currentSong.volume = 0.1;
        if (volumeSlider) volumeSlider.value = 10;
        volumeIcon.src = "img/volume.svg";
        updateVolumeColor(10);
      }
    });
  }
}

// Card click handler
document.querySelector(".cardcontainer").addEventListener("click", async (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const folder = card.dataset.folder;
  if (!folder) return;

  songs = await getsongs(`songs/${folder}`);
  if (songs.length > 0) {
    playmusic(songs[0]);
  }
});

// Main function
async function main() {
  await getsongs("songs/ncs");
  if (songs.length > 0) {
    playmusic(songs[0], true);
  }
  await displayalbums();
}

// Initialize
initializeControls();
main();