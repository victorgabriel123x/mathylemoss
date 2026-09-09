/* MATHY LEMOSS — Navegação acessível e movimento, sem dependências. */
(function () {
  'use strict';

  var C = window.SITE_CONFIG || window.MATHY_CONTATO || {};
  var sociais = C.socials || {};
  var movimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia('(min-width: 1080px)');
  var calmo = movimento.matches;
  var emIframe = (function () {
    try { return window.self !== window.top; } catch (e) { return true; }
  })();

  /* Todos os destinos são fornecidos pela configuração central. */
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var chave = el.dataset.link;
    var valor = C[chave] || sociais[chave];
    if (typeof valor === 'string' && valor) el.setAttribute('href', valor);
  });
  document.querySelectorAll('[data-texto]').forEach(function (el) {
    var valor = C[el.dataset.texto];
    if (typeof valor === 'string' && valor) el.textContent = valor;
  });

  var topo = document.getElementById('topo');
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  var fechar = document.getElementById('menuFechar');
  var aberto = false;
  var focoAnterior = null;
  var inertes = [];
  var overflowAnterior = [];
  var seletorFoco = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

  function visivel(el) {
    return !!(el && el.isConnected && el.getClientRects().length &&
      window.getComputedStyle(el).visibility !== 'hidden' && !el.closest('[inert]'));
  }

  function focaveis() {
    return Array.prototype.filter.call(menu.querySelectorAll(seletorFoco), function (el) {
      return el.tabIndex >= 0 && visivel(el);
    });
  }

  function focar(el) {
    if (el) el.focus({ preventScroll: true });
  }

  function focarSecao(el) {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '-1');
      el.addEventListener('blur', function limpar() {
        el.removeAttribute('tabindex');
        el.removeEventListener('blur', limpar);
      });
    }
    focar(el);
  }

  function tornarInerte(el) {
    if (!el || inertes.some(function (item) { return item.el === el; })) return;
    inertes.push({ el: el, valor: el.getAttribute('inert') });
    el.setAttribute('inert', '');
  }

  function isolarCabecalho(el) {
    if (el === btn) return;
    if (el.contains(btn)) {
      Array.prototype.forEach.call(el.children, isolarCabecalho);
    } else {
      tornarInerte(el);
    }
  }

  function fecharMenu(opcoes) {
    if (!menu || !aberto) return;
    opcoes = opcoes || {};
    aberto = false;
    menu.dataset.aberto = 'false';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    inertes.forEach(function (item) {
      if (item.valor === null) item.el.removeAttribute('inert');
      else item.el.setAttribute('inert', item.valor);
    });
    inertes = [];
    ['overflow', 'overflow-x', 'overflow-y'].forEach(function (propriedade) {
      document.body.style.removeProperty(propriedade);
    });
    overflowAnterior.forEach(function (item) {
      document.body.style.setProperty(item.propriedade, item.valor, item.prioridade);
    });

    if (opcoes.destino) {
      focarSecao(opcoes.destino);
    } else {
      var destino = visivel(focoAnterior) ? focoAnterior : null;
      if (!destino && visivel(btn)) destino = btn;
      if (!destino && topo) destino = topo.querySelector('.marca');
      focar(destino);
    }
    // Só oculta da árvore de acessibilidade depois de retirar o foco.
    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');
    agendarQuadro();
  }

  function abrirMenu() {
    if (!menu || aberto || desktop.matches) return;
    focoAnterior = document.activeElement;
    overflowAnterior = Array.prototype.filter.call(document.body.style, function (propriedade) {
      return /^overflow(?:-x|-y)?$/.test(propriedade);
    }).map(function (propriedade) {
      return {
        propriedade: propriedade,
        valor: document.body.style.getPropertyValue(propriedade),
        prioridade: document.body.style.getPropertyPriority(propriedade)
      };
    });
    aberto = true;
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    menu.dataset.aberto = 'true';
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu');
    document.querySelectorAll('main, footer, #capitulos, #contatoFlutuante, .pular-para').forEach(tornarInerte);
    if (topo) isolarCabecalho(topo);
    document.body.style.setProperty('overflow', 'hidden');
    var primeiro = fechar || focaveis()[0];
    if (primeiro) focar(primeiro);
    else {
      menu.setAttribute('tabindex', '-1');
      focar(menu);
    }
  }

  if (btn && menu) {
    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');
    btn.addEventListener('click', function () {
      if (aberto) fecharMenu();
      else abrirMenu();
    });
    if (fechar) fechar.addEventListener('click', function () { fecharMenu(); });
    menu.addEventListener('click', function (e) {
      if (e.target === menu) fecharMenu();
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        var href = a.getAttribute('href') || '';
        var destino = href.charAt(0) === '#' ? document.getElementById(href.slice(1)) : null;
        fecharMenu({ destino: destino });
      });
    });
    document.addEventListener('keydown', function (e) {
      if (!aberto) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        fecharMenu();
      } else if (e.key === 'Tab') {
        var itens = focaveis();
        var primeiro = itens[0];
        var ultimo = itens[itens.length - 1];
        if (!primeiro) {
          e.preventDefault();
          focar(menu);
        } else if (e.shiftKey && (document.activeElement === primeiro || !menu.contains(document.activeElement))) {
          e.preventDefault();
          focar(ultimo);
        } else if (!e.shiftKey && (document.activeElement === ultimo || !menu.contains(document.activeElement))) {
          e.preventDefault();
          focar(primeiro);
        }
      }
    });
    document.addEventListener('focusin', function (e) {
      if (aberto && !menu.contains(e.target)) focar(focaveis()[0] || menu);
    });
  }

  /* Observer e fallback compartilham a revelação. O conteúdo nunca é reocultado. */
  var alvos = Array.prototype.slice.call(document.querySelectorAll('.rev'));
  var pendentes = new Set(alvos);
  var temporizadores = new Map();
  var observador = null;

  function revelar(el, imediato) {
    if (!pendentes.has(el)) return;
    pendentes.delete(el);
    if (observador) observador.unobserve(el);
    var atraso = imediato || calmo ? 0 : Math.min(600, Math.max(0, (parseFloat(el.dataset.atraso) || 0) * 1000));
    if (!atraso) el.classList.add('dentro');
    else temporizadores.set(el, setTimeout(function () {
      el.classList.add('dentro');
      temporizadores.delete(el);
    }, atraso));
  }

  function mostrarTudo() {
    if (observador) observador.disconnect();
    temporizadores.forEach(function (timer) { clearTimeout(timer); });
    temporizadores.clear();
    alvos.forEach(function (el) { el.classList.add('dentro'); });
    pendentes.clear();
  }

  if (calmo || emIframe || !('IntersectionObserver' in window)) mostrarTudo();
  else {
    try {
      observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) revelar(entrada.target, false);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.03 });
      alvos.forEach(function (el) { observador.observe(el); });
    } catch (e) {
      mostrarTudo();
    }
  }

  var progresso = document.getElementById('leituraProgresso');
  var flutuante = document.getElementById('contatoFlutuante');
  var hero = document.getElementById('inicio');
  var contato = document.getElementById('contato');
  var linksCapitulos = Array.prototype.slice.call(document.querySelectorAll('#capitulos a[href^="#"]'));
  var secoes = ['inicio', 'mathy', 'trajetoria', 'conteudos', 'audiovisual', 'publicidade', 'taro', 'contato'].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);
  var permiteTranslate = window.CSS && window.CSS.supports('translate', '0 1px');
  var camadas = Array.prototype.map.call(document.querySelectorAll('[data-parallax]'), function (el) {
    return {
      el: el,
      secao: el.closest('section') || el.parentElement,
      fator: Math.max(-1, Math.min(1, (parseFloat(el.dataset.parallax) || 0) / 26)),
      original: el.style.getPropertyValue('translate'),
      prioridade: el.style.getPropertyPriority('translate')
    };
  });
  var quadroPendente = false;
  var capituloAnterior = '';

  function atualizarQuadro() {
    quadroPendente = false;
    // Leituras agrupadas antes de qualquer alteração de classe ou estilo.
    var y = window.scrollY || document.documentElement.scrollTop;
    var altura = window.innerHeight;
    var alcance = Math.max(0, document.documentElement.scrollHeight - altura);
    var fracao = alcance ? Math.max(0, Math.min(1, y / alcance)) : 1;
    var limite = Math.max(100, altura * 0.3);
    var ativo = secoes.length ? secoes[0].id : '';
    secoes.forEach(function (secao) {
      if (secao.getBoundingClientRect().top <= limite) ativo = secao.id;
    });
    if (alcance > 0 && y >= alcance - 2 && contato) ativo = contato.id;
    var mostrarContato = !!(hero && contato && hero.getBoundingClientRect().bottom <= 0 && contato.getBoundingClientRect().top >= altura);
    var revelarAgora = [];
    pendentes.forEach(function (el) {
      if (el.getBoundingClientRect().top < altura * 0.92) revelarAgora.push(el);
    });
    var deslocamentos = [];
    if (!calmo && !emIframe && permiteTranslate) {
      camadas.forEach(function (camada) {
        var rect = camada.secao.getBoundingClientRect();
        var passagem = Math.max(0, Math.min(1, (altura - rect.top) / (altura + rect.height)));
        deslocamentos.push({ camada: camada, y: (passagem - 0.5) * 24 * camada.fator });
      });
    }

    if (topo) topo.classList.toggle('compacto', y > 40);
    if (progresso) progresso.style.transform = 'scaleX(' + fracao.toFixed(4) + ')';
    if (flutuante) flutuante.hidden = !mostrarContato;
    if (ativo !== capituloAnterior) {
      linksCapitulos.forEach(function (a) {
        var atual = a.getAttribute('href') === '#' + ativo;
        a.classList.toggle('ativo', atual);
        if (atual) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
      capituloAnterior = ativo;
    }
    revelarAgora.forEach(function (el) { revelar(el, calmo); });
    deslocamentos.forEach(function (item) {
      // -12 a +12 px no máximo, relativos à seção, sem acumular na página.
      item.camada.el.style.setProperty('translate', '0 ' + item.y.toFixed(2) + 'px');
    });
  }

  function agendarQuadro() {
    if (quadroPendente) return;
    quadroPendente = true;
    requestAnimationFrame(atualizarQuadro);
  }

  window.addEventListener('scroll', agendarQuadro, { passive: true });
  window.addEventListener('resize', function () {
    if (desktop.matches && aberto) fecharMenu();
    agendarQuadro();
  }, { passive: true });
  window.addEventListener('load', agendarQuadro);
  window.addEventListener('pageshow', agendarQuadro);
  document.addEventListener('toggle', agendarQuadro, true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(agendarQuadro);

  function mudarMovimento(e) {
    calmo = e.matches;
    if (calmo) {
      mostrarTudo();
      camadas.forEach(function (camada) {
        if (camada.original) camada.el.style.setProperty('translate', camada.original, camada.prioridade);
        else camada.el.style.removeProperty('translate');
      });
    }
    agendarQuadro();
  }
  if (movimento.addEventListener) movimento.addEventListener('change', mudarMovimento);
  else movimento.addListener(mudarMovimento);

  document.documentElement.classList.add('hero-pronta');
  agendarQuadro();
  // Revela o conteúdo visível mesmo se o observer não entregar seu callback.
  setTimeout(agendarQuadro, 2500);
})();
