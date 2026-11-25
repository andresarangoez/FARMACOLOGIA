/* ============================================================
   NÚCLEO · Markdown → HTML
   Soporta lo que usan los archivos de /content: encabezados,
   tablas, citas (> ⭐ dato de examen), listas anidadas,
   bloques de código, líneas y párrafos.
   Lo marcado con ⭐ queda con clase para destacarlo.
   ============================================================ */
FA.md = (function () {
    var u = FA.u;
    var ESTRELLA = '⭐';

    /* Íconos de sección según el título (solo h2) */
    var ICO = {
        diana: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
        engranaje: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
        alerta: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/>',
        corazon: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
        jeringa: '<path d="m14.5 4.5 5 5M17 7l-9.5 9.5-3 .5.5-3L14.5 4.5M11 8l1.5 1.5M8.5 10.5 10 12M3.5 20.5l2-2"/>',
        reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
        libro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 1 6.5 18H20"/>',
        estrella: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
        lista: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>'
    };
    function icoSeccion(t) {
        var x = t.toLowerCase(), k =
            /indicaci|usos|cu[aá]ndo se|elecci[oó]n/.test(x) ? 'diana' :
            /mecanismo|ladme|farmacocin|c[oó]mo act|v[ií]a/.test(x) ? 'engranaje' :
            /efecto|adverso|toxic|reacci|contraindic|precauci|interacci|s[ií]ndrome|riesgo/.test(x) ? 'alerta' :
            /cuidado|enfermer|vigil|monitor|educaci/.test(x) ? 'corazon' :
            /dosis|administraci|preparaci|dilu|presentaci/.test(x) ? 'jeringa' :
            /historia|origen/.test(x) ? 'reloj' :
            /concepto|qu[eé] es|definici|clasificaci/.test(x) ? 'libro' :
            /clave|resumen|recuerda/.test(x) ? 'estrella' : 'lista';
        return '<span class="h-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICO[k] + '</svg></span>';
    }

    function encabezado(nivel, texto) {
        var m = new RegExp(ESTRELLA + '\\s*(.*)$').exec(texto);
        var titulo = texto.replace(new RegExp('\\s*' + ESTRELLA + '.*$'), '').trim();
        var badge = m ? ' <span class="badge-examen">' + ESTRELLA + ' ' + u.esc(m[1] || 'Dato de examen') + '</span>' : '';
        var n = Math.min(nivel, 4);
        return '<h' + n + ' id="' + u.slug(titulo) + '"' + (n === 2 ? ' class="h-sec"' : '') + '>' + (n === 2 ? icoSeccion(titulo) : '') + u.inline(titulo) + badge + '</h' + n + '>';
    }

    function celdas(l) {
        l = l.trim().replace(/^\|/, '').replace(/\|$/, '');
        return l.split('|').map(function (c) { return c.trim(); });
    }

    function cita(buf) {
        var parrafos = [], act = [];
        buf.forEach(function (l) {
            if (!l.trim()) { if (act.length) parrafos.push(act.join(' ')); act = []; }
            else act.push(l.trim());
        });
        if (act.length) parrafos.push(act.join(' '));
        var examen = parrafos.join(' ').indexOf(ESTRELLA) >= 0;
        return '<blockquote class="' + (examen ? 'dato' : 'nota') + '">' +
            parrafos.map(function (p) { return '<p>' + u.inline(p) + '</p>'; }).join('') + '</blockquote>';
    }

    /* Listas de primer nivel sin subniveles → tarjetas, fichas o pasos */
    /* «**Título:** texto» o «**Título** — texto»; sin dos puntos ni guion no es título */
    var reEtiq = /^\*\*([^*]{1,60}?):\*\*\s*(.+)$|^\*\*([^*]{1,60}?)\*\*\s*[:—–]\s*(.+)$/;
    function etiqueta(t) { var m = reEtiq.exec(t); return m ? [null, m[1] || m[3], m[2] || m[4]] : null; }
    function plano(t) { return t.replace(/[*_`]/g, '').trim(); }
    function listaVisual(nodo) {
        var hs = nodo.hijos;
        if (hs.length < 2 || hs.length > 14 || hs.some(function (h) { return h.hijos.length; })) return null;
        if (hs.some(function (h) { return /→\s*\*\*A:|^\*\*Q:/.test(h.txt); })) return null;
        var ord = hs[0].ord;
        var etiq = hs.map(function (h) { return etiqueta(h.txt); });
        if (etiq.every(Boolean)) {
            return '<' + (ord ? 'ol' : 'ul') + ' class="fichas-md' + (ord ? ' fichas-md--num' : '') + '">' + etiq.map(function (m) {
                return '<li><b class="fichas-md__t">' + u.inline(m[1].replace(/:$/, '')) + '</b><span>' + u.inline(m[2]) + '</span></li>';
            }).join('') + '</' + (ord ? 'ol' : 'ul') + '>';
        }
        if (ord) return '<ol class="pasos-md">' + hs.map(function (h) { return '<li><span>' + u.inline(h.txt) + '</span></li>'; }).join('') + '</ol>';
        if (hs.every(function (h) { return plano(h.txt).length <= 75; }))
            return '<ul class="tiles-md">' + hs.map(function (h) { return '<li><span>' + u.inline(h.txt) + '</span></li>'; }).join('') + '</ul>';
        return '<ul class="puntos-md">' + hs.map(function (h) { return '<li><span>' + u.inline(h.txt) + '</span></li>'; }).join('') + '</ul>';
    }

    function listaHtml(nodo) {
        if (!nodo.hijos.length) return '';
        if (nodo.ind === -1) { var v = listaVisual(nodo); if (v) return v; }
        var tag = nodo.hijos[0].ord ? 'ol' : 'ul';
        return '<' + tag + '>' + nodo.hijos.map(function (h) {
            var ex = h.txt.indexOf(ESTRELLA) >= 0 ? ' class="item-examen"' : '';
            return '<li' + ex + '>' + u.inline(h.txt) + listaHtml(h) + '</li>';
        }).join('') + '</' + tag + '>';
    }

    function aHtml(md) {
        var L = md.replace(/\r/g, '').split('\n');
        var i = 0, out = [];
        var reLista = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
        function esTabla(k) {
            return /^\s*\|/.test(L[k] || '') && /^\s*\|[\s:|-]+\|?\s*$/.test(L[k + 1] || '') && /-/.test(L[k + 1] || '');
        }
        function especial(k) {
            var l = L[k];
            return !l.trim() || /^#{1,6}\s/.test(l) || /^\s*---+\s*$/.test(l) || /^\s*```/.test(l) ||
                /^\s*>/.test(l) || esTabla(k) || reLista.test(l);
        }

        while (i < L.length) {
            var l = L[i], m;
            if (!l.trim()) { i++; continue; }

            if ((m = /^(#{1,6})\s+(.*)$/.exec(l))) { out.push(encabezado(m[1].length, m[2])); i++; continue; }
            if (/^\s*---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }

            if (/^\s*```/.test(l)) {
                var cod = []; i++;
                while (i < L.length && !/^\s*```/.test(L[i])) { cod.push(L[i]); i++; }
                i++;
                out.push('<pre><code>' + u.esc(cod.join('\n')) + '</code></pre>');
                continue;
            }

            if (/^\s*>/.test(l)) {
                var q = [];
                while (i < L.length && /^\s*>/.test(L[i])) { q.push(L[i].replace(/^\s*>\s?/, '')); i++; }
                out.push(cita(q));
                continue;
            }

            if (esTabla(i)) {
                var cab = celdas(L[i]); i += 2;
                var filas = [];
                while (i < L.length && /^\s*\|/.test(L[i])) { filas.push(celdas(L[i])); i++; }
                out.push('<div class="tabla-wrap"><table><thead><tr>' +
                    cab.map(function (c) { return '<th>' + u.inline(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
                    filas.map(function (f) {
                        var ex = f.join(' ').indexOf(ESTRELLA) >= 0 ? ' class="fila-examen"' : '';
                        return '<tr' + ex + '>' + f.map(function (c) { return '<td>' + u.inline(c) + '</td>'; }).join('') + '</tr>';
                    }).join('') + '</tbody></table></div>');
                continue;
            }

            if (reLista.test(l)) {
                var items = [];
                while (i < L.length && L[i].trim() && (reLista.test(L[i]) || (items.length && /^\s+\S/.test(L[i])))) {
                    var lm = reLista.exec(L[i]);
                    if (lm) items.push({ ind: lm[1].length, ord: /\d/.test(lm[2]), txt: lm[3], hijos: [] });
                    else items[items.length - 1].txt += ' ' + L[i].trim();
                    i++;
                }
                var raiz = { hijos: [], ind: -1 }, pila = [raiz];
                items.forEach(function (it) {
                    while (pila.length > 1 && pila[pila.length - 1].ind >= it.ind) pila.pop();
                    pila[pila.length - 1].hijos.push(it);
                    pila.push(it);
                });
                out.push(listaHtml(raiz));
                continue;
            }

            var p = [];
            while (i < L.length && !especial(i)) { p.push(L[i].trim()); i++; }
            if (!p.length) { p.push(L[i].trim()); i++; }
            var txt = p.join(' '), pe;
            if (/^\*\*[^*]{2,80}\*\*:?$/.test(txt)) out.push('<p class="sub-md">' + u.inline(txt.replace(/:?\*\*:?$/, '**')) + '</p>');
            else if ((pe = etiqueta(txt)) && pe[1].length <= 40 && txt.length < 320)
                out.push('<p class="dato-md"><b class="dato-md__t">' + u.inline(pe[1]) + '</b><span>' + u.inline(pe[2]) + '</span></p>');
            else out.push('<p>' + u.inline(txt) + '</p>');
        }
        return out.join('\n');
    }

    /* Frontmatter YAML simple: clave: valor  |  clave: [a, b] */
    function frontmatter(md) {
        var t = md.replace(/\r/g, '').replace(/^﻿/, '');
        var m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(t);
        if (!m) return { meta: {}, cuerpo: t };
        var meta = {};
        m[1].split('\n').forEach(function (l) {
            var k = /^([\w_]+):\s*(.*)$/.exec(l);
            if (!k) return;
            var v = k[2].trim();
            var arr = /^\[(.*)\]$/.exec(v);
            meta[k[1]] = arr ? arr[1].split(',').map(function (x) { return x.trim(); }).filter(Boolean) : v;
        });
        return { meta: meta, cuerpo: m[2] };
    }

    return { html: aHtml, frontmatter: frontmatter };
})();
