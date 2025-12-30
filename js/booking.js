/**
 * Frisør Ozsimsekli - Booking System
 * Multi-step booking wizard with form validation
 */

document.addEventListener('DOMContentLoaded', function() {
  // ==========================================
  // Check if booking wizard exists
  // ==========================================
  const bookingWizard = document.getElementById('bookingWizard');
  if (!bookingWizard) return;

  // ==========================================
  // Services Configuration
  // ==========================================
  const services = {
    dameklipp: {
      title: 'Dameklipp & styling',
      icon: '✂️',
      items: [
        { id: 'dameklipp-kort', name: 'Dameklipp kort', description: 'Klipp, vask og føn - kort hår', price: 550, duration: 45 },
        { id: 'dameklipp-medium', name: 'Dameklipp medium', description: 'Klipp, vask og føn - medium lengde', price: 600, duration: 60 },
        { id: 'dameklipp-lang', name: 'Dameklipp lang', description: 'Klipp, vask og føn - langt hår', price: 650, duration: 75 },
        { id: 'klipp-styling', name: 'Klipp med styling', description: 'Inkl. krølling eller rettetang', price: 750, duration: 90 },
        { id: 'vask-fon', name: 'Kun vask og føn', description: 'Styling uten klipp', price: 350, duration: 30 },
        { id: 'oppsetting-enkel', name: 'Oppsetting enkel', description: 'Hverdagsstyling', price: 500, duration: 45 },
        { id: 'oppsetting-fest', name: 'Oppsetting fest', description: 'Festfrisyre, bryllup, konfirmasjon', price: 700, duration: 60 },
        { id: 'pannelugg', name: 'Pannelugg', description: 'Klipp av pannelugg', price: 150, duration: 15 }
      ]
    },
    herreklipp: {
      title: 'Herreklipp',
      icon: '💈',
      items: [
        { id: 'herreklipp', name: 'Herreklipp', description: 'Klassisk klipp med maskin og saks', price: 350, duration: 30 },
        { id: 'herreklipp-skjegg', name: 'Herreklipp med skjegg', description: 'Klipp og skjeggtrim', price: 450, duration: 45 },
        { id: 'skjeggtrim', name: 'Kun skjeggtrim', description: 'Forming og trim av skjegg', price: 150, duration: 15 },
        { id: 'fade', name: 'Fade / Skin fade', description: 'Moderne fade-teknikker', price: 400, duration: 40 },
        { id: 'herreklipp-student', name: 'Herreklipp student', description: 'Med gyldig studentbevis', price: 300, duration: 30 },
        { id: 'hode-skjegg-komplett', name: 'Hode og skjegg komplett', description: 'Full behandling', price: 500, duration: 60 }
      ]
    },
    barneklipp: {
      title: 'Barneklipp',
      icon: '⭐',
      items: [
        { id: 'barneklipp-0-6', name: 'Barneklipp (0-6 år)', description: 'De minste barna', price: 250, duration: 20 },
        { id: 'barneklipp-7-12', name: 'Barneklipp (7-12 år)', description: 'Større barn', price: 300, duration: 25 },
        { id: 'ungdomsklipp', name: 'Ungdomsklipp (13-17 år)', description: 'Tenåringer', price: 350, duration: 30 }
      ]
    },
    farge: {
      title: 'Farge & teknikk',
      icon: '🎨',
      items: [
        { id: 'helfarging-kort', name: 'Helfarging kort', description: 'Ensfarget, kort hår', price: 950, duration: 90 },
        { id: 'helfarging-medium', name: 'Helfarging medium', description: 'Ensfarget, medium lengde', price: 1100, duration: 105 },
        { id: 'helfarging-lang', name: 'Helfarging lang', description: 'Ensfarget, langt hår', price: 1300, duration: 120 },
        { id: 'ettervekst', name: 'Ettervekst', description: 'Farging av utvekst', price: 750, duration: 75 },
        { id: 'striper-delvis', name: 'Striper/highlights delvis', description: 'Foliestriper, delvis', price: 1100, duration: 90 },
        { id: 'striper-hel', name: 'Striper helfarging', description: 'Foliestriper, hele hodet', price: 1500, duration: 120 },
        { id: 'balayage', name: 'Balayage', description: 'Naturlig solkysset effekt', price: 1600, duration: 150 },
        { id: 'toning', name: 'Toning', description: 'Fargefriskning og glans', price: 600, duration: 60 }
      ]
    },
    behandlinger: {
      title: 'Behandlinger & pleie',
      icon: '✨',
      items: [
        { id: 'olaplex', name: 'Olaplex behandling', description: 'Reparerende og styrkende', price: 400, duration: 45 },
        { id: 'olaplex-tillegg', name: 'Olaplex tillegg', description: 'Ved annen behandling', price: 250, duration: 15 },
        { id: 'harkur', name: 'Hårkur intensiv', description: 'Dypvirkende pleie', price: 250, duration: 30 },
        { id: 'hodebunnsbehandling', name: 'Hodebunnsbehandling', description: 'Mot tørr/irritert hodebunn', price: 300, duration: 30 }
      ]
    },
    bryn: {
      title: 'Bryn & vipper',
      icon: '👁️',
      items: [
        { id: 'brynfarging', name: 'Brynfarging', description: 'Farge på bryn', price: 150, duration: 15 },
        { id: 'brynforming', name: 'Brynforming', description: 'Pinsett/voks', price: 150, duration: 15 },
        { id: 'bryn-komplett', name: 'Bryn komplett', description: 'Farging og forming', price: 250, duration: 25 },
        { id: 'vippefarging', name: 'Vippefarging', description: 'Farge på vipper', price: 200, duration: 20 },
        { id: 'bryn-vipper', name: 'Bryn og vipper', description: 'Komplett pakke', price: 350, duration: 35 }
      ]
    }
  };

  // ==========================================
  // Opening Hours Configuration
  // ==========================================
  const openingHours = {
    0: null, // Sunday - closed
    1: null, // Monday - closed
    2: { open: '09:00', close: '17:00' }, // Tuesday
    3: { open: '09:00', close: '17:00' }, // Wednesday
    4: { open: '09:00', close: '17:00' }, // Thursday
    5: { open: '09:00', close: '17:00' }, // Friday
    6: { open: '09:00', close: '15:00' }  // Saturday
  };

  // ==========================================
  // Booking State
  // ==========================================
  const bookingState = {
    currentStep: 1,
    category: null,
    service: null,
    date: null,
    dateFormatted: '',
    time: null,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerComments: '',
    termsAccepted: false
  };

  // ==========================================
  // DOM Elements
  // ==========================================
  const steps = bookingWizard.querySelectorAll('.booking-step');
  const panels = bookingWizard.querySelectorAll('.booking-panel');
  const categoryBtns = bookingWizard.querySelectorAll('.service-category-btn');
  const serviceOptionsContainer = document.getElementById('serviceOptions');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const calendarContainer = document.getElementById('bookingCalendar');

  // Navigation buttons
  const toStep2Btn = document.getElementById('toStep2');
  const toStep3Btn = document.getElementById('toStep3');
  const toStep4Btn = document.getElementById('toStep4');
  const backToStep1Btn = document.getElementById('backToStep1');
  const backToStep2Btn = document.getElementById('backToStep2');
  const backToStep3Btn = document.getElementById('backToStep3');
  const confirmBookingBtn = document.getElementById('confirmBooking');

  // ==========================================
  // Initialize Calendar
  // ==========================================
  let calendar = null;
  if (calendarContainer) {
    calendar = new BookingCalendar('bookingCalendar', {
      closedDays: [0, 1], // Sunday and Monday
      maxMonthsAhead: 3,
      onDateSelect: function(date, dateString) {
        bookingState.date = date;
        bookingState.dateFormatted = calendar.getSelectedDateFormatted();
        generateTimeSlots(date.getDay());

        // Reset time selection
        bookingState.time = null;
        if (toStep3Btn) toStep3Btn.disabled = true;
      }
    });
  }

  // ==========================================
  // Service Category Selection
  // ==========================================
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category;

      // Update visual state
      categoryBtns.forEach(b => b.classList.remove('service-category-btn--active'));
      this.classList.add('service-category-btn--active');

      // Update state
      bookingState.category = category;
      bookingState.service = null;

      // Render service options
      renderServiceOptions(category);

      // Disable next button until service is selected
      if (toStep2Btn) toStep2Btn.disabled = true;
    });
  });

  // ==========================================
  // Render Service Options
  // ==========================================
  function renderServiceOptions(categoryKey) {
    const category = services[categoryKey];
    if (!category || !serviceOptionsContainer) return;

    let html = `<h4 style="margin-bottom: 1rem; color: var(--color-primary);">${category.icon} ${category.title}</h4>`;

    category.items.forEach(item => {
      html += `
        <div class="service-option" data-service-id="${item.id}" data-category="${categoryKey}">
          <div class="service-option__radio"></div>
          <div class="service-option__info">
            <div class="service-option__name">${item.name}</div>
            <div class="service-option__meta">${item.description} · ca. ${item.duration} min</div>
          </div>
          <div class="service-option__price">${item.price} kr</div>
        </div>
      `;
    });

    serviceOptionsContainer.innerHTML = html;

    // Bind click events
    serviceOptionsContainer.querySelectorAll('.service-option').forEach(option => {
      option.addEventListener('click', function() {
        const serviceId = this.dataset.serviceId;
        const categoryKey = this.dataset.category;
        const service = services[categoryKey].items.find(s => s.id === serviceId);

        if (service) {
          // Update visual state
          serviceOptionsContainer.querySelectorAll('.service-option').forEach(o => {
            o.classList.remove('service-option--selected');
          });
          this.classList.add('service-option--selected');

          // Update state
          bookingState.service = service;

          // Enable next button
          if (toStep2Btn) toStep2Btn.disabled = false;
        }
      });
    });
  }

  // ==========================================
  // Generate Time Slots
  // ==========================================
  function generateTimeSlots(dayOfWeek) {
    const hours = openingHours[dayOfWeek];
    if (!hours || !timeSlotsContainer) {
      timeSlotsContainer.innerHTML = '<p class="text-muted text-center">Velg en dato for å se ledige tider</p>';
      return;
    }

    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);

    let currentHour = openHour;
    let currentMin = openMin;

    // Check if selected date is today
    const today = new Date();
    const isToday = bookingState.date && bookingState.date.toDateString() === today.toDateString();

    let html = '<div class="time-slots__grid">';

    while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

      let isDisabled = false;

      // Disable past times if today
      if (isToday) {
        const slotTime = new Date();
        slotTime.setHours(currentHour, currentMin, 0);
        const bufferTime = new Date();
        bufferTime.setHours(bufferTime.getHours() + 1);
        if (slotTime <= bufferTime) {
          isDisabled = true;
        }
      }

      // Simulate some random booked slots (demo only)
      if (!isDisabled && Math.random() < 0.1) {
        isDisabled = true;
      }

      const classes = ['time-slot'];
      if (isDisabled) classes.push('time-slot--disabled');

      html += `<div class="${classes.join(' ')}" data-time="${timeStr}">${timeStr}</div>`;

      // Increment by 30 minutes
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour++;
      }
    }

    html += '</div>';
    timeSlotsContainer.innerHTML = html;

    // Bind click events
    timeSlotsContainer.querySelectorAll('.time-slot:not(.time-slot--disabled)').forEach(slot => {
      slot.addEventListener('click', function() {
        // Update visual state
        timeSlotsContainer.querySelectorAll('.time-slot').forEach(s => {
          s.classList.remove('time-slot--selected');
        });
        this.classList.add('time-slot--selected');

        // Update state
        bookingState.time = this.dataset.time;

        // Enable next button
        if (toStep3Btn) toStep3Btn.disabled = false;
      });
    });
  }

  // ==========================================
  // Step Navigation
  // ==========================================
  function goToStep(stepNumber) {
    // Update step indicators
    steps.forEach((step, index) => {
      step.classList.remove('booking-step--active', 'booking-step--completed');
      if (index + 1 < stepNumber) {
        step.classList.add('booking-step--completed');
      } else if (index + 1 === stepNumber) {
        step.classList.add('booking-step--active');
      }
    });

    // Show/hide panels
    panels.forEach(panel => {
      panel.classList.remove('booking-panel--active');
    });

    const targetPanel = document.getElementById(`step${stepNumber}`);
    if (targetPanel) {
      targetPanel.classList.add('booking-panel--active');
    }

    bookingState.currentStep = stepNumber;

    // Scroll to top of wizard
    bookingWizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Step 1 to Step 2
  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', function() {
      if (bookingState.service) {
        goToStep(2);
      }
    });
  }

  // Step 2 to Step 3
  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', function() {
      if (bookingState.date && bookingState.time) {
        goToStep(3);
      }
    });
  }

  // Step 3 to Step 4 (validation + summary)
  if (toStep4Btn) {
    toStep4Btn.addEventListener('click', function() {
      const nameInput = document.getElementById('customerName');
      const emailInput = document.getElementById('customerEmail');
      const phoneInput = document.getElementById('customerPhone');
      const commentsInput = document.getElementById('customerComments');
      const termsCheckbox = document.getElementById('termsAccepted');

      let isValid = true;

      // Clear previous errors
      bookingWizard.querySelectorAll('.form-input--error').forEach(el => {
        el.classList.remove('form-input--error');
      });

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('form-input--error');
        isValid = false;
      } else {
        bookingState.customerName = nameInput.value.trim();
      }

      // Validate email
      if (!emailInput.value.trim() || !window.isValidEmail(emailInput.value)) {
        emailInput.classList.add('form-input--error');
        isValid = false;
      } else {
        bookingState.customerEmail = emailInput.value.trim();
      }

      // Validate phone
      if (!phoneInput.value.trim() || !window.isValidPhone(phoneInput.value)) {
        phoneInput.classList.add('form-input--error');
        isValid = false;
      } else {
        bookingState.customerPhone = phoneInput.value.trim();
      }

      // Terms checkbox
      if (!termsCheckbox.checked) {
        termsCheckbox.parentElement.style.color = 'var(--color-error)';
        isValid = false;
      } else {
        termsCheckbox.parentElement.style.color = '';
        bookingState.termsAccepted = true;
      }

      bookingState.customerComments = commentsInput ? commentsInput.value.trim() : '';

      if (isValid) {
        updateSummary();
        goToStep(4);
      }
    });
  }

  // Back buttons
  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => goToStep(1));
  }

  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => goToStep(2));
  }

  if (backToStep3Btn) {
    backToStep3Btn.addEventListener('click', () => goToStep(3));
  }

  // ==========================================
  // Update Summary
  // ==========================================
  function updateSummary() {
    document.getElementById('summaryService').textContent = bookingState.service ? bookingState.service.name : '';
    document.getElementById('summaryPrice').textContent = bookingState.service ? `${bookingState.service.price} kr` : '';
    document.getElementById('summaryDuration').textContent = bookingState.service ? `ca. ${bookingState.service.duration} min` : '';
    document.getElementById('summaryDate').textContent = bookingState.dateFormatted;
    document.getElementById('summaryTime').textContent = bookingState.time;
    document.getElementById('summaryName').textContent = bookingState.customerName;
    document.getElementById('summaryEmail').textContent = bookingState.customerEmail;
    document.getElementById('summaryPhone').textContent = bookingState.customerPhone;

    const commentsElement = document.getElementById('summaryComments');
    if (commentsElement) {
      commentsElement.textContent = bookingState.customerComments || 'Ingen kommentarer';
    }
  }

  // ==========================================
  // Confirm Booking
  // ==========================================
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', async function() {
      this.disabled = true;
      this.innerHTML = '<span class="loading"><span class="spinner"></span> Sender...</span>';

      try {
        // Simulate API call (replace with actual Resend API integration)
        await simulateBookingSubmission();

        // Hide all panels
        panels.forEach(panel => panel.classList.remove('booking-panel--active'));

        // Show success
        const successPanel = document.getElementById('stepSuccess');
        if (successPanel) {
          successPanel.style.display = 'block';

          // Update success message with email
          const successEmail = document.getElementById('successEmail');
          if (successEmail) {
            successEmail.textContent = bookingState.customerEmail;
          }

          // Update success summary
          document.getElementById('successService').textContent = bookingState.service.name;
          document.getElementById('successDate').textContent = bookingState.dateFormatted;
          document.getElementById('successTime').textContent = bookingState.time;
        }

        // Update step indicators to all completed
        steps.forEach(step => {
          step.classList.remove('booking-step--active');
          step.classList.add('booking-step--completed');
        });

      } catch (error) {
        console.error('Booking failed:', error);
        alert('Beklager, noe gikk galt. Vennligst prøv igjen eller kontakt oss direkte.');
        this.disabled = false;
        this.textContent = 'Bekreft bestilling';
      }
    });
  }

  // ==========================================
  // Simulate Booking Submission (Demo)
  // ==========================================
  function simulateBookingSubmission() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Booking submitted:', bookingState);
        resolve();
      }, 2000);
    });
  }

  // ==========================================
  // Remove Error on Input
  // ==========================================
  bookingWizard.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('form-input--error');
    });
  });

  console.log('Frisør Ozsimsekli - Booking.js loaded');
});
