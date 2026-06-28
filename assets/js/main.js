const cards = document.querySelectorAll('[data-project-card]');

const reveal = () => {
  if (!('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    observer.observe(card);
  });
};

const trackCardLight = () => {
  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
};

const setYear = () => {
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
};

reveal();
trackCardLight();
setYear();
