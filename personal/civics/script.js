const navbar = document.querySelector('.navbar');
const menuToggle = document.getElementById('menuToggle');//a
const navbarMenu = document.getElementById('navbarMenu');
const navLinks = document.querySelectorAll('.navbar-menu a');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const backToTopButton = document.getElementById('backToTop');
const preloader = document.getElementById('preloader');
const sections = document.querySelectorAll('section');
const scrollElements = document.querySelectorAll('[data-scroll]');
const counterElements = document.querySelectorAll('.counter');

window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  setTimeout(() => {
    gsap.to(preloader, { opacity: 0, duration: 0.5, onComplete: () => { preloader.style.display = 'none'; } });
  }, 500);
  if (document.getElementById('particles')) {
    particlesJS('particles', {
      "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#8b5cf6" },
        "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
        "opacity": { "value": 0.2, "random": true, "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.1, "sync": false } },
        "size": { "value": 3, "random": true, "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false } },
        "line_linked": { "enable": true, "distance": 150, "color": "#3b82f6", "opacity": 0.2, "width": 1 },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
        "modes": { "bubble": { "distance": 150, "size": 6, "duration": 2, "opacity": 0.3, "speed": 3 }, "push": { "particles_nb": 4 } }
      },
      "retina_detect": true
    });
  }
  initAnimations();
});

function initAnimations() {
  const heroElements = document.querySelectorAll('.hero [data-scroll]');
  gsap.fromTo(heroElements, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' });
  scrollElements.forEach(el => {
    const delay = el.dataset.scrollDelay || 0;
    gsap.fromTo(el, { opacity: 0, y: 30 }, { scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }, opacity: 1, y: 0, duration: 0.8, delay: parseFloat(delay), ease: 'power2.out' });
  });
  counterElements.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    ScrollTrigger.create({ trigger: counter, start: 'top 80%', once: true, onEnter: () => { animateCounter(counter, 0, target, 2000); } });
  });
  gsap.fromTo('.issue-card', { opacity: 0, y: 30 }, { scrollTrigger: { trigger: '.issues-grid', start: 'top 80%' }, opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)' });
  gsap.fromTo('.source-card', { opacity: 0, y: 30 }, { scrollTrigger: { trigger: '.sources-grid', start: 'top 80%' }, opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)' });
  gsap.fromTo('.action-card', { opacity: 0, y: 30 }, { scrollTrigger: { trigger: '.action-cards', start: 'top 80%' }, opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)' });
  gsap.fromTo('.section-header', { opacity: 0, y: 20 }, { scrollTrigger: { trigger: '.section-header', start: 'top 85%' }, opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  gsap.fromTo('.quote-container', { opacity: 0, scale: 0.95 }, { scrollTrigger: { trigger: '.quote-container', start: 'top 80%' }, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' });
}

menuToggle.addEventListener('click', () => {
  navbarMenu.classList.toggle('active');
  if (navbarMenu.classList.contains('active')) { menuToggle.innerHTML = '<i class="fas fa-times"></i>'; document.body.style.overflow = 'hidden'; }
  else { menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; document.body.style.overflow = ''; }
});
navLinks.forEach(link => {
  link.addEventListener('click', () => { navbarMenu.classList.remove('active'); menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; document.body.style.overflow = ''; });
});
document.addEventListener('click', e => {
  if (navbarMenu.classList.contains('active') && !navbarMenu.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
    navbarMenu.classList.remove('active'); menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; document.body.style.overflow = '';
  }
});
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
  if (window.scrollY > 300) { backToTopButton.classList.add('visible'); } else { backToTopButton.classList.remove('visible'); }
  highlightNavOnScroll();
});
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const currentActiveContent = document.querySelector('.tab-content.active');
    const targetContentId = button.dataset.tab;
    const targetContent = document.getElementById(targetContentId);
    if (targetContent.classList.contains('active')) return;
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    gsap.to(currentActiveContent, { opacity: 0, y: 10, duration: 0.3, onComplete: () => {
      tabContents.forEach(content => { content.classList.remove('active'); content.style.opacity = 0; content.style.transform = 'translateY(10px)'; });
      targetContent.classList.add('active');
      gsap.to(targetContent, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }});
  });
});
backToTopButton.addEventListener('click', () => {
  gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: 'power2.inOut' });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      gsap.to(window, { duration: 1, scrollTo: { y: targetPosition, autoKill: false }, ease: 'power2.inOut' });
    }
  });
});
function highlightNavOnScroll() {
  let scrollPosition = window.scrollY + 100;
  navLinks.forEach(link => link.classList.remove('active'));
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbar.offsetHeight - 20;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (sectionId && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) { currentSection = sectionId; }
  });
  if (currentSection) {
    const activeLink = document.querySelector(`.navbar-menu a[href="#${currentSection}"]`);
    if (activeLink) { activeLink.classList.add('active'); }
  }
}
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  function updateCounter(currentTime) {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime > duration) { element.textContent = end; return; }
    const progress = Math.min(elapsedTime / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(easeProgress * (end - start) + start);
    element.textContent = value;
    requestAnimationFrame(updateCounter);
  }
  requestAnimationFrame(updateCounter);
}
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    const heroTitle = document.querySelector('.hero .title');
    const heroSection = document.querySelector('.hero');
    if (heroTitle && heroSection) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const moveX = x * 20 - 10;
      const moveY = y * 20 - 10;
      gsap.to(heroTitle, { x: moveX, y: moveY, duration: 1.5, ease: 'power2.out' });
    }
  });
}
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navbarMenu.classList.contains('active')) {
    navbarMenu.classList.remove('active');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = '';
  }
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { console.log(e.matches ? 'dark' : 'light'); });
document.documentElement.style.visibility = 'visible';
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
    navbarMenu.classList.remove('active');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = '';
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const allLinks = document.querySelectorAll('a');
  allLinks.forEach(link => { if (link.getAttribute('href') === '#') { link.addEventListener('click', function(e) { e.preventDefault(); }); } });
});
document.querySelectorAll('.issue-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const learnMore = this.nextElementSibling;
    if (learnMore.style.display === 'none' || learnMore.style.display === '') {
      learnMore.style.display = 'block';
      this.innerHTML = 'Show less <i class="fas fa-arrow-up"></i>';
    } else {
      learnMore.style.display = 'none';
      this.innerHTML = 'Learn more <i class="fas fa-arrow-right"></i>';
    }
  });
});
document.querySelectorAll('.action-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    alert('More details will be available soon.');
  });
});
document.querySelector('.join-button').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Thanks for joining the project!');
});
