/**
 * Queens of Change Foundation - Interactive Scripting
 * Handles: Dark Mode, Sticky Header, Scrollspy, Mobile Hamburger Menu,
 *          Intersection Observer for Scroll Reveals & Animated Count-up Counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initStickyHeader();
  initMobileMenu();
  initScrollspy();
  initScrollReveal();
  initAnimatedCounters();
});

/* ==========================================
   1. Dark Mode / Theme Toggle Logic
   ========================================== */
function initDarkMode() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Retrieve previous choice or fall back to system preferences
  const currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  // Set initial state
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Toggle event handler
  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

/* ==========================================
   2. Sticky Header Animation on Scroll
   ========================================== */
function initStickyHeader() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run immediately in case user loads page scrolled down
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/* ==========================================
   3. Mobile Responsive Menu Toggle
   ========================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when a navigation item is clicked
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================
   4. Scrollspy (Highlight Menu Based on Current Viewport)
   ========================================== */
function initScrollspy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  if (!navLinks.length || !sections.length) return;

  const scrollspyHandler = () => {
    const scrollPosition = window.scrollY + 160; // Offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollspyHandler);
  scrollspyHandler(); // Run initially
}

/* ==========================================
   5. Scroll Reveal Animations (Intersection Observer)
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null, // Viewport
    threshold: 0.12, // Reveal when 12% is visible
    rootMargin: '0px 0px -40px 0px' // Slightly trigger before crossing fully
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animated in
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================
   6. Animated Metrics Count-up Counters
   ========================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.impact-number');
  if (!counters.length) return;

  const formatNumber = (num, target) => {
    if (target >= 100000) {
      // 200000 -> "2,00,000+"
      return num.toLocaleString('en-IN') + '+';
    } else if (target >= 1000) {
      // 50000 -> "50,000+"
      return num.toLocaleString('en-IN') + '+';
    } else if (target === 100) {
      // 100 -> "100%"
      return num + '%';
    } else {
      // 500 -> "500+"
      return num + '+';
    }
  };

  const startCounting = (counterElement) => {
    const target = parseInt(counterElement.getAttribute('data-target'), 10);
    const duration = 2000; // Total count duration in milliseconds
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const easeOutQuad = (t) => t * (2 - t); // Easing curve for premium feel

    const timer = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentValue = Math.min(Math.floor(progress * target), target);
      
      counterElement.textContent = formatNumber(currentValue, target);

      if (frame >= totalFrames) {
        clearInterval(timer);
        counterElement.textContent = formatNumber(target, target);
      }
    }, frameRate);
  };

  // Observe statistics section to trigger counters
  const statsSection = document.querySelector('.impact-grid');
  if (!statsSection) return;

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => startCounting(counter));
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, { threshold: 0.1 });

  statsObserver.observe(statsSection);
}
