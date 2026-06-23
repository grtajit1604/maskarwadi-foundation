/* =============================================
   MASKARWADI FOUNDATION — Main JavaScript
   ============================================= */

'use strict';

// ===== Initialize AOS =====
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration: 800,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    once: true,
    offset: 80,
    disable: window.innerWidth < 480 ? 'mobile' : false
  });
});

// ==== DOM Ready =====
document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // 1. PRELOADER
  // ============================================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      setTimeout(function () { preloader.classList.add('hidden'); }, 600);
    });
    setTimeout(function () {
      if (!preloader.classList.contains('hidden')) preloader.classList.add('hidden');
    }, 3000);
  }

  // ============================================================
  // 2. HERO SLIDESHOW
  // ============================================================
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 1) {
    let current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  // ============================================================
  // 3. MOBILE MENU
  // ============================================================
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', function () {
      const isActive = navbar.classList.toggle('active');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close on link click
    if (navMenu) {
      navMenu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          navbar.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (navbar.classList.contains('active') &&
          !navbar.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================
  // 4. STICKY HEADER & ACTIVE NAV
  // ============================================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  // Multi-page active link detection
  function setActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    // Default to index.html if empty
    if (currentPage === '' || currentPage.endsWith('/')) currentPage = 'index.html';

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      // Handle same-page anchor links (e.g., #donate, #volunteer)
      if (href && href.startsWith('#')) {
        var section = document.querySelector('section[id="' + href.slice(1) + '"]');
        if (section && currentPage === 'index.html') {
          // Only auto-highlight on homepage for same-page anchors
        }
      }
      // Check if the link href matches the current page
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // Also update active nav for same-page anchor scrolling
  function updateActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === '' || currentPage.endsWith('/')) currentPage = 'index.html';

    // Only do scroll-based highlighting on the homepage
    if (currentPage === 'index.html') {
      var sections = document.querySelectorAll('section[id]');
      var scrollPos = window.scrollY + 200;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var bottom = top + section.offsetHeight;
        var id = section.getAttribute('id');
        navLinks.forEach(function (link) {
          var href = link.getAttribute('href');
          if (href === '#' + id && scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
          }
        });
      });
    }
  }

  window.addEventListener('scroll', function () {
    updateHeader();
    updateActiveNav();
  }, { passive: true });

  updateHeader();
  setActiveNav();

  // ============================================================
  // 5. SCROLL TO TOP
  // ============================================================
  const scrollBtn = document.getElementById('scrollToTop');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // 6. DARK/LIGHT MODE
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function setTheme(mode) {
    if (mode === 'dark') {
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', mode);
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(html.classList.contains('dark-mode') ? 'light' : 'dark');
    });
  }

  // ============================================================
  // 7. ANIMATED COUNTERS
  // ============================================================
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.stat-number').forEach(function (counter) {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 2000;
      let startTime = null;

      function update(now) {
        if (!startTime) startTime = now;
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ============================================================
  // 8. STATS OBSERVER (trigger counters)
  // ============================================================
  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);

  // ============================================================
  // 9. GALLERY LIGHTBOX
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.querySelector('.lightbox-caption');

  if (lightbox && lightboxImg) {
    let currentIndex = 0;
    const galleryItems = document.querySelectorAll('.gallery-item');

    function openLightbox(index) {
      currentIndex = index;
      const item = galleryItems[index];
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-info h4');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery image';
        if (lightboxCaption && title) lightboxCaption.textContent = title.textContent;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function prevImage() {
      if (currentIndex > 0) openLightbox(currentIndex - 1);
      else openLightbox(galleryItems.length - 1);
    }

    function nextImage() {
      if (currentIndex < galleryItems.length - 1) openLightbox(currentIndex + 1);
      else openLightbox(0);
    }

    galleryItems.forEach(function (item, idx) {
      item.addEventListener('click', function () { openLightbox(idx); });
    });

    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    const prevBtn = document.querySelector('.lightbox-prev');
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    const nextBtn = document.querySelector('.lightbox-next');
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });

    // Click outside image
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // ============================================================
  // 10. DONATE AMOUNT SELECTOR
  // ============================================================
  document.querySelectorAll('.donate-amount').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.donate-amount').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  // ============================================================
  // 11. COPY UPI
  // ============================================================
  window.copyUPI = function () {
    const code = document.querySelector('.upi-clipboard code');
    if (code) {
      const text = code.textContent.trim();
      const copyIcon = document.querySelector('.copy-btn i');
      const original = copyIcon ? copyIcon.className : '';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          if (copyIcon) { copyIcon.className = 'fas fa-check'; }
          setTimeout(function () { if (copyIcon) copyIcon.className = original || 'fas fa-copy'; }, 2000);
        }).catch(function () { fallbackCopy(text, copyIcon, original); });
      } else {
        fallbackCopy(text, copyIcon, original);
      }
    }
  };

  function fallbackCopy(text, icon, original) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (icon) { icon.className = 'fas fa-check'; }
      setTimeout(function () { if (icon) icon.className = original || 'fas fa-copy'; }, 2000);
    } catch (e) { /* silent */ }
    document.body.removeChild(ta);
  }

  // ============================================================
  // 12. CONTACT FORM
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(function () {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #6cb50d, #1a9148)';
        setTimeout(function () {
          contactForm.reset();
          btn.innerHTML = orig;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  // ============================================================
  // 13. VOLUNTEER FORM
  // ============================================================
  const volunteerForm = document.getElementById('volunteerForm');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = volunteerForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
      btn.disabled = true;

      setTimeout(function () {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Registration Successful!';
        btn.style.background = 'linear-gradient(135deg, #6cb50d, #1a9148)';
        setTimeout(function () {
          volunteerForm.reset();
          btn.innerHTML = orig;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  // ============================================================
  // 14. PARALLAX HERO (desktop only)
  // ============================================================
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', function () {
      const hero = document.querySelector('.hero');
      if (!hero) return;
      const scrolled = window.scrollY;
      const slideshow = hero.querySelector('.hero-bg-slideshow');
      const content = hero.querySelector('.hero-content');
      if (slideshow) slideshow.style.transform = 'translateY(' + (scrolled * 0.25) + 'px)';
      if (content) {
        content.style.transform = 'translateY(' + (-scrolled * 0.12) + 'px)';
        content.style.opacity = Math.max(1 - (scrolled / 600), 0.3);
      }
    }, { passive: true });
  }

  // ============================================================
  // 15. DONATE BUTTON ON DONATE CARD
  // ============================================================
  document.querySelectorAll('.donate-card .btn-block').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const active = document.querySelector('.donate-amount.active');
      const amount = active ? active.getAttribute('data-amount') : '2000';
      alert('Thank you for your generosity!\n\nYou chose to donate ₹' + (amount === 'custom' ? 'Custom Amount' : amount) + '.\n\nUPI ID: maskarwadi@upi\n\nWe will redirect you to the payment gateway.');
    });
  });

  // ============================================================
  // 16. HERO PARALLAX ON RESIZE
  // ============================================================
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth <= 768) {
        const sh = document.querySelector('.hero-bg-slideshow');
        const hc = document.querySelector('.hero-content');
        if (sh) sh.style.transform = '';
        if (hc) { hc.style.transform = ''; hc.style.opacity = ''; }
      }
    }, 250);
  });

  // ============================================================
  // 17. PROJECT PROGRESS BARS (set CSS custom property)
  // ============================================================
  document.querySelectorAll('.project-progress').forEach(function (container) {
    const bar = container.querySelector('.progress-bar');
    if (bar) {
      const width = bar.getAttribute('style') ? bar.style.width : '0%';
      // The width is already inline, but we need to animate it
      // Reset and animate via observer
      bar.style.width = '0%';
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
            bar.style.width = width;
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      observer.observe(bar);
    }
  });

  // ============================================================
  // 18. CONSOLE
  // ============================================================
  console.log('%c🌿 Maskarwadi Foundation', 'font-size: 24px; font-weight: bold; color: #1a9148;');
  console.log('%cTogether Towards a Better Tomorrow', 'font-size: 14px; color: #07688f;');
  console.log('%c📧 maskarwadifoundation@gmail.com', 'font-size: 12px; color: #8896ab;');

}); // End DOMContentLoaded
