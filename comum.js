/* Roda no navegador nas duas variantes (vira comum.js no site). */
(() => {
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* Horário de São Paulo: dia (0 = domingo), "HH:MM" e data AAAA-MM-DD */
  const agora = (() => {
    try {
      const p = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      }).formatToParts(new Date());
      const v = (t) => (p.find((x) => x.type === t) || {}).value;
      return {
        dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday')),
        hora: (v('hour') === '24' ? '00' : v('hour')) + ':' + v('minute'),
        data: v('year') + '-' + v('month') + '-' + v('day'),
      };
    } catch (e) { return null; }
  })();

  if (agora) {
    /* Destaca o dia de hoje e diz se está aberto agora */
    let aberto = false;
    $$('tr[data-dias]').forEach((tr) => {
      if (!tr.dataset.dias.split(',').map(Number).includes(agora.dia)) return;
      tr.classList.add('is-hoje');
      if (tr.dataset.abre && agora.hora >= tr.dataset.abre && agora.hora < tr.dataset.fecha) aberto = true;
    });
    $$('[data-aberto-agora]').forEach((el) => {
      el.textContent = aberto ? el.dataset.abertoTxt : el.dataset.fechadoTxt;
      el.classList.add(aberto ? 'is-aberto' : 'is-fechado');
    });

    /* Ofertas: contagem regressiva; somem depois da validade */
    $$('[data-validade]').forEach((o) => {
      const dias = Math.round((new Date(o.dataset.validade) - new Date(agora.data)) / 864e5);
      if (dias < 0) { o.remove(); return; }
      const c = o.querySelector('[data-contagem]');
      if (c) c.textContent = dias === 0 ? 'Último dia!' : 'Faltam ' + dias + (dias === 1 ? ' dia' : ' dias');
    });
    $$('[data-grupo-ofertas]').forEach((g) => { if (!g.querySelector('[data-validade], .oferta, .offer__inner')) g.hidden = true; });

    /* Data especial some sozinha depois da data */
    $$('[data-ate]').forEach((s) => { if (agora.data > s.dataset.ate) s.hidden = true; });
  }

  /* Ano no rodapé */
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Mapa do Google só carrega depois do clique */
  $$('[data-mapa]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const box = btn.closest('[data-mapa-box]');
      const f = document.createElement('iframe');
      f.src = btn.dataset.mapa;
      f.title = btn.dataset.titulo;
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('is-carregado');
    });
  });

  /* Medição: cada clique no WhatsApp vira um evento (para GTM ou GA4, se forem instalados) */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    const onde = a.dataset.local || (a.closest('section, header, footer') || {}).id || 'botao_flutuante';
    window.dataLayer.push({ event: 'clique_whatsapp', local: onde, texto: a.textContent.trim().slice(0, 60) });
  });
})();
