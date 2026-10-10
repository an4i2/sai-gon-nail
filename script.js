document.addEventListener('DOMContentLoaded', function () {
  // Header scroll effect
  var header = document.querySelector('.header');
  var scrollThreshold = 50;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Initial check
  updateHeader();

  // Throttled scroll event
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Smooth scroll with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#0') return;
      
      var targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      
      var headerHeight = document.querySelector('.header').offsetHeight;
      var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      var nav = document.querySelector('.nav');
      var menuToggle = document.querySelector('.menu-toggle');
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Mobile menu toggle
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu on link click (Hick's Law: reduce choices after selection)
    var navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form validation and submission
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var isValid = true;
      
      // Clear previous errors
      contactForm.querySelectorAll('.form-error').forEach(function(errorEl) {
        errorEl.textContent = '';
      });
      contactForm.querySelectorAll('input, select, textarea').forEach(function(field) {
        field.classList.remove('error');
      });
      
      // Validate name
      var name = document.getElementById('name');
      if (!name || !name.value.trim()) {
        isValid = false;
        name.classList.add('error');
        var nameError = name.parentElement.querySelector('.form-error');
        if (nameError) nameError.textContent = 'Bitte geben Sie Ihren Namen ein.';
      }
      
      // Validate email
      var email = document.getElementById('email');
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
      
      // Validate phone (optional but must be valid if provided)
      var phone = document.getElementById('phone');
      if (phone && phone.value.trim() && !/^[\d\s\+\-\(\)]{7,}$/.test(phone.value.trim())) {
        isValid = false;
        phone.classList.add('error');
        var phoneError = phone.parentElement.querySelector('.form-error');
        if (phoneError) phoneError.textContent = 'Bitte geben Sie eine gültige Telefonnummer ein.';
      }
      
      if (isValid) {
        // Show success message
        var successEl = contactForm.querySelector('.form-success');
        if (!successEl) {
          successEl = document.createElement('div');
          successEl.className = 'form-success';
          successEl.setAttribute('role', 'status');
          successEl.setAttribute('aria-live', 'polite');
          contactForm.insertBefore(successEl, contactForm.querySelector('.form-group'));
        }
        successEl.textContent = 'Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.';
        
        // Reset form
        contactForm.reset();
        
        // Scroll to success message
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide success message after 5 seconds
        setTimeout(function () {
          successEl.remove();
        }, 5000);
      }
    });
    
    // Clear error on input
    contactForm.querySelectorAll('input, select, textarea').forEach(function(field) {
      field.addEventListener('input', function() {
        this.classList.remove('error');
        var errorEl = this.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  // Intersection Observer for scroll animations (Cognitive Load, Flow)
  // Observe elements that need fade-in animation on scroll
  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Add animation class when element enters viewport
        if (!entry.target.classList.contains('fade-in')) {
          entry.target.classList.add('fade-in-up');
        }
        // Unobserve after animation (performance optimization)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all section h2 and service cards for staggered animation
  var animatedElements = document.querySelectorAll('section h2, .service-card, .about-content p, .contact-form');
  animatedElements.forEach(function (el) {
    observer.observe(el);
  });

  // Lazy loading image handling
  document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
      img.addEventListener('error', function() {
        // Handle image loading errors gracefully
        console.log('Image failed to load:', this.src);
      });
    }
  });

  // Parallax effect on location image (Subtle perceived performance improvement)
  // ~100-200ms feedback for smooth motion
  var locationImg = document.querySelector('.location img');
  if (locationImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var parallaxContainer = locationImg.closest('.location');
    
    if (parallaxContainer) {
      window.addEventListener('scroll', function () {
        var scrollPosition = window.scrollY;
        var elementOffset = parallaxContainer.offsetTop;
        var elementHeight = parallaxContainer.offsetHeight;
        var windowHeight = window.innerHeight;
        
        // Calculate parallax factor based on scroll position
        if (scrollPosition + windowHeight > elementOffset && scrollPosition < elementOffset + elementHeight) {
          var relativeScroll = (scrollPosition - elementOffset + windowHeight) / (elementHeight + windowHeight);
          var parallaxOffset = (relativeScroll - 0.5) * 15; // Subtle 15px movement
          locationImg.style.transform = 'translateY(' + parallaxOffset + 'px)';
        }
      }, false);
    }
  }
});
