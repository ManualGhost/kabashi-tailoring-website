const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const revealEls = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxVisual = document.getElementById('lightboxVisual');
const languageToggle = document.getElementById('languageToggle');
const translatableEls = document.querySelectorAll('[data-en][data-ar]');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

function setHeaderState() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const href = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('active', href === id);
      });
    }
  });
}, { threshold: 0.42, rootMargin: '-80px 0px -35% 0px' });
sections.forEach(section => sectionObserver.observe(section));

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    galleryCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

galleryCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.dataset.title || 'Kabashi Gallery Item';
    const image = card.dataset.image;
    const visualBg = getComputedStyle(card).getPropertyValue('--gallery-bg');

    lightboxTitle.textContent = title;
    lightboxVisual.style.background = visualBg;
    lightboxVisual.innerHTML = image ? `<img src="${image}" alt="${title} preview image">` : '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.focus();
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

let currentLanguage = 'en';
function setLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('is-arabic', lang === 'ar');
  languageToggle.textContent = lang === 'ar' ? 'English' : 'العربية';

  translatableEls.forEach(el => {
    const value = el.dataset[lang];
    if (!value) return;
    el.textContent = value;
  });
}

languageToggle.addEventListener('click', () => {
  setLanguage(currentLanguage === 'en' ? 'ar' : 'en');
});

// Preview images are generated from the supplied Kabashi references.
// Replace assets/photos/ with final approved high-resolution originals before launch.
