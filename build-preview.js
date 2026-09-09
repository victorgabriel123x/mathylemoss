/* ============================================================
   BUILD DE PREVIEW
   Gera uma versão auto-contida (CSS, JS e imagens embutidos)
   para publicar como página e revisar em qualquer dispositivo.
   O site de produção continua sendo o index.html multi-arquivo.

   uso:  node build-preview.js <caminho-de-saida.html>
   ============================================================ */
const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const saida = process.argv[2] || path.join(RAIZ, 'preview.html');

/* Raiz alternativa de assets (versões leves só para revisão).
   Se o arquivo existir lá, ele é usado no lugar do original. */
const ASSETS_LEVES = process.argv[3] || null;

function resolveAsset(rel) {
  if (ASSETS_LEVES) {
    const leve = path.join(ASSETS_LEVES, rel);
    if (ehArquivo(leve)) return leve;
  }
  return path.join(RAIZ, rel);
}

function ehArquivo(p) {
  try { return fs.statSync(p).isFile(); } catch (e) { return false; }
}

const MIME = {
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif'
};

let html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');

/* --- CSS: <link rel=stylesheet href="css/*"> -> <style> --- */
let css = '';
html = html.replace(/[ \t]*<link rel="stylesheet" href="(css\/[^"]+)">\n?/g, (_, href) => {
  css += `\n/* ===== ${href} ===== */\n` + fs.readFileSync(path.join(RAIZ, href), 'utf8');
  return '';
});
html = html.replace('</head>', `<style>${css}\n</style>\n</head>`);

/* --- preload de imagem não faz sentido em data: --- */
html = html.replace(/[ \t]*<link rel="preload" as="image"[^>]*>\n?/g, '');

/* --- JS local -> inline --- */
html = html.replace(/<script src="((?:js|data)\/[^"]+)"><\/script>/g, (_, src) =>
  `<script>\n/* ===== ${src} ===== */\n` + fs.readFileSync(path.join(RAIZ, src), 'utf8') + '\n</script>'
);

/* --- imagens locais -> data: URI --- */
let embutidas = 0, bytes = 0;
html = html.replace(/(src|href)="(public\/[^"]+)"/g, (m, attr, rel) => {
  const abs = resolveAsset(rel);
  if (!ehArquivo(abs)) {
    console.warn('  ! não encontrado:', rel);
    return m;
  }
  const buf = fs.readFileSync(abs);
  const mime = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
  embutidas++; bytes += buf.length;
  return `${attr}="data:${mime};base64,${buf.toString('base64')}"`;
});

/* --- caminhos citados dentro do JS ('public/...') --- */
html = html.replace(/'(public\/[^']+)'/g, (m, rel) => {
  const abs = resolveAsset(rel);
  if (!ehArquivo(abs)) {
    console.warn('  ! não encontrado (js):', rel);
    return m;
  }
  const buf = fs.readFileSync(abs);
  const mime = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
  embutidas++; bytes += buf.length;
  return `'data:${mime};base64,${buf.toString('base64')}'`;
});

/* --- também no CSS (url(public/...)) --- */
html = html.replace(/url\((['"]?)(public\/[^)'"]+)\1\)/g, (m, q, rel) => {
  const abs = resolveAsset(rel);
  if (!ehArquivo(abs)) return m;
  const buf = fs.readFileSync(abs);
  const mime = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
  embutidas++; bytes += buf.length;
  return `url("data:${mime};base64,${buf.toString('base64')}")`;
});

/* --- logos das marcas: montadas em JS, então viram um mapa de data: URI --- */
const dirBrands = path.join(RAIZ, 'public', 'brands');
if (fs.existsSync(dirBrands)) {
  const mapa = {};
  for (const f of fs.readdirSync(dirBrands)) {
    if (!f.endsWith('.svg')) continue;
    const buf = fs.readFileSync(path.join(dirBrands, f));
    mapa[f] = 'data:image/svg+xml;base64,' + buf.toString('base64');
    embutidas++; bytes += buf.length;
  }
  html = html.replace(
    /<script>\n\/\* ===== js\/secoes\.js/,
    `<script>window.__BRANDS_DATA=${JSON.stringify(mapa)};</script>\n<script>\n/* ===== js/secoes.js`
  );
}

/* --- a plataforma de publicação injeta o esqueleto: remover envoltórios --- */
html = html
  .replace(/<!DOCTYPE html>\s*/i, '')
  .replace(/<html[^>]*>\s*/i, '')
  .replace(/<\/html>\s*$/i, '')
  .replace(/<head>\s*/i, '')
  .replace(/<\/head>\s*/i, '')
  .replace(/<body>\s*/i, '')
  .replace(/<\/body>\s*/i, '')
  .replace(/[ \t]*<meta charset[^>]*>\n?/i, '')
  .replace(/[ \t]*<meta name="viewport"[^>]*>\n?/i, '')
  .replace(/[ \t]*<link rel="icon"[^>]*>\n?/i, '');

fs.writeFileSync(saida, html);
console.log(`preview: ${saida}`);
console.log(`  ${embutidas} arquivos embutidos · ${(bytes / 1048576).toFixed(2)} MB brutos`);
console.log(`  html final: ${(fs.statSync(saida).size / 1048576).toFixed(2)} MB`);
