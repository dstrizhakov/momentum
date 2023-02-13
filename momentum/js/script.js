
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