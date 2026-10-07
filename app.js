// Intense World Gym — Senior Frontend Interactive Architecture
// Crafted with 100% pure vanilla JS, optimized performance & zero dependencies

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll blur & dimension transition
  const header = document.getElementById('siteHeader');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

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
    threshold: 0.12,
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

  // 4. Smooth Anchor Scrolling
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

  // 5. Active Navigation Link Highlighter on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 140;
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
  }, { passive: true });

  // 6. Branch Gallery Thumbnail Switcher
  const thumbBtns = document.querySelectorAll('.branch-thumb-btn');
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetSrc = this.getAttribute('data-img');
      const caption = this.getAttribute('data-caption') || '';
      const gallery = this.closest('.branch-gallery');
      if (gallery) {
        const mainImg = gallery.querySelector('.branch-gallery-main img');
        const mainTrigger = gallery.querySelector('.branch-gallery-main');
        if (mainImg && targetSrc) {
          mainImg.style.opacity = '0.3';
          setTimeout(() => {
            mainImg.src = targetSrc;
            mainImg.style.opacity = '1';
            if (mainTrigger) {
              mainTrigger.setAttribute('data-img', targetSrc);
              mainTrigger.setAttribute('data-caption', caption);
            }
          }, 120);
        }
        gallery.querySelectorAll('.branch-thumb-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // 7. Lightbox Modal Functionality (Human UX Craft)
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, caption) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || 'Intense World Gym Facility';
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', function() {
      const src = this.getAttribute('data-img') || this.querySelector('img')?.src;
      const caption = this.getAttribute('data-caption') || '';
      if (src) openLightbox(src, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('open')) {
      closeLightbox();
    }
  });

  // 8. Package Plan Tab Switcher (Strength vs Cardio)
  const packageTabBtns = document.querySelectorAll('.package-tab-btn');
  const packageGridStrength = document.getElementById('packageGridStrength');
  const packageGridCardio = document.getElementById('packageGridCardio');

  packageTabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      packageTabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tab = this.getAttribute('data-package-tab');

      if (tab === 'strength') {
        if (packageGridStrength) {
          packageGridStrength.style.display = 'grid';
          setTimeout(() => { packageGridStrength.style.opacity = '1'; }, 30);
        }
        if (packageGridCardio) {
          packageGridCardio.style.opacity = '0';
          packageGridCardio.style.display = 'none';
        }
      } else if (tab === 'cardio') {
        if (packageGridCardio) {
          packageGridCardio.style.display = 'grid';
          setTimeout(() => { packageGridCardio.style.opacity = '1'; }, 30);
        }
        if (packageGridStrength) {
          packageGridStrength.style.opacity = '0';
          packageGridStrength.style.display = 'none';
        }
      }
    });
  });

  // 9. Branch Filter Tabs (All / Chikkaballapur / Shidlaghatta)
  const branchTabBtns = document.querySelectorAll('.branch-tab-btn');
  const branchCards = document.querySelectorAll('.branch-card');

  branchTabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      branchTabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');

      branchCards.forEach(card => {
        const cardBranch = card.getAttribute('data-branch');
        if (filter === 'all' || cardBranch === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 10. Real-Time Branch Open/Closed Live Status Clock
  function updateLiveBranchStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    const chikkaStatusEl = document.getElementById('chikkaLiveStatus');
    const shidStatusEl = document.getElementById('shidLiveStatus');

    // Chikkaballapur: Open daily 4:00 AM – 10:00 PM Continuously (4.0 to 22.0)
    if (chikkaStatusEl) {
      if (currentTime >= 4 && currentTime < 22) {
        chikkaStatusEl.innerHTML = '<span class="status-indicator"></span> OPEN NOW • CLOSES 10:00 PM';
        chikkaStatusEl.style.color = 'var(--success)';
      } else {
        chikkaStatusEl.innerHTML = '<span class="status-indicator" style="background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span> CLOSED NOW • OPENS 4:00 AM';
        chikkaStatusEl.style.color = '#ef4444';
      }
    }

    // Shidlaghatta: Mon–Sat 5:00 AM – 10:00 AM & 5:00 PM – 10:00 PM (Sunday Closed)
    if (shidStatusEl) {
      if (day === 0) { // Sunday
        shidStatusEl.innerHTML = '<span class="status-indicator" style="background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span> CLOSED TODAY (SUNDAY) • OPENS MON 5 AM';
        shidStatusEl.style.color = '#ef4444';
      } else if (currentTime >= 5 && currentTime < 10) {
        // Morning Slot
        shidStatusEl.innerHTML = '<span class="status-indicator"></span> OPEN NOW (MORNING) • CLOSES 10:00 AM';
        shidStatusEl.style.color = 'var(--success)';
      } else if (currentTime >= 10 && currentTime < 17) {
        // Afternoon Break
        shidStatusEl.innerHTML = '<span class="status-indicator" style="background: var(--gold); box-shadow: 0 0 8px var(--gold);"></span> AFTERNOON BREAK • OPENS 5:00 PM';
        shidStatusEl.style.color = 'var(--gold)';
      } else if (currentTime >= 17 && currentTime < 22) {
        // Evening Slot
        shidStatusEl.innerHTML = '<span class="status-indicator"></span> OPEN NOW (EVENING) • CLOSES 10:00 PM';
        shidStatusEl.style.color = 'var(--success)';
      } else {
        // Night / Early Morning
        shidStatusEl.innerHTML = '<span class="status-indicator" style="background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span> CLOSED NOW • OPENS 5:00 AM';
        shidStatusEl.style.color = '#ef4444';
      }
    }
  }

  updateLiveBranchStatus();
  setInterval(updateLiveBranchStatus, 60000); // Live refresh every minute
});

// 11. Interactive Goal Finder WhatsApp Submitter
window.submitGoalFinder = function() {
  const goal = document.getElementById('userGoal')?.value || 'Strength & Conditioning';
  const branch = document.getElementById('preferredBranch')?.value || 'Chikkaballapur';
  const exp = document.getElementById('trainingExperience')?.value || 'Beginner';
  const timing = document.getElementById('preferredTiming')?.value || 'Morning';

  const text = `Hello Intense World Gym!%0A%0AI would like to inquire about membership and training plans.%0A%0A🏋️ *Goal:* ${encodeURIComponent(goal)}%0A📍 *Preferred Branch:* ${encodeURIComponent(branch)}%0A⚡ *Experience Level:* ${encodeURIComponent(exp)}%0A⏰ *Preferred Time:* ${encodeURIComponent(timing)}%0A%0APlease share membership details!`;

  window.open(`https://wa.me/918618932114?text=${text}`, '_blank');
};
