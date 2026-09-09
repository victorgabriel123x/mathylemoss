/* Atualize fatos somente com fonte verificável. Rode node scripts/build-content.cjs.
   Pesquisa e limitações completas: data/sources.json. */
window.MATHY_DATA = {
  researchedAt: '2026-09-09',
  socialStats: {
    updatedAt: null,
    instagram: { followers: null, source: 'https://www.instagram.com/mathylemoss/' },
    tiktok: { followers: null, likes: null, source: 'https://www.tiktok.com/@mathylemoss' }
  },
  audiovisual: [
    { title: 'LOL: Se Rir, Já Era!', platform: 'Prime Video', role: 'Participante', season: '2ª temporada', year: '2022',
      description: 'O humor da Mathy em uma competição em que fazer rir é o desafio — e rir está fora de questão.',
      source: 'https://www.primevideo.com/-/pt/detail/0HGCWEAMARBZQ5IF3JRZR6CZ0Z' },
    { title: 'Tire 5 Cartas', platform: 'Cinema', role: 'Atriz', year: '2023',
      description: 'Mathy integra o elenco do longa brasileiro com Lília Cabral, Alcione e Thaynara OG.',
      source: 'https://www.exibidor.com.br/filme/15488/tire-5-cartas.html' }
  ],
  awards: [{ title: 'TikTok Awards', year: '2021', role: 'Indicada', category: 'Entregou tudo na For You', officialName: 'Mathy Lemoss',
    source: 'https://newsroom.tiktok.com/tiktok-awards-2021?lang=pt-BR' }],
  brandCases: [
    { brand: 'TikTok', campaign: 'Começa no TikTok', year: '2020', formats: ['Campanha nacional'],
      description: 'Criadora convidada para a primeira campanha nacional da plataforma no Brasil, que levou o universo dos vídeos para além do aplicativo.',
      result: null, media: null, source: 'https://newsroom.tiktok.com/comeca-no-tiktok?lang=pt-BR', color: '#5B0E2D' },
    { brand: 'Black Princess', campaign: 'FemAle · #StrongFemAle', year: '2023', formats: ['Ação de marca'],
      description: 'Participação anunciada na ação da edição FemAle, que reuniu criadoras em torno do protagonismo feminino.',
      result: null, media: null, source: 'https://www.promoview.com.br/experiencia-de-marca/black-princess-nova-edicao-cerveja-fabricada-mulheres/', color: '#183F37' }
  ]
};

// Formatação compartilhada entre o HTML gerado e o contador do navegador.
window.formatSocialNumber = function (value) {
  if (!Number.isFinite(value) || value < 0) return '';
  var unit = value >= 1000000 ? 1000000 : value >= 1000 ? 1000 : 1;
  var digits = unit === 1000000 ? 2 : unit === 1000 ? 1 : 0;
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(value / unit) + (unit === 1000000 ? ' mi' : unit === 1000 ? ' mil' : '');
};
