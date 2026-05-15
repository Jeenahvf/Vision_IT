tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                50: "#f7f8fa",
                100: "#e7eaf0",
                200: "#ccd2db",
                300: "#aab2bb",
                400: "#FFC500",
                500: "#253242",
                600: "#1b2531",
                700: "#151d28",
                800: "#111821",
                900: "#09101a",
                accent: "#FFC500",
              },
              ink: { DEFAULT: "#253242", soft: "#42536a", faint: "#b4bbc6" },
              paper: "#f7f8fa",
            },
            fontFamily: {
              head: ["Rajdhani", "sans-serif"],
              body: ["Barlow", "sans-serif"],
              mono: ['"Share Tech Mono"', "monospace"],
            },
          },
        },
      };
      
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Custom cursor (dot + trailing ring) ---- */
  const cursor = document.querySelector('.cursor');
  const trail = document.querySelector('.cursor-trail');
  // Only enable on devices with a fine pointer (real mouse) — skip touch screens.
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (cursor && trail && finePointer) {
    document.body.classList.add('cursor-enabled');

    let mouseX = window.innerWidth / 2,  mouseY = window.innerHeight / 2;
    let trailX = mouseX, trailY = mouseY;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Ring eases toward the pointer for a smooth trailing effect
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      trail.style.left = trailX + 'px';
      trail.style.top  = trailY + 'px';
      requestAnimationFrame(animateTrail);
    };
    requestAnimationFrame(animateTrail);

    // Grow + tint over interactive elements
    const interactive = 'a, button, input, textarea, select, label, .filter-btn';
    document.querySelectorAll(interactive).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        trail.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        trail.classList.remove('cursor-hover');
      });
    });

    // Click feedback
    document.addEventListener('mousedown', () => {
      cursor.classList.add('cursor-click');
      trail.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('cursor-click');
      trail.classList.remove('cursor-click');
    });

    // Hide when the pointer leaves the window, show again on return
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      trail.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      trail.style.opacity = '1';
    });
  }

  /* ---- Navbar: shadow on scroll ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('nav-scrolled', window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('is-active', open);
      document.body.classList.toggle('overflow-hidden', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('is-active');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  /* ---- Highlight active nav link based on current page ---- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.getAttribute('data-nav') === path) {
      link.classList.add('nav-active');
    }
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ---- Gallery filter ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('filter-active'));
        btn.classList.add('filter-active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.gallery-item').forEach(item => {
          const show = f === 'all' || item.dataset.cat === f;
          item.style.opacity = show ? '1' : '0.25';
          item.style.transform = show ? 'scale(1)' : 'scale(0.96)';
          item.style.pointerEvents = show ? 'auto' : 'none';
        });
      });
    });
  }

  /* ---- Contact form ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const success = document.getElementById('formSuccess');
      if (success) {
        success.classList.remove('hidden');
        success.classList.add('flex');
      }
      contactForm.reset();
      setTimeout(() => {
        if (success) {
          success.classList.add('hidden');
          success.classList.remove('flex');
        }
      }, 4500);
    });
  }

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

// for count
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // The lower the number, the faster the animation

  counters.forEach(counter => {
    const animate = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;

      // Calculate the increment per frame
      const increment = target / speed;

      if (count < target) {
        // Round up and update text
        counter.innerText = Math.ceil(count + increment);
        // Call function again on the next frame
        setTimeout(animate, 10);
      } else {
        // Ensure it ends on the exact number and adds any suffixes (like +)
        counter.innerText = target.toLocaleString() + (target > 50 ? '+' : '');
      }
    };

    animate();
  });
