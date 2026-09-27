/* ============================================================
   ElClient — витрина · мелкие интеракции (ванильный JS)
   ============================================================ */

// Флаг наличия JS: CSS прячет .reveal только внутри <html class="js">,
// поэтому без скрипта страница остаётся полностью видимой.
document.documentElement.classList.add('js');

// --- Появление блоков при прокрутке ---
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      }
    },
    // Анимация стартует, как только блок чуть-чуть вошёл в экран:
    // без «мёртвой паузы», когда блок уже видно, а он ещё не двигается
    { threshold: 0.05, rootMargin: '0px 0px -24px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// --- Шапка: более плотное стекло после прокрутки ---
const header = document.querySelector('.header');

const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// --- Лёгкий параллакс орбов за курсором (только для точного указателя) ---
const orbs = document.querySelectorAll('.bg__orb');
const finePointer = window.matchMedia('(pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (finePointer && !reducedMotion && orbs.length) {
  // Запись стиля один раз на кадр (через rAF), а не на каждое событие
  // mousemove — десятки событий подряд не гоняют пересчёт стилей
  let mouseX = 0;
  let mouseY = 0;
  let rafId = 0;

  const applyParallax = () => {
    rafId = 0;
    orbs.forEach((orb, i) => {
      const depth = 18 + i * 12;
      // Свойство `translate` не конфликтует с transform-анимацией орбов
      orb.style.translate = `${-mouseX * depth}px ${-mouseY * depth}px`;
    });
  };

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
    if (!rafId) rafId = requestAnimationFrame(applyParallax);
  });
}

// --- Актуальный год в футере ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
