/* ============================================================
   VISTA · #/pizarra
   Pizarra para rayar y escribir (viene de la tutoría final):
   lápiz, resaltador, puntero láser, figuras, texto y borrador.
   El dibujo se guarda sólo en este navegador.
   ============================================================ */
FA.vistas.pizarra = (function () {
    var W = 1600, H = 1000, CLAVE = 'farmacologia-pizarra-v2';
    var COLORES = ['#0f2342', '#0A3E7C', '#2563eb', '#0891b2', '#16a34a', '#84cc16', '#f59e0b', '#ea580c', '#ef4444', '#db2777', '#7c3aed', '#6b7280'];
    var GROSOR = [[2, 'Fino'], [4, 'Medio'], [8, 'Grueso']];
    var FONDOS = [['cuadricula', 'Cuadrícula'], ['lineas', 'Líneas'], ['blanco', 'Blanco'], ['oscuro', 'Oscuro']];
    var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    var HERR = [
        ['lapiz', 'Lápiz (P)', '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/>'],
        ['resaltador', 'Resaltador (H)', '<path d="M9 15l-3 3h5l1-1"/><path d="M8 13l7-7 4 4-7 7z"/><path d="M4 21h16" stroke="#FBD785" stroke-width="3"/>'],
        ['laser', 'Puntero láser (L)', '<circle cx="12" cy="12" r="3.2" fill="#ef4444" stroke="#ef4444"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>'],
        ['texto', 'Texto (T)', '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>'],
        ['borrador', 'Borrador (E)', '<path d="M16 4l5 5-9 9H7l-3-3z"/><path d="M11 9l5 5M7 20h13"/>']
    ];
    var FIG = [
        ['linea', 'Línea (I)', '<path d="M5 19L19 5"/>'],
        ['flecha', 'Flecha (A)', '<path d="M5 19L19 5M10 5h9v9"/>'],
        ['doble', 'Flecha doble', '<path d="M5 19L19 5M10 5h9v9M14 19H5v-9"/>'],
        ['rect', 'Rectángulo (R)', '<rect x="4" y="6" width="16" height="12" rx="1.5"/>'],
        ['elipse', 'Círculo (O)', '<ellipse cx="12" cy="12" rx="8.5" ry="7"/>'],
        ['triangulo', 'Triángulo (Y)', '<path d="M12 4l8.5 15h-17z"/>'],
        ['rombo', 'Rombo', '<path d="M12 3l8 9-8 9-8-9z"/>']
    ];
    var SEL = ['mover', 'Seleccionar, mover y cambiar tamaño (V)', '<path d="M5 3l14 8-6 1.6L10 19z"/>'];
    var ES_FIG = {}; FIG.forEach(function (f) { ES_FIG[f[0]] = f; });
    var TECLAS = { p: 'lapiz', h: 'resaltador', l: 'laser', t: 'texto', i: 'linea', a: 'flecha', r: 'rect', o: 'elipse', y: 'triangulo', e: 'borrador', v: 'mover' };

    function cargar() {
        try { var d = JSON.parse(localStorage.getItem(CLAVE)); if (d && Array.isArray(d.items)) return d; } catch (e) {}
        return { items: [], fondo: 'cuadricula' };
    }
    function guardar(d) { try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch (e) {} }

    function boton(attr, tit, svg, extra) {
        return '<button type="button" class="pz-b" ' + attr + ' title="' + tit + '" aria-label="' + tit.replace(/\s*\(.*\)$/, '') + '"' + (extra || '') + '><svg ' + S + '>' + svg + '</svg></button>';
    }

    function render() {
        var h = function (x) { return boton('data-h="' + x[0] + '"', x[1], x[2], ' aria-pressed="false"'); };
        return '<div class="pz" data-pz>' +
            '<div class="pz-barra" role="toolbar" aria-label="Herramientas de la pizarra">' +
            '<div class="pz-grupo"><a class="pz-b pz-salir" href="#/inicio" title="Salir de la pizarra" aria-label="Salir de la pizarra"><svg ' + S + '><path d="M19 12H5M11 6l-6 6 6 6"/></svg></a></div>' +
            '<div class="pz-grupo">' + h(SEL) + HERR.slice(0, 4).map(h).join('') +
            '<span class="pz-menu"><button type="button" class="pz-b pz-b--menu" data-abrir="figuras" title="Figuras" aria-label="Figuras" aria-expanded="false" aria-pressed="false"><svg ' + S + ' data-fig-ico><path d="M12 4l8.5 15h-17z"/></svg><i class="pz-flechita" aria-hidden="true"></i></button>' +
            '<span class="pz-pop pz-pop--fig" data-pop="figuras" role="group" aria-label="Figuras">' + FIG.map(h).join('') + '</span></span>' +
            h(HERR[4]) + '</div>' +
            '<div class="pz-grupo"><span class="pz-menu"><button type="button" class="pz-b pz-b--menu" data-abrir="colores" title="Color" aria-label="Color" aria-expanded="false"><i class="pz-color pz-color--actual" data-color-actual></i><i class="pz-flechita" aria-hidden="true"></i></button>' +
            '<span class="pz-pop pz-pop--col" data-pop="colores" role="group" aria-label="Colores">' + COLORES.map(function (c) { return '<button type="button" class="pz-color" data-color="' + c + '" style="--c:' + c + '" aria-label="Color ' + c + '" aria-pressed="false"></button>'; }).join('') + '</span></span></div>' +
            '<div class="pz-grupo" aria-label="Grosor">' + GROSOR.map(function (g) { return '<button type="button" class="pz-b pz-grosor" data-g="' + g[0] + '" title="' + g[1] + '" aria-label="Grosor ' + g[1].toLowerCase() + '" aria-pressed="false"><i style="--g:' + (g[0] + 2) + 'px"></i></button>'; }).join('') + '</div>' +
            '<div class="pz-grupo">' +
            '<label class="pz-fondo"><span class="sr">Fondo</span><select data-fondo>' + FONDOS.map(function (f) { return '<option value="' + f[0] + '">' + f[1] + '</option>'; }).join('') + '</select></label>' +
            boton('data-deshacer', 'Deshacer (Ctrl+Z)', '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>') +
            boton('data-rehacer', 'Rehacer (Ctrl+Y)', '<path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/>') +
            boton('data-limpiar', 'Limpiar todo (C) · se puede deshacer', '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>') +
            boton('data-png', 'Guardar como imagen', '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>') +
            boton('data-full', 'Pantalla completa (F)', '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>') +
            '</div></div>' +
            '<div class="pz-hoja" data-hoja><canvas data-lienzo aria-label="Pizarra para dibujar"></canvas></div>' +
            '</div>';
    }

    function montar(el) {
        var raiz = el.querySelector('[data-pz]'), hoja = raiz.querySelector('[data-hoja]'), lienzo = raiz.querySelector('[data-lienzo]');
        var ctx = lienzo.getContext('2d');
        /* sin pie de página ni scroll mientras la pizarra está abierta */
        document.body.classList.add('con-pizarra');
        function alSalir() { if (location.hash.indexOf('#/pizarra') !== 0) { document.body.classList.remove('con-pizarra'); removeEventListener('hashchange', alSalir); } }
        addEventListener('hashchange', alSalir);
        /* la hoja ocupa todo el espacio: el lienzo toma su tamaño real en píxeles */
        function medir() {
            var w = hoja.clientWidth, hh = hoja.clientHeight, d = window.devicePixelRatio || 1;
            if (!w || !hh || (w === W && hh === H && lienzo.width === Math.round(w * d))) return;
            W = w; H = hh; lienzo.width = Math.round(w * d); lienzo.height = Math.round(hh * d);
            ctx.setTransform(d, 0, 0, d, 0, 0); pintar();
        }
        if (window.ResizeObserver) new ResizeObserver(medir).observe(hoja); else addEventListener('resize', medir);
        var doc = cargar(), historia = [], rehacer = [];
        function marcar() { historia.push(JSON.stringify(doc.items)); if (historia.length > 80) historia.shift(); rehacer = []; }
        var sel = [];   /* índices de lo seleccionado con la herramienta «Seleccionar» */
        var modo = 'lapiz', color = COLORES[0], grosor = 4, actual = null, rastro = [], raf = null, editor = null;

        function guardarYpintar() { guardar(doc); pintar(); }
        function punto(e) { var r = lienzo.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }

        function flecha(a, b, g) {
            var ang = Math.atan2(b.y - a.y, b.x - a.x), L = 10 + g * 2.5;
            ctx.beginPath(); ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x - L * Math.cos(ang - .45), b.y - L * Math.sin(ang - .45));
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x - L * Math.cos(ang + .45), b.y - L * Math.sin(ang + .45));
            ctx.stroke();
        }
        /* triángulo: punta arriba al centro (o abajo si se arrastra hacia arriba); rombo: puntas al centro de cada lado */
        function vertices(t) {
            var a = t.p[0], b = t.p[1], x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), cx = (x0 + x1) / 2, cy = (a.y + b.y) / 2;
            if (t.tipo === 'rombo') return [{ x: cx, y: a.y }, { x: x1, y: cy }, { x: cx, y: b.y }, { x: x0, y: cy }];
            return [{ x: cx, y: a.y }, { x: x1, y: b.y }, { x: x0, y: b.y }];
        }
        function fuente(t) { return '700 ' + t.s + 'px "Nunito Sans", system-ui, sans-serif'; }
        function dibujar(t) {
            ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = t.c; ctx.fillStyle = t.c; ctx.lineWidth = t.g;
            if (t.tipo === 'texto') {
                ctx.font = fuente(t); ctx.textBaseline = 'top';
                t.txt.split('\n').forEach(function (l, i) { ctx.fillText(l, t.x, t.y + i * t.s * 1.25); });
            } else if (t.tipo === 'lapiz' || t.tipo === 'resaltador') {
                if (t.tipo === 'resaltador') { ctx.globalAlpha = .35; ctx.lineWidth = t.g * 5 + 6; ctx.lineCap = 'butt'; }
                ctx.beginPath(); ctx.moveTo(t.p[0].x, t.p[0].y);
                for (var i = 1; i < t.p.length; i++) { var a = t.p[i - 1], b = t.p[i]; ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2); }
                if (t.p.length === 1) ctx.lineTo(t.p[0].x + .1, t.p[0].y);
                ctx.stroke();
            } else {
                var p = t.p[0], q = t.p[1];
                ctx.beginPath();
                if (t.tipo === 'rect') ctx.rect(Math.min(p.x, q.x), Math.min(p.y, q.y), Math.abs(q.x - p.x), Math.abs(q.y - p.y));
                else if (t.tipo === 'elipse') ctx.ellipse((p.x + q.x) / 2, (p.y + q.y) / 2, Math.abs(q.x - p.x) / 2, Math.abs(q.y - p.y) / 2, 0, 0, Math.PI * 2);
                else if (t.tipo === 'triangulo' || t.tipo === 'rombo') {
                    var v = vertices(t); ctx.moveTo(v[0].x, v[0].y);
                    for (var j = 1; j < v.length; j++) ctx.lineTo(v[j].x, v[j].y);
                    ctx.closePath();
                }
                else { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
                ctx.stroke();
                if (t.tipo === 'flecha' || t.tipo === 'doble') flecha(p, q, t.g);
                if (t.tipo === 'doble') flecha(q, p, t.g);
            }
            ctx.restore();
        }
        /* ---- selección: caja que encierra cada elemento, mover y escalar ---- */
        function caja(t) {
            if (t.tipo === 'texto') {
                ctx.save(); ctx.font = fuente(t);
                var lin = t.txt.split('\n'), w = Math.max.apply(null, lin.map(function (l) { return ctx.measureText(l).width; })); ctx.restore();
                return { x0: t.x, y0: t.y, x1: t.x + w, y1: t.y + lin.length * t.s * 1.25 };
            }
            var m = t.tipo === 'resaltador' ? t.g * 2.5 + 3 : t.g / 2 + (t.tipo === 'flecha' || t.tipo === 'doble' ? 8 + t.g * 2.5 : 0);
            var xs = t.p.map(function (q) { return q.x; }), ys = t.p.map(function (q) { return q.y; });
            return { x0: Math.min.apply(null, xs) - m, y0: Math.min.apply(null, ys) - m, x1: Math.max.apply(null, xs) + m, y1: Math.max.apply(null, ys) + m };
        }
        function cajaSel() {
            var c = null;
            sel.forEach(function (i) {
                var b = caja(doc.items[i]);
                c = c ? { x0: Math.min(c.x0, b.x0), y0: Math.min(c.y0, b.y0), x1: Math.max(c.x1, b.x1), y1: Math.max(c.y1, b.y1) } : b;
            });
            return c && { x0: c.x0 - 6, y0: c.y0 - 6, x1: c.x1 + 6, y1: c.y1 + 6 };
        }
        function dentro(p, c, m) { m = m || 0; return p.x >= c.x0 - m && p.x <= c.x1 + m && p.y >= c.y0 - m && p.y <= c.y1 + m; }
        function enAsa(p, c) { return Math.abs(p.x - c.x1) < 14 && Math.abs(p.y - c.y1) < 14; }
        function transformar(t, f, k) {
            var n = JSON.parse(JSON.stringify(t));
            if (n.tipo === 'texto') { var q = f({ x: n.x, y: n.y }); n.x = q.x; n.y = q.y; if (k) n.s = Math.max(8, t.s * k); }
            else n.p = n.p.map(f);
            return n;
        }
        function pintarSel() {
            if (modo !== 'mover') return;
            ctx.save(); ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
            if (actual && actual.sel === 'caja') {
                var a = actual.ini, b = actual.fin;
                ctx.fillStyle = 'rgba(37,99,235,.08)';
                ctx.fillRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
                ctx.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
            }
            var c = sel.length && cajaSel();
            if (c) {
                ctx.strokeRect(c.x0, c.y0, c.x1 - c.x0, c.y1 - c.y0);
                ctx.setLineDash([]); ctx.fillStyle = '#fff'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.rect(c.x1 - 7, c.y1 - 7, 14, 14); ctx.fill(); ctx.stroke();
            }
            ctx.restore();
        }

        function pintar() {
            ctx.clearRect(0, 0, W, H);
            doc.items.forEach(dibujar);
            if (actual && actual.tipo) dibujar(actual);
            pintarSel();
            if (modo === 'laser' && rastro.length) {
                var ahora = performance.now();
                rastro = rastro.filter(function (p) { return ahora - p.t < 420; });
                for (var i = 1; i < rastro.length; i++) {
                    var a = rastro[i - 1], b = rastro[i], v = 1 - (ahora - b.t) / 420;
                    ctx.save(); ctx.strokeStyle = 'rgba(239,68,68,' + (v * .55) + ')'; ctx.lineWidth = 7 * v + 1; ctx.lineCap = 'round';
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
                }
                var u = rastro[rastro.length - 1];
                if (u) {
                    ctx.save(); var g = ctx.createRadialGradient(u.x, u.y, 0, u.x, u.y, 20);
                    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,40,40,1)'); g.addColorStop(1, 'rgba(255,0,0,0)');
                    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(u.x, u.y, 20, 0, Math.PI * 2); ctx.fill(); ctx.restore();
                }
            }
        }
        function bucle() { if (!document.body.contains(lienzo)) { raf = null; return; } pintar(); raf = modo === 'laser' ? requestAnimationFrame(bucle) : null; }

        /* ---- borrador: quita el elemento que toque ---- */
        function distSeg(p, a, b) {
            var dx = b.x - a.x, dy = b.y - a.y, l = dx * dx + dy * dy, k = l ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l)) : 0;
            var x = a.x + k * dx - p.x, y = a.y + k * dy - p.y; return Math.sqrt(x * x + y * y);
        }
        function toca(t, p) {
            var r = 14 + (t.g || 0);
            if (t.tipo === 'texto') {
                ctx.save(); ctx.font = fuente(t);
                var lin = t.txt.split('\n'), w = Math.max.apply(null, lin.map(function (l) { return ctx.measureText(l).width; })); ctx.restore();
                return p.x > t.x - 8 && p.x < t.x + w + 8 && p.y > t.y - 8 && p.y < t.y + lin.length * t.s * 1.25 + 8;
            }
            if (t.tipo === 'lapiz' || t.tipo === 'resaltador') {
                for (var i = 0; i < t.p.length; i++) if (distSeg(p, t.p[Math.max(0, i - 1)], t.p[i]) < r + (t.tipo === 'resaltador' ? t.g * 2.5 : 0)) return true;
                return false;
            }
            var a = t.p[0], b = t.p[1];
            if (t.tipo === 'linea' || t.tipo === 'flecha' || t.tipo === 'doble') return distSeg(p, a, b) < r;
            if (t.tipo === 'triangulo' || t.tipo === 'rombo') {
                var v = vertices(t);
                return v.some(function (q, i) { return distSeg(p, q, v[(i + 1) % v.length]) < r; });
            }
            var x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y);
            if (t.tipo === 'rect') {
                var c = [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
                return c.some(function (q, i) { return distSeg(p, q, c[(i + 1) % 4]) < r; });
            }
            var rx = (x1 - x0) / 2 || 1, ry = (y1 - y0) / 2 || 1, nx = (p.x - x0 - rx) / rx, ny = (p.y - y0 - ry) / ry, d = Math.sqrt(nx * nx + ny * ny);
            return Math.abs(d - 1) * Math.min(rx, ry) < r;
        }
        function borrarEn(p) {
            for (var i = doc.items.length - 1; i >= 0; i--) if (toca(doc.items[i], p)) { actual.quitados.push(doc.items.splice(i, 1)[0]); }
            pintar();
        }

        /* ---- texto: un cuadro editable encima de la hoja ---- */
        function cerrarEditor(ok) {
            if (!editor) return;
            var e = editor; editor = null;
            var txt = e.ta.value.replace(/\s+$/, '');
            if (ok && txt) { marcar(); doc.items.push({ tipo: 'texto', x: e.x, y: e.y, c: e.c, s: e.s, g: 0, txt: txt }); guardarYpintar(); }
            e.ta.remove();
        }
        function abrirEditor(p) {
            cerrarEditor(true);
            var esc = hoja.clientWidth / W, s = 18 + grosor * 6;
            var ta = document.createElement('textarea');
            ta.className = 'pz-texto'; ta.rows = 1; ta.setAttribute('aria-label', 'Escribe el texto');
            ta.style.left = (p.x * esc) + 'px'; ta.style.top = (p.y * esc) + 'px';
            ta.style.color = color; ta.style.fontSize = (s * esc) + 'px';
            hoja.appendChild(ta);
            editor = { ta: ta, x: p.x, y: p.y, c: color, s: s };
            function crecer() { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; ta.style.width = 'auto'; ta.style.width = Math.max(60, ta.scrollWidth + 8) + 'px'; }
            ta.addEventListener('input', crecer);
            ta.addEventListener('keydown', function (e) {
                e.stopPropagation();
                if (e.key === 'Escape') cerrarEditor(false);
                else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); cerrarEditor(true); }
            });
            ta.addEventListener('blur', function () { cerrarEditor(true); });
            crecer(); setTimeout(function () { ta.focus(); }, 0);
        }

        /* ---- puntero ---- */
        lienzo.addEventListener('pointerdown', function (e) {
            if (modo === 'laser') return;
            var p = punto(e);
            if (modo === 'texto') { e.preventDefault(); abrirEditor(p); return; }
            lienzo.setPointerCapture(e.pointerId);
            if (modo === 'mover') {
                var c = sel.length && cajaSel();
                if (c && enAsa(p, c)) { actual = { sel: 'escalar', ini: p, caja: c, antes: JSON.stringify(doc.items) }; return; }
                if (!(c && dentro(p, c) && !e.shiftKey)) {
                    var hit = -1;
                    for (var i = doc.items.length - 1; i >= 0; i--) if (dentro(p, caja(doc.items[i]), 6)) { hit = i; break; }
                    if (hit < 0) { if (!e.shiftKey) sel = []; actual = { sel: 'caja', ini: p, fin: p }; pintar(); return; }
                    if (e.shiftKey) { var k = sel.indexOf(hit); if (k >= 0) sel.splice(k, 1); else sel.push(hit); pintar(); return; }
                    sel = [hit];
                }
                actual = { sel: 'mover', ini: p, antes: JSON.stringify(doc.items) }; pintar(); return;
            }
            if (modo === 'borrador') { actual = { borrar: true, quitados: [], antes: JSON.stringify(doc.items) }; borrarEn(p); return; }
            actual = { tipo: modo, c: color, g: grosor, p: modo === 'lapiz' || modo === 'resaltador' ? [p] : [p, { x: p.x, y: p.y }] };
            pintar();
        });
        lienzo.addEventListener('pointermove', function (e) {
            var p = punto(e);
            if (modo === 'laser') { p.t = performance.now(); rastro.push(p); if (!raf) bucle(); return; }
            if (modo === 'mover' && !actual) {
                var cs = sel.length && cajaSel();
                hoja.dataset.cursor = cs && enAsa(p, cs) ? 'escalar' : (cs && dentro(p, cs) ? 'mover' : '');
                return;
            }
            if (!actual) return;
            if (actual.borrar) { borrarEn(p); return; }
            if (actual.sel) {
                var base = JSON.parse(actual.antes || '[]');
                if (actual.sel === 'caja') actual.fin = p;
                else if (actual.sel === 'mover') {
                    var dx = p.x - actual.ini.x, dy = p.y - actual.ini.y;
                    sel.forEach(function (i) { doc.items[i] = transformar(base[i], function (q) { return { x: q.x + dx, y: q.y + dy }; }); });
                    actual.cambio = true;
                } else {
                    var c = actual.caja, ox = c.x0, oy = c.y0;
                    var k = Math.max(.1, Math.max((p.x - ox) / (c.x1 - ox || 1), (p.y - oy) / (c.y1 - oy || 1)));
                    sel.forEach(function (i) { doc.items[i] = transformar(base[i], function (q) { return { x: ox + (q.x - ox) * k, y: oy + (q.y - oy) * k }; }, k); });
                    actual.cambio = true;
                }
                pintar(); return;
            }
            if (actual.tipo === 'lapiz' || actual.tipo === 'resaltador') {
                if (actual.tipo === 'resaltador' && e.shiftKey) p.y = actual.p[0].y;
                actual.p.push(p);
            } else {
                if (e.shiftKey && /^(rect|elipse|triangulo|rombo)$/.test(actual.tipo)) {
                    var a = actual.p[0], m = Math.max(Math.abs(p.x - a.x), Math.abs(p.y - a.y));
                    p = { x: a.x + m * Math.sign(p.x - a.x || 1), y: a.y + m * Math.sign(p.y - a.y || 1) };
                }
                actual.p[1] = p;
            }
            pintar();
        });
        function soltar() {
            if (!actual) return;
            var t = actual; actual = null;
            if (t.borrar) { if (t.quitados.length) { historia.push(t.antes); rehacer = []; guardar(doc); } return; }
            if (t.sel) {
                if (t.sel === 'caja') {
                    var r = { x0: Math.min(t.ini.x, t.fin.x), y0: Math.min(t.ini.y, t.fin.y), x1: Math.max(t.ini.x, t.fin.x), y1: Math.max(t.ini.y, t.fin.y) };
                    doc.items.forEach(function (it, i) {
                        var b = caja(it);
                        if (b.x0 < r.x1 && b.x1 > r.x0 && b.y0 < r.y1 && b.y1 > r.y0 && sel.indexOf(i) < 0) sel.push(i);
                    });
                } else if (t.cambio) { historia.push(t.antes); rehacer = []; guardar(doc); }
                pintar(); return;
            }
            var p = t.p, chico = p.length > 1 && t.tipo !== 'lapiz' && t.tipo !== 'resaltador' && Math.abs(p[1].x - p[0].x) < 3 && Math.abs(p[1].y - p[0].y) < 3;
            if (!chico) { marcar(); doc.items.push(t); }
            guardarYpintar();
        }
        lienzo.addEventListener('pointerup', soltar);
        lienzo.addEventListener('pointercancel', soltar);
        lienzo.addEventListener('pointerleave', function () { if (modo === 'laser') rastro = []; });

        /* ---- barra ---- */
        function ponerModo(m) {
            cerrarEditor(true);
            modo = m; rastro = []; cerrarPops(); sel = []; hoja.dataset.cursor = '';
            raiz.querySelectorAll('[data-h]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.h === m); });
            var bf = raiz.querySelector('[data-abrir="figuras"]');
            bf.setAttribute('aria-pressed', !!ES_FIG[m]);
            if (ES_FIG[m]) { bf.querySelector('[data-fig-ico]').innerHTML = ES_FIG[m][2]; bf.title = ES_FIG[m][1].replace(/\s*\(.*\)$/, '') + ' · más figuras'; }
            hoja.dataset.modo = m;
            if (m === 'laser') { if (!raf) bucle(); } else pintar();
        }
        function ponerColor(c) {
            color = c; cerrarPops();
            raiz.querySelectorAll('[data-color]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.color === c); });
            raiz.querySelector('[data-color-actual]').style.setProperty('--c', c);
        }
        /* paneles desplegables (figuras y colores) */
        function cerrarPops(salvo) {
            raiz.querySelectorAll('[data-abrir]').forEach(function (b) {
                var abre = b.dataset.abrir === salvo;
                b.setAttribute('aria-expanded', abre);
                raiz.querySelector('[data-pop="' + b.dataset.abrir + '"]').classList.toggle('ver', abre);
            });
        }
        raiz.querySelectorAll('[data-abrir]').forEach(function (b) {
            b.addEventListener('click', function (e) {
                e.stopPropagation();
                var ya = b.getAttribute('aria-expanded') === 'true';
                cerrarPops(ya ? null : b.dataset.abrir);
            });
        });
        document.addEventListener('pointerdown', function cierre(e) {
            if (!document.body.contains(raiz)) { document.removeEventListener('pointerdown', cierre); return; }
            if (!e.target.closest('.pz-menu')) cerrarPops();
        });
        function ponerGrosor(g) { grosor = g; raiz.querySelectorAll('[data-g]').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.g === g); }); }
        function ponerFondo(f) { doc.fondo = f; hoja.dataset.fondo = f; raiz.querySelector('[data-fondo]').value = f; guardar(doc); }
        function borrarSel() {
            if (!sel.length) return;
            marcar(); doc.items = doc.items.filter(function (x, i) { return sel.indexOf(i) < 0; }); sel = []; guardarYpintar();
        }
        function deshacer() { cerrarEditor(true); sel = []; if (historia.length) { rehacer.push(JSON.stringify(doc.items)); doc.items = JSON.parse(historia.pop()); guardarYpintar(); } }
        function rehacerUno() { sel = []; if (rehacer.length) { historia.push(JSON.stringify(doc.items)); doc.items = JSON.parse(rehacer.pop()); guardarYpintar(); } }
        function limpiar() {
            cerrarEditor(false);
            if (!doc.items.length) return;
            marcar(); doc.items = []; sel = []; guardarYpintar();
        }
        function png() {
            cerrarEditor(true);
            var c = document.createElement('canvas'); c.width = W; c.height = H;
            var x = c.getContext('2d');
            x.fillStyle = doc.fondo === 'oscuro' ? '#0f2a24' : '#ffffff'; x.fillRect(0, 0, W, H);
            x.drawImage(lienzo, 0, 0, W, H);
            var a = document.createElement('a'); a.download = 'pizarra-farmacologia.png'; a.href = c.toDataURL('image/png'); a.click();
        }
        function completa() {
            if (document.fullscreenElement) document.exitFullscreen();
            else if (raiz.requestFullscreen) raiz.requestFullscreen();
        }

        raiz.querySelectorAll('[data-h]').forEach(function (b) { b.addEventListener('click', function () { ponerModo(b.dataset.h); }); });
        raiz.querySelectorAll('[data-color]').forEach(function (b) { b.addEventListener('click', function () { ponerColor(b.dataset.color); if (modo === 'laser' || modo === 'borrador') ponerModo('lapiz'); }); });
        raiz.querySelectorAll('[data-g]').forEach(function (b) { b.addEventListener('click', function () { ponerGrosor(+b.dataset.g); }); });
        raiz.querySelector('[data-fondo]').addEventListener('change', function (e) { ponerFondo(e.target.value); });
        raiz.querySelector('[data-deshacer]').addEventListener('click', deshacer);
        raiz.querySelector('[data-rehacer]').addEventListener('click', rehacerUno);
        raiz.querySelector('[data-limpiar]').addEventListener('click', limpiar);
        raiz.querySelector('[data-png]').addEventListener('click', png);
        raiz.querySelector('[data-full]').addEventListener('click', completa);

        function teclas(e) {
            if (!document.body.contains(raiz)) { removeEventListener('keydown', teclas); return; }
            var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
            var k = e.key.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); if (e.shiftKey) rehacerUno(); else deshacer(); return; }
            if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); rehacerUno(); return; }
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if ((k === 'delete' || k === 'backspace') && sel.length) { e.preventDefault(); borrarSel(); }
            else if (k === 'escape') { cerrarPops(); if (sel.length) { sel = []; pintar(); } }
            else if (TECLAS[k]) ponerModo(TECLAS[k]);
            else if (k === 'c') limpiar();
            else if (k === 'f') completa();
        }
        addEventListener('keydown', teclas);

        ponerColor(color); ponerGrosor(grosor); ponerFondo(doc.fondo || 'cuadricula'); ponerModo('lapiz'); medir();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(pintar);
    }

    return { titulo: 'Pizarra', render: render, montar: montar };
})();
