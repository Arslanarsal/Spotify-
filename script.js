var cursong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let responce = await a.text();
  let div = document.createElement("div");
  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");
  let song = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3") || element.href.endsWith(".mp4")) {
      song.push(element.href.split("/songs/")[1].replaceAll("%20", " "));
      // song.push(element.href);
    }
  }
  return song;
}

let playmusic = (track, ch = false) => {
  if (ch) {
    cursong.src = "/songs/" + track;
    document.querySelector(".songinfo").innerHTML = track;
  } else {
    document.querySelector("#songpause").src = "Svg/paused.svg";
    cursong.src = "/songs/" + track;
    cursong.play();
    document.querySelector(".songinfo").innerHTML = track;
  }
};

async function main() {
  // Get all songs
  let songs = await getSongs();
  playmusic(songs[0], true);

  //  get the ul
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  //  insert li in ul
  for (const song of songs) {
    songul.insertAdjacentHTML(
      "beforeend",
      `<li class="border-w">
      <img class="invert" src="Svg/music.svg" alt="" />
      <div class="info m-4">
        <div class="name">${song}</div>
        <div>Arslan</div>
      </div>
      <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="Svg/play.svg" alt="" />
      </div>
    </li>`
    );
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  let playbutton = document.querySelector("#songpause");
  playbutton.addEventListener("click", (e) => {
    if (cursong.paused) {
      cursong.play();
      playbutton.src = "Svg/paused.svg";
    } else {
      cursong.pause();
      playbutton.src = "Svg/play.svg";
    }
  });

  cursong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      cursong.currentTime
    )}  /${secondsToMinutesSeconds(cursong.duration)}`;

    document.querySelector(".circle").style.left =
      (cursong.currentTime / cursong.duration) * 100 + "%";
  });

  document.querySelector(".seeker").addEventListener("click", (e) => {
    percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    console.log(percent);
    document.querySelector(".circle").style.left = percent + "%";

    cursong.currentTime = (cursong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", function () {
    let left = document.querySelector(".left");
    let right = document.querySelector(".right");
    let hamburger = document.querySelector(".hamburger");
    let cross = document.querySelector(".cross");
    left.style.width = "25vw";
    right.style.width = "75vw";
    hamburger.style.display = "none";
    cross.style.display = "inline";
  });

  document.querySelector(".cross").addEventListener("click", function () {
    let left = document.querySelector(".left");
    let right = document.querySelector(".right");
    let hamburger = document.querySelector(".hamburger");
    let cross = document.querySelector(".cross");
    left.style.width = "0vw";
    right.style.width = "100vw";
    hamburger.style.display = "inline";
    cross.style.display = "none";
  });
}

main();
