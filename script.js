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
      const msg = encodeURIComponent('Halo Zyer! 👋 Saya mau tanya-tanya soal paket Foto Outdoor. Boleh dibantu?');
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
  document.querySelectorAll('[data-video-link]').forEach(el => {
    if (!el.getAttribute('href') || el.getAttribute('href') === '#') {
      el.href = CONFIG.instagramUrl;
    }
  });
}


/* ===== Gallery Lightbox ===== */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose   = document.getElementById('lightbox-close');

function openLightbox(src, category = '', title = '') {
  if (!lightbox || !src) return;
  lightboxImg.src = src;
  if (lightboxCaption) {
    if (category || title) {
      lightboxCaption.textContent = category && title ? `${category} — ${title}` : (title || category);
      lightboxCaption.style.display = 'inline-block';
    } else {
      lightboxCaption.style.display = 'none';
    }
  }
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (lightboxImg) lightboxImg.src = '';
    if (lightboxCaption) lightboxCaption.textContent = '';
  }, 300);
}

function bindGallery() {
  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(
        item.dataset.src,
        item.dataset.category || '',
        item.dataset.title || ''
      );
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
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


/* ===== Pricing Tabs ===== */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tab');
  const panels = document.querySelectorAll('.pricing-tab-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs active state
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels active state
      panels.forEach(panel => {
        if (panel.dataset.panel === target) {
          panel.classList.add('active');
          // Trigger smooth reveal for cards inside active panel
          panel.querySelectorAll('.fade-in').forEach((card, idx) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, idx * 80);
          });
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}


/* ===== Video Platform Modal ===== */
const videoModal = document.getElementById('video-modal');
const videoModalClose = document.getElementById('video-modal-close');
const videoLinkInstagram = document.getElementById('video-link-instagram');
const videoLinkTiktok = document.getElementById('video-link-tiktok');

function openVideoModal(igUrl, tiktokUrl) {
  if (!videoModal) return;
  if (videoLinkInstagram) videoLinkInstagram.href = igUrl || CONFIG.instagramUrl;
  if (videoLinkTiktok) videoLinkTiktok.href = tiktokUrl || CONFIG.tiktokUrl;
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  if (!videoModal) return;
  videoModal.classList.remove('active');
  document.body.style.overflow = '';
}

function initVideoModal() {
  document.querySelectorAll('[data-video-modal]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const igUrl = item.dataset.instagram || CONFIG.instagramUrl;
      const tiktokUrl = item.dataset.tiktok || CONFIG.tiktokUrl;
      openVideoModal(igUrl, tiktokUrl);
    });
  });

  videoModalClose?.addEventListener('click', closeVideoModal);
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal?.classList.contains('active')) {
      closeVideoModal();
    }
  });
}


/* ===== Init All ===== */
document.addEventListener('DOMContentLoaded', () => {
  bindWAButtons();
  bindFloatingWA();
  bindGenericWALinks();
  bindSocialLinks();
  bindGallery();
  initVideoModal();
  initFadeIn();
  initSmoothScroll();
  initPricingTabs();
});
