
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
	return Math.floor(Math.random() * (max - min));
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