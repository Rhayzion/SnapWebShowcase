// Let's get GSAP ready to make things dance
gsap.registerPlugin(ScrollTrigger, Draggable);

// Time to make that camera shutter go *click*
const snapshotSound = new Audio('https://www.soundjay.com/mechanical/camera-shutter-click-01.mp3');
function playSnapshotSound() {
  snapshotSound.currentTime = 0;
  snapshotSound.play().catch(() => {});
}

// Custom cursor shenanigans, because who needs a boring pointer?
const cursor = document.getElementById('cursor-trail');
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX - 7.5,
      y: e.clientY - 7.5,
      duration: 0.2,
      ease: 'power2.out',
    });
  });

  document.querySelectorAll('.hero-video, .story-main-image, .story-gallery-item, .service-card, .contact-form button, .menu-link, .prev, .next').forEach(item => {
    item.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    item.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// 3D tilt effect to make images feel like they're flirting with you
function add3DTilt(element) {
  if (window.innerWidth <= 768) return;
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / rect.height) * 15;
    const rotateY = -(mouseX / rect.width) * 15;
    gsap.to(element, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  });
}

document.querySelectorAll('.hero-video, .story-main-image, .story-gallery-item, .about-image, .service-card').forEach(add3DTilt);

// Split text into chars for fancy animations
function splitTextToChars(element) {
  const text = element.textContent;
  element.innerHTML = text
    .split('')
    .map(char => `<span class="char">${char}</span>`)
    .join('');
}

document.querySelectorAll('.hero-text-line, .story-title, .story-description, .story-meta, .about-title, .about-description, .services-title, .service-title, .service-description, .testimonials-title, .testimonial-quote, .testimonial-author, .contact-title, .preloader-counter, .slider-text').forEach(splitTextToChars);

const hamburger = document.querySelector('.hamburger');
const fullscreenMenu = document.querySelector('.fullscreen-menu');
const menuClose = document.querySelector('.menu-close');
const menuLinks = document.querySelectorAll('.menu-link');
const titleLines = document.querySelectorAll('.title-line');
const titleCounters = document.querySelectorAll('.title-counter');
let menuOpen = false;

// Real-time clock because we’re classy like that
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const period = now.getHours() >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  document.getElementById('menu-clock').textContent = `${displayHours}:${minutes} ${period}`;
}
updateClock();
setInterval(updateClock, 1000);

// Toggle menu with a dramatic entrance
function toggleMenu() {
  if (!menuOpen) {
    openMenu();
  } else {
    closeMenu();
  }
}

function openMenu() {
  menuOpen = true;
  hamburger.textContent = 'CLOSE';
  playSnapshotSound();
  
  fullscreenMenu.style.opacity = '0';
  fullscreenMenu.classList.add('open');
  
  gsap.to(fullscreenMenu, { opacity: 1, duration: 0.8, ease: 'power4.out' });
  gsap.to(menuLinks, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.2 });
  gsap.to(titleLines, { opacity: 1, stagger: 0.2, duration: 0.8, ease: 'power4.out', delay: 0.4 });
  gsap.to(titleCounters, { opacity: 1, stagger: 0.2, duration: 0.8, ease: 'power4.out', delay: 0.6 });
}

function closeMenu() {
  menuOpen = false;
  hamburger.textContent = 'MENU';
  playSnapshotSound();
  
  gsap.to(menuLinks, { opacity: 0, y: 20, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
  gsap.to(titleLines, { opacity: 0, stagger: 0.2, duration: 0.5, ease: 'power4.out' });
  gsap.to(titleCounters, { opacity: 0, stagger: 0.2, duration: 0.5, ease: 'power4.out' });
  
  gsap.to(fullscreenMenu, {
    opacity: 0,
    duration: 0.8,
    ease: 'power4.out',
    onComplete: () => {
      fullscreenMenu.classList.remove('open');
      fullscreenMenu.style.opacity = '';
      gsap.set(menuLinks, { opacity: 0, y: 20 });
      gsap.set(titleLines, { opacity: 0 });
      gsap.set(titleCounters, { opacity: 0 });
    },
  });
}

hamburger.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', closeMenu);

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    playSnapshotSound();
    closeMenu();
  });
});

// Hero video stack for that cinematic vibe
const heroVideos = document.querySelectorAll('.hero-video');
let currentVideoIndex = 0;

heroVideos.forEach(video => {
  video.play().catch(() => {});
});

function updateHeroStack(direction = 'next') {
  const prevIndex = currentVideoIndex;
  currentVideoIndex = direction === 'next'
    ? (currentVideoIndex + 1) % heroVideos.length
    : (currentVideoIndex - 1 + heroVideos.length) % heroVideos.length;

  const currentVideo = heroVideos[prevIndex];
  const nextVideo = heroVideos[currentVideoIndex];

  gsap.to(currentVideo, {
    opacity: 0,
    scale: 0.8,
    rotate: direction === 'next' ? 50 : -40,
    zIndex: 1,
    duration: 0.5,
    ease: 'power2.out',
    onStart: () => playSnapshotSound(),
  });

  gsap.to(nextVideo, {
    opacity: 1,
    scale: 1,
    rotate: 0,
    zIndex: 3,
    duration: 0.5,
    ease: 'power2.out',
  });

  heroVideos.forEach((vid, i) => {
    if (i !== prevIndex && i !== currentVideoIndex) {
      gsap.to(vid, {
        opacity: 0.5,
        scale: 0.9,
        rotate: i === 0 ? -20 : i === 1 ? 0 : 25,
        zIndex: 2,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  });

  gsap.to('.slider-text', {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      document.querySelector('.slider-text').textContent = `00${currentVideoIndex + 1}'`;
      gsap.to('.slider-text', { opacity: 1, duration: 0.2 });
    },
  });
}

document.querySelector('.next').addEventListener('click', () => updateHeroStack('next'));
document.querySelector('.prev').addEventListener('click', () => updateHeroStack('prev'));

// Swipe support for mobile folks
let touchStartX = 0;
document.querySelector('.hero-video-stack').addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

document.querySelector('.hero-video-stack').addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) {
    updateHeroStack('next');
  } else if (touchEndX - touchStartX > 50) {
    updateHeroStack('prev');
  }
});

gsap.to(heroVideos, {
  x: (i) => (i - 1) * 100,
  y: (i) => (i % 2 === 0 ? 70 : -70),
  rotate: (i) => (i - 1) * 105,
  scale: 0.8,
  opacity: 0.3,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

// Preloader to keep people guessing
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  const counter = document.querySelector('.preloader-counter');
  let count = 1;

  const media = document.querySelectorAll('img, video');
  let loadedMedia = 0;
  const totalMedia = media.length;

  function updateCounter() {
    counter.textContent = `00${count}'`;
    count = count % 3 + 1;
  }

  const counterInterval = setInterval(updateCounter, 500);

  function startPreloader() {
    clearInterval(counterInterval);
    counter.textContent = `001'`;
    gsap.to(counter, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        preloader.classList.add('hidden');
        gsap.to('.hero-flash', {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          repeat: 1,
          yoyo: true,
          onStart: () => playSnapshotSound(),
        });
        gsap.to(heroVideos[0], {
          opacity: 1,
          scale: 1,
          rotate: 15,
          zIndex: 3,
          duration: 1.5,
          ease: 'power4.out',
        });
        gsap.to(heroVideos[1], {
          opacity: 0.5,
          scale: 0.9,
          rotate: -15,
          zIndex: 2,
          duration: 1.5,
          ease: 'power4.out',
          delay: 0.2,
        });
        gsap.to(heroVideos[2], {
          opacity: 0.5,
          scale: 0.9,
          rotate: 0,
          zIndex: 1,
          duration: 1.5,
          ease: 'power4.out',
          delay: 0.4,
        });
        gsap.from('.hero-text-line .char', {
          opacity: 0,
          y: 50,
          stagger: 0.05,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
        gsap.to('.hero-subtitle', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
        gsap.to('.slider-text', {
          opacity: 1,
          duration: 0.5,
          delay: 0.5,
        });
      },
    });
  }

  gsap.to(counter, { opacity: 1, duration: 0.5, ease: 'power2.out' });

  if (totalMedia === 0) {
    startPreloader();
  } else {
    media.forEach(item => {
      if (item.tagName === 'IMG' && item.complete || item.tagName === 'VIDEO' && item.readyState >= 3) {
        loadedMedia++;
        if (loadedMedia === totalMedia) startPreloader();
      } else {
        item.addEventListener('load', () => {
          loadedMedia++;
          if (loadedMedia === totalMedia) startPreloader();
        });
        item.addEventListener('loadeddata', () => {
          loadedMedia++;
          if (loadedMedia === totalMedia) startPreloader();
        });
        item.addEventListener('error', () => {
          loadedMedia++;
          if (loadedMedia === totalMedia) startPreloader();
        });
        }
      });
      setTimeout(startPreloader, 5000);
    }
});

// Story sections with fancy scroll effects
document.querySelectorAll('.story-section').forEach((section) => {
  const mainImage = section.querySelector('.story-main-image');
  const storyText = section.querySelector('.story-text');
  const galleryItems = section.querySelectorAll('.story-gallery-item');
  const overlay = section.querySelector('.story-overlay');

  const tlStory = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=200%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  });

  tlStory
    .to(overlay, { opacity: 1, duration: 0.5 })
    .to(overlay, { opacity: 0, duration: 0.5 }, '+=0.5')
    .to(mainImage, { opacity: 1, scale: 1, translateZ: 0, rotate: 0, duration: 1, ease: 'power4.out' }, 0)
    .to(storyText, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5)
    .from(storyText.querySelector('.story-title').querySelectorAll('.char'), {
      opacity: 0,
      y: 20,
      scale: 0.8,
      stagger: 0.05,
      duration: 0.5,
      ease: 'back.out(1.7)',
    }, 0.7)
    .from(storyText.querySelector('.story-description').querySelectorAll('.char'), {
      opacity: 0,
      x: -20,
      stagger: 0.03,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.9)
    .from(storyText.querySelector('.story-meta').querySelectorAll('.char'), {
      opacity: 0,
      x: -20,
      stagger: 0.03,
      duration: 0.5,
      ease: 'power2.out',
    }, 1.1)
    .to(galleryItems, {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      stagger: 0.2,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    }, 1.5);

  gsap.to(mainImage, {
    y: -50,
    scale: 1.1,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
  });

  if (window.innerWidth <= 768) {
    gsap.to(galleryItems, {
      opacity: 1,
      duration: 0.5,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top' },
    });
  }

  mainImage.addEventListener('click', () => {
    const storyFullscreen = document.querySelector('.story-fullscreen');
    const fullscreenImage = storyFullscreen.querySelector('.story-fullscreen-image');
    const fullscreenDetails = storyFullscreen.querySelector('.story-fullscreen-details');
    fullscreenImage.src = mainImage.src;
    fullscreenImage.alt = mainImage.alt;
    fullscreenDetails.textContent = `${section.querySelector('.story-title').textContent} - ${section.querySelector('.story-meta').textContent}`;
    storyFullscreen.style.display = 'flex';
    gsap.from(fullscreenImage, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => playSnapshotSound(),
    });
    gsap.from(fullscreenDetails, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.3,
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullscreenGallery = document.querySelector('.fullscreen-gallery');
      const fullscreenImage = fullscreenGallery.querySelector('.fullscreen-image');
      fullscreenImage.src = item.src;
      fullscreenImage.alt = item.alt;
      fullscreenGallery.style.display = 'flex';
      gsap.from(fullscreenImage, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => playSnapshotSound(),
      });
    });
  });
});

// Close fullscreen with a dramatic exit
document.querySelectorAll('.close-gallery').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    const target = closeBtn.closest('.fullscreen-gallery') || closeBtn.closest('.story-fullscreen');
    const image = target.querySelector('img');
    const details = target.querySelector('.story-fullscreen-details');
    gsap.to(image, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => target.style.display = 'none',
      onStart: () => playSnapshotSound(),
    });
    if (details) {
      gsap.to(details, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
    }
  });
});

// About section animations
const aboutTl = gsap.timeline({
  scrollTrigger: { trigger: '.about-section', start: 'top 80%', end: 'top 50%', scrub: true },
});
aboutTl
  .to('.about-image', { opacity: 1, rotate: 0, duration: 1, ease: 'power4.out' })
  .to('.about-content', { opacity: 1, duration: 1, ease: 'power4.out' }, 0)
  .from('.about-title .char', { opacity: 0, y: 20, stagger: 0.05, duration: 0.5, ease: 'back.out(1.7)' }, 0.2)
  .from('.about-description .char', { opacity: 0, x: -20, stagger: 0.03, duration: 0.5, ease: 'power2.out' }, 0.4);

// Services section animations
const servicesTl = gsap.timeline({
  scrollTrigger: { trigger: '.services-section', start: 'top 80%', end: 'top 50%', scrub: true },
});
servicesTl
  .to('.services-title', { opacity: 1, duration: 1, ease: 'power4.out' })
  .from('.services-title .char', { opacity: 0, y: 20, stagger: 0.05, duration: 0.5, ease: 'back.out(1.7)' }, 0.2)
  .to('.service-card', { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: 'power3.out' }, 0.4)
  .from('.service-title .char', { opacity: 0, y: 20, stagger: 0.03, duration: 0.5, ease: 'back.out(1.7)' }, 0.6)
  .from('.service-description .char', { opacity: 0, x: -20, stagger: 0.03, duration: 0.5, ease: 'power2.out' }, 0.8);

// Testimonials carousel
const testimonials = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    if (i === index) {
      testimonial.classList.add('active');
      gsap.to(testimonial, { opacity: 1, duration: 1, ease: 'power2.out' });
      gsap.from(testimonial.querySelector('.testimonial-quote').querySelectorAll('.char'), {
        opacity: 0,
        x: -20,
        stagger: 0.03,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.from(testimonial.querySelector('.testimonial-author').querySelectorAll('.char'), {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });
    } else {
      gsap.to(testimonial, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => testimonial.classList.remove('active'),
      });
    }
  });
}

const testimonialsTl = gsap.timeline({
  scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%', end: 'top 50%', scrub: true },
});
testimonialsTl
  .to('.testimonials-title', { opacity: 1, duration: 1, ease: 'power4.out' })
  .from('.testimonials-title .char', { opacity: 0, y: 20, stagger: 0.05, duration: 0.5, ease: 'back.out(1.7)' }, 0.2);

setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 5000);

showTestimonial(currentTestimonial);

// Contact section animations
const contactTl = gsap.timeline({
  scrollTrigger: { trigger: '.contact-section', start: 'top 80%', end: 'top 50%', scrub: true },
});
contactTl
  .to('.contact-title', { opacity: 1, duration: 1, ease: 'power4.out' })
  .from('.contact-title .char', { opacity: 0, y: 20, stagger: 0.05, duration: 0.5, ease: 'back.out(1.7)' }, 0.2)
  .to('.contact-form input, .contact-form textarea, .contact-form button', {
    opacity: 1,
    y: 0,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out',
  }, 0.4);
