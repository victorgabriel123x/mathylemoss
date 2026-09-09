/* ============================================================
   MATHY LEMOSS — MAIN
   Sem dependências. Respeita prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var C = window.MATHY_CONTATO || {};
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- links e textos vindos de data/contato.js ---------- */
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var v = C[el.dataset.link];
    if (v) el.setAttribute('href', v);
  });
  document.querySelectorAll('[data-texto]').forEach(function (el) {
    var v = C[el.dataset.texto];
    if (v) el.textContent = v;
  });

  /* ---------- header compacto ---------- */
  var topo = document.getElementById('topo');
  var ticking = false;
  function aoRolar() {
    if (topo) topo.classList.toggle('compacto', window.scrollY > 40);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  aoRolar();

  /* ---------- menu overlay ---------- */
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');

  function fecharMenu() {
    if (!menu) return;
    menu.dataset.aberto = 'false';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }
  function abrirMenu() {
    menu.dataset.aberto = 'true';
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
    var primeiro = menu.querySelector('a');
    if (primeiro) primeiro.focus();
  }

  if (btn && menu) {
    btn.addEventListener('click', function () {
      menu.dataset.aberto === 'true' ? fecharMenu() : abrirMenu();
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', fecharMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.dataset.aberto === 'true') {
        fecharMenu();
        btn.focus();
      }
    });
  }

  /* ---------- revelação no scroll ----------
     Regra de ouro: conteúdo nunca fica preso invisível.
     Dentro de um iframe o scroll do pai não chega até aqui,
     então a animação é dispensada e tudo aparece de uma vez.   */
  var alvos = document.querySelectorAll('.rev');
  var emIframe = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();

  function mostrarTudo() {
    document.querySelectorAll('.rev:not(.dentro)').forEach(function (el) {
      el.classList.add('dentro');
    });
  }

  if (calmo || emIframe || !('IntersectionObserver' in window)) {
    mostrarTudo();
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var atraso = parseFloat(e.target.dataset.atraso || 0);
        setTimeout(function () { e.target.classList.add('dentro'); }, atraso * 1000);
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    alvos.forEach(function (el) { obs.observe(el); });

    // rede de segurança: se algo acima da dobra continuar escondido, mostra.
    setTimeout(function () {
      document.querySelectorAll('.rev:not(.dentro)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('dentro');
      });
    }, 2500);
  }

  /* ---------- parallax leve (um único listener) ---------- */
  var camadas = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!calmo && camadas.length) {
    var rodando = false;
    function mover() {
      var y = window.scrollY;
      camadas.forEach(function (el) {
        var f = parseFloat(el.dataset.parallax) || 0;
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        el.style.transform = 'translate3d(0,' + (y * f / 100).toFixed(2) + 'px,0)' +
          (el.classList.contains('hero__bot--dir') ? ' scaleY(-1)' : '');
      });
      rodando = false;
    }
    window.addEventListener('scroll', function () {
      if (!rodando) { rodando = true; requestAnimationFrame(mover); }
    }, { passive: true });
    mover();
  }

  /* ---------- entrada da hero ----------
     O estado inicial é decidido no <head>, antes da primeira pintura.
     Aqui só reforçamos a liberação — nunca o contrário.            */
  function liberarHero() {
    document.documentElement.classList.add('hero-pronta');
  }
  liberarHero();
  window.addEventListener('load', liberarHero);
})();
