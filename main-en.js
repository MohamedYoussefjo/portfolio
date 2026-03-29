/**
 * Main JS — Typing animation, scroll reveals, counter, navigation
 */
document.addEventListener('DOMContentLoaded', function () {

  /* ================================================================
     1. Initialize Lucide Icons
     ================================================================ */
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ================================================================
     2. Typing Animation
     ================================================================ */
  var typingEl = document.getElementById('typing-text');
  var phrases = [
    'Cybersecurity Enthusiast',
    'CompTIA Security+ Certified',
    'CTF Competitor — 5272 pts',
    'Penetration Testing & Forensics',
    'Big Data & Machine Learning',
    'Security Engineering @ UTT',
    'Ethical Hacker & Bug Hunter',
    'CNAM Cybersecurity Analyst',
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typeSpeed = 80;
  var deleteSpeed = 40;
  var pauseEnd = 2000;
  var pauseStart = 500;

  function type() {
    var current = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    var delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  if (typingEl) type();

  /* ================================================================
     3. Navbar — Scroll Effect & Active Link
     ================================================================ */
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('.section');

  function onScroll() {
    var scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ================================================================
     4. Mobile Navigation Toggle
     ================================================================ */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-links');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ================================================================
     5. Scroll Reveal Animation
     ================================================================ */
  var reveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    var triggerBottom = window.innerHeight * 0.88;

    reveals.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal();

  /* ================================================================
     6. Counter Animation (Hero Stats)
     ================================================================ */
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  var statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;

    var heroSection = document.getElementById('hero');
    if (!heroSection) return;

    var rect = heroSection.getBoundingClientRect();
    // Start when hero is in view
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      statsAnimated = true;

      statNumbers.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease out cubic
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(step);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  // Run once on load in case hero is already visible
  setTimeout(animateCounters, 500);

  /* ================================================================
     7. Skill Bar Animation
     ================================================================ */
  var skillFills = document.querySelectorAll('.skill-fill[data-width]');
  var skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;

    var skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    var rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      skillsAnimated = true;
      skillFills.forEach(function (bar) {
        var w = bar.getAttribute('data-width');
        // Slight stagger
        setTimeout(function () {
          bar.style.width = w + '%';
        }, Math.random() * 400);
      });
    }
  }

  window.addEventListener('scroll', animateSkills, { passive: true });
  animateSkills();

  /* ================================================================
     8. Smooth Scroll for Anchor Links
     ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ================================================================
     9. Contact Form Handler (demo — logs to console)
     ================================================================ */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // In production, send to backend or service like Formspree
      console.log('Contact form submission:', data);

      // Visual feedback
      var btn = form.querySelector('.form-submit');
      var originalHTML = btn.innerHTML;
      btn.innerHTML = '<span style="color: var(--neon-cyan);">Message Sent!</span>';
      btn.style.pointerEvents = 'none';

      setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = '';
        form.reset();
        // Re-init icons on the button
        if (window.lucide) lucide.createIcons();
      }, 3000);
    });
  }

  /* ================================================================
     10. Parallax-lite on Hero (mouse tilt)
     ================================================================ */
  var heroContent = document.querySelector('.hero-content');
  if (heroContent && window.innerWidth > 768) {
    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 8;
      var y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroContent.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
  }

});
