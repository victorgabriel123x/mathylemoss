/* ============================================================
   MATHY LEMOSS — CONTEÚDO
   Texto e dados separados do layout. Alterar aqui, não no HTML.
   Nada aqui é inventado: vem dos áudios da Mathy ou de fonte pública.
   ============================================================ */

window.MATHY_CONTEUDO = {

  /* ---------- 05 · EU NÃO SOU UM NICHO ----------
     Cada categoria tem sua própria cor. O arco-íris como sistema:
     a cor não decora, ela identifica o assunto.                  */
  nicho: [
    {
      id: 'humor',
      nome: 'Humor',
      cor: 'var(--rosa)',
      frase: 'Foi onde muita gente me conheceu',
      texto: 'Dublagens, interpretação, reação e espontaneidade. A habilidade de transformar situação comum em história que as pessoas querem mandar uma para a outra.',
      foto: 'public/mathy/retrato-rosa.webp',
      alt: 'Mathy Lemoss sorrindo, iluminada por luz rosa'
    },
    {
      id: 'beleza',
      nome: 'Beleza',
      cor: 'var(--coral)',
      frase: 'Se arrumar também pode ser uma forma de se escutar',
      texto: 'Tutoriais, maquiagem, cuidados, arrume-se comigo. E aquela conversa que só acontece enquanto o espelho está na frente.',
      foto: 'public/mathy/bastidor-01.webp',
      alt: 'Mathy Lemoss gravando conteúdo de beleza em frente ao espelho'
    },
    {
      id: 'estilo',
      nome: 'Estilo',
      cor: 'var(--amarelo)',
      frase: 'Eu não sigo a moda. Eu tenho a minha',
      texto: 'Looks, compras, experimentação e identidade. Cada uma com a sua moda, essa é a minha.',
      foto: 'public/mathy/vestido-amarelo.webp',
      alt: 'Mathy Lemoss em vestido amarelo de babados, em estúdio'
    },
    {
      id: 'espiritualidade',
      nome: 'Espiritualidade',
      cor: 'var(--lilas)',
      frase: 'Olhar para dentro passou a fazer tanto sentido quanto olhar para fora',
      texto: 'Tarô terapêutico, escuta e acolhimento. Direcionamento para quem precisa enxergar um momento por outro ângulo.',
      foto: 'public/mathy/taro.webp',
      alt: 'Mathy Lemoss de olhos fechados, mãos em prece, sob luz violeta'
    },
    {
      id: 'publicidade',
      nome: 'Publicidade',
      cor: 'var(--azul)',
      frase: 'A marca entra no meu mundo, não o contrário',
      texto: 'Campanhas, conteúdo patrocinado, UGC e projetos especiais, na linguagem que já funciona no perfil.',
      foto: 'public/mathy/sobre.webp',
      alt: 'Mathy Lemoss em ambiente descontraído, olhando para a câmera'
    },
    {
      id: 'eventos',
      nome: 'Eventos',
      cor: 'var(--laranja)',
      frase: 'Presença, e o conteúdo que nasce ali',
      texto: 'Cobertura em tempo real, bastidores e o material que continua rendendo depois que o evento acaba.',
      foto: 'public/momentos/risada-noite.webp',
      alt: 'Mathy Lemoss rindo, à noite, na rua'
    },
    {
      id: 'atuacao',
      nome: 'Atuação',
      cor: 'var(--turquesa)',
      frase: 'Da tela do celular para outras telas',
      texto: 'Streaming e cinema. Prime Video em 2022, cinema brasileiro em 2023, e o que ainda vier.',
      foto: 'public/mathy/violeta-01.webp',
      alt: 'Mathy Lemoss em retrato sob luz violeta'
    }
  ],

  /* ---------- 11 · MARCAS ----------
     "documentada" = com registro público (imprensa / IMDb).
     "informada"   = citada pela Mathy, sem fonte pública localizada.
     A faixa não diferencia visualmente. O título já é honesto.

     "logo" aponta para public/brands/<arquivo>.svg. Quando o arquivo
     existe, a faixa mostra o logotipo oficial; quando não existe, cai
     no wordmark tipográfico automaticamente, sem quebrar nada.
     Ver public/brands/LEIA-ME.md.                                   */
  marcas: [
    { nome: 'TikTok',         logo: 'tiktok.svg',         origem: 'documentada' },
    { nome: 'Prime Video',    logo: 'prime-video.svg',    origem: 'documentada' },
    { nome: 'Bradesco',       logo: 'bradesco.svg',       origem: 'documentada' },
    { nome: 'Burger King',    logo: 'burger-king.svg',    origem: 'documentada' },
    { nome: 'Americanas',     logo: 'americanas.svg',     origem: 'documentada' },
    { nome: 'Salon Line',     logo: 'salon-line.svg',     origem: 'documentada' },
    { nome: 'Mercado Livre',  logo: 'mercado-livre.svg',  origem: 'documentada' },
    { nome: 'Spotify',        logo: 'spotify.svg',        origem: 'informada' },
    { nome: 'Magazine Luiza', logo: 'magazine-luiza.svg', origem: 'informada' },
    { nome: 'Claro',          logo: 'claro.svg',          origem: 'informada' },
    { nome: 'Nissin',         logo: 'nissin.svg',         origem: 'informada' }
  ],

  /* ---------- 12 · DEPOIMENTOS DE TARÔ ----------
     Transcritos dos feedbacks reais enviados por clientes.
     Sem nome e sem print, por privacidade de quem escreveu.      */
  depoimentos: [
    {
      texto: 'Você vai muito além de uma leitura de cartas. Você entende o lado humano da gente e trabalha em cima disso. A gente nota que você realmente se importa com a pessoa que está do outro lado da tela.',
      de: 'Atendimento individual'
    },
    {
      texto: 'Mais do que respostas, encontrei clareza, acolhimento e uma nova forma de enxergar meus caminhos. Me fez acreditar mais em mim, na minha força e na minha intuição.',
      de: 'Tarô terapêutico'
    },
    {
      texto: 'Essa leitura me fez entender e pensar muitas coisas. O passado fica como referência, agora é focar no que está vindo. Voltarei outras vezes, porque você falou tudo que eu precisava ouvir.',
      de: 'Atendimento individual'
    },
    {
      texto: 'Amei sua leitura. Muito obrigada pelos conselhos que a espiritualidade me enviou através de você. Recebi com todo carinho.',
      de: 'Tarô terapêutico'
    }
  ]
};
