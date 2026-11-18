(function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

var RESPS = ['Liderança', 'Analista', 'Supervisão'];
var COR_R = { 'Liderança': '#70D44B', 'Analista': '#2457B3', 'Supervisão': '#E9A23B' };
var PERS = [
  { k: 'Diária',            t: 'Todos os dias',       s: 'Rotina diária',                 b: 'Dia',    c: '#70D44B', tc: '#151618' },
  { k: 'Semanal',           t: 'Toda semana',         s: 'Rotina semanal',                b: 'Sem',    c: '#2F9E8F', tc: '#fff' },
  { k: 'Quinzenal',         t: 'A cada 15 dias',      s: 'Rotina quinzenal',              b: '15d',    c: '#2457B3', tc: '#fff' },
  { k: 'Mensal',            t: 'Todo mês',            s: 'Rotina mensal',                 b: 'Mês',    c: '#151618', tc: '#fff' },
  { k: 'Quando necessário', t: 'Quando acontecer',    s: 'Sempre que a situação ocorrer', b: '!',      c: '#E9A23B', tc: '#151618' }
];
function perDef(k) { return PERS.filter(function (p) { return p.k === k; })[0]; }
var NOMES_GAR = GARAGENS.map(function (g) { return g.nome; });

var ICO = {
  planilha: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>',
  sistema:  '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  chamado:  '<svg viewBox="0 0 24 24"><path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M13 6v12" stroke-dasharray="2 3"/></svg>',
  portal:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>'
};
var TIPO = { planilha: 'Planilha', sistema: 'Sistema', chamado: 'Chamado', portal: 'Portal' };
var SETA = '<svg class="seta" viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg>';
var RELOGIO = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

/* ---------- estado (fica no endereço da página, para compartilhar) ---------- */
var F = { g: '', r: '', p: '', q: '' };
var LS = null; try { LS = window.localStorage; } catch (e) {}
function lerUrl() {
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('garagem') && NOMES_GAR.indexOf(q.get('garagem')) >= 0) F.g = q.get('garagem');
    if (q.get('funcao') && RESPS.indexOf(q.get('funcao')) >= 0) F.r = q.get('funcao');
    if (q.get('periodo') && perDef(q.get('periodo'))) F.p = q.get('periodo');
  } catch (e) {}
  if (!F.g && !F.r && LS) {
    try { var g = LS.getItem('est_garagem'), r = LS.getItem('est_funcao');
      if (g && NOMES_GAR.indexOf(g) >= 0) F.g = g; if (r && RESPS.indexOf(r) >= 0) F.r = r; } catch (e) {}
  }
}
function urlVisao(f) {
  f = f || F; var q = new URLSearchParams();
  if (f.g) q.set('garagem', f.g); if (f.r) q.set('funcao', f.r); if (f.p) q.set('periodo', f.p);
  var s = q.toString();
  return location.origin + location.pathname + (s ? '?' + s : '') + (s ? '#rotina' : '');
}
function gravar() {
  try { var u = urlVisao(); history.replaceState(null, '', u.replace(location.origin, '').replace(/#rotina$/, '') + (location.hash || '')); } catch (e) {}
  if (LS) { try { LS.setItem('est_garagem', F.g); LS.setItem('est_funcao', F.r); } catch (e) {} }
}

/* ---------- regras de filtro ---------- */
function persDe(a, resp) {
  if (a.todos || !a.papeis.length) return a.per || [];
  var s = {}; a.papeis.forEach(function (p) { if (!resp || p.r === resp) p.p.forEach(function (x) { s[x] = 1; }); });
  return PERS.map(function (x) { return x.k; }).filter(function (k) { return s[k]; });
}
function textoBusca(a) {
  return norm([a.titulo, a.sub, a.dept, a.grupo, (a.sis || []).join(' '), a.papeis.map(function (p) { return p.r + ' ' + p.o; }).join(' '), a.links.map(function (l) { return l.t; }).join(' ')].join(' '));
}
function atende(a, semPer) {
  if (F.r && !a.todos && !a.papeis.some(function (p) { return p.r === F.r; })) return false;
  if (F.q && textoBusca(a).indexOf(norm(F.q)) < 0) return false;
  if (!semPer && F.p && persDe(a, F.r).indexOf(F.p) < 0) return false;
  return true;
}
function urlDoLink(l) { return (F.g && l.g && l.g[F.g]) ? l.g[F.g] : l.u; }

/* ---------- montagem ---------- */
function opcoes(sel, rot, vals, atual) {
  sel.innerHTML = '<option value="">' + rot + '</option>' + vals.map(function (v) { return '<option' + (v === atual ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join('');
}
function montaAvisos() {
  $('avisos').innerHTML = AVISOS.map(function (a) {
    return '<div class="aviso-faixa"><div class="wrap"><span class="ic">!</span><p>' + a.texto + '</p>' + (a.link ? '<a href="' + esc(a.link.u) + '" target="_blank" rel="noopener">' + esc(a.link.t) + ' ↗</a>' : '') + '</div></div>';
  }).join('');
}
function montaFiltros() {
  opcoes($('f-g'), 'Garagem: todas', NOMES_GAR, F.g);
  opcoes($('f-r'), 'Função: todas', RESPS, F.r);
  opcoes($('h-g'), 'Todas as garagens', NOMES_GAR, F.g);
  opcoes($('h-r'), 'Todas as funções', RESPS, F.r);
  $('f-g').classList.toggle('ativo', !!F.g); $('f-r').classList.toggle('ativo', !!F.r);
  if ($('f-q').value !== F.q) $('f-q').value = F.q;
  $('limpar').hidden = !(F.g || F.r || F.p || F.q);
}
function montaPers() {
  var base = ATIVIDADES.filter(function (a) { return atende(a, true); });
  var h = '<button role="tab" data-p="" class="' + (F.p ? '' : 'on') + '">Todas <i>' + base.length + '</i></button>';
  PERS.forEach(function (p) {
    var n = base.filter(function (a) { return persDe(a, F.r).indexOf(p.k) >= 0; }).length;
    h += '<button role="tab" data-p="' + p.k + '" class="' + (F.p === p.k ? 'on' : '') + '">' + p.t + ' <i>' + n + '</i></button>';
  });
  $('pers').innerHTML = h;
  $$('button', $('pers')).forEach(function (b) { b.onclick = function () { F.p = b.getAttribute('data-p'); atualiza(); }; });
}
function chipPer(k) { var p = perDef(k); return '<span class="pc" style="--c:' + p.c + ';--t:' + p.tc + '">' + esc(p.t) + '</span>'; }
function chipResp(r) { return '<span class="resp" style="--c:' + COR_R[r] + '"><i></i>' + esc(r) + '</span>'; }

/* tarefa dentro de uma faixa de periodicidade */
function tarefa(a, per) {
  var ps = a.papeis.filter(function (p) { return (!F.r || p.r === F.r) && p.p.indexOf(per) >= 0; });
  var grupos = [];
  ps.forEach(function (p) {
    var key = p.p.join('|') + '#' + p.o, g = grupos.filter(function (x) { return x.key === key; })[0];
    if (g) g.rs.push(p.r); else grupos.push({ key: key, rs: [p.r], p: p.p, o: p.o });
  });
  var h = '<article class="tarefa rv"><div class="t-corpo"><div class="t-top"><span class="dept">' + esc(a.dept) + '</span>' + (a.novo ? '<span class="novo">NOVO</span>' : '') + '</div>';
  h += '<h4>' + esc(a.titulo) + '</h4>' + (a.sub ? '<p class="t-sub">' + esc(a.sub) + '</p>' : '');
  h += '<div class="quem">';
  if (a.todos || !a.papeis.length) {
    h += '<div class="papel"><div class="rs"><span class="resp" style="--c:#9AA3A8"><i></i>Todos</span></div><div><p style="color:var(--mute)">Vale para toda a equipe da operação.</p></div></div>';
  } else {
    grupos.forEach(function (g) {
      var outros = g.p.filter(function (x) { return x !== per; });
      h += '<div class="papel"><div class="rs">' + g.rs.map(chipResp).join('') + '</div><div>' +
        (g.o ? '<p>' + esc(g.o) + '</p>' : '<p style="color:var(--mute)">Acompanhar e atualizar no local indicado ao lado.</p>') +
        (outros.length ? '<div class="pp"><span style="font-size:12px;color:var(--mute)">Também:</span>' + outros.map(chipPer).join('') + '</div>' : '') +
        '</div></div>';
    });
  }
  h += '</div>';
  if (a.prazo) h += '<div class="prazo">' + RELOGIO + '<span>' + a.prazo + '</span></div>';
  h += '</div><div class="t-onde"><span class="tt">Onde fazer</span>';
  if (a.sis && a.sis.length) h += '<div class="sis">' + a.sis.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div>';
  if (a.links.length) h += a.links.map(function (l) {
    return '<a class="lk" href="' + esc(urlDoLink(l)) + '" target="_blank" rel="noopener"><span class="ic">' + ICO[l.k] + '</span><span class="tx">' + (/^abrir/i.test(l.t) ? '' : 'Abrir ') + esc(l.t) + (l.rede ? '<span class="rede">Só na rede Estapar / VPN</span>' : '') + '</span>' + SETA + '</a>';
  }).join('');
  else h += '<div class="semlink">Sem link direto: faça pelo sistema indicado acima.</div>';
  return h + '</div></article>';
}
function montaRotina() {
  var lista = ATIVIDADES.filter(function (a) { return atende(a, false); });
  var per = F.p ? PERS.filter(function (p) { return p.k === F.p; }) : PERS;
  var h = '';
  per.forEach(function (p) {
    var itens = lista.filter(function (a) { return persDe(a, F.r).indexOf(p.k) >= 0; });
    if (!itens.length && F.q) return;
    h += '<div class="faixa-per"><div class="fp-h rv"><span class="bolha" style="--c:' + p.c + ';--t:' + p.tc + '">' + p.b + '</span><div><h3>' + p.t + '</h3><small>' + p.s + '</small></div><span class="lane"></span><span class="q">' + itens.length + ' tarefa' + (itens.length === 1 ? '' : 's') + '</span></div><div class="tarefas">';
    h += itens.length ? itens.map(function (a) { return tarefa(a, p.k); }).join('') :
      '<div class="vaz">Nenhuma rotina ' + p.s.replace('Rotina ', '').toLowerCase() + (F.r ? ' para <b>' + esc(F.r) + '</b>' : '') + ' na planilha no momento.</div>';
    h += '</div></div>';
  });
  if (!h) h = '<div class="vaz"><b>Nada encontrado para “' + esc(F.q) + '”.</b><br>Tente outra palavra ou limpe a busca.</div>';
  $('faixas').innerHTML = h;
  var titulo = F.p ? perDef(F.p).t : 'O que fazer em cada período';
  $('r-tit').textContent = titulo;
  var partes = [];
  if (F.g) partes.push('<span class="tag">Garagem: ' + esc(F.g) + '</span>');
  if (F.r) partes.push('<span class="tag">' + esc(F.r) + '</span>');
  $('resumo').innerHTML = '<span><b>' + lista.length + '</b> tarefa' + (lista.length === 1 ? '' : 's') + ' nesta visão</span>' + partes.join('') +
    ((F.g || F.r || F.p) ? '<button class="copia" id="copiaVisao"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>Copiar link desta visão</button>' : '');
  if ($('copiaVisao')) $('copiaVisao').onclick = function () { copiar(urlVisao()); };
  observar();
}
function montaGaragens() {
  var carro = '<svg viewBox="0 0 30 54"><rect x="1" y="1" width="28" height="52" rx="9" fill="#70D44B"/><rect x="5" y="14" width="20" height="16" rx="4" fill="#151618" opacity=".55"/><rect x="4" y="1" width="6" height="4" rx="1" fill="#fff6c8"/><rect x="20" y="1" width="6" height="4" rx="1" fill="#fff6c8"/></svg>';
  $('gars').innerHTML = GARAGENS.map(function (g) {
    return '<button class="gar rv' + (F.g === g.nome ? ' on' : '') + '" data-g="' + esc(g.nome) + '"><span class="vg">' + carro + '</span>' +
      (g.obs ? '<span class="ob">' + esc(g.obs) + '</span>' : '') + '<span class="nm">' + esc(g.nome) + '</span>' +
      '<span class="ac">Ver rotina <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>';
  }).join('');
  $$('.gar', $('gars')).forEach(function (b) {
    b.onclick = function () { F.g = b.getAttribute('data-g'); atualiza(); irPara('rotina'); };
  });
  observar();
}
function montaLinks() {
  var q = norm($('lk-q').value), itens = [];
  ATIVIDADES.forEach(function (a) {
    a.links.forEach(function (l) {
      var txt = norm(l.t + ' ' + a.titulo + ' ' + a.dept + ' ' + (a.sis || []).join(' '));
      if (q && txt.indexOf(q) < 0) return;
      itens.push('<a class="tile rv" href="' + esc(urlDoLink(l)) + '" target="_blank" rel="noopener"><div class="top"><span class="ic">' + ICO[l.k] + '</span><div><div class="tp">' + TIPO[l.k] + ' · ' + esc(a.dept) + '</div><h3>' + esc(l.t) + '</h3></div></div>' +
        '<p class="pq">Para: ' + esc(a.titulo) + '</p><div class="pps">' + persDe(a, '').map(chipPer).join('') + '</div>' +
        (l.rede ? '<span class="rd">Só abre na rede Estapar / VPN</span>' : '') +
        '<span class="ir">Abrir <svg viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg></span></a>');
    });
  });
  $('tiles').innerHTML = itens.length ? itens.join('') : '<div class="vaz" style="grid-column:1/-1">Nenhum link encontrado.</div>';
  $('lk-sub').textContent = itens.length + ' link' + (itens.length === 1 ? '' : 's') + ' · clique para abrir direto, em uma nova aba.';
  observar();
}
function montaAtalhos() {
  var h = '';
  ['Diária', 'Semanal', 'Mensal'].forEach(function (k) {
    var n = ATIVIDADES.filter(function (a) { return persDe(a, F.r).indexOf(k) >= 0 && (!F.r || a.todos || a.papeis.some(function (p) { return p.r === F.r; })); }).length;
    h += '<a href="#rotina" data-p="' + k + '"><b>' + n + '</b>' + perDef(k).t + '</a>';
  });
  $('atalhos').innerHTML = h;
  $$('a', $('atalhos')).forEach(function (a) { a.onclick = function (e) { e.preventDefault(); F.p = a.getAttribute('data-p'); atualiza(); irPara('rotina'); }; });
}
function montaRodape() {
  var vistos = {}, li = [];
  ATIVIDADES.forEach(function (a) { a.links.forEach(function (l) { if (li.length < 5 && !vistos[l.t] && !l.rede) { vistos[l.t] = 1; li.push('<li><a href="' + esc(l.u) + '" target="_blank" rel="noopener">' + esc(l.t) + ' ↗</a></li>'); } }); });
  $('ft-links').innerHTML = li.join('');
  $('ft-fonte').textContent = 'Fonte: ' + SITE.fonte + ' · Atualizado em ' + SITE.atualizadoEm + (SITE.versao ? ' · Versão ' + SITE.versao : '');
  $('ft-area').textContent = 'Orientação e atribuição de responsabilidades · ' + SITE.area + '. Responsável pelo conteúdo: ' + SITE.contato + '.';
  $('ft-uso').textContent = 'Estapar · Uso interno · © ' + new Date().getFullYear();
  $('h-area').textContent = 'Orientação e atribuição de responsabilidades · ' + SITE.area;
}
function montaPrazos() {
  $('prz').innerHTML = (typeof PRAZOS === 'undefined' ? [] : PRAZOS).map(function (p) {
    return '<div class="pz rv"><div class="v">' + esc(p.valor) + (p.unidade ? ' <small>' + esc(p.unidade) + '</small>' : '') + '</div><h3>' + esc(p.titulo) + '</h3><p>' + esc(p.texto) + '</p></div>';
  }).join('');
  $('prazos').hidden = !$('prz').innerHTML;
}
function montaDuvidas() {
  $('faq').innerHTML = (typeof DUVIDAS === 'undefined' ? [] : DUVIDAS).map(function (d, i) {
    return '<details class="rv"><summary><span class="n">' + (i < 9 ? '0' : '') + (i + 1) + '.</span>' + esc(d.p) + '<span class="mx">+</span></summary><div class="rsp">' + d.r + '</div></details>';
  }).join('');
}
function atualiza() { gravar(); montaFiltros(); montaPers(); montaRotina(); montaAtalhos(); $$('.gar').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-g') === F.g); }); montaLinks(); }
function irPara(id) { var el = $(id); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }

/* ---------- surgir ao rolar ---------- */
var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -40px 0px' }) : null;
function observar() {
  $$('.rv:not(.vis)').forEach(function (el, i) {
    if (!io) { el.classList.add('vis'); return; }
    if (!el._obs) { el._obs = 1; el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); }
  });
  /* conteúdo já visível na tela aparece na hora */
  $$('.rv:not(.vis)').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('vis'); });
}

/* ---------- eventos ---------- */
$('f-g').onchange = function () { F.g = this.value; atualiza(); };
$('f-r').onchange = function () { F.r = this.value; atualiza(); };
$('f-q').oninput = function () { F.q = this.value; montaPers(); montaRotina(); $('limpar').hidden = !(F.g || F.r || F.p || F.q); };
$('limpar').onclick = function () { F.g = F.r = F.p = F.q = ''; atualiza(); };
$('lk-q').oninput = montaLinks;
$('rapido').onsubmit = function (e) { e.preventDefault(); F.g = $('h-g').value; F.r = $('h-r').value; atualiza(); irPara('rotina'); };
$('burger').onclick = function () { var a = $('menu').classList.toggle('aberto'); this.setAttribute('aria-expanded', a); };
$$('#menu a').forEach(function (a) { a.addEventListener('click', function () { $('menu').classList.remove('aberto'); $('burger').setAttribute('aria-expanded', 'false'); }); });
$('topo').onclick = function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); };

/* cabeçalho sólido + carrinho na estrada + menu ativo */
var secs = ['rotina', 'prazos', 'garagens', 'links', 'duvidas'];
function aoRolar() {
  var y = scrollY, max = document.documentElement.scrollHeight - innerHeight, pc = max > 0 ? y / max : 0;
  $('nav').classList.toggle('solid', y > 40);
  $('feito').style.width = (pc * 100) + '%';
  $('carro').style.left = (pc * 100) + '%';
  $('topo').classList.toggle('show', y > innerHeight);
  var at = ''; secs.forEach(function (id) { var el = $(id); if (el && el.getBoundingClientRect().top < 200) at = id; });
  $$('#menu a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + at); });
  if (!$('sharePop').hidden) fecharShare();
}
addEventListener('scroll', aoRolar, { passive: true });

/* ---------- compartilhar ---------- */
function textoPag() {
  var f = []; if (F.g) f.push(F.g); if (F.r) f.push(F.r); if (F.p) f.push(perDef(F.p).t);
  return 'Estapar — o que fazer, quando fazer e onde fazer' + (f.length ? ' (' + f.join(' · ') + ')' : '');
}
function toast(h) { var t = $('toast'); t.innerHTML = h; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2600); }
function abrirShare() {
  var pop = $('sharePop'), b = $('compartilhar').getBoundingClientRect(), u = urlVisao(), tx = textoPag();
  $('shareLink').value = u;
  $('sh-wa').href = 'https://wa.me/?text=' + encodeURIComponent(tx + '\n' + u);
  $('sh-em').href = 'mailto:?subject=' + encodeURIComponent(tx) + '&body=' + encodeURIComponent(tx + '\n\n' + u);
  pop.hidden = false;
  var w = pop.offsetWidth; pop.style.top = (b.bottom + 10) + 'px'; pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, b.right - w)) + 'px';
  $('compartilhar').setAttribute('aria-expanded', 'true');
}
function fecharShare() { $('sharePop').hidden = true; $('compartilhar').setAttribute('aria-expanded', 'false'); }
function copiar(t) {
  function via() { var i = $('shareLink'); i.value = t; i.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} return ok; }
  var ok = function () { toast('<b>✓</b> Link copiado'); fecharShare(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function () { via() ? ok() : toast('Selecione o link e copie com Ctrl+C'); });
  else via() ? ok() : toast('Selecione o link e copie com Ctrl+C');
}
$('compartilhar').onclick = function (e) { e.stopPropagation(); $('sharePop').hidden ? abrirShare() : fecharShare(); };
$('sharePop').onclick = function (e) { e.stopPropagation(); if (e.target.closest('[data-acao="copiar"]')) copiar(urlVisao()); else if (e.target.closest('a')) fecharShare(); };
document.addEventListener('click', function () { if (!$('sharePop').hidden) fecharShare(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharShare(); });

/* ---------- estacionamento animado (mesmo do painel de Ocorrências) ---------- */
function estacionamento() {
  var W = 1600, H = 900, cores = ['#5f6468', '#e8e8e8', '#2b2f33', '#7c858b', '#9aa3a8', '#70D44B', '#2457B3', '#b23a3a', '#d9dde0'];
  var rnd = 7; function r() { rnd = (rnd * 9301 + 49297) % 233280; return rnd / 233280; }
  var g = '<svg class="estac" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice"><defs>' +
    '<g id="car"><rect x="-28" y="-13" width="56" height="26" rx="8"/><rect x="-12" y="-10.5" width="22" height="21" rx="4" fill="#0b0c0d" opacity=".55"/><rect x="-6" y="-9" width="11" height="18" rx="3" fill="#fff" opacity=".16"/><rect x="25" y="-10" width="3" height="5" rx="1" fill="#fff6c8"/><rect x="25" y="5" width="3" height="5" rx="1" fill="#fff6c8"/><rect x="-28" y="-10" width="2.5" height="5" fill="#ff5a4f"/><rect x="-28" y="5" width="2.5" height="5" fill="#ff5a4f"/></g>' +
    '<radialGradient id="farol"><stop offset="0" stop-color="#fff6c8" stop-opacity=".5"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient></defs><rect width="' + W + '" height="' + H + '" fill="#17191b"/>';
  function fila(y0, y1, cy, sy, rot, livre) {
    for (var x = 0; x <= W + 64; x += 64) {
      g += '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + y1 + '" stroke="#fff" stroke-opacity=".2" stroke-width="2"/>';
      var cx = x + 32, oc = (livre !== undefined && Math.abs(cx - livre) < 2) ? false : r() < .72;
      if (oc) g += '<use href="#car" fill="' + cores[Math.floor(r() * cores.length)] + '" transform="translate(' + cx + ',' + cy + ') rotate(' + (r() < .5 ? rot : rot + 180) + ')"/>';
      else if (!(livre !== undefined && Math.abs(cx - livre) < 2)) g += '<rect class="vaga" x="' + (cx - 22) + '" y="' + (Math.min(y0, y1) + 12) + '" width="44" height="' + (Math.abs(y1 - y0) - 24) + '" rx="6" fill="none" stroke="#70D44B" stroke-width="2" style="animation-delay:' + (r() * 5).toFixed(1) + 's"/>';
      g += '<circle class="sens" cx="' + cx + '" cy="' + sy + '" r="3.4" fill="' + (oc ? '#e0574f' : '#70D44B') + '" style="animation-delay:' + (r() * 4).toFixed(1) + 's"/>';
    }
  }
  /* 3 corredores de vagas e 2 ruas */
  fila(0, 92, 46, 7, 90);
  fila(268, 360, 314, 353, 90);
  fila(360, 452, 406, 445, 90, 1120);
  fila(628, 720, 674, 713, 90);
  fila(720, 812, 766, 805, 90);
  [92, 268, 452, 628].forEach(function (y) { g += '<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>'; });
  [180, 540].forEach(function (y) { g += '<line class="faixa" x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '" stroke="#E9A23B" stroke-opacity=".55" stroke-width="3" stroke-dasharray="32 24"/>'; });
  for (var x = 120; x < W; x += 360) [136, 496].forEach(function (yy) {
    g += '<path d="M' + x + ' ' + yy + ' l18 0 l-6 -6 M' + (x + 18) + ' ' + yy + ' l-6 6" stroke="#fff" stroke-opacity=".25" stroke-width="2" fill="none"/><path d="M' + (x + 200) + ' ' + (yy + 88) + ' l-18 0 l6 -6 M' + (x + 182) + ' ' + (yy + 88) + ' l6 6" stroke="#fff" stroke-opacity=".25" stroke-width="2" fill="none"/>';
  });
  [[136, 'anda', 19, 0, '#70D44B'], [136, 'anda', 23, -11, '#e8e8e8'], [224, 'volta', 21, -4, '#9aa3a8'], [224, 'volta', 26, -15, '#2457B3'], [136, 'anda', 31, -22, '#2b2f33'],
   [496, 'anda', 24, -6, '#d9dde0'], [584, 'volta', 20, -9, '#70D44B'], [584, 'volta', 29, -19, '#7c858b']].forEach(function (a) {
    var y = a[0], dir = a[1], d = a[2], dl = a[3], c = a[4], rot = dir === 'anda' ? 0 : 180, fx = dir === 'anda' ? 44 : -44;
    g += '<g class="mov ' + (dir === 'volta' ? 'volta' : '') + '" style="animation-duration:' + d + 's;animation-delay:' + dl + 's"><ellipse cx="' + fx + '" cy="' + y + '" rx="42" ry="16" fill="url(#farol)"/><use href="#car" fill="' + c + '" transform="translate(0,' + y + ') rotate(' + rot + ')"/></g>';
  });
  /* carro verde que entra e estaciona na vaga livre */
  g += '<g class="estaciona"><use href="#car" fill="#70D44B" transform="translate(1120,496) rotate(-90)"/></g>';
  g += '<g transform="translate(1440,540)"><rect x="-8" y="-58" width="16" height="22" rx="3" fill="#2b2f33"/><rect class="cancela" x="0" y="-50" width="120" height="7" rx="3.5" fill="#E9A23B"/><circle cx="0" cy="-47" r="5" fill="#70D44B"/></g>';
  $('estac').innerHTML = g + '</svg>';
}
if (!reduce) document.querySelector('.hero').addEventListener('mousemove', function (e) {
  $('estac').style.transform = 'translate(' + ((e.clientX / innerWidth - .5) * -18) + 'px,' + ((e.clientY / innerHeight - .5) * -10) + 'px)';
});

/* ---------- início ---------- */
estacionamento(); montaAvisos(); lerUrl(); montaGaragens(); montaPrazos(); montaDuvidas(); montaRodape(); atualiza(); aoRolar(); observar();
if (location.search && location.hash === '#rotina') setTimeout(function () { irPara('rotina'); }, 300);
})();
