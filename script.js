document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var isValid = true;
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var phone = document.getElementById('phone');
      var message = document.getElementById('message');
      var errors = [name, email, phone, message];

      errors.forEach(function (field) {
        if (!field) return;
        field.classList.remove('error');
        var errorEl = field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });

      if (!name || !name.value.trim()) {
        isValid = false;
        name.classList.add('error');
        var nameError = name.parentElement.querySelector('.form-error');
        if (nameError) nameError.textContent = 'Bitte geben Sie Ihren Namen ein.';
      }

      if (!email || !email.value.trim()) {
        isValid = false;
        email.classList.add('error');
        var emailError = email.parentElement.querySelector('.form-error');
        if (emailError) emailError.textContent = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        isValid = false;
        email.classList.add('error');
        var emailError2 = email.parentElement.querySelector('.form-error');
        if (emailError2) emailError2.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      }

      if (phone && phone.value.trim() && !/^[\d\s\+\-\(\)]{7,}$/.test(phone.value.trim())) {
        isValid = false;
        phone.classList.add('error');
        var phoneError = phone.parentElement.querySelector('.form-error');
        if (phoneError) phoneError.textContent = 'Bitte geben Sie eine gültige Telefonnummer ein.';
      }

      if (isValid) {
        var successEl = contactForm.querySelector('.form-success');
        if (!successEl) {
          successEl = document.createElement('div');
          successEl.className = 'form-success';
          successEl.setAttribute('role', 'status');
          successEl.setAttribute('aria-live', 'polite');
          contactForm.insertBefore(successEl, contactForm.firstChild);
        }
        successEl.textContent = 'Vielen Dank fur Ihre Nachricht! Wir melden uns bald bei Ihnen.';
        successEl.classList.add('visible');
        contactForm.reset();
        setTimeout(function () {
          successEl.classList.remove('visible');
        }, 5000);
      }
    });

    contactForm.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('error');
        var errorEl = field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  var revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  var locationImg = document.querySelector('.location-image-wrapper img');
  if (locationImg) {
    locationImg.addEventListener('load', function () {
      locationImg.parentElement.classList.add('loaded');
    });
  }
});