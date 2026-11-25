/* ============================================================
   VISTA · #/pizarra
   Pizarra de esquina a esquina (viene de la tutoría final).
   Lienzo sin bordes con zoom y desplazamiento; marcadores, regla,
   notas adhesivas, figuras, conectores, texto, láser y selección.
   Coordenadas guardadas «del mundo»; la vista {x, y, z} las lleva
   a la pantalla. El dibujo se guarda sólo en este navegador.
   ============================================================ */
FA.vistas.pizarra = (function () {
    var CLAVE = 'farmacologia-pizarra-v2';
    var COLORES = ['#000000', '#0f2342', '#facc15', '#f59e0b', '#ea580c', '#ef4444', '#be123c', '#db2777', '#7c3aed', '#38bdf8', '#2563eb', '#0A3E7C', '#84cc16', '#16a34a', '#6b7280', '#ffffff'];
    var NOTAS = ['#fde68a', '#fed7aa', '#fdba74', '#fca5a5', '#f9a8d4', '#d9f99d', '#a7f3d0', '#a5f3fc', '#bfdbfe', '#c4b5fd', '#e5e7eb', '#fef3c7'];
    var FONDOS = [['cuadricula', 'Cuadrícula'], ['puntos', 'Puntos'], ['lineas', 'Líneas'], ['blanco', 'Blanco'], ['oscuro', 'Oscuro']];
    var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    var I = {
        salir: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
        deshacer: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
        rehacer: '<path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/>',
        sel: '<path d="M5 3l14 8-6 1.6L10 19z"/>',
        mano: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v7.5M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L4.6 15a1.6 1.6 0 0 1 2.4-2.1L8 14"/>',
        dibujar: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/>',
        nota: '<path d="M5 4h14v10l-6 6H5z"/><path d="M13 20v-6h6"/>',
        texto: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
        figuras: '<rect x="3" y="11" width="9" height="9" rx="1.5"/><circle cx="16.5" cy="7.5" r="4.5"/>',
        laser: '<circle cx="12" cy="12" r="3.2" fill="#ef4444" stroke="#ef4444"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
        mas: '<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
        lapiz: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/>',
        marcador: '<path d="M14 4l6 6-8 8H6v-6z"/><path d="M6 18l-2 2" stroke-width="3"/>',
        arcoiris: '<path d="M3 17a9 9 0 0 1 18 0" stroke="#ef4444"/><path d="M6 17a6 6 0 0 1 12 0" stroke="#f59e0b"/><path d="M9 17a3 3 0 0 1 6 0" stroke="#2563eb"/>',
        resaltador: '<path d="M9 15l-3 3h5l1-1"/><path d="M8 13l7-7 4 4-7 7z"/><path d="M4 21h16" stroke="#FBD785" stroke-width="3"/>',
        borrador: '<path d="M16 4l5 5-9 9H7l-3-3z"/><path d="M11 9l5 5M7 20h13"/>',
        regla: '<rect x="2" y="8" width="20" height="8" rx="1.5" transform="rotate(-30 12 12)"/><path d="M7.5 12.8l1-1.7M11 10.8l1.5-2.6M14.5 8.8l1-1.7" />',
        relleno: '<rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" fill-opacity=".35"/>',
        menos: '<path d="M5 12h14"/>', mas2: '<path d="M12 5v14M5 12h14"/>',
        ajustar: '<path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/><rect x="8" y="9" width="8" height="6" rx="1"/>',
        limpiar: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
        imagen: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
        completa: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
    };
    var PLUMAS = [['lapiz', 'Bolígrafo (P)'], ['marcador', 'Marcador'], ['resaltador', 'Resaltador (H)']];
    var FIGS = [
        ['rect', 'Rectángulo', '<rect x="4" y="5" width="16" height="14" rx="1.5"/>'],
        ['elipse', 'Círculo', '<ellipse cx="12" cy="12" rx="8.5" ry="7.5"/>'],
        ['triangulo', 'Triángulo', '<path d="M12 4l8.5 15h-17z"/>'],
        ['pentagono', 'Pentágono', '<path d="M12 3.5l8.5 6.2-3.2 10h-10.6l-3.2-10z"/>'],
        ['flechab', 'Flecha gruesa', '<path d="M3 9h10V5l8 7-8 7v-4H3z"/>'],
        ['paralelo', 'Paralelogramo', '<path d="M7 5h14l-4 14H3z"/>'],
        ['rombo', 'Rombo', '<path d="M12 3l8 9-8 9-8-9z"/>'],
        ['redondo', 'Rectángulo redondeado', '<rect x="3" y="6" width="18" height="12" rx="6"/>']
    ];
    var CONS = [
        ['flecha', 'Flecha', '<path d="M5 19L19 5M10 5h9v9"/>'],
        ['linea', 'Línea', '<path d="M5 19L19 5"/>'],
        ['doble', 'Flecha doble', '<path d="M5 19L19 5M10 5h9v9M14 19H5v-9"/>'],
        ['curva', 'Flecha curva', '<path d="M4 18C6 8 14 6 19 9"/><path d="M14 6l5 3-3 5"/>']
    ];
    var ES_FIG = {}; FIGS.concat(CONS).forEach(function (f) { ES_FIG[f[0]] = f; });
    var ES_PLUMA = { lapiz: 1, marcador: 1, arcoiris: 1, resaltador: 1, borrador: 1 };
    var CERRADAS = { rect: 1, elipse: 1, triangulo: 1, pentagono: 1, flechab: 1, paralelo: 1, rombo: 1, redondo: 1 };
    var TECLAS = { v: 'sel', p: 'lapiz', h: 'resaltador', e: 'borrador', t: 'texto', n: 'nota', l: 'laser' };

    function cargar() {
        try { var d = JSON.parse(localStorage.getItem(CLAVE)); if (d && Array.isArray(d.items)) return d; } catch (e) {}
        return { items: [], fondo: 'cuadricula' };
    }
    function guardar(d) { try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch (e) {} }

    function ico(n) { return '<svg ' + S + '>' + (I[n] || '') + '</svg>'; }
    function b(attr, tit, svg, extra) {
        return '<button type="button" class="pz-b" ' + attr + ' title="' + tit + '" aria-label="' + tit.replace(/\s*\(.*\)$/, '') + '"' + (extra || '') + '>' + svg + '</button>';
    }
    function modoB(m, tit, svg) { return b('data-h="' + m + '"', tit, svg, ' aria-pressed="false"'); }
    function menu(nombre, boton, cont, clase) {
        return '<span class="pz-menu">' + boton + '<span class="pz-pop ' + (clase || '') + '" data-pop="' + nombre + '" role="group">' + cont + '</span></span>';
    }
    function abre(nombre, tit, svg, extra) {
        return b('data-abrir="' + nombre + '"', tit, svg + '<i class="pz-flechita" aria-hidden="true"></i>', ' aria-expanded="false"' + (extra || ''));
    }

    function render() {
        var colores = '<span class="pz-pal">' +
            '<label class="pz-rango"><span class="pz-rango__ico" aria-hidden="true"><i class="pz-rango__punto"></i></span><input type="range" min="1" max="24" step="1" data-grosor aria-label="Grosor"><b data-grosor-val>4</b></label>' +
            '<label class="pz-rango pz-rango--op"><span class="pz-rango__ico pz-rango__ico--op" aria-hidden="true"></span><input type="range" min="5" max="100" step="5" data-opacidad aria-label="Difuminado (opacidad)"><b data-opacidad-val>100</b></label>' +
            '<span class="pz-pal__fila"><button type="button" class="pz-color pz-color--mas" data-otro title="Agregar un color" aria-label="Agregar un color">+</button><input type="color" data-color-input hidden>' +
            '<span class="pz-recientes" data-recientes></span></span>' +
            '<span class="pz-pal__grilla">' + COLORES.map(function (c) { return '<button type="button" class="pz-color" data-color="' + c + '" style="--c:' + c + '" aria-label="Color ' + c + '" aria-pressed="false"></button>'; }).join('') +
            '<button type="button" class="pz-color pz-color--arcoiris" data-arcoiris title="Arcoíris" aria-label="Arcoíris"></button></span></span>';
        var notas = NOTAS.map(function (c) { return '<button type="button" class="pz-nota" data-nota="' + c + '" style="--c:' + c + '" aria-label="Nota de color ' + c + '"></button>'; }).join('');
        var figs = '<span class="pz-figs">' + FIGS.map(function (f) { return modoB(f[0], f[1], '<svg ' + S + '>' + f[2] + '</svg>'); }).join('') + '</span>' +
            '<span class="pz-figs pz-figs--con">' + CONS.map(function (f) { return modoB(f[0], f[1], '<svg ' + S + '>' + f[2] + '</svg>'); }).join('') + '</span>';
        var mas = '<span class="pz-lista">' +
            '<span class="pz-lista__tit">Notas adhesivas</span><span class="pz-notas">' + notas + '</span>' +
            '<span class="pz-lista__tit">Fondo</span><span class="pz-fondos">' + FONDOS.map(function (f) { return '<button type="button" class="pz-fondo" data-fondo="' + f[0] + '" aria-pressed="false">' + f[1] + '</button>'; }).join('') + '</span>' +
            '<button type="button" class="pz-item" data-png>' + ico('imagen') + 'Guardar como imagen</button></span>';
        var borrar = '<span class="pz-lista">' +
            '<button type="button" class="pz-item" data-h="borrador" aria-pressed="false">' + ico('borrador') + 'Borrador (E)</button>' +
            '<button type="button" class="pz-item pz-item--peligro" data-limpiar>' + ico('limpiar') + 'Borrar todo (se puede deshacer)</button></span>';

        return '<div class="pz" data-pz>' +
            '<div class="pz-hoja" data-hoja><canvas data-lienzo aria-label="Pizarra para dibujar"></canvas></div>' +
            '<div class="pz-abajo">' +
            '<div class="pz-sub" data-sub role="toolbar" aria-label="Opciones de dibujo">' +
            '<div class="pz-grupo" data-plumas>' + PLUMAS.map(function (p) { return modoB(p[0], p[1], ico(p[0])); }).join('') +
            b('data-regla', 'Regla (R): arrastra para moverla, gira con la manija; dibuja junto a su borde para trazar recto', ico('regla'), ' aria-pressed="false"') + '</div>' +
            '<div class="pz-grupo">' + menu('colores', abre('colores', 'Color, grosor y difuminado', '<i class="pz-color pz-color--actual" data-color-actual></i>'), colores, 'pz-pop--col') + '</div>' +
            '</div>' +
            '<div class="pz-barra" role="toolbar" aria-label="Herramientas de la pizarra">' +
            '<div class="pz-grupo"><a class="pz-b pz-salir" href="#/inicio" title="Salir de la pizarra" aria-label="Salir de la pizarra">' + ico('salir') + '</a>' +
            b('data-deshacer', 'Deshacer (Ctrl+Z)', ico('deshacer')) + b('data-rehacer', 'Rehacer (Ctrl+Y)', ico('rehacer')) + '</div>' +
            '<div class="pz-grupo">' + modoB('sel', 'Seleccionar, mover y cambiar tamaño (V)', ico('sel')) + modoB('mano', 'Mover la hoja (barra espaciadora)', ico('mano')) +
            b('data-dibujar', 'Dibujar (P)', ico('dibujar'), ' aria-pressed="false"') +
            modoB('texto', 'Texto (T)', ico('texto')) +
            menu('figuras', abre('figuras', 'Figuras y conectores', '<svg ' + S + ' data-fig-ico>' + I.figuras + '</svg>', ' aria-pressed="false" data-btn-fig'), figs, 'pz-pop--fig') +
            b('data-relleno', 'Relleno de las figuras', ico('relleno'), ' aria-pressed="false"') +
            menu('borrar', abre('borrar', 'Borrar', ico('borrador'), ' aria-pressed="false" data-btn-borrar'), borrar, 'pz-pop--borrar') +
            modoB('laser', 'Puntero láser (L)', ico('laser')) + '</div>' +
            '<div class="pz-grupo">' + menu('mas', abre('mas', 'Más opciones', ico('mas')), mas, 'pz-pop--mas') + '</div>' +
            '</div></div>' +
            '<div class="pz-zoom" role="group" aria-label="Zoom">' + b('data-zmenos', 'Alejar (−)', ico('menos')) +
            '<button type="button" class="pz-zval" data-z100 title="Volver al 100 % (0)">100 %</button>' + b('data-zmas', 'Acercar (+)', ico('mas2')) +
            b('data-ajustar', 'Ajustar a la pantalla (1)', ico('ajustar')) + b('data-full', 'Pantalla completa (F)', ico('completa')) + '</div>' +
            '</div>';
    }

    function montar(el) {
        var raiz = el.querySelector('[data-pz]'), hoja = raiz.querySelector('[data-hoja]'), lienzo = raiz.querySelector('[data-lienzo]');
        var ctx = lienzo.getContext('2d'), cx = ctx;
        var W = 0, H = 0, DPR = 1;
        var doc = cargar(), historia = [], rehacer = [];
        var vista = doc.vista || { x: 0, y: 0, z: 1 };
        var modo = 'lapiz', pluma = 'lapiz', color = COLORES[1], grosor = 4, opacidad = 1, relleno = false, notaColor = NOTAS[0];
        var actual = null, rastro = [], raf = null, editor = null, sel = [], espacio = false, punteros = {}, pinza = null;
        var regla = { on: false, x: 0, y: 0, ang: -Math.PI / 12, len: 900, w: 72 };

        document.body.classList.add('con-pizarra');
        function alSalir() { if (location.hash.indexOf('#/pizarra') !== 0) { document.body.classList.remove('con-pizarra'); removeEventListener('hashchange', alSalir); } }
        addEventListener('hashchange', alSalir);

        function marcar() { historia.push(JSON.stringify(doc.items)); if (historia.length > 80) historia.shift(); rehacer = []; }
        var tGuardar = null;
        function guardarLuego() { clearTimeout(tGuardar); tGuardar = setTimeout(function () { doc.vista = vista; guardar(doc); }, 300); }
        function guardarYpintar() { doc.vista = vista; guardar(doc); pintar(); }

        /* ---------- vista: tamaño, zoom y desplazamiento ---------- */
        function medir() {
            var w = hoja.clientWidth, h = hoja.clientHeight, d = window.devicePixelRatio || 1;
            if (!w || !h) return;
            if (w === W && h === H && d === DPR) return;
            W = w; H = h; DPR = d; lienzo.width = Math.round(w * d); lienzo.height = Math.round(h * d);
            aplicarVista();
        }
        if (window.ResizeObserver) new ResizeObserver(medir).observe(hoja); else addEventListener('resize', medir);
        function aplicarVista() {
            var paso = (doc.fondo === 'lineas' ? 40 : 32) * vista.z;
            hoja.style.setProperty('--gs', paso + 'px');
            hoja.style.setProperty('--gx', vista.x + 'px');
            hoja.style.setProperty('--gy', vista.y + 'px');
            raiz.querySelector('[data-z100]').textContent = Math.round(vista.z * 100) + ' %';
            pintar();
        }
        function zoomEn(z, sx, sy) {
            z = Math.max(.1, Math.min(5, z));
            if (sx == null) { sx = W / 2; sy = H / 2; }
            var wx = (sx - vista.x) / vista.z, wy = (sy - vista.y) / vista.z;
            vista.z = z; vista.x = sx - wx * z; vista.y = sy - wy * z;
            cerrarEditor(true); aplicarVista(); guardarLuego();
        }
        function ajustar() {
            if (!doc.items.length) { vista = { x: 0, y: 0, z: 1 }; aplicarVista(); guardarLuego(); return; }
            var c = cajaDe(doc.items.map(function (_, i) { return i; }));
            var bw = c.x1 - c.x0, bh = c.y1 - c.y0, m = 60, arriba = 20, abajo = 150;
            var z = Math.max(.1, Math.min(2, (W - m * 2) / (bw || 1), (H - arriba - abajo) / (bh || 1)));
            vista.z = z; vista.x = (W - bw * z) / 2 - c.x0 * z; vista.y = arriba + (H - arriba - abajo - bh * z) / 2 - c.y0 * z;
            cerrarEditor(true); aplicarVista(); guardarLuego();
        }
        function pantalla(e) { var r = lienzo.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
        function mundo(s) { return { x: (s.x - vista.x) / vista.z, y: (s.y - vista.y) / vista.z }; }

        /* ---------- geometría de cada figura ---------- */
        function bbox(p, q) { return { x0: Math.min(p.x, q.x), y0: Math.min(p.y, q.y), x1: Math.max(p.x, q.x), y1: Math.max(p.y, q.y) }; }
        function control(t) {
            var p = t.p[0], q = t.p[1], dx = q.x - p.x, dy = q.y - p.y;
            return { x: (p.x + q.x) / 2 + dy * .3, y: (p.y + q.y) / 2 - dx * .3 };
        }
        function contorno(t) {
            var p = t.p[0], q = t.p[1], c = bbox(p, q), w = c.x1 - c.x0, h = c.y1 - c.y0, cxm = (c.x0 + c.x1) / 2, cym = (c.y0 + c.y1) / 2, i, out = [];
            switch (t.tipo) {
                case 'rect': case 'redondo': return [{ x: c.x0, y: c.y0 }, { x: c.x1, y: c.y0 }, { x: c.x1, y: c.y1 }, { x: c.x0, y: c.y1 }];
                case 'triangulo': return [{ x: cxm, y: p.y }, { x: c.x1, y: q.y }, { x: c.x0, y: q.y }];
                case 'rombo': return [{ x: cxm, y: c.y0 }, { x: c.x1, y: cym }, { x: cxm, y: c.y1 }, { x: c.x0, y: cym }];
                case 'paralelo': var s = w * .22; return [{ x: c.x0 + s, y: c.y0 }, { x: c.x1, y: c.y0 }, { x: c.x1 - s, y: c.y1 }, { x: c.x0, y: c.y1 }];
                case 'pentagono':
                    for (i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; out.push({ x: cxm + w / 2 * Math.cos(a) / .951, y: c.y0 + h * (Math.sin(a) + 1) / 1.809 }); }
                    return out.map(function (o) { return { x: Math.max(c.x0, Math.min(c.x1, o.x)), y: o.y }; });
                case 'flechab':
                    var der = q.x >= p.x, cab = Math.min(w * .45, h), y0 = cym - h * .22, y1 = cym + h * .22;
                    out = [{ x: c.x0, y: y0 }, { x: c.x1 - cab, y: y0 }, { x: c.x1 - cab, y: c.y0 }, { x: c.x1, y: cym }, { x: c.x1 - cab, y: c.y1 }, { x: c.x1 - cab, y: y1 }, { x: c.x0, y: y1 }];
                    return der ? out : out.map(function (o) { return { x: c.x0 + c.x1 - o.x, y: o.y }; });
                case 'elipse':
                    for (i = 0; i < 36; i++) { var g = i * Math.PI * 2 / 36; out.push({ x: cxm + w / 2 * Math.cos(g), y: cym + h / 2 * Math.sin(g) }); }
                    return out;
                case 'curva':
                    var k = control(t);
                    for (i = 0; i <= 20; i++) { var u = i / 20, v = 1 - u; out.push({ x: v * v * p.x + 2 * v * u * k.x + u * u * q.x, y: v * v * p.y + 2 * v * u * k.y + u * u * q.y }); }
                    return out;
                default: return [p, q];
            }
        }

        /* ---------- dibujo ---------- */
        function puntaFlecha(a, b, g) {
            var ang = Math.atan2(b.y - a.y, b.x - a.x), L = 10 + g * 2.5;
            cx.beginPath(); cx.moveTo(b.x, b.y);
            cx.lineTo(b.x - L * Math.cos(ang - .45), b.y - L * Math.sin(ang - .45));
            cx.moveTo(b.x, b.y);
            cx.lineTo(b.x - L * Math.cos(ang + .45), b.y - L * Math.sin(ang + .45));
            cx.stroke();
        }
        function fuente(t) { return '700 ' + t.s + 'px "Nunito Sans", system-ui, sans-serif'; }
        function fuenteNota(t) { return '600 ' + t.s + 'px "Nunito Sans", system-ui, sans-serif'; }
        function lineasNota(t) {
            cx.font = fuenteNota(t);
            var ancho = t.w - t.s * 1.4, out = [];
            String(t.txt || '').split('\n').forEach(function (par) {
                var l = '';
                par.split(' ').forEach(function (pal) {
                    var prueba = l ? l + ' ' + pal : pal;
                    if (cx.measureText(prueba).width <= ancho) { l = prueba; return; }
                    if (l) { out.push(l); l = ''; }
                    /* palabra más larga que la nota: se parte letra por letra */
                    while (cx.measureText(pal).width > ancho && pal.length > 1) {
                        var n = pal.length - 1;
                        while (n > 1 && cx.measureText(pal.slice(0, n)).width > ancho) n--;
                        out.push(pal.slice(0, n)); pal = pal.slice(n);
                    }
                    l = pal;
                });
                out.push(l);
            });
            return out;
        }
        function trazo(t) {
            var p = t.p;
            cx.beginPath(); cx.moveTo(p[0].x, p[0].y);
            for (var i = 1; i < p.length; i++) { var a = p[i - 1], c = p[i]; cx.quadraticCurveTo(a.x, a.y, (a.x + c.x) / 2, (a.y + c.y) / 2); }
            if (p.length > 1) cx.lineTo(p[p.length - 1].x, p[p.length - 1].y); else cx.lineTo(p[0].x + .1, p[0].y);
            cx.stroke();
        }
        function dibujar(t) {
            cx.save(); cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.strokeStyle = t.c; cx.fillStyle = t.c; cx.lineWidth = t.g || 1; cx.globalAlpha = t.o == null ? 1 : t.o;
            if (t.tipo === 'texto') {
                cx.font = fuente(t); cx.textBaseline = 'top';
                t.txt.split('\n').forEach(function (l, i) { cx.fillText(l, t.x, t.y + i * t.s * 1.25); });
            } else if (t.tipo === 'nota') {
                cx.shadowColor = 'rgba(15,35,66,.22)'; cx.shadowBlur = 14; cx.shadowOffsetY = 4;
                cx.fillStyle = t.c; cx.fillRect(t.x, t.y, t.w, t.h);
                cx.shadowColor = 'transparent';
                cx.fillStyle = '#1f2937'; cx.textBaseline = 'top';
                /* si el texto no cabe, la letra se achica hasta que quede dentro de la nota */
                var tn = { w: t.w, h: t.h, s: t.s, txt: t.txt }, ls = lineasNota(tn);
                while (tn.s > 7 && ls.length * tn.s * 1.3 > tn.h - tn.s * 1.2) { tn.s -= 1; ls = lineasNota(tn); }
                cx.font = fuenteNota(tn);
                var maxL = Math.floor((tn.h - tn.s * 1.2) / (tn.s * 1.3));
                ls.slice(0, maxL).forEach(function (l, i) { cx.fillText(l, t.x + tn.s * .7, t.y + tn.s * .7 + i * tn.s * 1.3); });
            } else if (t.tipo === 'arcoiris') {
                var largo = 0;
                for (var i = 1; i < t.p.length; i++) {
                    var a = t.p[i - 1], c = t.p[i];
                    largo += Math.sqrt((c.x - a.x) * (c.x - a.x) + (c.y - a.y) * (c.y - a.y));
                    cx.strokeStyle = 'hsl(' + Math.round(largo * .7) % 360 + ',90%,52%)'; cx.lineWidth = t.g * 1.6 + 1;
                    cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(c.x, c.y); cx.stroke();
                }
                if (t.p.length === 1) { cx.strokeStyle = 'hsl(0,90%,52%)'; cx.lineWidth = t.g * 1.6 + 1; trazo(t); }
            } else if (t.tipo === 'lapiz' || t.tipo === 'marcador' || t.tipo === 'resaltador') {
                if (t.tipo === 'resaltador') { cx.globalAlpha *= .35; cx.lineWidth = t.g * 5 + 6; cx.lineCap = 'butt'; }
                if (t.tipo === 'marcador') cx.lineWidth = t.g * 2.5 + 2;
                trazo(t);
            } else {
                var p = t.p[0], q = t.p[1];
                cx.beginPath();
                if (t.tipo === 'elipse') { var e = bbox(p, q); cx.ellipse((e.x0 + e.x1) / 2, (e.y0 + e.y1) / 2, (e.x1 - e.x0) / 2, (e.y1 - e.y0) / 2, 0, 0, Math.PI * 2); }
                else if (t.tipo === 'redondo') {
                    var r = bbox(p, q), rad = Math.min((r.x1 - r.x0) / 2, (r.y1 - r.y0) / 2);
                    cx.moveTo(r.x0 + rad, r.y0); cx.arcTo(r.x1, r.y0, r.x1, r.y1, rad); cx.arcTo(r.x1, r.y1, r.x0, r.y1, rad);
                    cx.arcTo(r.x0, r.y1, r.x0, r.y0, rad); cx.arcTo(r.x0, r.y0, r.x1, r.y0, rad); cx.closePath();
                } else if (t.tipo === 'curva') { var k = control(t); cx.moveTo(p.x, p.y); cx.quadraticCurveTo(k.x, k.y, q.x, q.y); }
                else if (CERRADAS[t.tipo]) {
                    var v = contorno(t); cx.moveTo(v[0].x, v[0].y);
                    for (var j = 1; j < v.length; j++) cx.lineTo(v[j].x, v[j].y);
                    cx.closePath();
                } else { cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); }
                if (t.f && CERRADAS[t.tipo]) { cx.save(); cx.globalAlpha *= .2; cx.fill(); cx.restore(); }
                cx.stroke();
                if (t.tipo === 'flecha' || t.tipo === 'doble') puntaFlecha(p, q, t.g);
                if (t.tipo === 'doble') puntaFlecha(q, p, t.g);
                if (t.tipo === 'curva') puntaFlecha(control(t), q, t.g);
            }
            cx.restore();
        }

        /* ---------- regla ---------- */
        function local(p) {
            var dx = p.x - regla.x, dy = p.y - regla.y, c = Math.cos(regla.ang), s = Math.sin(regla.ang);
            return { u: dx * c + dy * s, v: -dx * s + dy * c };
        }
        function global(u, v) {
            var c = Math.cos(regla.ang), s = Math.sin(regla.ang);
            return { x: regla.x + u * c - v * s, y: regla.y + u * s + v * c };
        }
        function asaRegla() { return global(regla.len / 2 - 34, 0); }
        function grados() { var d = Math.round(-regla.ang * 180 / Math.PI) % 180; if (d < 0) d += 180; return d; }
        function pintarRegla() {
            if (!regla.on) return;
            var L = regla.len, w = regla.w;
            cx.save(); cx.translate(regla.x, regla.y); cx.rotate(regla.ang);
            cx.shadowColor = 'rgba(15,35,66,.25)'; cx.shadowBlur = 10;
            cx.fillStyle = 'rgba(226,232,240,.88)'; cx.strokeStyle = '#94a3b8'; cx.lineWidth = 1;
            cx.beginPath(); cx.rect(-L / 2, -w / 2, L, w); cx.fill(); cx.shadowColor = 'transparent'; cx.stroke();
            cx.strokeStyle = '#475569'; cx.fillStyle = '#334155'; cx.font = '600 11px "Nunito Sans", system-ui, sans-serif'; cx.textAlign = 'center';
            for (var u = 0; u <= L - 20; u += 10) {
                var x = -L / 2 + 10 + u, n = u % 100 === 0, m = u % 50 === 0, lg = n ? 16 : (m ? 11 : 6);
                cx.beginPath(); cx.moveTo(x, -w / 2); cx.lineTo(x, -w / 2 + lg); cx.moveTo(x, w / 2); cx.lineTo(x, w / 2 - lg); cx.stroke();
                if (n) cx.fillText(String(u / 100), x, -w / 2 + 28);
            }
            cx.font = '800 15px "Nunito Sans", system-ui, sans-serif'; cx.fillStyle = '#0A3E7C';
            cx.fillText(grados() + '°', 0, 6);
            cx.beginPath(); cx.arc(L / 2 - 34, 0, 13, 0, Math.PI * 2); cx.fillStyle = '#0A3E7C'; cx.fill();
            cx.strokeStyle = '#fff'; cx.lineWidth = 2; cx.beginPath(); cx.arc(L / 2 - 34, 0, 6, -2.4, 1.6); cx.stroke();
            cx.restore();
        }

        /* ---------- selección ---------- */
        function caja(t) {
            if (t.tipo === 'texto') {
                cx.save(); cx.font = fuente(t);
                var lin = t.txt.split('\n'), w = Math.max.apply(null, lin.map(function (l) { return cx.measureText(l).width; })); cx.restore();
                return { x0: t.x, y0: t.y, x1: t.x + w, y1: t.y + lin.length * t.s * 1.25 };
            }
            if (t.tipo === 'nota') return { x0: t.x, y0: t.y, x1: t.x + t.w, y1: t.y + t.h };
            var pts = ES_FIG[t.tipo] ? contorno(t) : t.p;
            var m = t.tipo === 'resaltador' ? t.g * 2.5 + 3 : (t.tipo === 'marcador' || t.tipo === 'arcoiris' ? t.g * 1.3 + 1 : t.g / 2) + (/flecha|doble|curva/.test(t.tipo) ? 8 + t.g * 2.5 : 0);
            var xs = pts.map(function (q) { return q.x; }), ys = pts.map(function (q) { return q.y; });
            return { x0: Math.min.apply(null, xs) - m, y0: Math.min.apply(null, ys) - m, x1: Math.max.apply(null, xs) + m, y1: Math.max.apply(null, ys) + m };
        }
        function cajaDe(lista) {
            var c = null;
            lista.forEach(function (i) {
                var q = caja(doc.items[i]);
                c = c ? { x0: Math.min(c.x0, q.x0), y0: Math.min(c.y0, q.y0), x1: Math.max(c.x1, q.x1), y1: Math.max(c.y1, q.y1) } : q;
            });
            return c;
        }
        function cajaSel() { var c = cajaDe(sel), m = 6 / vista.z; return c && { x0: c.x0 - m, y0: c.y0 - m, x1: c.x1 + m, y1: c.y1 + m }; }
        function dentro(p, c, m) { m = m || 0; return p.x >= c.x0 - m && p.x <= c.x1 + m && p.y >= c.y0 - m && p.y <= c.y1 + m; }
        function enAsa(p, c) { var t = 14 / vista.z; return Math.abs(p.x - c.x1) < t && Math.abs(p.y - c.y1) < t; }
        function transformar(t, f, k) {
            var n = JSON.parse(JSON.stringify(t));
            if (n.tipo === 'texto' || n.tipo === 'nota') {
                var q = f({ x: n.x, y: n.y }); n.x = q.x; n.y = q.y;
                if (k) { n.s = Math.max(6, t.s * k); if (n.tipo === 'nota') { n.w = Math.max(40, t.w * k); n.h = Math.max(40, t.h * k); } }
            } else n.p = n.p.map(f);
            return n;
        }
        function pintarSel() {
            if (modo !== 'sel') return;
            var z = vista.z;
            cx.save(); cx.strokeStyle = '#2563eb'; cx.lineWidth = 1.5 / z; cx.setLineDash([6 / z, 4 / z]);
            if (actual && actual.sel === 'caja') {
                var r = bbox(actual.ini, actual.fin);
                cx.fillStyle = 'rgba(37,99,235,.08)'; cx.fillRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); cx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
            }
            var c = sel.length && cajaSel();
            if (c) {
                cx.strokeRect(c.x0, c.y0, c.x1 - c.x0, c.y1 - c.y0);
                cx.setLineDash([]); cx.fillStyle = '#fff'; cx.lineWidth = 2 / z;
                cx.beginPath(); cx.rect(c.x1 - 7 / z, c.y1 - 7 / z, 14 / z, 14 / z); cx.fill(); cx.stroke();
            }
            cx.restore();
        }
        function pintarLaser() {
            if (modo !== 'laser' || !rastro.length) return;
            var ahora = performance.now(), z = vista.z;
            rastro = rastro.filter(function (p) { return ahora - p.t < 420; });
            for (var i = 1; i < rastro.length; i++) {
                var a = rastro[i - 1], c = rastro[i], v = 1 - (ahora - c.t) / 420;
                cx.save(); cx.strokeStyle = 'rgba(239,68,68,' + (v * .55) + ')'; cx.lineWidth = (7 * v + 1) / z; cx.lineCap = 'round';
                cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(c.x, c.y); cx.stroke(); cx.restore();
            }
            var u = rastro[rastro.length - 1];
            if (u) {
                var r = 20 / z;
                cx.save(); var g = cx.createRadialGradient(u.x, u.y, 0, u.x, u.y, r);
                g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,40,40,1)'); g.addColorStop(1, 'rgba(255,0,0,0)');
                cx.fillStyle = g; cx.beginPath(); cx.arc(u.x, u.y, r, 0, Math.PI * 2); cx.fill(); cx.restore();
            }
        }
        function pintar() {
            if (!W) return;
            ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, lienzo.width, lienzo.height);
            ctx.setTransform(DPR * vista.z, 0, 0, DPR * vista.z, DPR * vista.x, DPR * vista.y);
            doc.items.forEach(function (t, i) { if (!(editor && editor.i === i)) dibujar(t); });
            if (actual && actual.tipo) dibujar(actual);
            pintarRegla(); pintarSel(); pintarLaser();
        }
        function bucle() { if (!document.body.contains(lienzo)) { raf = null; return; } pintar(); raf = modo === 'laser' && rastro.length ? requestAnimationFrame(bucle) : null; }

        /* ---------- borrador ---------- */
        function distSeg(p, a, c) {
            var dx = c.x - a.x, dy = c.y - a.y, l = dx * dx + dy * dy, k = l ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l)) : 0;
            var x = a.x + k * dx - p.x, y = a.y + k * dy - p.y; return Math.sqrt(x * x + y * y);
        }
        function toca(t, p) {
            var r = 10 / vista.z + (t.g || 0);
            if (t.tipo === 'texto' || t.tipo === 'nota') return dentro(p, caja(t), 4);
            if (!ES_FIG[t.tipo]) {
                var extra = t.tipo === 'resaltador' ? t.g * 2.5 : (t.tipo === 'marcador' || t.tipo === 'arcoiris' ? t.g : 0);
                for (var i = 0; i < t.p.length; i++) if (distSeg(p, t.p[Math.max(0, i - 1)], t.p[i]) < r + extra) return true;
                return false;
            }
            var v = contorno(t), cerr = !!CERRADAS[t.tipo];
            if (cerr && t.f && dentro(p, bbox(t.p[0], t.p[1]))) return true;
            for (var j = 0; j < v.length - (cerr ? 0 : 1); j++) if (distSeg(p, v[j], v[(j + 1) % v.length]) < r) return true;
            return false;
        }
        function borrarEn(p) {
            for (var i = doc.items.length - 1; i >= 0; i--) if (toca(doc.items[i], p)) actual.quitados.push(doc.items.splice(i, 1)[0]);
            pintar();
        }

        /* ---------- editor de texto y de notas ---------- */
        function cerrarEditor(ok) {
            if (!editor) return;
            var e = editor; editor = null;
            var txt = e.ta.value.replace(/\s+$/, '');
            e.ta.remove();
            if (e.tipo === 'nota') {
                if (ok) { marcar(); doc.items[e.i].txt = txt; }
                guardarYpintar(); return;
            }
            if (e.i != null) {
                if (!ok) { pintar(); return; }
                marcar();
                if (txt) doc.items[e.i].txt = txt; else doc.items.splice(e.i, 1);
                guardarYpintar(); return;
            }
            if (ok && txt) { marcar(); doc.items.push({ tipo: 'texto', x: e.x, y: e.y, c: e.c, s: e.s, g: 0, o: opacidad, txt: txt }); guardarYpintar(); }
        }
        function abrirEditor(p, i) {
            cerrarEditor(true);
            var t = i != null ? doc.items[i] : null, z = vista.z;
            var ta = document.createElement('textarea');
            ta.setAttribute('aria-label', 'Escribe el texto');
            if (t && t.tipo === 'nota') {
                ta.className = 'pz-texto pz-texto--nota';
                ta.style.left = (t.x * z + vista.x) + 'px'; ta.style.top = (t.y * z + vista.y) + 'px';
                ta.style.width = (t.w * z) + 'px'; ta.style.height = (t.h * z) + 'px';
                ta.style.padding = (t.s * .7 * z) + 'px'; ta.style.fontSize = (t.s * z) + 'px'; ta.style.background = t.c;
                ta.value = t.txt || '';
                editor = { ta: ta, tipo: 'nota', i: i };
            } else {
                var s = t ? t.s : 18 + grosor * 6, x = t ? t.x : p.x, y = t ? t.y : p.y, c = t ? t.c : color;
                ta.className = 'pz-texto'; ta.rows = 1;
                ta.style.left = (x * z + vista.x) + 'px'; ta.style.top = (y * z + vista.y) + 'px';
                ta.style.color = c; ta.style.fontSize = (s * z) + 'px';
                ta.value = t ? t.txt : '';
                editor = { ta: ta, tipo: 'texto', i: i, x: x, y: y, c: c, s: s };
            }
            hoja.appendChild(ta);
            function crecer() {
                if (editor && editor.tipo === 'nota') return;
                ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; ta.style.width = 'auto'; ta.style.width = Math.max(60, ta.scrollWidth + 8) + 'px';
            }
            ta.addEventListener('input', crecer);
            ta.addEventListener('keydown', function (e) {
                e.stopPropagation();
                if (e.key === 'Escape') cerrarEditor(editor && editor.tipo === 'nota');
                else if (e.key === 'Enter' && !e.shiftKey && editor && editor.tipo !== 'nota') { e.preventDefault(); cerrarEditor(true); }
            });
            ta.addEventListener('blur', function () { cerrarEditor(true); });
            crecer(); pintar(); setTimeout(function () { ta.focus(); ta.select(); }, 0);
        }
        function itemEditable(p, tipo) {
            for (var i = doc.items.length - 1; i >= 0; i--) {
                var t = doc.items[i];
                if ((t.tipo === 'texto' || t.tipo === 'nota') && (!tipo || t.tipo === tipo) && dentro(p, caja(t), 2)) return i;
            }
            return -1;
        }

        /* ---------- puntero ---------- */
        function iniciarPinza() {
            var ids = Object.keys(punteros), a = punteros[ids[0]], c = punteros[ids[1]];
            pinza = { d: Math.hypot(c.x - a.x, c.y - a.y) || 1, m: { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 }, v: { x: vista.x, y: vista.y, z: vista.z } };
        }
        lienzo.addEventListener('pointerdown', function (e) {
            var s = pantalla(e);
            punteros[e.pointerId] = s;
            if (Object.keys(punteros).length === 2) {
                if (actual && actual.tipo) actual = null;   /* dos dedos: zoom, no dibujar */
                actual = null; iniciarPinza(); pintar(); return;
            }
            if (Object.keys(punteros).length > 2) return;
            cerrarPops();
            var p = mundo(s);
            lienzo.setPointerCapture(e.pointerId);
            if (modo === 'mano' || espacio || e.button === 1) { actual = { mano: true, s: s, v: { x: vista.x, y: vista.y } }; hoja.dataset.cursor = 'agarrando'; return; }
            if (modo === 'laser') return;
            /* regla: mover o girar */
            if (regla.on) {
                var a = asaRegla();
                if (Math.hypot(p.x - a.x, p.y - a.y) < 18 / vista.z) { actual = { regla: 'girar' }; return; }
                var l = local(p);
                if (Math.abs(l.u) < regla.len / 2 && Math.abs(l.v) < regla.w / 2) { actual = { regla: 'mover', ini: p, x: regla.x, y: regla.y }; return; }
            }
            if (modo === 'texto') {
                e.preventDefault();
                var it = itemEditable(p, 'texto');
                abrirEditor(p, it >= 0 ? it : null); return;
            }
            if (modo === 'nota') {
                e.preventDefault();
                var en = itemEditable(p, 'nota');
                if (en >= 0) { abrirEditor(p, en); return; }
                marcar();
                doc.items.push({ tipo: 'nota', x: p.x - 100, y: p.y - 100, w: 200, h: 200, s: 18, c: notaColor, txt: '' });
                guardar(doc); abrirEditor(p, doc.items.length - 1); return;
            }
            if (modo === 'sel') {
                var c = sel.length && cajaSel();
                if (c && enAsa(p, c)) { actual = { sel: 'escalar', ini: p, caja: c, antes: JSON.stringify(doc.items) }; return; }
                if (!(c && dentro(p, c) && !e.shiftKey)) {
                    var hit = -1;
                    for (var i = doc.items.length - 1; i >= 0; i--) if (dentro(p, caja(doc.items[i]), 6 / vista.z)) { hit = i; break; }
                    if (hit < 0) { if (!e.shiftKey) sel = []; actual = { sel: 'caja', ini: p, fin: p }; pintar(); return; }
                    if (e.shiftKey) { var k = sel.indexOf(hit); if (k >= 0) sel.splice(k, 1); else sel.push(hit); pintar(); return; }
                    sel = [hit];
                }
                actual = { sel: 'mover', ini: p, antes: JSON.stringify(doc.items) }; pintar(); return;
            }
            if (modo === 'borrador') { actual = { borrar: true, quitados: [], antes: JSON.stringify(doc.items) }; borrarEn(p); return; }
            if (ES_PLUMA[modo]) {
                actual = { tipo: modo, c: color, g: grosor, o: opacidad, p: [p] };
                if (regla.on) {
                    var lr = local(p), w2 = regla.w / 2, zona = 40 / vista.z;
                    if (Math.abs(lr.u) < regla.len / 2) {
                        if (lr.v < -w2 && lr.v > -w2 - zona) actual.borde = -w2;
                        else if (lr.v > w2 && lr.v < w2 + zona) actual.borde = w2;
                    }
                    if (actual.borde != null) actual.p = [pegar(p, actual)];
                }
                pintar(); return;
            }
            if (ES_FIG[modo]) { actual = { tipo: modo, c: color, g: grosor, o: opacidad, f: relleno && !!CERRADAS[modo], p: [p, { x: p.x, y: p.y }] }; pintar(); }
        });
        function pegar(p, t) {
            var l = local(p), off = (t.tipo === 'resaltador' ? t.g * 2.5 + 3 : t.g) / 2 + 1;
            return global(l.u, t.borde + (t.borde < 0 ? -off : off));
        }
        lienzo.addEventListener('pointermove', function (e) {
            var s = pantalla(e);
            if (punteros[e.pointerId]) punteros[e.pointerId] = s;
            if (pinza && Object.keys(punteros).length >= 2) {
                var ids = Object.keys(punteros), a = punteros[ids[0]], c = punteros[ids[1]];
                var d = Math.hypot(c.x - a.x, c.y - a.y), m = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 };
                var z = Math.max(.1, Math.min(5, pinza.v.z * d / pinza.d));
                var wx = (pinza.m.x - pinza.v.x) / pinza.v.z, wy = (pinza.m.y - pinza.v.y) / pinza.v.z;
                vista.z = z; vista.x = m.x - wx * z; vista.y = m.y - wy * z; aplicarVista(); return;
            }
            var p = mundo(s);
            if (modo === 'laser' && !actual) { p.t = performance.now(); rastro.push(p); if (!raf) bucle(); return; }
            if (!actual) {
                var cur = '';
                if (regla.on) { var a2 = asaRegla(), l = local(p); if (Math.hypot(p.x - a2.x, p.y - a2.y) < 18 / vista.z) cur = 'girar'; else if (Math.abs(l.u) < regla.len / 2 && Math.abs(l.v) < regla.w / 2) cur = 'mover'; }
                if (!cur && modo === 'sel') { var cs = sel.length && cajaSel(); cur = cs && enAsa(p, cs) ? 'escalar' : (cs && dentro(p, cs) ? 'mover' : ''); }
                hoja.dataset.cursor = cur || (espacio ? 'mano' : '');
                return;
            }
            if (actual.mano) { vista.x = actual.v.x + s.x - actual.s.x; vista.y = actual.v.y + s.y - actual.s.y; aplicarVista(); return; }
            if (actual.regla === 'girar') {
                var g = Math.atan2(p.y - regla.y, p.x - regla.x), deg = Math.round(g * 180 / Math.PI);
                if (e.shiftKey) deg = Math.round(deg / 15) * 15;
                regla.ang = deg * Math.PI / 180; pintar(); return;
            }
            if (actual.regla === 'mover') { regla.x = actual.x + p.x - actual.ini.x; regla.y = actual.y + p.y - actual.ini.y; pintar(); return; }
            if (actual.borrar) { borrarEn(p); return; }
            if (actual.sel) {
                var base = JSON.parse(actual.antes || '[]');
                if (actual.sel === 'caja') actual.fin = p;
                else if (actual.sel === 'mover') {
                    var dx = p.x - actual.ini.x, dy = p.y - actual.ini.y;
                    sel.forEach(function (i) { doc.items[i] = transformar(base[i], function (q) { return { x: q.x + dx, y: q.y + dy }; }); });
                    actual.cambio = true;
                } else {
                    var cj = actual.caja, ox = cj.x0, oy = cj.y0;
                    var k = Math.max(.1, Math.max((p.x - ox) / (cj.x1 - ox || 1), (p.y - oy) / (cj.y1 - oy || 1)));
                    sel.forEach(function (i) { doc.items[i] = transformar(base[i], function (q) { return { x: ox + (q.x - ox) * k, y: oy + (q.y - oy) * k }; }, k); });
                    actual.cambio = true;
                }
                pintar(); return;
            }
            if (ES_PLUMA[actual.tipo]) {
                if (actual.borde != null) p = pegar(p, actual);
                else if (actual.tipo === 'resaltador' && e.shiftKey) p.y = actual.p[0].y;
                actual.p.push(p);
            } else {
                if (e.shiftKey && CERRADAS[actual.tipo]) {
                    var o = actual.p[0], mm = Math.max(Math.abs(p.x - o.x), Math.abs(p.y - o.y));
                    p = { x: o.x + mm * Math.sign(p.x - o.x || 1), y: o.y + mm * Math.sign(p.y - o.y || 1) };
                }
                actual.p[1] = p;
            }
            pintar();
        });
        function soltar(e) {
            delete punteros[e.pointerId];
            if (pinza) { if (Object.keys(punteros).length < 2) { pinza = null; guardarLuego(); } return; }
            if (!actual) return;
            var t = actual; actual = null;
            if (t.mano) { hoja.dataset.cursor = espacio ? 'mano' : ''; guardarLuego(); return; }
            if (t.regla) return;
            if (t.borrar) { if (t.quitados.length) { historia.push(t.antes); rehacer = []; guardar(doc); } return; }
            if (t.sel) {
                if (t.sel === 'caja') {
                    var r = bbox(t.ini, t.fin);
                    doc.items.forEach(function (it, i) {
                        var q = caja(it);
                        if (q.x0 < r.x1 && q.x1 > r.x0 && q.y0 < r.y1 && q.y1 > r.y0 && sel.indexOf(i) < 0) sel.push(i);
                    });
                } else if (t.cambio) { historia.push(t.antes); rehacer = []; guardar(doc); }
                pintar(); return;
            }
            var p = t.p, chico = p.length > 1 && ES_FIG[t.tipo] && Math.abs(p[1].x - p[0].x) < 3 && Math.abs(p[1].y - p[0].y) < 3;
            if (!chico) { marcar(); doc.items.push(t); }
            guardarYpintar();
        }
        lienzo.addEventListener('pointerup', soltar);
        lienzo.addEventListener('pointercancel', soltar);
        lienzo.addEventListener('pointerleave', function () { if (modo === 'laser') rastro = []; });
        lienzo.addEventListener('dblclick', function (e) {
            if (modo !== 'sel') return;
            var i = itemEditable(mundo(pantalla(e)));
            if (i >= 0) { sel = []; abrirEditor(null, i); }
        });
        /* rueda: desplaza; con Ctrl (o pellizco en el touchpad) acerca y aleja */
        lienzo.addEventListener('wheel', function (e) {
            e.preventDefault();
            var s = pantalla(e);
            if (e.ctrlKey || e.metaKey) zoomEn(vista.z * Math.exp(-e.deltaY * .0025), s.x, s.y);
            else { vista.x -= e.deltaX; vista.y -= e.deltaY; cerrarEditor(true); aplicarVista(); guardarLuego(); }
        }, { passive: false });

        /* ---------- barra ---------- */
        function ponerModo(m) {
            cerrarEditor(true);
            modo = m; rastro = []; sel = []; hoja.dataset.cursor = ''; cerrarPops();
            if (ES_PLUMA[m] && m !== 'borrador') pluma = m;
            raiz.querySelectorAll('[data-h]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.h === m); });
            raiz.querySelector('[data-dibujar]').setAttribute('aria-pressed', !!ES_PLUMA[m] && m !== 'borrador');
            raiz.querySelector('[data-btn-borrar]').setAttribute('aria-pressed', m === 'borrador');
            var bf = raiz.querySelector('[data-btn-fig]');
            bf.setAttribute('aria-pressed', !!ES_FIG[m]);
            if (ES_FIG[m]) bf.querySelector('[data-fig-ico]').innerHTML = ES_FIG[m][2];
            var conSub = !!((ES_PLUMA[m] && m !== 'borrador') || ES_FIG[m] || m === 'texto');
            raiz.querySelector('[data-sub]').classList.toggle('ver', conSub);
            raiz.querySelector('[data-plumas]').hidden = !ES_PLUMA[m];
            hoja.dataset.modo = m;
            raiz.querySelector('[data-arcoiris]').setAttribute('aria-pressed', m === 'arcoiris');
            raiz.querySelector('[data-color-actual]').classList.toggle('pz-color--arcoiris', m === 'arcoiris');
            pintar();
        }
        function ponerColor(c) {
            color = c; cerrarPops();
            raiz.querySelectorAll('[data-color],[data-reciente]').forEach(function (x) { x.setAttribute('aria-pressed', (x.dataset.color || x.dataset.reciente) === c); });
            raiz.querySelector('[data-color-actual]').style.setProperty('--c', c);
        }
        function ponerGrosor(g) {
            grosor = g; raiz.querySelector('[data-grosor]').value = g; raiz.querySelector('[data-grosor-val]').textContent = g;
            raiz.querySelector('[data-color-actual]').style.setProperty('--t', Math.min(22, 8 + g) + 'px');
        }
        function ponerOpacidad(o) {
            opacidad = o; raiz.querySelector('[data-opacidad]').value = Math.round(o * 100); raiz.querySelector('[data-opacidad-val]').textContent = Math.round(o * 100);
            raiz.querySelector('[data-color-actual]').style.opacity = Math.max(.25, o);
        }
        function recordar(c) {
            var r = (doc.recientes || []).filter(function (x) { return x !== c; }); r.unshift(c); doc.recientes = r.slice(0, 4); guardar(doc); pintarRecientes();
        }
        function pintarRecientes() {
            var cont = raiz.querySelector('[data-recientes]');
            cont.innerHTML = (doc.recientes || []).map(function (c) { return '<button type="button" class="pz-color" data-reciente="' + c + '" style="--c:' + c + '" aria-label="Color reciente ' + c + '" aria-pressed="' + (c === color) + '"></button>'; }).join('');
        }
        function ponerFondo(f) {
            doc.fondo = f; hoja.dataset.fondo = f; guardar(doc);
            raiz.querySelectorAll('[data-fondo]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.fondo === f); });
            aplicarVista();
        }
        function ponerRegla(v) {
            regla.on = v;
            if (v) { var c = mundo({ x: W / 2, y: H / 2 }); regla.x = c.x; regla.y = c.y; regla.len = 900 / Math.max(vista.z, .4); }
            raiz.querySelector('[data-regla]').setAttribute('aria-pressed', v);
            pintar();
        }
        function cerrarPops(salvo) {
            raiz.querySelectorAll('[data-abrir]').forEach(function (x) {
                var a = x.dataset.abrir === salvo;
                x.setAttribute('aria-expanded', a);
                raiz.querySelector('[data-pop="' + x.dataset.abrir + '"]').classList.toggle('ver', a);
            });
        }
        raiz.querySelectorAll('[data-abrir]').forEach(function (x) {
            x.addEventListener('click', function (e) {
                e.stopPropagation();
                cerrarPops(x.getAttribute('aria-expanded') === 'true' ? null : x.dataset.abrir);
            });
        });
        document.addEventListener('pointerdown', function cierre(e) {
            if (!document.body.contains(raiz)) { document.removeEventListener('pointerdown', cierre); return; }
            if (!e.target.closest('.pz-menu')) cerrarPops();
        });
        function borrarSel() {
            if (!sel.length) return;
            marcar(); doc.items = doc.items.filter(function (x, i) { return sel.indexOf(i) < 0; }); sel = []; guardarYpintar();
        }
        function deshacer() { cerrarEditor(true); sel = []; if (historia.length) { rehacer.push(JSON.stringify(doc.items)); doc.items = JSON.parse(historia.pop()); guardarYpintar(); } }
        function rehacerUno() { sel = []; if (rehacer.length) { historia.push(JSON.stringify(doc.items)); doc.items = JSON.parse(rehacer.pop()); guardarYpintar(); } }
        function limpiar() { cerrarEditor(false); cerrarPops(); if (!doc.items.length) return; marcar(); doc.items = []; sel = []; guardarYpintar(); }
        function png() {
            cerrarEditor(true); cerrarPops();
            var c = doc.items.length ? cajaDe(doc.items.map(function (_, i) { return i; })) : { x0: 0, y0: 0, x1: W, y1: H };
            var m = 40, esc = 2, w = Math.min(8000, (c.x1 - c.x0 + m * 2) * esc), h = Math.min(8000, (c.y1 - c.y0 + m * 2) * esc);
            var tela = document.createElement('canvas'); tela.width = w; tela.height = h;
            var x = tela.getContext('2d');
            x.fillStyle = doc.fondo === 'oscuro' ? '#000000' : '#ffffff'; x.fillRect(0, 0, w, h);
            x.setTransform(esc, 0, 0, esc, (m - c.x0) * esc, (m - c.y0) * esc);
            cx = x; doc.items.forEach(dibujar); cx = ctx;
            var a = document.createElement('a'); a.download = 'pizarra-farmacologia.png'; a.href = tela.toDataURL('image/png'); a.click();
        }
        function completa() {
            cerrarPops();
            if (document.fullscreenElement) document.exitFullscreen();
            else if (raiz.requestFullscreen) raiz.requestFullscreen();
        }

        raiz.querySelectorAll('[data-h]').forEach(function (x) { x.addEventListener('click', function () { ponerModo(x.dataset.h); }); });
        raiz.querySelector('[data-dibujar]').addEventListener('click', function () { ponerModo(pluma); });
        raiz.querySelectorAll('[data-nota]').forEach(function (x) { x.addEventListener('click', function () { notaColor = x.dataset.nota; ponerModo('nota'); }); });
        function aplicarColor(c) {
            ponerColor(c); recordar(c);
            if (ES_PLUMA[modo] && (modo === 'arcoiris' || modo === 'borrador')) ponerModo('lapiz');
            if (sel.length) { marcar(); sel.forEach(function (i) { if (doc.items[i].tipo !== 'nota') doc.items[i].c = c; }); guardarYpintar(); }
        }
        raiz.querySelectorAll('[data-color]').forEach(function (x) { x.addEventListener('click', function () { aplicarColor(x.dataset.color); }); });
        raiz.querySelector('[data-grosor]').addEventListener('input', function () { ponerGrosor(+this.value); });
        raiz.querySelector('[data-opacidad]').addEventListener('input', function () { ponerOpacidad(+this.value / 100); });
        var entrada = raiz.querySelector('[data-color-input]');
        raiz.querySelector('[data-otro]').addEventListener('click', function () { entrada.value = /^#[0-9a-f]{6}$/i.test(color) ? color : '#0f2342'; entrada.click(); });
        entrada.addEventListener('change', function () { aplicarColor(entrada.value); });
        raiz.querySelector('[data-recientes]').addEventListener('click', function (e) { var x = e.target.closest('[data-reciente]'); if (x) aplicarColor(x.dataset.reciente); });
        raiz.querySelector('[data-arcoiris]').addEventListener('click', function () { ponerModo('arcoiris'); });
        raiz.querySelector('[data-relleno]').addEventListener('click', function () { relleno = !relleno; this.setAttribute('aria-pressed', relleno); });
        raiz.querySelector('[data-regla]').addEventListener('click', function () { ponerRegla(!regla.on); });
        raiz.querySelectorAll('[data-fondo]').forEach(function (x) { x.addEventListener('click', function () { ponerFondo(x.dataset.fondo); }); });
        raiz.querySelector('[data-deshacer]').addEventListener('click', deshacer);
        raiz.querySelector('[data-rehacer]').addEventListener('click', rehacerUno);
        raiz.querySelector('[data-limpiar]').addEventListener('click', limpiar);
        raiz.querySelector('[data-png]').addEventListener('click', png);
        raiz.querySelector('[data-full]').addEventListener('click', completa);
        raiz.querySelector('[data-zmenos]').addEventListener('click', function () { zoomEn(vista.z / 1.25); });
        raiz.querySelector('[data-zmas]').addEventListener('click', function () { zoomEn(vista.z * 1.25); });
        raiz.querySelector('[data-z100]').addEventListener('click', function () { zoomEn(1); });
        raiz.querySelector('[data-ajustar]').addEventListener('click', ajustar);

        function teclas(e) {
            if (!document.body.contains(raiz)) { removeEventListener('keydown', teclas); removeEventListener('keyup', soltarTecla); return; }
            var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
            var k = e.key.toLowerCase();
            if (k === ' ') { e.preventDefault(); if (!espacio) { espacio = true; hoja.dataset.cursor = 'mano'; } return; }
            if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); if (e.shiftKey) rehacerUno(); else deshacer(); return; }
            if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); rehacerUno(); return; }
            if ((e.ctrlKey || e.metaKey) && (k === '+' || k === '=' || k === '-')) { e.preventDefault(); zoomEn(vista.z * (k === '-' ? 1 / 1.25 : 1.25)); return; }
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if ((k === 'delete' || k === 'backspace') && sel.length) { e.preventDefault(); borrarSel(); }
            else if (k === 'escape') { cerrarPops(); if (sel.length) { sel = []; pintar(); } }
            else if (k === '+' || k === '=') zoomEn(vista.z * 1.25);
            else if (k === '-') zoomEn(vista.z / 1.25);
            else if (k === '0') zoomEn(1);
            else if (k === '1') ajustar();
            else if (k === 'r') ponerRegla(!regla.on);
            else if (k === 'f') completa();
            else if (TECLAS[k]) ponerModo(TECLAS[k]);
        }
        function soltarTecla(e) { if (e.key === ' ') { espacio = false; hoja.dataset.cursor = ''; } }
        addEventListener('keydown', teclas);
        addEventListener('keyup', soltarTecla);

        ponerColor(color); ponerGrosor(grosor); ponerOpacidad(1); pintarRecientes(); ponerFondo(doc.fondo || 'cuadricula'); ponerModo('lapiz'); medir();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(pintar);
    }

    return { titulo: 'Pizarra', render: render, montar: montar };
})();
