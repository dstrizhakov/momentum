import playList from './playList.js';

// 1. Часы и календарь
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');
const greetingEl = document.querySelector('.greeting');

const showTime = () => {
	const date = new Date();
	const currentTime = date.toLocaleTimeString();
	timeEl.textContent = `${currentTime}`;
	showDate();
	showGreeting();
	setTimeout(showTime, 1000);
}
const showDate = () => {
	const date = new Date();
	const options = {
		weekday: "long",
		month: "long",
		day: "numeric",
	};
	const currentDate = date.toLocaleDateString('en-US', options);
	dateEl.textContent = `${currentDate}`;
}
let timeOfDay;

const showGreeting = () => {
	timeOfDay = getTimeOfDay();
	greetingEl.textContent = `Good ${timeOfDay},`;
}

const getTimeOfDay = () => {
	const date = new Date();
	const hours = date.getHours();
	let time = Math.floor(hours / 6);
	const dict = ['night', 'morning', 'afternoon', 'evening']
	return dict[time]
}

showTime();

//2. Приветствие
// save name to local storage then beforeunload
const nameEl = document.querySelector('.name');

function setLocalStorage() {
	localStorage.setItem('name', nameEl.value)
}
window.addEventListener('beforeunload', setLocalStorage)

// read name from local storage then load
function getLocalStorage() {
	if (localStorage.getItem('name')) {
		nameEl.value = localStorage.getItem('name');
	}
}
window.addEventListener('load', getLocalStorage)


// 3. Слайдер изображений
const body = document.body;
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

let bgNum = getRandom(1, 20);

function setBg() {
	bgNum = bgNum.toString().padStart(2, "0");
	const img = new Image();
	const url = `https://raw.githubusercontent.com/dstrizhakov/momentum/assets/assets/img/backgrounds/${timeOfDay}/${bgNum}.webp`
	img.src = url;
	img.onload = () => {
		body.style.backgroundImage = `url(${url})`;
	}
}

setBg();

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

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

// 4. Виджет погоды
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');

// api key from openweathermap.org
const api_key = 'e1855b84a004bbbcc85c4a5708681819';

let lang = 'en';
let units = 'metric';

async function getWeather() {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=${api_key}&units=${units}`;

	const res = await fetch(url);
	if (res.status !== 200) {
		weatherError.textContent = 'No data'
		weatherIcon.className = 'weather-icon owf';
		temperature.textContent = `----°C`;
		weatherDescription.textContent = '----//----';
		wind.textContent = `Wind speed: ---- m/s`;
		humidity.textContent = `Humidity: ---- %`
	} else {
		const data = await res.json();
		weatherError.textContent = null;
		weatherIcon.className = 'weather-icon owf';
		weatherIcon.classList.add(`owf-${data.weather[0].id}`);
		temperature.textContent = `${Math.round(data.main.temp)}°C`;
		weatherDescription.textContent = data.weather[0].description;
		wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
		humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`
	}
}

function setCity() {
	getWeather();
	city.blur();
}

function setLocalStorageCity() {
	localStorage.setItem('city', city.value)
}
window.addEventListener('beforeunload', setLocalStorageCity)

function getLocalStorageCity() {
	if (localStorage.getItem('city')) {
		city.value = localStorage.getItem('city');
		setCity()
	} else {
		city.value = 'Minsk';
		setCity()
	}
}
window.addEventListener('load', getLocalStorageCity)

// первоначальная подгрузка данных
// document.addEventListener('DOMContentLoaded', getWeather);
// подгрузка данных при изменении города
city.addEventListener('change', setCity);

// 5. Виджет "цитата дня"
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

async function getQuote() {
	// const url = `https://type.fit/api/quotes`;
	const path = './js/data.json';
	const res = await fetch(path);
	writeQuote(res);
	// const res = await fetch(url);
	// if (res.status === 200) {
	// 	writeQuote(res)
	// } else {
	// 	const res = await fetch(path);
	// 	writeQuote(res);
	// }
}

async function writeQuote(res) {
	const data = await res.json();
	const quoteNum = getRandom(0, data.length)
	quote.textContent = `"${data[quoteNum].text}"`;
	author.textContent = data[quoteNum].author || 'Unknown author';
}

document.addEventListener('DOMContentLoaded', getQuote);
changeQuote.addEventListener('click', getQuote);

// 6. Аудиоплеер

const playPauseBtn = document.querySelector('.play-pause');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');

let isPlay = false;
let newVolume = 0.75;
let playNum = 0;
const audio = new Audio();

function playAudio() {
	changeActiveTrack();
	if (!isPlay) {
		audio.src = playList[playNum].src
		audio.currentTime = 0;
		audio.play();
		isPlay = true;
		playPauseBtn.classList.remove('play')
		playPauseBtn.classList.add('pause')
	} else {
		audio.pause();
		isPlay = false;
		playPauseBtn.classList.remove('pause')
		playPauseBtn.classList.add('play')
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
	const currentPlayList = document.querySelectorAll('.play-item')
	currentPlayList.forEach((el, index) => {
		if (index !== playNum) {
			el.classList.remove('item-active')
		} else {
			el.classList.add('item-active')
		}
	})
}

playList.forEach(el => {
	const li = document.createElement('li');
	li.classList.add('play-item');
	li.textContent = el.title;
	playListContainer.append(li);
})

playPauseBtn.addEventListener('click', playAudio);
playNextBtn.addEventListener('click', playNext);
playPrevBtn.addEventListener('click', playPrev);
// automatically play the next song at the end of the audio object's duration
audio.addEventListener('ended', function () {
	playNext();
});

// продвинутый плеер
//click on timeline to skip around
const timeline = document.querySelector(".timeline");
timeline.addEventListener("click", e => {
	const timelineWidth = window.getComputedStyle(timeline).width;
	const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
	audio.currentTime = timeToSeek;
}, false);

//check audio percentage and update time accordingly
setInterval(() => {
	const progressBar = document.querySelector(".progress");
	progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
	document.querySelector(".audio-time .current").textContent = getTimeCodeFromNum(
		audio.currentTime
	);
}, 500);

audio.addEventListener(
	"loadeddata",
	() => {
		document.querySelector(".audio-time .length").textContent = getTimeCodeFromNum(
			audio.duration
		);
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
volumeSlider.addEventListener('click', e => {
	const sliderWidth = window.getComputedStyle(volumeSlider).width;
	newVolume = e.offsetX / parseInt(sliderWidth);
	audio.volume = newVolume;
	document.querySelector(".volume-percentage").style.width = newVolume * 100 + '%';
}, false)

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