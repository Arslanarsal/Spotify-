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
    }
  }
  return song;
}

async function main() {
  // Get all songs
  let songs = await getSongs();

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

  // let audio = new Audio(songs[1]);
  // audio.play();
}

main();
