/* Pet dos Principes, variante A: entrada suave dos blocos (horários, mapa e medição estão no comum.js) */
(() => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sel = '.secao-topo, .servico, .leva-txt, .leva-passos li, .galeria li, .depo, .duo > *, .passos li, .faq details, .local > *, .final-conteudo > *';
  const io = new IntersectionObserver((entradas) => {
    entradas.filter((e) => e.isIntersecting).forEach((e, i) => {
      const el = e.target;
      io.unobserve(el);
      el.style.setProperty('--atraso', Math.min(i, 5) * 80 + 'ms');
      el.classList.add('is-visivel');
      setTimeout(() => { el.classList.remove('revela', 'is-visivel'); el.style.removeProperty('--atraso'); }, 1200);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll(sel).forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add('revela');
    io.observe(el);
  });
})();
