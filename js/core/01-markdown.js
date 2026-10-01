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

    function encabezado(nivel, texto) {
        var m = new RegExp(ESTRELLA + '\\s*(.*)$').exec(texto);
        var titulo = texto.replace(new RegExp('\\s*' + ESTRELLA + '.*$'), '').trim();
        var badge = m ? ' <span class="badge-examen">' + ESTRELLA + ' ' + u.esc(m[1] || 'Dato de examen') + '</span>' : '';
        var n = Math.min(nivel, 4);
        return '<h' + n + ' id="' + u.slug(titulo) + '">' + u.inline(titulo) + badge + '</h' + n + '>';
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

    function listaHtml(nodo) {
        if (!nodo.hijos.length) return '';
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
            out.push('<p>' + u.inline(p.join(' ')) + '</p>');
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
