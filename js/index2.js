
let songs        = [];
let currfolder   = "";
let currentIndex = 0;
const currentSong = new Audio();

const playBtn       = document.getElementById("play");
const previousBtn   = document.getElementById("previous");
const nextBtn       = document.getElementById("next");
const hamburger     = document.querySelector(".hamburger");
const closeBtn      = document.querySelector(".close");
const seekbar       = document.querySelector(".seekbar");
const circle        = document.querySelector(".circle");
const songtimeEl    = document.querySelector(".songtime");
const songinfoEl    = document.querySelector(".songinfo");
const cardcontainer = document.querySelector(".cardcontainer");
const volumeSlider  = document.querySelector(".range input");
const volumeIcon    = document.querySelector(".volume > img");
const naatUL        = document.querySelector(".naatlist ul");

const ALBUMS = [
  {
    folder      : "cs",          
    title       : " Naats 2026",
    description : "Cover Naats for u",
  
    songs       : [
      "aye-hasnain-ke-nana.mp3",
      "chal-deen-ki-tabligh-main.mp3",
      "kabaay-ki-ronaq-kabay-ka-manzar.mp3",
     ,"kabaay-ki-ronaq-kabay-ka-manzar.mp3", 
    ]
  },
  {
    folder      : "ncs",          
    title       : "Copyright Naats",
    description : "Naats for u",
    songs       : [
      "chal-deen-ki-tabligh.mp3", "mera-dil-badal-de.mp3",
    ]
  },
  {
    folder      : "j.jamshed",    
    title       : "Junaid Jamshed 2016",
    description : "Naats for u",
    songs       : []              
  },
  {
    folder      : "owais",      
    title       : "Owais Raza Qadri 2026",
    description : "Naats for u",
    songs       : []
  },
  {
    folder      : "Siddiq",      
    title       : "Siddiq Ismail 2026",
    description : "Naats for u",
    songs       : []
  }
];


function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

function updateVolumeColor(value) {
  volumeSlider.style.background =
    `linear-gradient(to right, #f88c0f ${value}%, #555 ${value}%)`;
}

function cleanName(filename) {
  return filename
    .replace(/\.mp3$/i, "")
    .replaceAll("-", " ")
    .replaceAll("%20", " ")
    .replace(/\b\w/g, c => c.toUpperCase()); 
}


function populateSidebar(songList, folder) {
  naatUL.innerHTML = "";

  if (!songList || songList.length === 0) {
    naatUL.innerHTML = `
      <li style="color:#888;padding:12px;list-style:none;text-align:center;">
        No songs in this album yet.
      </li>`;
    return;
  }

  const albumData = ALBUMS.find(a => a.folder === folder);
  const artist    = albumData ? albumData.title : cleanName(folder);

  songList.forEach((song, idx) => {
    naatUL.innerHTML += `
      <li data-index="${idx}">
        <img class="invert" width="34" src="img/music.svg" alt="">
        <div class="info">
          <div class="songname">${cleanName(song)}</div>
          <div class="artistname">${artist}</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <svg class="playnow-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" fill="#1d1a1b" stroke="#161315" stroke-width="1"/>
            <path d="M13 10.5V21.5L22 16L13 10.5Z" fill="white"/>
          </svg>
        </div>
      </li>`;
  });

  naatUL.querySelectorAll("li[data-index]").forEach(li => {
    li.addEventListener("click", () => {
      currentIndex = parseInt(li.dataset.index);
      playMusic(songs[currentIndex]);
    });
  });
}

function highlightActive() {
  naatUL.querySelectorAll("li[data-index]").forEach(li => {
    li.style.background =
      parseInt(li.dataset.index) === currentIndex ? "#1db95433" : "";
  });
}

function playMusic(track, pause = false) {
  if (!track) return;


  currentSong.src = `songs/${currfolder}/` + track;

  songinfoEl.innerHTML = `
    <div style="font-weight:bold;font-size:14px;">${cleanName(track)}</div>`;

  highlightActive();

  playBtn.style.filter = "invert(1)"; 

  if (!pause) {
    currentSong.play()
      .then(() => {
        playBtn.src = "img/pause.svg";  
      })
      .catch(err => console.warn("Playback error:", err));
  } else {
    playBtn.src = "img/play1.svg";     
  }
}


function loadAlbum(album) {
  currfolder = album.folder;
  songs      = album.songs;
  populateSidebar(songs, album.folder);
}


function displayAlbums() {
  cardcontainer.innerHTML = "";
  ALBUMS.forEach(album => {
    cardcontainer.insertAdjacentHTML(
      "beforeend",
      `<div data-folder="${album.folder}" class="card js-card">
        <div class="play">
          <img src="img/play.svg" alt="">
        </div>
        <img
          src="songs/${album.folder}/cover.jpg"
          onerror="this.src='img/music.svg'; this.style.padding='30px';"
          alt="${album.title}">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      </div>`
    );
  });
}


cardcontainer.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const album = ALBUMS.find(a => a.folder === card.dataset.folder);
  if (!album) return;

  loadAlbum(album);
  currentIndex = 0;
  if (songs.length > 0) {
    playMusic(songs[0]);
  }
});


playBtn.addEventListener("click", () => {
  playBtn.style.filter = "invert(1)"; 
  if (currentSong.paused) {
    currentSong.play();
    playBtn.src = "img/pause.svg";   
  } else {
    currentSong.pause();
    playBtn.src = "img/play1.svg";    
  }
});


currentSong.addEventListener("timeupdate", () => {

  const percent = (currentSong.currentTime / currentSong.duration) * 100;


  circle.style.left = percent + "%";


  seekbar.style.background =
    `linear-gradient(to right, rgb(240 136 15) ${percent}%, #444 ${percent}%)`;

  songtimeEl.innerHTML =
    `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
  if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
    circle.style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  }
});


seekbar.addEventListener("click", e => {
    const COLOR = "rgb(240 136 15)";
  const percent           = (e.offsetX / seekbar.getBoundingClientRect().width) * 100;
  circle.style.left       = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;


seekbar.style.background =
  `linear-gradient(to right, ${COLOR} ${percent}%, #444 ${percent}%)`;

});


currentSong.addEventListener("ended", () => {
  currentIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
  playMusic(songs[currentIndex]);     
});


previousBtn.addEventListener("click", () => {
  currentIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
  playMusic(songs[currentIndex]);
});

nextBtn.addEventListener("click", () => {
  currentIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
  playMusic(songs[currentIndex]);
});


hamburger.addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});
closeBtn.addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
});


volumeSlider.value = 70;
currentSong.volume = 0.7;
updateVolumeColor(70);

volumeSlider.addEventListener("input", e => {
  const value        = e.target.value;
  currentSong.volume = value / 100;
  volumeIcon.src     = value == 0 ? "img/mute.svg" : "img/volume.svg";
  updateVolumeColor(value);
});

volumeIcon.addEventListener("click", () => {
  if (currentSong.volume > 0) {
    currentSong.volume = 0;
    volumeSlider.value = 0;
    volumeIcon.src     = "img/mute.svg";
    updateVolumeColor(0);
  } else {
    currentSong.volume = 0.7;
    volumeSlider.value = 70;
    volumeIcon.src     = "img/volume.svg";
    updateVolumeColor(70);
  }
});


function main() {
  displayAlbums();                      

  const defaultAlbum = ALBUMS[0];      
  loadAlbum(defaultAlbum);
  currentIndex = 0;
  if (songs.length > 0) playMusic(songs[0], true); 
}

main();