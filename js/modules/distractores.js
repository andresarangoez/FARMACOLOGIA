/* ============================================================
   VISTA · #/distractores  ·  ¿A qué fármaco pertenece?
   Muestra un mecanismo, efecto adverso o grupo y hay que elegir el
   fármaco entre 4 parecidos (de la misma sesión y grupo cuando se puede).
   Es el patrón del parcial: la opción incorrecta suele ser el mecanismo de
   OTRO fármaco. Por eso, al responder se muestra qué hace cada una de las
   4 opciones, para aprender las confusiones y no solo la respuesta.
   Los pares los genera FA.pares automáticamente desde content/.
   ============================================================ */
FA.vistas.distractores = (function () {
    var u = FA.u, L = ['a', 'b', 'c', 'd'];
    var TIPOS = [
        { id: 'mecanismo', txt: 'Mecanismo de acción', d: 'Cómo actúa cada fármaco', q: '¿A qué fármaco pertenece este mecanismo de acción?' },
        { id: 'efecto', txt: 'Efecto adverso', d: 'Qué reacción puede producir', q: '¿A qué fármaco corresponde este efecto adverso?' },
        { id: 'grupo', txt: 'Grupo farmacológico', d: 'A qué familia pertenece', q: '¿A qué fármaco corresponde este grupo farmacológico?' },
        { id: 'mezcla', txt: 'Mezclado', d: 'Un poco de todo', q: null }
    ];
    var ETIQ = { mecanismo: 'Mecanismo de acción', efecto: 'Efecto adverso', grupo: 'Grupo farmacológico' };
    var PREG = { mecanismo: TIPOS[0].q, efecto: TIPOS[1].q, grupo: TIPOS[2].q };

    function pool(tipo, sesiones, solo) {
        var t = tipo === 'mezcla' ? ['mecanismo', 'efecto', 'grupo'] : [tipo], r = [];
        t.forEach(function (x) { r = r.concat(FA.pares.lista(x, sesiones)); });
        if (solo) r = r.filter(function (p) { var s = FA.estado.par(p.id); return s && s.ult === false; });
        return r;
    }

    function jugar(el, preguntas, opc) {
        var i = 0, aciertos = 0, falladas = [], respondida = false;
        var items = preguntas.map(function (p) { return { par: p, opciones: FA.pares.opciones(p, 3) }; });

        function pintar() {
            if (i >= items.length) return fin();
            var it = items[i], p = it.par;
            el.innerHTML = '<div class="quiz">' +
                '<div class="fc__top"><span>Pregunta <b>' + (i + 1) + '</b> de ' + items.length + '</span><span class="chip chip--fijo">' + ETIQ[p.tipo] + '</span></div>' +
                '<div class="barra-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + items.length + '" aria-valuenow="' + i + '"><i style="width:' + u.pct(i, items.length) + '%"></i></div>' +
                '<div class="panel"><p class="quiz__tipo">' + PREG[p.tipo] + '</p>' +
                '<blockquote class="enigma">' + u.esc(p.texto) + '</blockquote>' +
                '<div class="opciones" role="group" aria-label="Fármacos">' + it.opciones.map(function (o, k) {
                    return '<button type="button" class="op" data-k="' + k + '"><b>' + L[k] + '</b><span>' + u.esc(o.farmaco) + '</span></button>';
                }).join('') + '</div>' +
                '<div data-fb hidden></div>' +
                '<div class="fila-botones"><button type="button" class="btn" data-sig hidden>' + (i + 1 === items.length ? 'Ver resultado' : 'Siguiente') + ' ' + u.icono('flecha') + '</button></div></div></div>';
            respondida = false;
        }

        function responder(k) {
            if (respondida) return; respondida = true;
            var it = items[i], p = it.par, o = it.opciones[k], ok = o === p;
            FA.estado.parResultado(p.id, ok);
            if (ok) aciertos++; else falladas.push({ par: p, elegido: o });
            el.querySelectorAll('.op').forEach(function (b, j) {
                b.disabled = true;
                if (it.opciones[j] === p) b.classList.add('op--ok'); else if (j === k) b.classList.add('op--mal');
            });
            var fb = el.querySelector('[data-fb]'); fb.hidden = false;
            fb.className = 'feedback ' + (ok ? 'feedback--ok' : 'feedback--mal');
            fb.innerHTML = '<b>' + (ok ? '¡Correcto!' : 'Incorrecto.') + '</b> ' + (ok ? '' : 'Era <b>' + u.esc(p.farmaco) + '</b>. ') +
                'Esto es lo que hace cada opción:' +
                '<ul class="cada">' + it.opciones.map(function (x, j) {
                    return '<li class="' + (x === p ? 'cada--ok' : (j === k ? 'cada--mal' : '')) + '"><b>' + L[j] + ') ' + u.esc(x.farmaco) + '</b> — ' + u.esc(x.texto) +
                        ' <a href="#/farmaco/' + x.tema + '" title="' + u.esc(x.origen) + '">ver tema</a></li>';
                }).join('') + '</ul>';
            var s = el.querySelector('[data-sig]'); s.hidden = false; s.focus();
        }

        function fin() {
            var tot = items.length, pc = u.pct(aciertos, tot);
            el.innerHTML = '<div class="panel resultado"><h2 class="panel__tit">Resultado</h2>' +
                '<p class="resultado__big">' + aciertos + '<small>/' + tot + '</small></p><p class="resultado__num"><b>' + pc + '%</b></p>' +
                (falladas.length ? '<h3>Para repasar</h3><ul class="falladas">' + falladas.map(function (f) {
                    return '<li><b>' + u.esc(f.par.texto) + '</b><br><span class="ok-txt">Era: ' + u.esc(f.par.farmaco) + '</span> · <span class="mal-txt">elegiste ' + u.esc(f.elegido.farmaco) + '</span>' +
                        ' · <a href="#/farmaco/' + f.par.tema + '">ver el tema</a><br><small class="origen">' + u.esc(f.par.origen) + '</small></li>';
                }).join('') + '</ul>' : '<p class="ok-txt">¡Sin errores!</p>') +
                '<div class="fila-botones"><button type="button" class="btn" data-otra>Otro intento</button>' +
                (falladas.length ? '<button type="button" class="btn btn--sec" data-fallo>Repetir sólo las falladas (' + falladas.length + ')</button>' : '') +
                '<button type="button" class="btn btn--sec" data-cambiar>Cambiar opciones</button></div></div>';
        }

        el.addEventListener('click', function (e) {
            var b = e.target.closest('button'); if (!b) return;
            if (b.classList.contains('op')) responder(+b.dataset.k);
            else if (b.hasAttribute('data-sig')) { i++; pintar(); }
            else if (b.hasAttribute('data-otra')) opc.otra();
            else if (b.hasAttribute('data-fallo')) opc.repetir(falladas.map(function (f) { return f.par; }));
            else if (b.hasAttribute('data-cambiar')) opc.cambiar();
        });
        function teclas(e) {
            if (!el.isConnected) { document.removeEventListener('keydown', teclas); return; }
            if (i >= items.length || respondida || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
            var k = L.indexOf(e.key.toLowerCase()); if (k < 0 && /^[1-4]$/.test(e.key)) k = +e.key - 1;
            if (k >= 0 && k < items[i].opciones.length) responder(k);
        }
        document.addEventListener('keydown', teclas);
        pintar();
    }

    return {
        titulo: '¿A qué fármaco pertenece?',
        render: function () {
            return '<div class="pagina pagina--estrecha">' +
                '<header class="cabecera"><h1>¿A qué fármaco pertenece?</h1>' +
                '<p class="lead">Es fácil confundir el mecanismo de un fármaco con el de otro. Aquí practicas justo eso: reconocer a quién pertenece cada descripción entre 4 fármacos parecidos.</p></header>' +
                '<div data-barra></div><div data-zona></div></div>';
        },
        montar: function (el) {
            var zona = el.querySelector('[data-zona]'), barra = el.querySelector('[data-barra]');
            var T = FA.pares.todos(), ses = FA.datos.sesiones.filter(function (s) { return T.mecanismo.concat(T.efecto, T.grupo).some(function (p) { return p.sesion === s.n; }); });
            var st = { tipo: 'mecanismo', ses: [], n: 10, solo: false };

            function ronda(lista) {
                barra.innerHTML = '<div class="barra-alcance"><span><small>Practicando</small> <b>' + u.esc(TIPOS.filter(function (t) { return t.id === st.tipo; })[0].txt) + '</b></span>' +
                    '<button type="button" class="btn btn--sec btn--chico" data-cambiar>Cambiar opciones</button></div>';
                barra.querySelector('[data-cambiar]').addEventListener('click', config);
                var todas = pool(st.tipo, st.ses, st.solo);
                var preg = lista || u.mezclar(todas).slice(0, st.n);
                if (!preg.length) return config();
                jugar(zona, preg, {
                    otra: function () { ronda(); }, cambiar: config,
                    repetir: function (l) { ronda(u.mezclar(l)); }
                });
            }

            function config() {
                barra.innerHTML = '';
                zona.innerHTML =
                    '<div class="panel alcance"><h2 class="panel__tit">¿Qué quieres practicar?</h2>' +
                    '<div class="tipo-grid" data-tipos role="radiogroup" aria-label="Tipo de práctica">' + TIPOS.map(function (t) { return '<button type="button" class="tipo-card" role="radio" data-t="' + t.id + '" aria-pressed="' + (st.tipo === t.id) + '" aria-checked="' + (st.tipo === t.id) + '"><span class="tipo-card__radio" aria-hidden="true"></span><span><b>' + t.txt + '</b><small>' + t.d + '</small></span></button>'; }).join('') + '</div>' +
                    '<h3 class="alcance__sub">¿De qué sesiones?</h3><p class="ayuda">Si no eliges ninguna, entran todas.</p>' +
                    '<div class="ses-grid" data-ses>' + ses.map(function (s) { return '<button type="button" class="ses-card" data-s="' + s.n + '" aria-pressed="' + (st.ses.indexOf(s.n) >= 0) + '"><span class="ses-card__n">Sesión ' + s.n + '<i class="ses-card__ok" aria-hidden="true">✓</i></span><span class="ses-card__tema">' + u.esc(s.tema) + '</span></button>'; }).join('') + '</div>' +
                    FA.alcance.numeros([5, 10, 15, 20].map(function (n) { return [n, String(n)]; }), st.n) +
                    '<label class="check"><input type="checkbox" data-solo' + (st.solo ? ' checked' : '') + '> Sólo las que fallé la última vez</label>' +
                    '<p class="alcance__cuenta" data-cuenta aria-live="polite"></p>' +
                    '<button type="button" class="btn" data-empezar>Empezar ' + u.icono('flecha') + '</button></div>';
                var cuenta = zona.querySelector('[data-cuenta]'), btn = zona.querySelector('[data-empezar]');
                function act() { var n = pool(st.tipo, st.ses, st.solo).length; cuenta.textContent = n + (n === 1 ? ' pregunta disponible' : ' preguntas disponibles'); btn.disabled = n < 1; }
                zona.querySelector('[data-tipos]').addEventListener('click', function (e) {
                    var b = e.target.closest('.tipo-card'); if (!b) return; st.tipo = b.dataset.t;
                    zona.querySelectorAll('[data-tipos] .tipo-card').forEach(function (x) { x.setAttribute('aria-pressed', x === b); x.setAttribute('aria-checked', x === b); }); act();
                });
                zona.querySelector('[data-ses]').addEventListener('click', function (e) {
                    var b = e.target.closest('.ses-card'); if (!b) return; var n = +b.dataset.s, i = st.ses.indexOf(n);
                    if (i >= 0) st.ses.splice(i, 1); else st.ses.push(n); b.setAttribute('aria-pressed', i < 0); act();
                });
                FA.alcance.montarNumeros(zona);
                zona.querySelector('[data-n]').addEventListener('change', function (e) { st.n = +e.target.value; act(); });
                zona.querySelector('[data-solo]').addEventListener('change', function (e) { st.solo = e.target.checked; act(); });
                btn.addEventListener('click', function () { ronda(); });
                act();
            }
            config();
        }
    };
})();
