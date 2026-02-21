console.log("Lets write JavaScript");
let songs;
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
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  /* Controls */
  const play = document.getElementById("play");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  const hamburger = document.querySelector(".hamburger");
  const close = document.querySelector(".close");
  const volumeSlider = document.querySelector(".range input");
  const volumeIcon = document.querySelector(".volume>img");

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

  const seekbar = document.querySelector(".seekbar");
  if (seekbar) {
    seekbar.addEventListener("click", e => {
      const circle = document.querySelector(".circle");
      let percent =
        (e.offsetX / seekbar.getBoundingClientRect().width) * 100;
      if (circle) circle.style.left = percent + "%";
      currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
  }

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
  if (previous) {
    previous.addEventListener("click", () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
      playmusic(songs[currentIndex]);
    });
  }
  if (next) {
    next.addEventListener("click", () => {
      currentIndex =
        currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
      playmusic(songs[currentIndex]);
    });
  }

  function updateVolumeColor(value) {
    volumeSlider.style.background =
      `linear-gradient(to right, #f88c0f ${value}%, black ${value}%)`;
  }
  if (volumeSlider) {
    updateVolumeColor(volumeSlider.value);
    volumeSlider.addEventListener("input", e => {
      const value = e.target.value;
      currentSong.volume = value / 100;
      if (volumeIcon)
        volumeIcon.src = value == 0 ? "img/mute.svg" : "img/volume.svg";
      updateVolumeColor(value);
    });
  }
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

  main();

    const data = await res.json();

    cardcontainer.insertAdjacentHTML(
      "beforeend",
      `
      <div data-folder="${folder}" class="card js-card">
        <div class="play">
          <img src="img/play.svg" alt="">
        </div>
        <img src="/songs/${folder}/cover.jpg" alt="">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
      </div>
      `
    );
  }

document.querySelector(".cardcontainer").addEventListener("click", async (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const folder = card.dataset.folder;
  if (!folder) return;

  songs = await getsongs(`songs/${folder}`);
  playmusic(songs[0])
});

async function main() {
   await getsongs("songs/ncs");
  playmusic(songs[0], true);
   displayalbums();
}

/* Controls */
play.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    play.src = "img/pause.svg";
  } else {
    currentSong.pause();
    play.src = "img/play1.svg";
  }
});
currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML =
    `${secondsToMinutesSeconds(currentSong.currentTime)}/` +
    `${secondsToMinutesSeconds(currentSong.duration)}`;
  if (!isNaN(currentSong.duration)) {
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  }
});
document.querySelector(".seekbar").addEventListener("click", e => {
let percent =
(e.offsetX / e.target.getBoundingClientRect().width) * 100;
document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;
});
document.querySelector(".hamburger").addEventListener("click", () => {
document.querySelector(".left").style.left = "0";
});
document.querySelector(".close").addEventListener("click", () => {
document.querySelector(".left").style.left = "-120%";
});
previous.addEventListener("click", () => {
currentIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
playmusic(songs[currentIndex]);
});
next.addEventListener("click", () => {
currentIndex =
currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
playmusic(songs[currentIndex]);
});


const volumeSlider = document.querySelector(".range input");
const volumeIcon = document.querySelector(".volume>img");
function updateVolumeColor(value) {
  volumeSlider.style.background =
    `linear-gradient(to right, #f88c0f ${value}%, black ${value}%)`;
}
updateVolumeColor(volumeSlider.value);
volumeSlider.addEventListener("input", e => {
  const value = e.target.value;
  currentSong.volume = value / 100;
  

  volumeIcon.src = value == 0 ? "img/mute.svg" : "img/volume.svg";
    updateVolumeColor(value);
});

volumeIcon.addEventListener("click", () => {
  if (currentSong.volume > 0) {
    currentSong.volume = 0;
    volumeSlider.value = 0;
    volumeIcon.src = "img/mute.svg";
     updateVolumeColor(0);
  } else {
    currentSong.volume = 0.1;
    volumeSlider.value = 10;
    volumeIcon.src = "img/volume.svg";
     updateVolumeColor(10);
  }
 
 
});






main();
