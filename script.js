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
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
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
  window.addEventListener('mousemove', (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    orbs.forEach((orb, i) => {
      const depth = 18 + i * 12;
      // Свойство `translate` не конфликтует с transform-анимацией орбов
      orb.style.translate = `${-x * depth}px ${-y * depth}px`;
    });
  });
}

// --- Актуальный год в футере ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
