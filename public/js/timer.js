const timer = {
    remainingTime: {
        total: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    }
}

const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    if (action == 'start') {
        startTimer();
    } else {
        stopTimer();
    }
});

const alarmSound = new Audio('break.mp3');

let interval;

//Updates the clock in the HTML with the remaining time
function updateClock() {
    const { remainingTime } = timer;

    const hours = `${remainingTime.hours}`.padStart(2, '0');
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const hr = document.getElementById('timer-hours');
    const min = document.getElementById('timer-minutes');
    const sec = document.getElementById('timer-seconds');

    hr.textContent = hours;
    min.textContent = minutes;
    sec.textContent = seconds;
}

//Calcualtes the difference between end and current time and splits it into hours, minutes and seconds
function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const hours = Number.parseInt(Math.floor(total / 3600), 10);
    const minutes = Number.parseInt(Math.floor((total % 3600) / 60), 10);
    const seconds = Number.parseInt(total % 60);

    return {
        total,
        hours,
        minutes,
        seconds
    };
}

//Gets the input from the HTML form and starts the timer
function startTimer() {
    timer.remainingTime = {
        total: document.getElementById('hours').value * 60 * 60 + document.getElementById('minutes').value * 60,
        hours: document.getElementById('hours').value,
        minutes: document.getElementById('minutes').value,
        seconds: 0
    }

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';

    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    interval = setInterval(function () {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;
        if (total <= 0) {
            alarmSound.play();
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
	
	timer.remainingTime = {
		total: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
}