// Intense World Gym - Smooth Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll blur and resize
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    mobileToggle.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
    drawerOverlay.classList.toggle('open');
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
    drawerOverlay.addEventListener('click', toggleMobileMenu);
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });
  }

  // 3. Scroll Reveal Intersection Observer (fade-in-up)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });

  // 4. Smooth Anchor Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. Active Nav Link Highlighter on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.desktop-nav a[href*="${sectionId}"]`);
      const mobileLink = document.querySelector(`.mobile-nav-links a[href*="${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navLink) navLink.classList.add('active');
        if (mobileLink) mobileLink.classList.add('active');
      } else {
        if (navLink) navLink.classList.remove('active');
        if (mobileLink) mobileLink.classList.remove('active');
      }
    });
  });

  // 6. Branch Gallery Thumbnail Switcher (Shidlaghatta Photo Gallery)
  const thumbBtns = document.querySelectorAll('.branch-thumb-btn');
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetSrc = this.getAttribute('data-img');
      const gallery = this.closest('.branch-gallery');
      if (gallery) {
        const mainImg = gallery.querySelector('.branch-gallery-main img');
        if (mainImg && targetSrc) {
          mainImg.style.opacity = '0.3';
          setTimeout(() => {
            mainImg.src = targetSrc;
            mainImg.style.opacity = '1';
          }, 120);
        }
        gallery.querySelectorAll('.branch-thumb-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
});
