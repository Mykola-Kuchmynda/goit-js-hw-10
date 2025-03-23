import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
iziToast.show({
  title: "Готово!",
  message: "iziToast підключено через npm",
});
flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  dateFormat: "Y-m-d H:i",
});

const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let countdownInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] <= new Date()) {
            iziToast.error({ title: "Error", message: "Please choose a date in the future" });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDates[0];
            startButton.disabled = false;
        }
    },
};

flatpickr(datetimePicker, options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
}

function startCountdown() {
    startButton.disabled = true;
    datetimePicker.disabled = true;

    countdownInterval = setInterval(() => {
        const currentTime = new Date();
        const timeDiff = userSelectedDate - currentTime;
        
        if (timeDiff <= 0) {
            clearInterval(countdownInterval);
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            datetimePicker.disabled = false;
            return;
        }

        updateTimerDisplay(convertMs(timeDiff));
    }, 1000);
}

startButton.addEventListener("click", startCountdown);
