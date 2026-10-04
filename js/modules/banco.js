/* ============================================================
   VISTA · #/examen/practicar[/<fuente>]  ·  Banco de examen
   Dentro de la zona con clave. Elige de qué recurso salen las
   preguntas, el modo (práctica o simulacro cronometrado), cuántas
   y, en el simulacro, el tiempo por pregunta.
   ============================================================ */
FA.vistas.bancoExamen = (function () {
    var u = FA.u;

    function hoy(f) { try { return new Date(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }); } catch (e) { return ''; } }
    function mmss(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

    return {
        titulo: 'Banco de examen',
        render: function () {
            if (!FA.acceso.abierto()) return FA.acceso.pantalla();
            var total = FA.datos.bancoExamen().length;
            return '<div class="pagina pagina--estrecha">' +
                '<nav class="migas" aria-label="Ruta"><a href="#/examen">Datos examen</a><span>/</span><b>Banco de examen</b></nav>' +
                '<header class="cabecera"><p class="eyebrow">Datos examen</p><h1>Banco de examen</h1>' +
                '<p class="lead">' + total + ' preguntas tipo caso clínico con las 4 opciones casi idénticas, como en el parcial. En la práctica ves la justificación al responder; en el simulacro, al terminar.</p></header>' +
                '<div data-barra></div><div data-zona></div></div>';
        },
        montar: function (el, p) {
            if (!FA.acceso.abierto()) { FA.acceso.montar(el); return; }
            var zona = el.querySelector('[data-zona]'), barra = el.querySelector('[data-barra]');
            var fuentes = FA.datos.extras.filter(function (e) { return e.preguntas.length; });
            var sel = {};
            fuentes.forEach(function (e) { sel[e.id] = !p.id || p.id === e.id; });

            function pool(soloFalladas) {
                var ids = fuentes.filter(function (e) { return sel[e.id]; }).map(function (e) { return e.id; });
                var b = FA.datos.bancoExamen(ids);
                if (soloFalladas) b = b.filter(function (q) { var r = FA.estado.examenPregunta(q.id); return r && r.ult === false; });
                return b;
            }

            function config() {
                barra.innerHTML = '';
                var hist = FA.estado.examenHistorial().slice(0, 5);
                zona.innerHTML =
                    '<div class="panel alcance">' +
                    '<h2 class="panel__tit">¿De dónde salen las preguntas?</h2>' +
                    '<div class="chips" data-fuentes>' + fuentes.map(function (e) {
                        return '<button type="button" class="chip" data-f="' + e.id + '" aria-pressed="' + !!sel[e.id] + '">' + u.esc(e.nombre.replace(/\s*\(.*$/, '')) + ' · ' + e.preguntas.length + '</button>';
                    }).join('') + '</div>' +
                    '<div class="campo"><span id="lbl-modo">Modo</span><div class="segmento" role="group" aria-labelledby="lbl-modo">' +
                    '<button type="button" data-modo="practica" aria-pressed="true">Práctica<small>justificación al responder</small></button>' +
                    '<button type="button" data-modo="simulacro" aria-pressed="false">Simulacro<small>con tiempo</small></button></div></div>' +
                    '<label class="campo"><span>Número de preguntas</span><select data-n><option value="5">5</option><option value="10" selected>10</option><option value="15">15</option><option value="20">20</option><option value="0">Todas</option></select></label>' +
                    '<label class="campo" data-tiempo hidden><span>Tiempo por pregunta</span><select data-t><option value="1">1 minuto</option><option value="1.5" selected>1,5 minutos</option><option value="2">2 minutos</option></select></label>' +
                    '<label class="check" data-solo-caja><input type="checkbox" data-solo> Sólo las que fallé la última vez</label>' +
                    '<p class="alcance__cuenta" data-cuenta aria-live="polite"></p>' +
                    '<button type="button" class="btn" data-empezar>Empezar ' + u.icono('flecha') + '</button></div>' +
                    (hist.length ? '<div class="panel" style="margin-top:var(--s-4)"><h2 class="panel__tit">Tus últimos intentos</h2><ul class="historial">' + hist.map(function (h) {
                        var pc = u.pct(h.ok, h.t);
                        return '<li><span>' + hoy(h.f) + '</span><b>' + u.esc(h.e) + '</b><span class="historial__nota ' + (pc >= 60 ? 'ok-txt' : 'mal-txt') + '">' + h.ok + '/' + h.t + ' · ' + pc + '%' + (h.s ? ' · ' + mmss(h.s) : '') + '</span></li>';
                    }).join('') + '</ul></div>' : '');

                var modo = 'practica', cuenta = zona.querySelector('[data-cuenta]'), btn = zona.querySelector('[data-empezar]');
                var solo = zona.querySelector('[data-solo]'), nSel = zona.querySelector('[data-n]'), tSel = zona.querySelector('[data-t]');
                function actualizar() {
                    var n = pool(solo.checked).length;
                    zona.querySelector('[data-tiempo]').hidden = modo !== 'simulacro';
                    var cuantas = +nSel.value || n; cuantas = Math.min(cuantas, n);
                    cuenta.textContent = n + (n === 1 ? ' pregunta disponible' : ' preguntas disponibles') +
                        (modo === 'simulacro' && n ? ' · tiempo total ' + Math.max(1, Math.round(cuantas * +tSel.value)) + ' min' : '');
                    btn.disabled = n === 0;
                }
                zona.querySelector('[data-fuentes]').addEventListener('click', function (e) {
                    var b = e.target.closest('.chip'); if (!b) return;
                    sel[b.dataset.f] = !sel[b.dataset.f];
                    if (!fuentes.some(function (x) { return sel[x.id]; })) sel[b.dataset.f] = true;   // al menos una
                    b.setAttribute('aria-pressed', !!sel[b.dataset.f]); actualizar();
                });
                zona.querySelectorAll('[data-modo]').forEach(function (b) {
                    b.addEventListener('click', function () {
                        modo = b.dataset.modo;
                        zona.querySelectorAll('[data-modo]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
                        actualizar();
                    });
                });
                [solo, nSel, tSel].forEach(function (c) { c.addEventListener('change', actualizar); });
                btn.addEventListener('click', function () { empezar(modo, +nSel.value, +tSel.value, solo.checked); });
                actualizar();
            }

            function etiqueta() {
                var n = fuentes.filter(function (e) { return sel[e.id]; });
                return n.length === fuentes.length ? 'Banco completo' : n.map(function (e) { return e.nombre.replace(/\s*\(.*$/, ''); }).join(' + ');
            }

            function empezar(modo, n, factor, solo) {
                var todas = pool(solo);
                if (!todas.length) return config();
                var cuantas = n > 0 ? Math.min(n, todas.length) : todas.length;
                function lote() { return u.mezclar(todas).slice(0, cuantas); }
                barra.innerHTML = '<div class="barra-alcance"><span><small>' + (modo === 'simulacro' ? 'Simulacro' : 'Práctica') + '</small> <b>' + u.esc(etiqueta()) + '</b></span>' +
                    '<a class="btn btn--sec btn--chico" href="#/examen/practicar" data-cambiar-alcance>Cambiar opciones</a></div>';
                barra.querySelector('[data-cambiar-alcance]').addEventListener('click', function (e) { e.preventDefault(); FA.router.render(); });
                FA.banco.montar(zona, lote(), {
                    modo: modo, minutos: Math.max(1, Math.round(cuantas * factor)), etiqueta: etiqueta(),
                    nuevoLote: lote, alCambiar: function () { FA.router.render(); }
                });
            }

            config();
        }
    };
})();
