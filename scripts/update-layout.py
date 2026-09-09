"""One-time migration of the existing page, preserving its editorial sections."""
from pathlib import Path
import re
root = Path(__file__).resolve().parent.parent
p = root / 'index.html'
s = p.read_text(encoding='utf-8')
s = s.replace('<meta name="author"', '<link rel="canonical" href="https://victorgabriel123x.github.io/casak/">\n<meta property="og:url" content="https://victorgabriel123x.github.io/casak/">\n<meta name="author"', 1)
s = s.replace('content="public/mathy/retrato-rosa.webp"', 'content="https://victorgabriel123x.github.io/casak/public/og-mathy.jpg"')
s = s.replace('<meta property="og:locale"', '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="Mathy Lemoss — influenciadora digital, atriz e humorista">\n<meta name="twitter:image:alt" content="Mathy Lemoss — influenciadora digital, atriz e humorista">\n<meta property="og:locale"', 1)
s = s.replace('<link rel="stylesheet" href="css/sections.css">', '<link rel="stylesheet" href="css/sections.css">\n<link rel="stylesheet" href="css/refinamentos.css">')
# Entry no longer hides the LCP photograph; text has a brief, independent reveal.
s = re.sub(r'<script>\s*/\* Decidido.*?</script>', '<script>document.documentElement.classList.add("js");</script>', s, count=1, flags=re.S)
s = s.replace('<body>', '<body>\n<div class="leitura" aria-hidden="true"><span id="leituraProgresso"></span></div>', 1)
s = s.replace('<div class="menu" id="menu" data-aberto="false"', '<div class="menu" id="menu" data-aberto="false" inert aria-hidden="true"')
s = s.replace('  <nav class="menu__lista"', '  <button type="button" class="menu__fechar" id="menuFechar" aria-label="Fechar menu">Fechar <span aria-hidden="true">×</span></button>\n  <nav class="menu__lista"',1)
s = s.replace('<a href="#manifesto">Manifesto</a>\n    ', '<a href="#inicio">Início</a>\n    ', 1)
s = s.replace('<a href="#trabalhos">Trabalhos</a>', '<a href="#audiovisual">Audiovisual</a>\n    <a href="#publicidade">Marcas</a>')
s = re.sub(r'  <nav class="menu__lista".*?</nav>', '''  <nav class="menu__lista" aria-label="Navegação">
    <a href="#inicio"><span>01</span>Início</a>
    <a href="#mathy"><span>02</span>Mathy</a>
    <a href="#trajetoria"><span>03</span>História</a>
    <a href="#conteudos"><span>04</span>Conteúdo</a>
    <a href="#audiovisual"><span>05</span>Audiovisual</a>
    <a href="#publicidade"><span>06</span>Marcas</a>
    <a href="#taro"><span>07</span>Tarô</a>
    <a href="#contato"><span>08</span>Contato</a>
  </nav>''',s,count=1,flags=re.S)
s = s.replace('<main id="conteudo-principal">','''<nav class="capitulos" id="capitulos" aria-label="Capítulos da página">
  <a href="#inicio"><span>01</span> Início</a><a href="#mathy"><span>02</span> Mathy</a>
  <a href="#trajetoria"><span>03</span> História</a><a href="#conteudos"><span>04</span> Conteúdo</a>
  <a href="#audiovisual"><span>05</span> Atriz</a><a href="#publicidade"><span>06</span> Marcas</a>
  <a href="#taro"><span>07</span> Tarô</a><a href="#contato"><span>08</span> Contato</a>
</nav>
<main id="conteudo-principal" tabindex="-1">''')
s = re.sub(r'    <ul class="hero__selos".*?</ul>', '',s,count=1,flags=re.S)
s = s.replace('     02 · MANIFESTO', '     02 · MANIFESTO', 1)
pos = s.index('<!-- ============================================================\n     02 · MANIFESTO')
s = s[:pos]+'''<section class="autoridade ch-escuro" aria-label="Presença e trajetória">
  <div class="wrap">
    <div id="metricas" hidden><!-- GENERATED:metricas --><!-- /GENERATED:metricas --></div>
    <ul class="autoridade__lista"><!-- GENERATED:autoridade --><!-- /GENERATED:autoridade --></ul>
  </div>
</section>

'''+s[pos:]
s = re.sub(r'    <ol class="traj__lista">.*?</ol>', '    <ol class="traj__lista"><!-- GENERATED:trajetoria --><!-- /GENERATED:trajetoria --></ol>',s,count=1,flags=re.S)
s = s.replace('    <div class="nicho__pills" role="tablist" aria-label="Categorias de conteúdo" id="nichoPills"></div>\n    <div class="nicho__palco" id="nichoPalco"></div>', '    <div class="nicho__mosaico"><!-- GENERATED:nicho --><!-- /GENERATED:nicho --></div>')
s = s.replace('id="trabalhos"', 'id="audiovisual"')
s = s.replace('    <header class="atriz__topo">', '    <span id="trabalhos" class="ancora-legada" aria-hidden="true"></span>\n    <header class="atriz__topo">')
s = re.sub(r'    <div class="atriz__grade">.*?\n    </div>\n  </div>\n</section>', '    <div class="atriz__grade"><!-- GENERATED:audiovisual --><!-- /GENERATED:audiovisual --></div>\n  </div>\n</section>', s, count=1, flags=re.S)
s = s.replace('      <ul class="publi__servicos">','      <div class="publi__formatos"><h3 class="publi__formatos-titulo">Formatos disponíveis para parceria</h3>\n      <ul class="publi__servicos">')
s = s.replace('    <div class="publi__faq">', '    <div class="publi__faq">',1)
s = s.replace('      </ul>\n    </div>\n\n    <div class="publi__faq">','      </ul>\n      </div>\n    </div>\n\n    <div class="publi__faq">',1)
s = s.replace('É enviado no primeiro contato pelo WhatsApp, com os dados atualizados de alcance, perfil de audiência e cases recentes.', 'Solicite pelo WhatsApp os dados de audiência e os materiais disponíveis para avaliar sua parceria. Envie marca, objetivo, formatos desejados e prazo.')
s = s.replace('o que entrega melhor resultado', 'a proposta adequada ao projeto')
s = s.replace('É isso que faz a peça performar em vez de parecer comercial.', 'A proposta é preservar a espontaneidade e a relação com quem acompanha seu trabalho.')
s = s.replace('O material de UGC é entregue separado, para a marca usar onde quiser, inclusive em mídia paga.', 'No UGC, os canais, o período de uso e a veiculação em mídia paga são combinados na proposta.')
s = s.replace('Material bruto e editado para a marca usar nos próprios canais e em mídia paga.', 'Conteúdo para os canais da marca, com entregas e direitos de uso definidos na proposta.')
s = s.replace('      <a class="btn btn--terciario" href="#trabalhos">', '      <a class="btn btn--terciario" href="#cases">')
s = s.replace('<section class="secao ch-creme marcas" aria-labelledby="marcas-titulo">','<section class="secao ch-creme marcas" id="cases" aria-labelledby="marcas-titulo">')
s = s.replace('  <div class="faixa marcas__faixa" id="marcasFaixa" aria-hidden="true"></div>\n  <p class="wrap marcas__nota rev" data-atraso=".12">Marcas e projetos com os quais a Mathy já trabalhou. Materiais e cases sob consulta.</p>', '''  <div class="wrap">
    <div class="cases__controles" aria-label="Controles da galeria">
      <p>Campanhas e projetos</p><div><button type="button" data-gallery="prev" aria-label="Trabalho anterior" aria-controls="casesGaleria">←</button><button type="button" data-gallery="next" aria-label="Próximo trabalho" aria-controls="casesGaleria">→</button></div>
    </div>
    <div class="cases__galeria" id="casesGaleria" role="region" aria-roledescription="carrossel" aria-label="Trabalhos selecionados" tabindex="0"><!-- GENERATED:cases --><!-- /GENERATED:cases --></div>
  </div>''')
s = s.replace('<section class="secao ch-roxo taro" id="taro">', '<section class="secao ch-roxo taro" id="taro">\n  <div class="wrap taro__transicao"><p class="rotulo">Agora, um outro lado da Mathy</p></div>\n  <div class="grao" aria-hidden="true"></div>')
s = re.sub(r'  <div class="taro__estrelas".*?</div>\n', '',s)
s = re.sub(r'  <span class="taro__anel.*?</span>\n', '',s)
s = re.sub(r'      <span class="taro__lua".*?</span>\n', '',s,flags=re.S)
s = re.sub(r'      <span class="taro__baralho".*?</span>\n', '',s)
s = s.replace('<ul class="taro__depos" id="taroDepos"></ul>', '<ul class="taro__depos" id="taroDepos"><!-- GENERATED:depoimentos --><!-- /GENERATED:depoimentos --></ul>')
s = s.replace('<p class="rotulo rev">Fala com a Mathy</p>', '<p class="rotulo rev">Quero trabalhar com a Mathy</p>')
s = s.replace('<h3 class="caminho__nome">Publicidade e projetos</h3>', '<h3 class="caminho__nome">Publicidade e campanhas</h3>')
s = s.replace('<h3 class="caminho__nome">Convites e eventos</h3>', '<h3 class="caminho__nome">Eventos e participações</h3>')
for label in ['Enviar briefing','Fazer convite','Agendar leitura']:
    s = s.replace('<span class="caminho__acao">WhatsApp', '<span class="caminho__acao">'+label,1)
s = s.replace('    <p class="rodape__local micro" data-texto="cidade">Dom Pedro, Maranhão · Brasil</p>', '''    <p class="rodape__local micro" data-texto="cidade">Dom Pedro, Maranhão · Brasil</p>
    <div class="rodape__credito"><p>Desenvolvido por <strong>VLDS Digital</strong></p><a data-link="waDesenvolvedor" href="#contato" target="_blank" rel="noopener noreferrer" aria-label="Contato com a VLDS Digital pelo WhatsApp: (98) 98477-2771">Contato <span>(98) 98477-2771</span> ↗</a></div>''')
s = s.replace('<script src="data/contato.js"></script>', '''<a id="contatoFlutuante" class="contato-flutuante" data-link="waPublicidade" href="#contato" target="_blank" rel="noopener noreferrer" hidden><span class="contato-flutuante__desktop">Publicidade e projetos</span><span class="contato-flutuante__mobile">Trabalhe com a Mathy</span><span aria-hidden="true">↗</span></a>
<script src="data/contato.js"></script>
<script src="data/mathy.js"></script>''')
s = s.replace('rel="noopener"', 'rel="noopener noreferrer"')
# The previous reel could not be authenticated: link to her verified official profile.
s = s.replace('data-link="videoTransformacao"', 'data-link="instagram"').replace('Assistir à história completa','Acompanhar a Mathy')
s = s.replace('</head>', '<!-- GENERATED:jsonld --><!-- /GENERATED:jsonld -->\n</head>',1)
p.write_text(s,encoding='utf-8')
print('Layout existente atualizado.')
