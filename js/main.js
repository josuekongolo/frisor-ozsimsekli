/**
 * Frisør Ozsimsekli - Main JavaScript
 * Navigation, scroll effects, and general interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // ==========================================
  // Mobile Navigation
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.getElementById('headerNav');
  const header = document.getElementById('header');

  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('menu-toggle--active');
      headerNav.classList.toggle('header__nav--open');
      document.body.style.overflow = headerNav.classList.contains('header__nav--open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    const navLinks = headerNav.querySelectorAll('.header__menu-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('menu-toggle--active');
        headerNav.classList.remove('header__nav--open');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!headerNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('menu-toggle--active');
        headerNav.classList.remove('header__nav--open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // Header Scroll Effect
  // ==========================================
  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // Fade-in Animation on Scroll
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(element => {
      fadeObserver.observe(element);
    });
  }

  // ==========================================
  // Contact Form Handler
  // ==========================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameInput = this.querySelector('#contactName');
      const emailInput = this.querySelector('#contactEmail');
      const subjectSelect = this.querySelector('#contactSubject');
      const messageInput = this.querySelector('#contactMessage');

      let isValid = true;

      // Clear previous errors
      this.querySelectorAll('.form-input--error, .form-textarea--error').forEach(el => {
        el.classList.remove('form-input--error', 'form-textarea--error');
      });

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('form-input--error');
        isValid = false;
      }

      // Validate email
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        emailInput.classList.add('form-input--error');
        isValid = false;
      }

      // Validate message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('form-textarea--error');
        isValid = false;
      }

      if (isValid) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"><span class="spinner"></span> Sender...</span>';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
          alert('Takk for din henvendelse! Vi svarer så snart som mulig.');
          this.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1500);
      }
    });

    // Remove error on input
    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('form-input--error', 'form-textarea--error');
      });
    });
  }

  // ==========================================
  // Helper Functions
  // ==========================================
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function isValidPhone(phone) {
    // Norwegian phone format: 8 digits, optionally with country code
    const cleaned = phone.replace(/\s/g, '');
    const re = /^(\+47)?[0-9]{8}$/;
    return re.test(cleaned);
  }

  // Make helper functions available globally for booking
  window.isValidEmail = isValidEmail;
  window.isValidPhone = isValidPhone;

  console.log('Frisør Ozsimsekli - Main.js loaded');
});
