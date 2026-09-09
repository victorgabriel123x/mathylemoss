/* ============================================================
   MATHY LEMOSS — CONTATO E LINKS
   Único lugar para alterar número, links e mensagens.
   ============================================================ */

window.SITE_CONFIG = (function () {
  'use strict';
  var WHATSAPP = '5599991556995';

  function wa(mensagem) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensagem);
  }

  return {
    name: 'Mathy Lemoss',
    url: 'https://victorgabriel123x.github.io/casak/',
    whatsapp: WHATSAPP,
    developer: { name: 'VLDS Digital', whatsapp: '5598984772771', phone: '(98) 98477-2771' },
    waDesenvolvedor: 'https://wa.me/5598984772771?text=' + encodeURIComponent('Olá, VLDS Digital! Conheci seu trabalho pelo site da Mathy e gostaria de conversar sobre um projeto.'),

    // Mensagens diferentes por assunto — a Mathy identifica de onde veio.
    waPublicidade: wa(
      'Olá, Mathy! Conheci seu trabalho pelo site e gostaria de conversar sobre uma parceria/publicidade.'
    ),
    waEventos: wa(
      'Olá, Mathy! Conheci seu trabalho pelo site e gostaria de conversar sobre um convite ou participação em evento.'
    ),
    waTaro: wa(
      'Olá, Mathy! Vim pelo site e gostaria de saber mais sobre a leitura de tarô.'
    ),

    socials: {
      instagram: 'https://www.instagram.com/mathylemoss/',
      tiktok: 'https://www.tiktok.com/@mathylemoss'
    },
    arroba: '@mathylemoss',

    // Vídeo em que ela conta a história do emagrecimento.
    videoTransformacao: null, // Link anterior sem autoria confirmada; não renderizar.

    cidade: 'Dom Pedro, Maranhão · Brasil'
  };
})();
window.MATHY_CONTATO = window.SITE_CONFIG;
