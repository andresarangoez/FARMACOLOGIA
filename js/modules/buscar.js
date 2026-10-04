/* ============================================================
   VISTA · #/buscar?q=…&s=7,8&g=…&t=…   ·  Buscador global y filtros
   Busca en TODO el texto de los temas (no solo en nombre y etiquetas),
   y filtra por sesión, grupo farmacológico y etiqueta.
   Tolerante a variantes de escritura (clofazimina / clofacimina,
   vancomicina / bancomicina, con o sin tildes) mediante una
   normalización de 1 carácter → 1 carácter, así los resaltados
   caen en el lugar correcto del texto original.
   No incluye la zona con clave (Datos examen).
   ============================================================ */
FA.buscar = (function () {
    var u = FA.u;
    var MAPA = { 'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e', 'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
                 'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u', 'ñ': 'n' };

    /* Misma longitud que el original: minúsculas, sin tildes, z→s, c→s (antes de e/i) o k, v→b, y→i */
    function norm(s) {
        s = s.toLowerCase();
        var out = '';
        for (var i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (MAPA[c]) c = MAPA[c];
            else if (c === 'z') c = 's';
            else if (c === 'c') c = /[eiéí]/.test(s.charAt(i + 1)) ? 's' : 'k';
            else if (c === 'v') c = 'b';
            else if (c === 'y') c = 'i';
            out += c;
        }
        return out;
    }

    var indice = null;
    function construir() {
        if (indice) return indice;
        indice = FA.datos.farmacos.map(function (f) {
            var secs = f.secciones.map(function (s) {
                var d = document.createElement('div');
                d.innerHTML = s.html.replace(/<\/(li|p|td|th|tr|h\d|blockquote)>/g, '$& ');   // espacio entre ítems al pasar a texto plano
                var texto = d.textContent.replace(/\s+/g, ' ').trim();
                return { id: s.id, titulo: s.titulo, texto: texto, n: norm(texto), nt: norm(s.titulo) };
            });
            var meta = [f.nombre, f.grupo, f.tema, f.mecanismo, f.tags.join(' ')].join(' ');
            return { f: f, secs: secs, nNombre: norm(f.nombre), nMeta: norm(meta), nGrupo: norm(f.grupo), nTags: norm(f.tags.join(' ')) };
        });
        return indice;
    }

    function tokens(q) { return norm(q).split(/[^a-z0-9]+/).filter(function (t) { return t.length >= 2; }); }

    function cuenta(texto, t) {
        var n = 0, i = texto.indexOf(t);
        while (i >= 0 && n < 50) { n++; i = texto.indexOf(t, i + t.length); }
        return n;
    }

    function resaltar(orig, ini, fin, toks) {
        var frag = orig.slice(ini, fin), nf = norm(frag), marcas = [];
        toks.forEach(function (t) {
            var i = nf.indexOf(t);
            while (i >= 0) { marcas.push([i, i + t.length]); i = nf.indexOf(t, i + t.length); }
        });
        marcas.sort(function (a, b) { return a[0] - b[0]; });
        var html = '', pos = 0;
        marcas.forEach(function (m) {
            if (m[0] < pos) return;
            html += u.esc(frag.slice(pos, m[0])) + '<mark>' + u.esc(frag.slice(m[0], m[1])) + '</mark>';
            pos = m[1];
        });
        return (ini > 0 ? '… ' : '') + html + u.esc(frag.slice(pos)) + (fin < orig.length ? ' …' : '');
    }

    /* filtros = { s:[n…], g:'grupo', t:'etiqueta' } → [{ f, puntos, fragmentos:[{sec,titulo,html}] }] */
    function buscar(q, filtros) {
        var toks = tokens(q), res = [];
        construir().forEach(function (it) {
            var f = it.f;
            if (filtros.s && filtros.s.length && filtros.s.indexOf(f.sesion) < 0) return;
            if (filtros.g && f.grupo !== filtros.g) return;
            if (filtros.t && f.tags.indexOf(filtros.t) < 0) return;
            if (!toks.length) { res.push({ f: f, puntos: 0, fragmentos: [] }); return; }
            var todo = it.nMeta + ' ' + it.secs.map(function (s) { return s.nt + ' ' + s.n; }).join(' ');
            for (var k = 0; k < toks.length; k++) if (todo.indexOf(toks[k]) < 0) return;
            var puntos = 0, frags = [];
            toks.forEach(function (t) {
                puntos += cuenta(it.nNombre, t) * 12 + cuenta(it.nGrupo, t) * 5 + cuenta(it.nTags, t) * 5 + cuenta(it.nMeta, t);
                it.secs.forEach(function (s) { puntos += cuenta(s.nt, t) * 4 + Math.min(cuenta(s.n, t), 5); });
            });
            it.secs.forEach(function (s) {
                if (frags.length >= 3) return;
                var pos = -1;
                for (var k = 0; k < toks.length && pos < 0; k++) pos = s.n.indexOf(toks[k]);
                if (pos < 0) { pos = s.nt.indexOf(toks[0]); if (pos < 0) return; frags.push({ sec: s.id, titulo: s.titulo, html: u.esc(s.texto.slice(0, 120)) + (s.texto.length > 120 ? ' …' : '') }); return; }
                var ini = Math.max(0, pos - 70), fin = Math.min(s.texto.length, pos + 110);
                frags.push({ sec: s.id, titulo: s.titulo, html: resaltar(s.texto, ini, fin, toks) });
            });
            res.push({ f: f, puntos: puntos, fragmentos: frags });
        });
        res.sort(function (a, b) { return b.puntos - a.puntos || a.f.sesion - b.f.sesion; });
        return res;
    }

    function opcionesFiltro() {
        var grupos = {}, tags = {};
        FA.datos.farmacos.forEach(function (f) {
            if (f.grupo) grupos[f.grupo] = (grupos[f.grupo] || 0) + 1;
            f.tags.forEach(function (t) { tags[t] = (tags[t] || 0) + 1; });
        });
        var ord = function (o) { return Object.keys(o).sort(function (a, b) { return o[b] - o[a] || (a < b ? -1 : 1); }).map(function (k) { return [k, o[k]]; }); };
        return { grupos: Object.keys(grupos).sort().map(function (k) { return [k, grupos[k]]; }), tags: ord(tags).sort(function (a, b) { return a[0] < b[0] ? -1 : 1; }) };
    }

    return { buscar: buscar, norm: norm, tokens: tokens, opcionesFiltro: opcionesFiltro };
})();

/* ── Vista ── */
FA.vistas.buscar = (function () {
    var u = FA.u;

    function leer() {
        var h = location.hash.split('?')[1] || '', p = {};
        h.split('&').forEach(function (kv) { if (!kv) return; var i = kv.indexOf('='); p[decodeURIComponent(kv.slice(0, i < 0 ? kv.length : i))] = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1)); });
        return { q: p.q || '', s: (p.s || '').split(',').filter(Boolean).map(Number), g: p.g || '', t: p.t || '' };
    }
    function escribir(st) {
        var partes = [];
        if (st.q) partes.push('q=' + encodeURIComponent(st.q));
        if (st.s.length) partes.push('s=' + st.s.join(','));
        if (st.g) partes.push('g=' + encodeURIComponent(st.g));
        if (st.t) partes.push('t=' + encodeURIComponent(st.t));
        history.replaceState(null, '', '#/buscar' + (partes.length ? '?' + partes.join('&') : ''));
    }

    return {
        titulo: 'Buscar',
        render: function () {
            var o = FA.buscar.opcionesFiltro(), st = leer();
            return '<div class="pagina">' +
                '<header class="cabecera"><p class="eyebrow">Material de estudio</p><h1>Buscar</h1>' +
                '<p class="lead">Busca en todo el texto de los temas. Escribe una o varias palabras (deben estar todas) y, si quieres, filtra por sesión, grupo o etiqueta.</p></header>' +
                '<div class="panel buscador-panel">' +
                '<label class="buscador buscador--grande">' + u.icono('buscar') + '<input type="search" data-q placeholder="Ej. nefrotoxicidad, ácido micólico, clofazimina…" aria-label="Buscar en todo el contenido" autocomplete="off" value="' + u.esc(st.q) + '"></label>' +
                '<div class="chips" data-chips role="group" aria-label="Filtrar por sesión">' + FA.datos.sesiones.map(function (s) {
                    return '<button type="button" class="chip" data-s="' + s.n + '" aria-pressed="' + (st.s.indexOf(s.n) >= 0) + '">Sesión ' + s.n + '</button>';
                }).join('') + '</div>' +
                '<div class="filtros-fila">' +
                '<label class="campo"><span>Grupo farmacológico</span><select data-g><option value="">Todos</option>' + o.grupos.map(function (g) { return '<option value="' + u.esc(g[0]) + '"' + (st.g === g[0] ? ' selected' : '') + '>' + u.esc(g[0]) + '</option>'; }).join('') + '</select></label>' +
                '<label class="campo"><span>Etiqueta</span><select data-t><option value="">Todas</option>' + o.tags.map(function (g) { return '<option value="' + u.esc(g[0]) + '"' + (st.t === g[0] ? ' selected' : '') + '>' + u.esc(g[0]) + ' (' + g[1] + ')</option>'; }).join('') + '</select></label>' +
                '<button type="button" class="btn btn--sec btn--chico" data-limpiar>Limpiar</button></div></div>' +
                '<p class="alcance__cuenta" data-cuenta aria-live="polite"></p>' +
                '<div class="resultados-b" data-res></div></div>';
        },
        montar: function (el) {
            var st = leer();
            var inp = el.querySelector('[data-q]'), cuenta = el.querySelector('[data-cuenta]'), res = el.querySelector('[data-res]');
            var selG = el.querySelector('[data-g]'), selT = el.querySelector('[data-t]'), chips = el.querySelector('[data-chips]');

            function pintar() {
                escribir(st);
                var r = FA.buscar.buscar(st.q, { s: st.s, g: st.g, t: st.t });
                var hay = st.q.trim() || st.s.length || st.g || st.t;
                cuenta.textContent = hay ? r.length + (r.length === 1 ? ' tema' : ' temas') + (st.q.trim() ? ' con «' + st.q.trim() + '»' : '') : 'Mostrando todos los temas (' + r.length + ').';
                res.innerHTML = r.length ? r.map(function (x) {
                    var f = x.f;
                    return '<article class="res-b"><div class="res-b__cab"><a class="res-b__nom" href="#/farmaco/' + f.id + '">' + u.esc(f.nombre) + '</a>' +
                        '<span class="chip chip--fijo">Sesión ' + f.sesion + '</span></div>' +
                        '<p class="res-b__grupo">' + u.esc(f.grupo) + '</p>' +
                        x.fragmentos.map(function (g) {
                            return '<a class="snip" href="#/farmaco/' + f.id + '/' + g.sec + '"><small>' + u.esc(g.titulo) + '</small><span>' + g.html + '</span></a>';
                        }).join('') + '</article>';
                }).join('') : '<div class="vacio"><b>Sin resultados</b><p>Prueba con otra palabra, menos palabras o quita algún filtro.</p></div>';
            }

            inp.addEventListener('input', function () { st.q = inp.value; pintar(); });
            chips.addEventListener('click', function (e) {
                var b = e.target.closest('.chip'); if (!b) return;
                var n = +b.dataset.s, i = st.s.indexOf(n);
                if (i >= 0) st.s.splice(i, 1); else st.s.push(n);
                b.setAttribute('aria-pressed', i < 0); pintar();
            });
            selG.addEventListener('change', function () { st.g = selG.value; pintar(); });
            selT.addEventListener('change', function () { st.t = selT.value; pintar(); });
            el.querySelector('[data-limpiar]').addEventListener('click', function () {
                st = { q: '', s: [], g: '', t: '' }; inp.value = ''; selG.value = ''; selT.value = '';
                chips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
                pintar(); inp.focus();
            });
            pintar();
            if (!st.q && !st.g && !st.t) inp.focus();
        }
    };
})();
