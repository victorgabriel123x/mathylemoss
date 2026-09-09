/* ============================================================
   MATHY LEMOSS — CONTATO E LINKS
   Único lugar para alterar número, links e mensagens.
   ============================================================ */

window.MATHY_CONTATO = (function () {
  // Somente dígitos, com código do país. +55 99 99155-6995
  var WHATSAPP = '5599991556995';

  function wa(mensagem) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensagem);
  }

  return {
    whatsapp: WHATSAPP,

    // Mensagens diferentes por assunto — a Mathy identifica de onde veio.
    waPublicidade: wa(
      'Oi, Mathy! Cheguei pelo seu site. Quero falar sobre uma parceria de publicidade.'
    ),
    waEventos: wa(
      'Oi, Mathy! Cheguei pelo seu site. Quero te convidar para um evento.'
    ),
    waTaro: wa(
      'Oi, Mathy! Cheguei pelo seu site. Quero agendar uma leitura de tarô terapêutico.'
    ),

    instagram: 'https://www.instagram.com/mathylemoss/',
    tiktok: 'https://www.tiktok.com/@mathylemoss',
    arroba: '@mathylemoss',

    // Vídeo em que ela conta a história do emagrecimento.
    videoTransformacao: 'https://www.instagram.com/reel/DJSaHYXSEiV/',

    cidade: 'Dom Pedro, Maranhão · Brasil'
  };
})();
