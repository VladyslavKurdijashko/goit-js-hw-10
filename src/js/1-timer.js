document.addEventListener('DOMContentLoaded', () => {
  const datetimePicker = document.getElementById('datetime-picker');
  const startButton = document.querySelector('button[data-start]');
  const daysSpan = document.querySelector('[data-days]');
  const hoursSpan = document.querySelector('[data-hours]');
  const minutesSpan = document.querySelector('[data-minutes]');
  const secondsSpan = document.querySelector('[data-seconds]');
  let userSelectedDate = null;
  let timerInterval = null;

  const options = {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose(selectedDates) {
          const selectedDate = selectedDates[0];
          if (selectedDate <= new Date()) {
              iziToast.error({
                  title: 'Error',
                  message: 'Please choose a date in the future',
              });
              startButton.disabled = true;
          } else {
              userSelectedDate = selectedDate;
              startButton.disabled = false;
          }
      },
  };

  flatpickr(datetimePicker, options);

  startButton.addEventListener('click', () => {
      startButton.disabled = true;
      datetimePicker.disabled = true;

      timerInterval = setInterval(() => {
          const now = new Date();
          const timeDifference = userSelectedDate - now;

          if (timeDifference <= 0) {
              clearInterval(timerInterval);
              updateTimer(0);
              datetimePicker.disabled = false;
              startButton.disabled = true;
              iziToast.success({
                  title: 'Success',
                  message: 'Countdown finished',
              });
          } else {
              updateTimer(timeDifference);
          }
      }, 1000);
  });

  function updateTimer(ms) {
      const time = convertMs(ms);
      daysSpan.textContent = addLeadingZero(time.days);
      hoursSpan.textContent = addLeadingZero(time.hours);
      minutesSpan.textContent = addLeadingZero(time.minutes);
      secondsSpan.textContent = addLeadingZero(time.seconds);
  }

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
      return String(value).padStart(2, '0');
  }
});