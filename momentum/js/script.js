import playList from "./playList.js";
//==================================================================
//получение элементов
//==================================================================
const body = document.body;
const nameEl = document.querySelector(".name");
const languageEl = document.querySelector(".language");
const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const greetingEl = document.querySelector(".greeting");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const city = document.querySelector(".city");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const weatherError = document.querySelector(".weather-error");
const quoteEl = document.querySelector(".quote");
const authorEl = document.querySelector(".author");
const playPauseBtn = document.querySelector(".play-pause");
const playListContainer = document.querySelector(".play-list");
const settingsModal = document.querySelector(".settings-modal");
const checkAudioEl = document.getElementById("check-audio");
const checkWeatherEl = document.getElementById("check-weather");
const checkClockEl = document.getElementById("check-clock");
const checkDateEl = document.getElementById("check-date");
const checkWelcomeEl = document.getElementById("check-welcome");
const checkQuotesEl = document.getElementById("check-quotes");
const radioGroup = document.querySelector(".form_radio_group");
const radioButtons = radioGroup.querySelectorAll('input[type="radio"]');
const tagsInput = document.querySelector(".settings-tags");
const tagsUpdate = document.querySelector(".settings-update");

//==================================================================
// язык приложения
//==================================================================
let language = "en";
let units = "metric";

const translation = {
  en: {
    night: "Good night,",
    morning: "Good morning,",
    afternoon: "Good afternoon,",
    evening: "Good evening,",
    option: "en-US",
    units: "metric",
    wind: "Wind speed:",
    speed: "m/s",
    humidity: "Humidity:",
    city: "Minsk",
    placeholder: "[Enter name]",
    settings: "Settings",
    player: "Player",
    weather: "Weather",
    clock: "Clock",
    date: "Date",
    welcome: "Welcome",
    quotes: "Quotes",
    background: "Backgrounds source:",
  },
  ru: {
    night: "Доброй ночи,",
    morning: "Доброе утро,",
    afternoon: "Добрый день,",
    evening: "Добрый вечер,",
    option: "ru-RU",
    units: "metric",
    wind: "Скорость ветра:",
    speed: "м/с",
    humidity: "Влажность:",
    city: "Минск",
    placeholder: "[Введите имя]",
    settings: "Настройки",
    player: "Аудиоплеер",
    weather: "Погода",
    clock: "Часы",
    date: "Дата",
    welcome: "Приветствие",
    quotes: "Цитата",
    background: "Источник фонов:",
  },
};

const toggleLang = () => {
  if (languageEl.textContent === "EN") {
    languageEl.textContent = "RU";
    language = "ru";
  } else {
    languageEl.textContent = "EN";
    language = "en";
  }
  getQuote();
  showTime();
  getWeather();
  setPlaceholder();
  setSettingsLanuage();
};

//==================================================================
// 1. Часы и календарь
//==================================================================

const showTime = () => {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  timeEl.textContent = `${currentTime}`;
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
};
const showDate = () => {
  const date = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const currentDate = date.toLocaleDateString(
    translation[language]["option"],
    options
  );
  dateEl.textContent = `${currentDate}`;
};
let timeOfDay;

const showGreeting = () => {
  timeOfDay = getTimeOfDay();
  let greetingText = translation[language][timeOfDay];
  greetingEl.textContent = greetingText;
};

const getTimeOfDay = () => {
  const date = new Date();
  const hours = date.getHours();
  let time = Math.floor(hours / 6);
  const dict = ["night", "morning", "afternoon", "evening"];
  return dict[time];
};

showTime();

//==================================================================
//2. Приветствие
//==================================================================

const setPlaceholder = () => {
  nameEl.setAttribute("placeholder", `${translation[language]["placeholder"]}`);
};

//==================================================================
// API фоновых изображений
//==================================================================

const UNSPLASH_ACCESS_KEY = "GQpboVLxSu8scxvDv9g3SOJtb4cEg3q9t5ekYwiivas";
let orientation = "landscape";
let query = `${timeOfDay}`;

// Flickr api
const FLICKR_ACCESS_KEY = "aab5d760fc4401960005a1e08225e42a";
const extras = "url_h";

async function getLinkToImage() {
  // Unsplash api//
  if (urlSourse === "unsplash") {
    let url = `https://api.unsplash.com/photos/random?orientation=${orientation}&query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.urls.regular;
  } else {
    // Flickr api//
    let url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_ACCESS_KEY}&tags=${query}&extras=${extras}&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    let randomFlickrUrl = getRandom(0, 100);
    return data.photos.photo[randomFlickrUrl].url_h;
  }
}

//==================================================================
// 3. Слайдер изображений
//==================================================================

let bgNum = getRandom(1, 20);

let urlSourse = "github";

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function setBg() {
  const img = new Image();
  let url;
  if (urlSourse === "github") {
    bgNum = bgNum.toString().padStart(2, "0");
    url = `https://raw.githubusercontent.com/dstrizhakov/momentum/assets/assets/img/backgrounds/${timeOfDay}/${bgNum}.webp`;
  } else if (urlSourse === "unsplash" || urlSourse === "flickr") {
    url = await getLinkToImage();
  }
  img.src = url;
  img.onload = () => {
    body.style.backgroundImage = `url(${url})`;
  };
}

// setBg();

function getSlideNext() {
  if (bgNum >= 20) {
    bgNum = 1;
  } else {
    bgNum++;
  }
  setBg();
}

function getSlidePrev() {
  if (bgNum <= 1) {
    bgNum = 20;
  } else {
    bgNum--;
  }
  setBg();
}

//==================================================================
// 4. Виджет погоды
//==================================================================

// api key from openweathermap.org
const api_key = "e1855b84a004bbbcc85c4a5708681819";

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language}&appid=${api_key}&units=${units}`;
  const res = await fetch(url);
  if (res.status !== 200) {
    weatherError.textContent = "No data";
    weatherIcon.className = "weather-icon owf";
    temperature.textContent = null;
    weatherDescription.textContent = null;
    wind.textContent = null;
    humidity.textContent = null;
  } else {
    const data = await res.json();
    weatherError.textContent = null;
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${translation[language]["wind"]} ${Math.round(
      data.wind.speed
    )} ${translation[language]["speed"]}`;
    humidity.textContent = `${translation[language]["humidity"]} ${Math.round(
      data.main.humidity
    )}%`;
  }
}

function setCity() {
  getWeather();
  city.blur();
}

// подгрузка данных при изменении города
city.addEventListener("change", setCity);

//==================================================================
// 5. Виджет "цитата дня"
//==================================================================

async function getQuote() {
  const path = "./js/data.json";
  const res = await fetch(path);
  writeQuote(res);
}

async function writeQuote(res) {
  const data = await res.json();
  const quoteNum = getRandom(0, data.length);
  let quote = data[quoteNum][language];
  quoteEl.textContent = `"${quote}"`;
  if (language === "ru") {
    authorEl.textContent = data[quoteNum].authorRu || "Неизвестный автор";
  } else {
    authorEl.textContent = data[quoteNum].authorEn || "Unknown author";
  }
}

document.addEventListener("DOMContentLoaded", getQuote);

//==================================================================
// 6. Аудиоплеер
//==================================================================

let isPlay = false;
let newVolume = 0.75;
let playNum = 0;
const audio = new Audio();

function playAudio() {
  changeActiveTrack();
  if (!isPlay) {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
    playPauseBtn.classList.remove("play");
    playPauseBtn.classList.add("pause");
  } else {
    audio.pause();
    isPlay = false;
    playPauseBtn.classList.remove("pause");
    playPauseBtn.classList.add("play");
  }
}
function playNext() {
  isPlay = false;
  if (playNum >= 3) {
    playNum = 0;
  } else {
    playNum++;
  }
  playAudio();
}
function playPrev() {
  isPlay = false;
  if (playNum <= 0) {
    playNum = 3;
  } else {
    playNum--;
  }
  playAudio();
}

function changeActiveTrack() {
  const currentPlayList = document.querySelectorAll(".play-item");
  currentPlayList.forEach((el, index) => {
    if (index !== playNum) {
      el.classList.remove("item-active");
    } else {
      el.classList.add("item-active");
    }
  });
}

playList.forEach((el) => {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = el.title;
  playListContainer.append(li);
});

// automatically play the next song at the end of the audio object's duration
audio.addEventListener("ended", function () {
  playNext();
});

// продвинутый плеер
//click on timeline to skip around
const timeline = document.querySelector(".timeline");
timeline.addEventListener(
  "click",
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false
);

//check audio percentage and update time accordingly
setInterval(() => {
  const progressBar = document.querySelector(".progress");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  document.querySelector(".audio-time .current").textContent =
    getTimeCodeFromNum(audio.currentTime);
}, 500);

audio.addEventListener(
  "loadeddata",
  () => {
    document.querySelector(".audio-time .length").textContent =
      getTimeCodeFromNum(audio.duration);
    audio.volume = newVolume;
  },
  false
);

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;
  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

// volume
//click volume slider to change volume
const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener(
  "click",
  (e) => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    document.querySelector(".volume-percentage").style.width =
      newVolume * 100 + "%";
  },
  false
);

document.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = document.querySelector(".volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icon-volume");
    volumeEl.classList.add("icon-mute");
  } else {
    volumeEl.classList.add("icon-volume");
    volumeEl.classList.remove("icon-mute");
  }
});

//==================================================================
// Settings
//==================================================================

function toggleHideClass(className, toggler) {
  const element = document.querySelector(`.${className}`);
  if (toggler.checked === true) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

checkAudioEl.addEventListener("click", () => {
  toggleHideClass("player", checkAudioEl);
  audio.pause();
  isPlay = false;
});
checkWeatherEl.addEventListener("click", () => {
  toggleHideClass("weather", checkWeatherEl);
});
checkClockEl.addEventListener("click", () => {
  toggleHideClass("time", checkClockEl);
});
checkDateEl.addEventListener("click", () => {
  toggleHideClass("date", checkDateEl);
});
checkWelcomeEl.addEventListener("click", () => {
  toggleHideClass("greeting-container", checkWelcomeEl);
});
checkQuotesEl.addEventListener("click", () => {
  toggleHideClass("change-quote", checkQuotesEl);
  toggleHideClass("quote-container", checkQuotesEl);
});

//==================================================================
// save and restore settings from Local Storage
//==================================================================

function setLocalStorage() {
  localStorage.setItem("name", nameEl.value);
  localStorage.setItem("city", city.value);
  localStorage.setItem("language", languageEl.textContent);
  localStorage.setItem("player", checkAudioEl.checked);
  localStorage.setItem("weather", checkWeatherEl.checked);
  localStorage.setItem("clock", checkClockEl.checked);
  localStorage.setItem("date", checkDateEl.checked);
  localStorage.setItem("welcome", checkWelcomeEl.checked);
  localStorage.setItem("quotes", checkQuotesEl.checked);
  localStorage.setItem("urlSourse", urlSourse);
}
window.addEventListener("beforeunload", setLocalStorage);

// read name from local storage then load
function getLocalStorage() {
  if (localStorage.getItem("name")) {
    nameEl.value = localStorage.getItem("name");
  }
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  } else {
    city.value = translation[language]["city"];
  }
  setCity();
  let langFromStorage = localStorage.getItem("language");
  if (langFromStorage) {
    language = langFromStorage.toLowerCase();
    languageEl.textContent = langFromStorage;
    getQuote();
  } else {
    language = "en";
    languageEl.textContent = "EN";
  }
  setPlaceholder();
  // recall settings
  setSettingsLanuage();
  if (localStorage.getItem("player") === "false") {
    checkAudioEl.removeAttribute("checked");
    toggleHideClass("player", checkAudioEl);
  }
  if (localStorage.getItem("weather") === "false") {
    checkWeatherEl.removeAttribute("checked");
    toggleHideClass("weather", checkWeatherEl);
  }
  if (localStorage.getItem("clock") === "false") {
    checkClockEl.removeAttribute("checked");
    toggleHideClass("time", checkClockEl);
  }
  if (localStorage.getItem("date") === "false") {
    checkDateEl.removeAttribute("checked");
    toggleHideClass("date", checkDateEl);
  }
  if (localStorage.getItem("welcome") === "false") {
    checkWelcomeEl.removeAttribute("checked");
    toggleHideClass("greeting-container", checkWelcomeEl);
  }
  if (localStorage.getItem("quotes") === "false") {
    checkQuotesEl.removeAttribute("checked");
    toggleHideClass("change-quote", checkQuotesEl);
    toggleHideClass("quote-container", checkQuotesEl);
  }
  if (localStorage.getItem("urlSourse") || localStorage.getItem("tags")) {
    urlSourse = localStorage.getItem("urlSourse");
    restoreSettingUrl(urlSourse);
    if (localStorage.getItem("tags")) {
      recallTags();
    }
    setBg();
  }
}
window.addEventListener("load", getLocalStorage);

//==================================================================
// чтобы разгрузить браузер будем использовать делегирование событий
// и обрабатывать все события click в одном слушателе
//==================================================================

body.addEventListener("click", (event) => {
  // обработка кнопки .settings-button
  if (event.target.closest(".settings-button")) {
    settingsModal.classList.toggle("active");
  } else if (
    !event.target.closest(".settings-modal") &&
    !event.target.closest(".language")
  ) {
    settingsModal.classList.remove("active");
  }
  // обработка кнопки .language
  if (event.target.closest(".language")) {
    toggleLang();
  }
  // обработка кнопки .change-quote
  if (event.target.closest(".change-quote")) {
    getQuote();
  }
  // обработка кнопки .slide-next
  if (event.target.closest(".slide-next")) {
    getSlideNext();
  }
  // обработка кнопки .slide-prev
  if (event.target.closest(".slide-prev")) {
    getSlidePrev();
  }
  // обработка кнопки .play-pause
  if (event.target.closest(".play-pause")) {
    playAudio();
  }
  // обработка кнопки .play-prev
  if (event.target.closest(".play-prev")) {
    playPrev();
  }
  // обработка кнопки .play-next
  if (event.target.closest(".play-next")) {
    playNext();
  }
  // обработка кнопки .settings-update
  if (event.target.closest(".settings-update")) {
    updateTags();
  }
});

//==================================================================
// Обработка радио-кнопок выбор api фоновых изображений
//==================================================================

function readRadio() {
  const selected = radioGroup.querySelector(
    'input[name="background"]:checked'
  ).value;
  urlSourse = selected;
  if (urlSourse === "github") {
    document.querySelector(".settings-tags").disabled = true;
  }
  if (urlSourse === "unsplash") {
    document.querySelector(".settings-tags").disabled = false;
  }
  if (urlSourse === "flickr") {
    document.querySelector(".settings-tags").disabled = false;
  }
  setBg();
}

function restoreSettingUrl(urlSourse) {
  if (urlSourse === "github") {
    radioButtons[0].checked = true;
    document.querySelector(".settings-tags").disabled = true;
  }
  if (urlSourse === "unsplash") {
    radioButtons[1].checked = true;
    document.querySelector(".settings-tags").disabled = false;
  }
  if (urlSourse === "flickr") {
    radioButtons[2].checked = true;
    document.querySelector(".settings-tags").disabled = false;
  }
}

radioGroup.addEventListener("change", readRadio);

function setSettingsLanuage() {
  document.querySelector(".settings-title").textContent =
    translation[language]["settings"];
  document.querySelector(".settings-module-player").textContent =
    translation[language]["player"];
  document.querySelector(".settings-module-weather").textContent =
    translation[language]["weather"];
  document.querySelector(".settings-module-clock").textContent =
    translation[language]["clock"];
  document.querySelector(".settings-module-date").textContent =
    translation[language]["date"];
  document.querySelector(".settings-module-welcome").textContent =
    translation[language]["welcome"];
  document.querySelector(".settings-module-quotes").textContent =
    translation[language]["quotes"];
  document.querySelector(".settings-module-background").textContent =
    translation[language]["background"];
}

setSettingsLanuage();

//==================================================================
// Обработка тегов для api фоновых изображений
//==================================================================
let tags = "";

function updateTags() {
  if (tagsInput.value.trim()) {
    tags = tagsInput.value.trim();
    query = tags;
    localStorage.setItem("tags", query);
    setBg();
  } else if (!tagsInput.value.trim()) {
    localStorage.removeItem("tags");
    query = `${timeOfDay}`;
    setBg();
  }
}

function recallTags() {
  let currentTags = localStorage.getItem("tags");
  tagsInput.value = currentTags;
  query = currentTags;
}

// первоначальная подгрузка данных
// document.addEventListener("DOMContentLoaded", renderAll());
// function renderAll() {
//   showTime();
// }
