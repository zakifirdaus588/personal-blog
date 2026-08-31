const yearSpan = document.getElementById('year');

const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.getElementById('main-navigation');

if (menuToggle && mainNavigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNavigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });

  mainNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNavigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Buka menu');
    });
  });
}

const publicUrl = 'https://zakifirdaus588.github.io/personal-blog/website/index.html';
const shareableSections = ['summary', 'profile', 'about', 'values', 'journey', 'four-points', 'story', 'timeline', 'gallery'];

shareableSections.forEach((sectionId) => {
  const section = document.getElementById(sectionId);
  const heading = section?.querySelector('h2');
  const intro = section?.querySelector('.section-intro');

  if (!section || !heading || !intro) return;

  const share = document.createElement('div');
  share.className = 'share-control';
  share.innerHTML = `
    <button class="share-trigger" type="button" aria-expanded="false">Bagikan bagian ini</button>
    <div class="share-menu" role="menu">
      <button type="button" data-share="whatsapp" role="menuitem">WhatsApp</button>
      <button type="button" data-share="facebook" role="menuitem">Facebook</button>
      <button type="button" data-share="instagram" role="menuitem">Instagram</button>
      <button type="button" data-share="copy" role="menuitem">Salin link</button>
    </div>
  `;
  intro.appendChild(share);

  const trigger = share.querySelector('.share-trigger');
  const shareMenu = share.querySelector('.share-menu');
  const sectionUrl = `${publicUrl}#${sectionId}`;
  const shareText = `${heading.textContent.trim()} - Zaki's Journey`;

  trigger.addEventListener('click', () => {
    const isOpen = share.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  shareMenu.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-share]');
    if (!button) return;

    const service = button.dataset.share;
    if (service === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${sectionUrl}`)}`, '_blank', 'noopener');
    } else if (service === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sectionUrl)}`, '_blank', 'noopener');
    } else if (service === 'instagram' && navigator.share) {
      await navigator.share({ title: shareText, text: shareText, url: sectionUrl });
    } else if (service === 'instagram' || service === 'copy') {
      await navigator.clipboard.writeText(sectionUrl);
      button.textContent = 'Link tersalin';
      setTimeout(() => { button.textContent = service === 'instagram' ? 'Instagram' : 'Salin link'; }, 1600);
    }
  });
});

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');
const musicVolume = document.getElementById('music-volume');
const floatingControls = document.querySelector('.floating-controls');
const controlPanel = document.querySelector('.control-panel');

if (floatingControls && controlPanel) {
  let inactivityTimer = null;

  const showControls = () => {
    floatingControls.classList.add('is-visible');
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      floatingControls.classList.remove('is-visible');
    }, 1800);
  };

  floatingControls.addEventListener('mouseenter', showControls);
  floatingControls.addEventListener('mousemove', showControls);
  floatingControls.addEventListener('focusin', showControls);
  floatingControls.addEventListener('touchstart', showControls, { passive: true });
  document.addEventListener('mousemove', (event) => {
    if (event.clientX > window.innerWidth - 260 && event.clientY > window.innerHeight - 220) {
      showControls();
    }
  });
  document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    if (touch && touch.clientX > window.innerWidth - 180 && touch.clientY > window.innerHeight - 180) {
      showControls();
    }
  }, { passive: true });

  showControls();
}

if (musicToggle && backgroundMusic && musicVolume) {
  backgroundMusic.volume = Number(musicVolume.value) / 100;

  const setMusicState = (isPlaying) => {
    musicToggle.classList.toggle('is-on', isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicToggle.innerHTML = isPlaying
      ? '<span class="music-icon">♫</span><span>Musik</span>'
      : '<span class="music-icon">♪</span><span>Musik</span>';
    musicToggle.setAttribute('aria-label', isPlaying ? 'Matikan musik' : 'Nyalakan musik');
  };

  musicVolume.addEventListener('input', () => {
    backgroundMusic.volume = Number(musicVolume.value) / 100;
  });

  setMusicState(false);

  musicToggle.addEventListener('click', async () => {
    const isPlaying = !backgroundMusic.paused;

    if (isPlaying) {
      backgroundMusic.pause();
      setMusicState(false);
      return;
    }

    try {
      await backgroundMusic.play();
      setMusicState(true);
    } catch (error) {
      setMusicState(false);
      console.warn('Music playback was blocked until user interaction:', error);
    }
  });
}

const autoScrollToggle = document.getElementById('autoscroll-toggle');
const scrollSpeedInput = document.getElementById('scroll-speed');
let autoScrollFrame = null;
let autoScrollActive = false;

if (autoScrollToggle && scrollSpeedInput) {
  const updateAutoScrollText = () => {
    const speed = Number(scrollSpeedInput.value);
    const label = autoScrollActive ? 'Auto Scroll On' : 'Auto Scroll Off';
    autoScrollToggle.textContent = label;
    autoScrollToggle.setAttribute('aria-pressed', String(autoScrollActive));
    autoScrollToggle.classList.toggle('is-on', autoScrollActive);

    const speedText = autoScrollActive ? `Speed ${speed}x` : 'Speed';
    scrollSpeedInput.setAttribute('aria-label', speedText);
  };

  const stopAutoScroll = () => {
    autoScrollActive = false;
    if (autoScrollFrame) {
      cancelAnimationFrame(autoScrollFrame);
      autoScrollFrame = null;
    }
    updateAutoScrollText();
  };

  const startAutoScroll = () => {
    autoScrollActive = true;
    const speedFactor = Number(scrollSpeedInput.value) * 0.8;

    const tick = () => {
      if (!autoScrollActive) return;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const nextScroll = currentScroll + speedFactor;

      if (nextScroll >= maxScroll) {
        window.scrollTo({ top: maxScroll, behavior: 'auto' });
        stopAutoScroll();
        return;
      }

      window.scrollTo({ top: nextScroll, behavior: 'auto' });
      autoScrollFrame = requestAnimationFrame(tick);
    };

    updateAutoScrollText();
    autoScrollFrame = requestAnimationFrame(tick);
  };

  autoScrollToggle.addEventListener('click', () => {
    if (autoScrollActive) {
      stopAutoScroll();
      return;
    }

    startAutoScroll();
  });

  scrollSpeedInput.addEventListener('input', () => {
    updateAutoScrollText();

    if (autoScrollActive) {
      stopAutoScroll();
      startAutoScroll();
    }
  });

  updateAutoScrollText();
}

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-nav.prev');
const nextButton = document.querySelector('.lightbox-nav.next');

if (lightbox && lightboxImage && lightboxCaption && closeButton && prevButton && nextButton) {
  const galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));

  galleryImages.forEach((img) => {
    if (img.parentElement && img.parentElement.classList.contains('gallery-item')) {
      return;
    }

    const figure = document.createElement('figure');
    figure.className = 'gallery-item';

    if (img.classList.contains('wide')) figure.classList.add('wide');
    if (img.classList.contains('tall')) figure.classList.add('tall');

    const caption = document.createElement('figcaption');
    caption.textContent = img.alt || 'Galeri Zaki';

    img.parentNode.insertBefore(figure, img);
    figure.appendChild(img);
    figure.appendChild(caption);
  });

  const updatedGalleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = (index + updatedGalleryImages.length) % updatedGalleryImages.length;
    const activeImage = updatedGalleryImages[currentIndex];

    if (!activeImage) return;

    lightboxImage.src = activeImage.src;
    lightboxImage.alt = activeImage.alt;
    lightboxCaption.textContent = activeImage.alt || 'Galeri Zaki';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  updatedGalleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });

  prevButton.addEventListener('click', () => openLightbox(currentIndex - 1));
  nextButton.addEventListener('click', () => openLightbox(currentIndex + 1));

  closeButton.addEventListener('click', () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;

    if (event.key === 'Escape') {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (event.key === 'ArrowLeft') {
      openLightbox(currentIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      openLightbox(currentIndex + 1);
    }
  });
}
