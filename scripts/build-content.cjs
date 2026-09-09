/* Sem dependências: materializa os dados no HTML para SEO e navegação sem JS. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const ctx = { window: {}, Intl, Number }; vm.createContext(ctx);
for (const file of ['contato.js', 'conteudo.js', 'mathy.js']) vm.runInContext(fs.readFileSync(path.join(root, 'data', file), 'utf8'), ctx);
const C = ctx.window.SITE_CONFIG, D = ctx.window.MATHY_DATA, T = ctx.window.MATHY_CONTEUDO;
const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function render(key, content) {
  const re = new RegExp('<!-- GENERATED:' + key + ' -->[\\s\\S]*?<!-- /GENERATED:' + key + ' -->');
  if (!re.test(html)) throw new Error('Marcador ausente: ' + key);
  html = html.replace(re, '<!-- GENERATED:' + key + ' -->\n' + content + '\n<!-- /GENERATED:' + key + ' -->');
}
function link(url, label, cls = '') { return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`; }
render('autoridade', [
  ...D.brandCases.slice(0,1).map(c=>({year:c.year,title:c.brand,text:c.formats[0],source:c.source})),
  ...D.awards.map(a=>({year:a.year,title:a.title,text:a.role,source:a.source})),
  ...D.audiovisual.map(a=>({year:a.year,title:a.platform,text:a.title,source:a.source}))
].map(x=>`<li><span>${esc(x.year)}</span><strong>${esc(x.title)}</strong><p>${esc(x.text)}</p></li>`).join('\n'));
const milestones = [
  ...D.brandCases.slice(0,1).map(c=>({year:c.year,title:c.campaign,text:c.description,source:c.source})),
  ...D.awards.map(a=>({year:a.year,title:a.title,text:a.role+' na categoria “'+a.category+'”.',source:a.source})),
  ...D.audiovisual.map(a=>({year:a.year,title:a.platform,text:a.title+' · '+a.role+(a.season?' · '+a.season:''),source:a.source}))
];
render('trajetoria', milestones.map(x=>`<li class="traj__item rev"><span class="traj__ano">${esc(x.year)}</span><div><h3 class="traj__nome">${esc(x.title)}</h3><p class="traj__desc">${esc(x.text)}</p>${link(x.source,'Conhecer o projeto','fonte-link')}</div></li>`).join('\n') + '<li class="traj__item traj__item--agora rev"><span class="traj__ano">Agora</span><div><h3 class="traj__nome">Uma nova Mathy Lemoss</h3><p class="traj__desc">Influenciadora, atriz, humorista, espiritualidade, beleza e histórias reais.</p></div></li>');
const categories = T.nicho.filter(x=>['humor','beleza','estilo'].includes(x.id)).concat([
  {id:'lifestyle',nome:'Lifestyle',frase:'Existe muita vida fora do feed',texto:'As pausas, as descobertas e os momentos que também merecem ser vividos.',foto:'public/momentos/piquenique.webp',alt:'Mathy ao ar livre, sentada em uma canga vermelha'},
  {id:'rotina',nome:'Rotina',frase:'Sem personagem. Só Mathy',texto:'Entre um treino, uma conversa e um café, o cotidiano também conta uma história.',foto:'public/momentos/academia.webp',alt:'Mathy na academia, usando roupa de treino'}
]);
render('nicho', categories.map((c,i)=>`<article class="nicho-card nicho-card--${esc(c.id)} rev"><figure><img src="${esc(c.foto)}" alt="${esc(c.alt)}" loading="lazy" decoding="async" width="960" height="1280"></figure><div class="nicho-card__texto"><p class="rotulo">${esc(c.nome==='Estilo'?'Moda · meu estilo':c.nome)}</p><h3>${esc(c.frase)}</h3><p>${esc(c.texto)}</p></div></article>`).join('\n'));
render('audiovisual',D.audiovisual.map((a,i)=>`<article class="obra rev"><span class="obra__indice" aria-hidden="true">0${i+1}</span><p class="obra__meta"><span>${esc(a.platform)}</span><span>${esc(a.year)}</span></p><h3 class="obra__nome">${esc(a.title)}</h3><p class="obra__papel">${esc(a.role)}${a.season?' · '+esc(a.season):''}</p><p class="obra__desc">${esc(a.description)}</p>${link(a.source,i===0?'Ver no Prime Video':'Conhecer o filme','btn btn--fio')}</article>`).join('\n'));
render('cases',D.brandCases.map((c,i)=>`<article class="case" style="--case:${esc(c.color)}"><div class="case__capa"><span>${esc(c.formats.join(' · '))}</span><h3>${esc(c.brand)}</h3><p>${esc(c.year)}</p></div><div class="case__texto"><h4>${esc(c.campaign)}</h4><p>${esc(c.description)}</p>${c.result?'<p>'+esc(c.result)+'</p>':''}${link(c.source,'Conhecer a campanha','btn btn--fio')}</div></article>`).join('\n'));
render('depoimentos',T.depoimentos.map(d=>`<li class="rev"><figure><blockquote>“${esc(d.texto)}”</blockquote><figcaption>${esc(d.de)}</figcaption></figure></li>`).join('\n'));
const stats = [
 { value:D.socialStats.instagram.followers,label:'Instagram',kind:'seguidores',source:D.socialStats.instagram.source },
 { value:D.socialStats.tiktok.followers,label:'TikTok',kind:'seguidores',source:D.socialStats.tiktok.source },
 { value:D.socialStats.tiktok.likes,label:'TikTok',kind:'curtidas',source:D.socialStats.tiktok.source }
].filter(x=>Number.isFinite(x.value)&&x.value>0&&x.source&&D.socialStats.updatedAt);
render('metricas',stats.length?'<div class="metricas__grade">'+stats.map(s=>`<a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer"><strong data-count="${s.value}">${ctx.window.formatSocialNumber(s.value)}</strong><span>${esc(s.label)} · ${esc(s.kind)}</span></a>`).join('')+'</div><p class="metricas__data">Dados públicos atualizados em '+new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(D.socialStats.updatedAt))+'</p>':'');
html = html.replace(/id="metricas"(?: hidden)?/, 'id="metricas"'+(stats.length?'':' hidden'));
const jsonld = {'@context':'https://schema.org','@type':'ProfilePage',url:C.url,name:C.name+' | Influenciadora digital, atriz e humorista',mainEntity:{'@type':'Person',name:C.name,alternateName:'Mathy Lemos',url:C.url,image:C.url+'public/mathy/retrato-rosa.webp',jobTitle:['Influenciadora digital','Atriz','Humorista'],sameAs:Object.values(C.socials)}};
render('jsonld','<script type="application/ld+json">'+JSON.stringify(jsonld).replace(/</g,'\\u003c')+'</script>');
// Hydrate build-time href values from the very same contact configuration.
html = html.replace(/<a\b[^>]*\bdata-link="([^"]+)"[^>]*>/g,(tag,key)=>{
 const url = C.socials[key] || C[key];
 if (!url) throw new Error('Link sem configuração: '+key);
 return tag.replace(/href="[^"]*"/,'href="'+esc(url)+'"');
});
// Optional image manifest, produced by optimize-images.py.
const manifestPath = path.join(root,'data','images.json');
if(fs.existsSync(manifestPath)){
 const images = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 html = html.replace(/<img\b[^>]*src="(public\/[^"]+)"[^>]*>/g,(tag,src)=>{
   const m=images[src]; if(!m)return tag;
   tag=tag.replace(/\s(?:width|height|srcset|sizes)="[^"]*"/g,'');
   const sizes=src.includes('hero-recorte')?'(max-width: 767px) 92vw, 44vw':'(max-width: 600px) 92vw, (max-width: 900px) 70vw, 48vw';
   return tag.replace(/>$/,` width="${m.width}" height="${m.height}"${m.srcset?' srcset="'+m.srcset+'" sizes="'+sizes+'"':''}>`);
 });
 const hero=images['public/mathy/hero-recorte.webp'];
 html=html.replace(/<link rel="preload" as="image"[^>]+>/,`<link rel="preload" as="image" href="public/mathy/hero-recorte.webp" imagesrcset="${hero.srcset}" imagesizes="(max-width: 767px) 92vw, 44vw" fetchpriority="high">`);
}
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('HTML gerado: fontes, projetos, cases, SEO e contatos centralizados.');
