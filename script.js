/* ====== Basic helpers ====== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ====== Loader ====== */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 600);
  }
});

/* ====== Mobile nav toggle ====== */
const navToggleBtns = $$('.burger');
navToggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mobile = document.getElementById('mobile-nav');
    if (!mobile) return;
    mobile.classList.toggle('open');
    mobile.style.display = mobile.classList.contains('open') ? 'block' : 'none';
  });
});

/* ====== Theme (day/night) toggle: persists in localStorage ====== */
function setTheme(dark) {
  if (dark) {
    document.documentElement.style.setProperty('--bg','#020617');
    document.documentElement.style.setProperty('--card','#071021');
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--card');
  }
  localStorage.setItem('air3-theme-dark', !!dark);
}

const themeButtons = $$('.theme-btn');
themeButtons.forEach(btn => btn.addEventListener('click', () => {
  const isDark = localStorage.getItem('air3-theme-dark') === 'true';
  setTheme(!isDark);
  // toggle icon
  $$('.theme-btn').forEach(b => {
    b.innerHTML = !isDark ? '<i class="fa-regular fa-moon"></i>' : '<i class="fa-regular fa-sun"></i>';
  });
}));

// initialize theme
if (localStorage.getItem('air3-theme-dark') === 'true') {
  setTheme(true);
  $$('.theme-btn').forEach(b => b.innerHTML = '<i class="fa-regular fa-moon"></i>');
} else {
  $$('.theme-btn').forEach(b => b.innerHTML = '<i class="fa-regular fa-sun"></i>');
}

/* ====== Typing animation (hero) ====== */
const words = ["Drone Videographer", "Photographer", "Content Creator", "Aerial Storyteller"];
let ti = 0;
let charIdx = 0;
const typingEl = document.getElementById('typing');

function typeLoop() {
  if (!typingEl) return;
  const current = words[ti];
  charIdx++;
  typingEl.textContent = current.slice(0, charIdx);
  if (charIdx === current.length) {
    setTimeout(() => {
      // delete
      const deleting = setInterval(() => {
        charIdx--;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          clearInterval(deleting);
          ti = (ti + 1) % words.length;
          setTimeout(typeLoop, 250);
        }
      }, 40);
    }, 1200);
  } else {
    setTimeout(typeLoop, 80);
  }
}
setTimeout(typeLoop, 400);

/* ====== Scroll reveal for sections ====== */
const revealOnScroll = () => {
  const sections = document.querySelectorAll('.section, .about-section, .hero');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 90) {
      section.querySelectorAll('*').forEach(el => el.style.opacity = '1');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ====== Smooth scroll for nav links that reference sections ====== */
$$('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
});

/* ====== Video modal logic ====== */
const videoThumbs = $$('.video-thumb');
const modal = document.getElementById('video-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = modal ? modal.querySelector('.modal-close') : null;

videoThumbs.forEach(t => {
  t.addEventListener('click', () => {
    const src = t.dataset.src;
    if (!src) return;
    if (modal && modalBody) {
      modal.classList.add('open');
      modalBody.innerHTML = `<iframe src="${src}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      document.body.style.overflow = 'hidden';
    }
  });
});

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  });
}
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      modalBody.innerHTML = '';
      document.body.style.overflow = '';
    }
  });
}

/* ====== Scroll to top ====== */
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  if (!scrollTopBtn) return;
  if (window.scrollY > 350) scrollTopBtn.style.display = 'flex';
  else scrollTopBtn.style.display = 'none';
});
if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* ====== Mobile nav close on link click ====== */
const mobileNav = document.getElementById('mobile-nav');
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      mobileNav.style.display = 'none';
    });
  });
}

/* ====== Contact form - simple local handling (no backend) ====== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('form-msg');
    msgEl.textContent = 'Thank you! Message prepared — open WhatsApp to send a booking message.';
    msgEl.style.color = 'var(--accent-2)';
    // Compose message and open Whatsapp as a fallback:
    const name = contactForm.name?.value || 'Guest';
    const email = contactForm.email?.value || '';
    const message = contactForm.message?.value || '';
    const text = `Hi Rohit, I am ${name}. ${message} (Email: ${email})`;
    const encoded = encodeURIComponent(text);
    // show a button to continue to WhatsApp
    setTimeout(() => {
      if (confirm("Open WhatsApp to send the message?")) {
        window.open(`https://wa.me/message/JAPY2SHUUAGJI1?text=${encoded}`, '_blank');
      }
    }, 600);
  });
}

/* ====== Accessibility: close modal with ESC ====== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      modalBody.innerHTML = '';
      document.body.style.overflow = '';
    }
  }
});
