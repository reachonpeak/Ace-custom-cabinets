/* ============================================================
   ACE Custom Cabinets — JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----- Mobile Menu / Side Drawer ----- //
  const hamburger = document.getElementById('hamburger');
  const sideDrawer = document.getElementById('sideDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function toggleDrawer() {
    hamburger.classList.toggle('active');
    sideDrawer.classList.toggle('open');
    drawerOverlay.classList.toggle('open');
    document.body.style.overflow = sideDrawer.classList.contains('open') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleDrawer);
    drawerOverlay.addEventListener('click', toggleDrawer);
    // Close on link click
    sideDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (sideDrawer.classList.contains('open')) toggleDrawer();
      });
    });
  }

  // ----- Sticky Header ----- //
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ----- Hero Ken Burns effect ----- //
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  // ----- Scroll Reveal Animations ----- //
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ----- Testimonials Carousel ----- //
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testimonialsDots');

  if (track && dotsContainer) {
    const slides = track.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;
    let autoPlay;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `testimonials__dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dotsContainer.querySelectorAll('.testimonials__dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function startAutoPlay() {
      autoPlay = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlay);
    }

    startAutoPlay();

    // Pause on hover
    const slider = document.querySelector('.testimonials__slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', startAutoPlay);
    }
  }

  // ----- Gallery Filter ----- //
  const filterBtns = document.querySelectorAll('.gallery-filter__btn');
  const galleryItems = document.querySelectorAll('.gallery-masonry__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ----- Lightbox ----- //
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox) {
    document.querySelectorAll('.gallery-masonry__item img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  // ----- Contact Form Validation ----- //
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      let valid = true;

      formData.forEach((value, key) => {
        const field = contactForm.querySelector(`[name="${key}"]`);
        if (!value.trim() && field.hasAttribute('required')) {
          field.style.borderColor = 'var(--crimson)';
          valid = false;
        } else {
          field.style.borderColor = 'var(--light-gray)';
        }
      });

      if (valid) {
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: var(--charcoal-deep); color: white; padding: 3rem 4rem;
          z-index: 3000; text-align: center; font-family: var(--font-heading);
          letter-spacing: 0.1em;
        `;
        successDiv.innerHTML = `
          <h3 style="font-size: 1.2rem; font-weight: 300; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.2em;">Thank You</h3>
          <p style="font-size: 0.85rem; color: #999; font-weight: 300;">We'll get back to you within 24 hours.</p>
        `;
        document.body.appendChild(successDiv);
        contactForm.reset();

        setTimeout(() => successDiv.remove(), 3500);
      }
    });
  }

  // ----- Smooth Scroll for Anchor Links ----- //
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
