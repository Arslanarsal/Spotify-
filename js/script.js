var cursong = new Audio();
let curfolder;
let songs;
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

async function getSongs(folder) {
  curfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let responce = await a.text();
  let div = document.createElement("div");
  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3") || element.href.endsWith(".mp4")) {
      songs.push(element.href.split(`/${folder}/`)[1].replaceAll("%20", " "));
    }
  }

  //  get the ul
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  songul.innerHTML = "";
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
      playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
}

let playmusic = (track, ch = false) => {
  if (ch) {
    cursong.src = `/${curfolder}/` + track;
    document.querySelector(".songinfo").innerHTML = track;
  } else {
    document.querySelector("#songpause").src = "Svg/paused.svg";
    cursong.src = `/${curfolder}/` + track;
    cursong.play();
    document.querySelector(".songinfo").innerHTML = track;
  }
};

// Display the Card

async function displayalbum() {
  let a = await fetch("http://127.0.0.1:3000/Songs/");

  let cardcontainer = document.querySelector(".cardcontainer");
  let responce = await a.text();
  let div = document.createElement("div");
  div.innerHTML = responce;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    let e = array[index];

    if (e.href.includes("/Songs")) {
      let folder = e.href.split("/").splice(-2)[0];
      let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`);

      // Geting the Piccture Type
      let pictype;
      let pic = await fetch(`http://127.0.0.1:3000/Songs/${folder}`);
      let picres = await pic.text();
      let diva = document.createElement("div");
      diva.innerHTML = picres;
      let as = diva.getElementsByTagName("a");
      Array.from(as).forEach((e) => {
        if (e.href.includes("/cover")) {
          pictype = e.innerText.split(".")[1];
        }
      });

      let responce = await a.json();

      cardcontainer.innerHTML =
        cardcontainer.innerHTML +
        `
        <div data-folder = "${folder}" class="card p-1 b-r-1 c-p">
        <div class="circle-container">
          <span
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            class="IconWrapper__Wrapper-sc-1hf1hjl-0 bjlVXn"
          >
            <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              viewBox="0 0 24 24"
              class="Svg-sc-ytk21e-0 iYxpxA"
            >
              <path
                d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
              ></path>
            </svg>
          </span>
        </div>

        <img
          src="/Songs/${folder}/cover.${pictype}"
          alt=""
        />
        <h2>${responce.title}</h2>
        <p>${responce.description}</p>
      </div>
      `;
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  // Get all songs
  await getSongs("Songs/Rap");
  playmusic(songs[0], true);

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
    document.querySelector(".circle").style.left = percent + "%";

    cursong.currentTime = (cursong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", function () {
    let left = document.querySelector(".left");
    let right = document.querySelector(".right");
    let hamburger = document.querySelector(".hamburger");
    let cross = document.querySelector(".cross");
    left.style.width = "320px";
    hamburger.style.display = "none";
    cross.style.display = "inline";
  });

  document.querySelector(".cross").addEventListener("click", function () {
    let left = document.querySelector(".left");
    let right = document.querySelector(".right");
    let hamburger = document.querySelector(".hamburger");
    let cross = document.querySelector(".cross");
    left.style.width = "0";
    hamburger.style.display = "inline";
    cross.style.display = "none";
  });

  let previous = document.querySelector(".previous");
  let next = document.querySelector(".next");

  next.addEventListener("click", function () {
    cursong.pause();
    let index = songs.indexOf(
      cursong.src.split("/").slice(-1)[0].replaceAll("%20", " ")
    );
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  previous.addEventListener("click", function () {
    cursong.pause();
    let index = songs.indexOf(
      cursong.src.split("/").slice(-1)[0].replaceAll("%20", " ")
    );
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      let c = document.querySelector(".volume>img");
      if (c.src.split("/").splice(-1)[0] == "mute.svg") {
        c.src = "http://127.0.0.1:3000/SVG/volume.svg";
      }
      cursong.volume = parseInt(e.target.value) / 100;
    });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("/volume")) {
      e.target.src = e.target.src.replace("/volume", "/mute");
      cursong.volume = 0;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("/mute", "/volume");
      cursong.volume = 1;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 20;
    }
  });
}

displayalbum();
main();
