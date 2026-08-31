const yearSpan = document.getElementById('year');

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
