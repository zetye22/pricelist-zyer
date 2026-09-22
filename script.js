/* ============================================
   ZYER — Outdoor Photo | script.js
   - Navbar scroll behavior
   - Smooth scroll
   - WhatsApp message builder
   - Gallery lightbox
   - Fade-in on scroll (Intersection Observer)
   ============================================ */

/* ===== CONFIG — GANTI DI SINI ===== */
const CONFIG = {
  // TODO: Ganti dengan nomor WA aktif Zyer (format: 628xxxxx)
  waNumber: '6285754259606',

  // TODO: Ganti dengan link Instagram Zyer
  instagramUrl: 'https://instagram.com/zyer.memoto',

  // TODO: Ganti dengan link TikTok Zyer
  tiktokUrl: 'https://tiktok.com/@zyer.memoto',
};
/* ==================================== */


/* ===== Navbar Scroll ===== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ===== WhatsApp Message Builder ===== */
/**
 * Build a WA link with a pre-filled message template.
 * @param {string} packageName  - Nama paket (misal: "Single")
 * @param {string} duration     - Durasi sesi (misal: "1 Jam")
 * @param {string} [addon='']   - Add-on yang dipilih (opsional)
 */
function buildWALink(packageName, duration, addon = '') {
  const addonText = addon ? `Tambahan: ${addon}. ` : '';
  const message = `Halo Zyer! 👋 Saya mau booking Paket ${packageName} (Durasi: ${duration}). ${addonText}Untuk tanggal [isi tanggal], apakah jadwal masih tersedia?`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.waNumber}?text=${encoded}`;
}

/**
 * Bind WA button clicks using data attributes.
 * Usage in HTML: data-wa-package="Single" data-wa-duration="1 Jam"
 */
function bindWAButtons() {
  document.querySelectorAll('[data-wa-package]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkg      = btn.dataset.waPackage   || '';
      const duration = btn.dataset.waDuration  || '';
      const addon    = btn.dataset.waAddon     || '';
      window.open(buildWALink(pkg, duration, addon), '_blank');
    });
  });
}

/* WA floating button & generic WA links */
function bindFloatingWA() {
  const floatBtn = document.getElementById('float-wa');
  if (floatBtn) {
    floatBtn.addEventListener('click', () => {
      const msg = encodeURIComponent('Halo Zyer! 👋 Saya mau tanya-tanya soal paket Foto Outdoor. Boleh dibantu?');
      window.open(`https://wa.me/${CONFIG.waNumber}?text=${msg}`, '_blank');
    });
  }
}

function bindGenericWALinks() {
  document.querySelectorAll('[data-wa-generic]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = encodeURIComponent('Halo Zyer! 👋 Saya mau tanya-tanya soal paket foto wisuda. Boleh dibantu?');
      window.open(`https://wa.me/${CONFIG.waNumber}?text=${msg}`, '_blank');
    });
  });
}

/* Update social links from config */
function bindSocialLinks() {
  document.querySelectorAll('[data-social="instagram"]').forEach(el => {
    el.href = CONFIG.instagramUrl;
  });
  document.querySelectorAll('[data-social="tiktok"]').forEach(el => {
    el.href = CONFIG.tiktokUrl;
  });
}


/* ===== Gallery Lightbox ===== */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src) {
  if (!lightbox || !src) return;
  lightboxImg.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
}

function bindGallery() {
  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => openLightbox(item.dataset.src));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}


/* ===== Fade-in on Scroll (Intersection Observer) ===== */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger effect using index
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


/* ===== Smooth Scroll for anchor links ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70; // navbar height offset
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}


/* ===== Init All ===== */
document.addEventListener('DOMContentLoaded', () => {
  bindWAButtons();
  bindFloatingWA();
  bindGenericWALinks();
  bindSocialLinks();
  bindGallery();
  initFadeIn();
  initSmoothScroll();
});
