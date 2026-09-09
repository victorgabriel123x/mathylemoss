/* ============================================================
   MATHY LEMOSS — SEÇÕES DINÂMICAS
   Monta a partir de data/conteudo.js:
   · 05 Eu não sou um nicho (abas com cor própria)
   · 10 Marcas (faixa em movimento)
   · 11 Depoimentos de tarô
   ============================================================ */
(function () {
  'use strict';

  var D = window.MATHY_CONTEUDO;
  if (!D) return;

  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     05 · EU NÃO SOU UM NICHO
     ------------------------------------------------------------ */
  (function nicho() {
    var pills = document.getElementById('nichoPills');
    var palco = document.getElementById('nichoPalco');
    if (!pills || !palco || !D.nicho) return;

    D.nicho.forEach(function (cat, i) {
      var ativo = i === 0;

      var pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'pill';
      pill.id = 'aba-' + cat.id;
      pill.setAttribute('role', 'tab');
      pill.setAttribute('aria-selected', ativo ? 'true' : 'false');
      pill.setAttribute('aria-controls', 'painel-' + cat.id);
      pill.tabIndex = ativo ? 0 : -1;
      pill.style.setProperty('--c', cat.cor);
      pill.innerHTML =
        '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2z"/></svg>' + cat.nome;
      pills.appendChild(pill);

      var painel = document.createElement('div');
      painel.className = 'painel';
      painel.id = 'painel-' + cat.id;
      painel.setAttribute('role', 'tabpanel');
      painel.setAttribute('aria-labelledby', 'aba-' + cat.id);
      painel.dataset.ativo = ativo ? 'true' : 'false';
      painel.style.setProperty('--c', cat.cor);
      painel.innerHTML =
        '<figure class="painel__foto"><img src="' + cat.foto + '" alt="' + cat.alt +
        '" loading="lazy" decoding="async"></figure>' +
        '<div class="painel__lado">' +
          '<p class="painel__marca">' + cat.nome + '</p>' +
          '<p class="painel__frase">' + cat.frase + '</p>' +
          '<p class="painel__texto">' + cat.texto + '</p>' +
        '</div>';
      palco.appendChild(painel);
    });

    var abas = Array.prototype.slice.call(pills.querySelectorAll('[role="tab"]'));

    function trocar(indice, focar) {
      abas.forEach(function (aba, i) {
        var sel = i === indice;
        aba.setAttribute('aria-selected', sel ? 'true' : 'false');
        aba.tabIndex = sel ? 0 : -1;
        document.getElementById(aba.getAttribute('aria-controls'))
          .dataset.ativo = sel ? 'true' : 'false';
      });
      if (focar) abas[indice].focus();
    }

    pills.addEventListener('click', function (e) {
      var aba = e.target.closest('[role="tab"]');
      if (aba) trocar(abas.indexOf(aba), false);
    });

    pills.addEventListener('keydown', function (e) {
      var atual = abas.indexOf(document.activeElement);
      if (atual < 0) return;
      var prox = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') prox = (atual + 1) % abas.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prox = (atual - 1 + abas.length) % abas.length;
      if (e.key === 'Home') prox = 0;
      if (e.key === 'End') prox = abas.length - 1;
      if (prox === null) return;
      e.preventDefault();
      trocar(prox, true);
    });
  })();

  /* ------------------------------------------------------------
     10 · MARCAS — faixa em movimento
     O trilho é duplicado para o loop ficar contínuo.
     ------------------------------------------------------------ */
  (function marcas() {
    var faixa = document.getElementById('marcasFaixa');
    if (!faixa || !D.marcas) return;

    /* Cada marca é logotipo + nome. Se o SVG não existir em
       public/brands/, o <img> falha, some, e sobra o wordmark
       tipográfico — nunca uma imagem quebrada.                  */
    function trilho() {
      var t = document.createElement('div');
      t.className = 'faixa__trilho';
      D.marcas.forEach(function (m) {
        var s = document.createElement('span');
        s.className = 'marca-item' + (m.logo ? ' marca-item--com-logo' : ' marca-item--sem-logo');

        if (m.logo) {
          var img = document.createElement('img');
          img.className = 'marca-item__logo';
          img.src = (window.__BRANDS_DATA && window.__BRANDS_DATA[m.logo]) ||
                    ('public/brands/' + m.logo);
          img.alt = m.nome;
          img.loading = 'lazy';
          img.decoding = 'async';

          /* o logotipo já é o nome escrito: o texto ao lado fica só
             para leitor de tela. Se o SVG não carregar, ele reaparece. */
          img.onerror = function () {
            s.className = 'marca-item marca-item--sem-logo';
            img.remove();
          };
          /* marca quase quadrada pesa menos que um wordmark longo
             na mesma altura, então ganha um pouco mais de corpo */
          img.onload = function () {
            if (img.naturalHeight &&
                img.naturalWidth / img.naturalHeight < 1.7) {
              img.classList.add('marca-item__logo--compacto');
            }
          };
          s.appendChild(img);
        }

        var nome = document.createElement('span');
        nome.className = 'marca-item__nome';
        nome.textContent = m.nome;
        s.appendChild(nome);

        t.appendChild(s);
      });
      return t;
    }

    faixa.appendChild(trilho());
    if (!calmo) faixa.appendChild(trilho());
  })();

  /* ------------------------------------------------------------
     11 · DEPOIMENTOS DE TARÔ
     ------------------------------------------------------------ */
  (function depoimentos() {
    var lista = document.getElementById('taroDepos');
    if (!lista || !D.depoimentos) return;

    D.depoimentos.forEach(function (d, i) {
      var li = document.createElement('li');
      li.className = 'rev';
      li.dataset.atraso = (i * 0.06).toFixed(2);
      li.innerHTML =
        '<figure><blockquote>“' + d.texto + '”</blockquote>' +
        '<figcaption>' + d.de + '</figcaption></figure>';
      lista.appendChild(li);
    });
  })();

  /* ------------------------------------------------------------
     11 · CÉU DA SEÇÃO DE TARÔ
     Estrelas espalhadas com posição e ritmo próprios. Um <div> com
     70 filhos custa menos que 70 gradientes no background.
     ------------------------------------------------------------ */
  (function estrelas() {
    var ceu = document.getElementById('taroEstrelas');
    if (!ceu) return;

    var frag = document.createDocumentFragment();
    for (var i = 0; i < 70; i++) {
      var e = document.createElement('i');
      var t = 1 + Math.random() * 1.6;
      e.style.left = (Math.random() * 100).toFixed(2) + '%';
      e.style.top = (Math.random() * 100).toFixed(2) + '%';
      e.style.width = e.style.height = t.toFixed(1) + 'px';
      if (!calmo) {
        e.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
        e.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + 's';
      }
      frag.appendChild(e);
    }
    ceu.appendChild(frag);
  })();

  /* avisa o main.js que há novos elementos .rev para observar */
  document.dispatchEvent(new CustomEvent('mathy:secoes-prontas'));
})();
