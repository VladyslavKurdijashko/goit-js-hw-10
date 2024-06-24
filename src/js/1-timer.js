document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('button[data-start]');
    const dateTimePicker = document.getElementById('datetime-picker');
    let userSelectedDate;
  
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
  
    flatpickr(dateTimePicker, options);
  
    startButton.addEventListener('click', () => {
      if (!userSelectedDate) return;
  
      dateTimePicker.disabled = true;
      startButton.disabled = true;
  
      const timerInterval = setInterval(() => {
        const now = new Date();
        const timeLeft = userSelectedDate - now;
  
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          updateTimerDisplay(0, 0, 0, 0);
          dateTimePicker.disabled = false;
          return;
        }
  
        const { days, hours, minutes, seconds } = convertMs(timeLeft);
        updateTimerDisplay(days, hours, minutes, seconds);
      }, 1000);
    });
  
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
  
    function updateTimerDisplay(days, hours, minutes, seconds) {
      document.querySelector('[data-days]').textContent = addLeadingZero(days);
      document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
      document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
      document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
    }
  });
  