// Intense World Gym — Senior Frontend Interactive Architecture
// Pure vanilla JavaScript engineered for high-speed responsiveness, accessibility & flawless interactions

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll blur & dimension transition
  const header = document.getElementById('siteHeader');
  
  function handleHeaderScroll() {
    if (!header) return;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 2. Mobile Drawer Navigation & Touch Handling
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer a');

  function openMobileMenu() {
    if (!mobileToggle || !mobileDrawer || !drawerOverlay) return;
    mobileToggle.classList.add('open');
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileToggle || !mobileDrawer || !drawerOverlay) return;
    mobileToggle.classList.remove('open');
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // 3. Animated Number Counters for Hero Stats
  const counterElements = document.querySelectorAll('.counter-num');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1600; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = target * ease;

        counter.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // 4. Scroll Reveal Intersection Observer (fade-in-up with staggered cascades)
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger counter animation if stats row enters
        if (entry.target.classList.contains('hero-bottom-stats') || entry.target.querySelector('.counter-num')) {
          animateCounters();
        }

        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach((el) => {
    const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
    el.style.transitionDelay = `${siblingIndex * 0.06}s`;
    observer.observe(el);
  });

  // Fallback: If hero elements are already in viewport on load, ensure they appear
  setTimeout(() => {
    document.querySelectorAll('.hero-section .fade-in-up').forEach(el => el.classList.add('visible'));
    animateCounters();
  }, 100);

  // 5. Smooth Anchor Scrolling with Precise Header Offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMobileMenu();

        // Calculate offset based on screen width
        const isMobile = window.innerWidth < 1024;
        const headerOffset = isMobile ? 70 : 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    });
  });

  // 6. Active Navigation Link Highlighter on Scroll
  const trackedSections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 140;
    trackedSections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.desktop-nav a[href="#${sectionId}"]`);
      const mobileLink = document.querySelector(`.mobile-nav-links a[href="#${sectionId}"]`);
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        if (navLink) navLink.classList.add('active');
        if (mobileLink) mobileLink.classList.add('active');
      } else {
        if (navLink) navLink.classList.remove('active');
        if (mobileLink) mobileLink.classList.remove('active');
      }
    });
  }, { passive: true });

  // 7. Branch Gallery Thumbnail Switcher
  const thumbBtns = document.querySelectorAll('.branch-thumb-btn');
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSrc = this.getAttribute('data-img');
      const caption = this.getAttribute('data-caption') || '';
      const gallery = this.closest('.branch-gallery');
      if (gallery) {
        const mainImg = gallery.querySelector('.branch-gallery-main img');
        const mainTrigger = gallery.querySelector('.branch-gallery-main');
        if (mainImg && targetSrc) {
          mainImg.style.opacity = '0.35';
          setTimeout(() => {
            mainImg.src = targetSrc;
            mainImg.style.opacity = '1';
            if (mainTrigger) {
              mainTrigger.setAttribute('data-img', targetSrc);
              mainTrigger.setAttribute('data-caption', caption);
            }
          }, 100);
        }
        gallery.querySelectorAll('.branch-thumb-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // 8. Lightbox Modal Functionality (Enhanced for mobile & desktop)
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, caption) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || 'Intense World Gym Facility';
    }
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const src = this.getAttribute('data-img') || this.querySelector('img')?.src;
      const caption = this.getAttribute('data-caption') || '';
      if (src) openLightbox(src, caption);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('open')) {
      closeLightbox();
    }
  });

  // 9. Package Plan Tab Switcher (Strength vs Cardio) with Guaranteed Visibility Fix
  const packageTabBtns = document.querySelectorAll('.package-tab-btn');
  const packageGridStrength = document.getElementById('packageGridStrength');
  const packageGridCardio = document.getElementById('packageGridCardio');

  packageTabBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      packageTabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tab = this.getAttribute('data-package-tab');

      if (tab === 'strength') {
        if (packageGridStrength) {
          packageGridStrength.style.display = 'grid';
          packageGridStrength.querySelectorAll('.fade-in-up').forEach(card => card.classList.add('visible'));
          setTimeout(() => { packageGridStrength.style.opacity = '1'; }, 20);
        }
        if (packageGridCardio) {
          packageGridCardio.style.opacity = '0';
          packageGridCardio.style.display = 'none';
        }
      } else if (tab === 'cardio') {
        if (packageGridCardio) {
          packageGridCardio.style.display = 'grid';
          packageGridCardio.querySelectorAll('.fade-in-up').forEach(card => card.classList.add('visible'));
          setTimeout(() => { packageGridCardio.style.opacity = '1'; }, 20);
        }
        if (packageGridStrength) {
          packageGridStrength.style.opacity = '0';
          packageGridStrength.style.display = 'none';
        }
      }
    });
  });

  // 10. Branch Filter Tabs (All / Chikkaballapur / Shidlaghatta) with Guaranteed Visibility
  const branchTabBtns = document.querySelectorAll('.branch-tab-btn');
  const branchCards = document.querySelectorAll('.branch-card');

  branchTabBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      branchTabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');

      branchCards.forEach(card => {
        const cardBranch = card.getAttribute('data-branch');
        if (filter === 'all' || cardBranch === filter) {
          card.style.display = 'flex';
          card.classList.add('visible');
          card.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));
          setTimeout(() => {
            card.style.opacity = '1';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 11. Real-Time Branch Open/Closed Live Status Clock
  function updateLiveBranchStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    const chikkaStatusEl = document.getElementById('chikkaLiveStatus');
    const shidStatusEl = document.getElementById('shidLiveStatus');

    // Chikkaballapur (1st Branch): Mon–Sat 4:00 AM – 10:00 PM Continuously (Sunday Closed)
    if (chikkaStatusEl) {
      if (day === 0) { // Sunday
        chikkaStatusEl.innerHTML = '<span class="status-indicator" style="background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span> CLOSED TODAY (SUNDAY) • OPENS MON 4:00 AM';
        chikkaStatusEl.style.color = '#ef4444';
      } else if (currentTime >= 4 && currentTime < 22) {
        chikkaStatusEl.innerHTML = '<span class="status-indicator"></span> OPEN NOW • 4:00 AM – 10:00 PM (CLOSES 10 PM)';
        chikkaStatusEl.style.color = 'var(--success)';
      } else {
        chikkaStatusEl.innerHTML = '<span class="status-indicator" style="background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span> CLOSED NOW • OPENS 4:00 AM';
        chikkaStatusEl.style.color = '#ef4444';
      }
    }

    // Shidlaghatta (2nd Branch): Mon–Sat 5:00 AM – 10:00 AM & 5:00 PM – 10:00 PM (Sunday Closed)
    if (shidStatusEl) {
      if (day === 0) { // Sunday
        shidStatusEl.innerHTML = '<span class="status-indicator" style="background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span> CLOSED TODAY (SUNDAY) • OPENS MON 5:00 AM';
        shidStatusEl.style.color = '#ef4444';
      } else if (currentTime >= 5 && currentTime < 10) {
        // Morning Slot
        shidStatusEl.innerHTML = '<span class="status-indicator"></span> OPEN NOW (MORNING: 5:00 AM – 10:00 AM)';
        shidStatusEl.style.color = 'var(--success)';
      } else if (currentTime >= 10 && currentTime < 17) {
        // Afternoon Break
        shidStatusEl.innerHTML = '<span class="status-indicator" style="background: var(--gold); box-shadow: 0 0 8px var(--gold);"></span> AFTERNOON BREAK • EVENING OPENS 5:00 PM';
        shidStatusEl.style.color = 'var(--gold)';
      } else if (currentTime >= 17 && currentTime < 22) {
        // Evening Slot
        shidStatusEl.innerHTML = '<span class="status-indicator"></span> OPEN NOW (EVENING: 5:00 PM – 10:00 PM)';
        shidStatusEl.style.color = 'var(--success)';
      } else {
        // Night / Early Morning
        shidStatusEl.innerHTML = '<span class="status-indicator" style="background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span> CLOSED NOW • MORNING OPENS 5:00 AM';
        shidStatusEl.style.color = '#ef4444';
      }
    }
  }

  updateLiveBranchStatus();
  setInterval(updateLiveBranchStatus, 60000); // Live refresh every minute
});

// 12. Interactive Goal Finder WhatsApp Submitter (Mobile & Desktop Verified)
window.submitGoalFinder = function() {
  const goal = document.getElementById('userGoal')?.value || 'Strength & Muscle Hypertrophy';
  const branch = document.getElementById('preferredBranch')?.value || '1st Branch — Chikkaballapur (Main HQ - Kote)';
  const exp = document.getElementById('trainingExperience')?.value || 'Beginner (New to lifting)';
  const timing = document.getElementById('preferredTiming')?.value || 'Morning (5:00 AM - 9:00 AM)';

  const text = `Hello Intense World Gym!%0A%0AI would like to inquire about membership and training plans.%0A%0A🏋️ *Goal:* ${encodeURIComponent(goal)}%0A📍 *Preferred Branch:* ${encodeURIComponent(branch)}%0A⚡ *Experience Level:* ${encodeURIComponent(exp)}%0A⏰ *Preferred Time:* ${encodeURIComponent(timing)}%0A%0APlease share membership details!`;

  const waUrl = `https://wa.me/918618932114?text=${text}`;
  
  const opened = window.open(waUrl, '_blank');
  if (!opened || opened.closed || typeof opened.closed === 'undefined') {
    window.location.href = waUrl;
  }
};
