/**
 * Frisør Ozsimsekli - Calendar Component
 * Interactive date picker for booking system
 */

class BookingCalendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = {
      closedDays: [0, 1], // Sunday = 0, Monday = 1
      minDate: new Date(),
      maxMonthsAhead: 3,
      onDateSelect: null,
      ...options
    };

    this.currentDate = new Date();
    this.selectedDate = null;
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();

    this.norwegianMonths = [
      'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
    ];

    this.norwegianWeekdays = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="calendar">
        <div class="calendar__header">
          <button type="button" class="calendar__nav calendar__nav--prev" id="calendarPrev">←</button>
          <span class="calendar__title" id="calendarTitle"></span>
          <button type="button" class="calendar__nav calendar__nav--next" id="calendarNext">→</button>
        </div>
        <div class="calendar__grid">
          <div class="calendar__weekdays" id="calendarWeekdays"></div>
          <div class="calendar__days" id="calendarDays"></div>
        </div>
      </div>
    `;

    this.renderWeekdays();
    this.renderDays();
    this.updateTitle();
    this.updateNavButtons();
  }

  renderWeekdays() {
    const weekdaysContainer = this.container.querySelector('#calendarWeekdays');
    weekdaysContainer.innerHTML = this.norwegianWeekdays
      .map(day => `<div class="calendar__weekday">${day}</div>`)
      .join('');
  }

  renderDays() {
    const daysContainer = this.container.querySelector('#calendarDays');
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    let html = '';

    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      html += '<div class="calendar__day calendar__day--empty"></div>';
    }

    // Render each day
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dayOfWeek = date.getDay();
      const isToday = this.isToday(date);
      const isDisabled = this.isDisabled(date, dayOfWeek);
      const isSelected = this.isSelected(date);

      const classes = ['calendar__day'];
      if (isToday) classes.push('calendar__day--today');
      if (isDisabled) classes.push('calendar__day--disabled');
      if (isSelected) classes.push('calendar__day--selected');

      html += `<div class="${classes.join(' ')}" data-date="${this.formatDate(date)}" data-day="${day}">${day}</div>`;
    }

    daysContainer.innerHTML = html;
  }

  updateTitle() {
    const titleElement = this.container.querySelector('#calendarTitle');
    titleElement.textContent = `${this.norwegianMonths[this.currentMonth]} ${this.currentYear}`;
  }

  updateNavButtons() {
    const prevBtn = this.container.querySelector('#calendarPrev');
    const nextBtn = this.container.querySelector('#calendarNext');

    // Disable prev if we're at current month
    const today = new Date();
    if (this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth()) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }

    // Disable next if we're at max months ahead
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + this.options.maxMonthsAhead);
    if (this.currentYear >= maxDate.getFullYear() && this.currentMonth >= maxDate.getMonth()) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }
  }

  bindEvents() {
    // Previous month
    this.container.querySelector('#calendarPrev').addEventListener('click', () => {
      this.goToPreviousMonth();
    });

    // Next month
    this.container.querySelector('#calendarNext').addEventListener('click', () => {
      this.goToNextMonth();
    });

    // Day click
    this.container.querySelector('#calendarDays').addEventListener('click', (e) => {
      const dayElement = e.target.closest('.calendar__day');
      if (!dayElement || dayElement.classList.contains('calendar__day--disabled') || dayElement.classList.contains('calendar__day--empty')) {
        return;
      }

      this.selectDate(dayElement.dataset.date);
    });
  }

  goToPreviousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderDays();
    this.updateTitle();
    this.updateNavButtons();
  }

  goToNextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderDays();
    this.updateTitle();
    this.updateNavButtons();
  }

  selectDate(dateString) {
    this.selectedDate = new Date(dateString);

    // Update visual selection
    this.container.querySelectorAll('.calendar__day--selected').forEach(el => {
      el.classList.remove('calendar__day--selected');
    });

    const selectedElement = this.container.querySelector(`[data-date="${dateString}"]`);
    if (selectedElement) {
      selectedElement.classList.add('calendar__day--selected');
    }

    // Callback
    if (typeof this.options.onDateSelect === 'function') {
      this.options.onDateSelect(this.selectedDate, dateString);
    }
  }

  isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isDisabled(date, dayOfWeek) {
    // Check if it's a closed day
    if (this.options.closedDays.includes(dayOfWeek)) {
      return true;
    }

    // Check if it's in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return true;
    }

    return false;
  }

  isSelected(date) {
    if (!this.selectedDate) return false;
    return date.toDateString() === this.selectedDate.toDateString();
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateNorwegian(date) {
    const weekdays = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    const months = [
      'januar', 'februar', 'mars', 'april', 'mai', 'juni',
      'juli', 'august', 'september', 'oktober', 'november', 'desember'
    ];

    const dayOfWeek = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek} ${day}. ${month} ${year}`;
  }

  getSelectedDate() {
    return this.selectedDate;
  }

  getSelectedDateFormatted() {
    if (!this.selectedDate) return '';
    return this.formatDateNorwegian(this.selectedDate);
  }

  reset() {
    this.selectedDate = null;
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.renderDays();
    this.updateTitle();
    this.updateNavButtons();
  }
}

// Make available globally
window.BookingCalendar = BookingCalendar;
