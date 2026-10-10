document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      if (name && email && name.value.trim() && email.value.trim()) {
        alert('Vielen Dank fur Ihre Nachricht! Wir melden uns bald bei Ihnen.');
        contactForm.reset();
      } else {
        alert('Bitte fuellen Sie mindestens Name und E-Mail aus.');
      }
    });
  }
});