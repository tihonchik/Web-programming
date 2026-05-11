document.addEventListener("DOMContentLoaded", () => {
  const mediaCollection = [
    {
      img: "https://img.youtube.com/vi/GtRwAp2WFGk/hqdefault.jpg",
      audio:
        "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg",
    },
    {
      img: "https://img.youtube.com/vi/BoaZcur_3F0/hqdefault.jpg",
      audio:
        "https://actions.google.com/sounds/v1/nature/forest_birds_and_insects.ogg",
    },
    {
      img: "https://img.youtube.com/vi/URDVkllQubY/hqdefault.jpg",
      audio: "https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg",
    },
    {
      img: "https://img.youtube.com/vi/4oJPLckECz0/hqdefault.jpg",
      audio: "https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg",
    },
    {
      img: "https://img.youtube.com/vi/8US6V0hJss0/hqdefault.jpg",
      audio: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
    },
    {
      img: "https://img.youtube.com/vi/DSIt9_K7rh4/hqdefault.jpg",
      audio:
        "https://actions.google.com/sounds/v1/science_fiction/space_wind.ogg",
    },
    {
      img: "https://img.youtube.com/vi/-F96veJnVqM/hqdefault.jpg",
      audio: "https://actions.google.com/sounds/v1/water/water_stream.ogg",
    },
    {
      img: "https://img.youtube.com/vi/Z-oPPUP5-Kg/hqdefault.jpg",
      audio:
        "https://actions.google.com/sounds/v1/transportation/train_pass_by.ogg",
    },
    {
      img: "https://img.youtube.com/vi/Um1SxgmxtuQ/hqdefault.jpg",
      audio: "https://actions.google.com/sounds/v1/crowds/crowd_cheering.ogg",
    },
  ];

  const imgEl = document.getElementById("galleryImage");
  const vidEl = document.getElementById("galleryVideo");
  const btnRandom = document.getElementById("btnRandomMedia");
  const btnVideo = document.getElementById("btnPlayVideo");
  const playIndicator = document.getElementById("playIndicator");
  const volumeSlider = document.getElementById("volumeSlider");

  let currentAudio = new Audio();
  currentAudio.volume = volumeSlider.value;

  volumeSlider.addEventListener("input", (e) => {
    const vol = e.target.value;
    currentAudio.volume = vol;
    vidEl.volume = vol;
  });

  const setIndicator = (isPlaying) => {
    if (isPlaying) {
      playIndicator.classList.add("playing");
    } else {
      playIndicator.classList.remove("playing");
    }
  };

  btnRandom.addEventListener("click", () => {
    vidEl.pause();
    vidEl.classList.add("hidden");

    imgEl.classList.remove("opacity-1");
    imgEl.classList.add("opacity-0");
    imgEl.classList.remove("hidden");

    setTimeout(() => {
      const randomItem =
        mediaCollection[Math.floor(Math.random() * mediaCollection.length)];

      imgEl.src = randomItem.img;

      imgEl.classList.remove("opacity-0");
      imgEl.classList.add("opacity-1");

      currentAudio.pause();
      currentAudio.src = randomItem.audio;
      currentAudio
        .play()
        .catch((e) => console.log("Audio play blocked by browser: ", e));

      setIndicator(true);
    }, 500);
  });

  btnVideo.addEventListener("click", () => {
    currentAudio.pause();

    imgEl.classList.add("hidden");
    vidEl.classList.remove("hidden");

    vidEl
      .play()
      .catch((e) => console.log("Video play blocked by browser: ", e));
    setIndicator(true);
  });

  currentAudio.addEventListener("ended", () => setIndicator(false));
  currentAudio.addEventListener("pause", () => setIndicator(false));
  currentAudio.addEventListener("play", () => setIndicator(true));

  vidEl.addEventListener("ended", () => setIndicator(false));
  vidEl.addEventListener("pause", () => setIndicator(false));
  vidEl.addEventListener("play", () => setIndicator(true));
});
