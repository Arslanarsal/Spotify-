async function song() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let responce = await a.text();
 

  let div = document.createElement("div");
  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");
  let song = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3") || element.href.endsWith(".mp4")) {
      song.push(element.href);
    }
  }
  console.log(song);
}
song();
