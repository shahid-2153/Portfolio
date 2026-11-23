(() => {
  "use strict";
  const navLinks = document.querySelectorAll('.ul-list li a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');
  const revealElements = document.querySelectorAll('.home-container, .about-container, .projects-container, .services-container, .contact-content');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollToTarget = (el) => {
    if (!el) return;
    window.scrollTo({top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 80), behavior: reducedMotion ? 'auto' : 'smooth'});
  };
  navLinks.forEach(link => link.addEventListener('click', event => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    event.preventDefault();
    scrollToTarget(target);
    history.replaceState(null, '', link.getAttribute('href'));
  }));
  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.id = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i>';
  document.body.appendChild(backToTop);
  backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: reducedMotion ? 'auto' : 'smooth'}));
  let ticking = false;
  const updateScroll = () => {
    const marker = window.scrollY + 120;
    let current = '';
    sections.forEach(section => { if (marker >= section.offsetTop) current = section.id; });
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + current;
      link.parentElement.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    backToTop.style.display = window.scrollY > 500 ? 'flex' : 'none';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScroll); ticking = true; }
  }, {passive: true});
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('active-reveal'); obs.unobserve(entry.target); }
    }), {threshold: 0.08});
    revealElements.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
  } else revealElements.forEach(el => el.classList.add('active-reveal'));
  const typingElement = document.querySelector('.info-home h3');
  const words = ['Frontend Developer', 'UI/UX Designer', 'Web Enthusiast'];
  if (typingElement && !reducedMotion) {
    let wordIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const word = words[wordIndex];
      typingElement.textContent = word.slice(0, charIndex);
      if (!deleting && charIndex < word.length) { charIndex++; setTimeout(type, 100); }
      else if (deleting && charIndex > 0) { charIndex--; setTimeout(type, 50); }
      else { deleting = !deleting; if (!deleting) wordIndex = (wordIndex + 1) % words.length; setTimeout(type, 900); }
    };
    setTimeout(type, 500);
  }
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    // Use the browser's network estimate when available; otherwise the page's
    // actual load event naturally determines how long the intro remains visible.
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = connection?.effectiveType || '';
    const downlink = Number(connection?.downlink) || 0;
    const rtt = Number(connection?.rtt) || 0;
    let minimumVisibleTime = 700;

    if (connection?.saveData || effectiveType.includes('2g') || (downlink > 0 && downlink <= 0.7) || rtt >= 500) {
      minimumVisibleTime = 1800;
    } else if (effectiveType === '3g' || (downlink > 0 && downlink <= 2) || rtt >= 250) {
      minimumVisibleTime = 1200;
    } else if (effectiveType === '4g' || downlink > 5) {
      minimumVisibleTime = 450;
    }

    const startedAt = performance.now();
    const items = [
      [document.getElementById('loading-text'), 0],
      [document.querySelector('.main-icon'), 150],
      ...Array.from(document.querySelectorAll('.sub-icons i')).map((el, i) => [el, 300 + i * 120]),
      [document.getElementById('designer-text'), 650]
    ];
    const animationScale = minimumVisibleTime / 1100;
    items.forEach(([el, delay]) => {
      if (el) setTimeout(() => {
        if (loadingScreen.hidden) return;
        el.classList.remove('hidden');
        if (!reducedMotion) el.classList.add('fall');
      }, Math.round(delay * animationScale));
    });

    let finished = false;
    const hideLoader = () => {
      if (finished) return;
      finished = true;
      const remaining = Math.max(0, minimumVisibleTime - (performance.now() - startedAt));
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.hidden = true;
          loadingScreen.style.display = 'none';
        }, reducedMotion ? 0 : 350);
      }, remaining);
    };

    // Wait for the page's assets to finish, with a safety timeout for stalled
    // third-party resources so the visitor is never trapped on the intro.
    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader, { once: true });
    setTimeout(hideLoader, 6000);
  }
  const form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (!window.emailjs || typeof window.emailjs.sendForm !== 'function') {
      alert('The contact service is temporarily unavailable. Please email shahidmushtaq2155@gmail.com directly.');
      return;
    }
    button.disabled = true;
    const original = button.textContent;
    button.textContent = 'Sending...';
    try {
      await window.emailjs.sendForm('service_can1p4e', 'template_sn2cax3', form);
      alert('Message sent successfully!');
      form.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('Message could not be sent. Please email shahidmushtaq2155@gmail.com directly.');
    } finally { button.disabled = false; button.textContent = original; }
  });
})();