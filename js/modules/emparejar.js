/* ============================================================
   VISTA · #/emparejar  ·  Emparejar en dos columnas
   Izquierda: mecanismo / efecto adverso / grupo farmacológico.
   Derecha: fármacos. Se une por clic (uno de cada columna) o
   arrastrando. Retroalimentación inmediata; al final muestra qué
   pares fallaste y de dónde sale cada uno (trazabilidad).
   Los pares los genera FA.pares automáticamente desde content/.
   ============================================================ */
FA.vistas.emparejar = (function () {
    var u = FA.u;
    var TIPOS = [
        { id: 'mecanismo', txt: 'Mecanismo de acción → fármaco' },
        { id: 'efecto', txt: 'Efecto adverso → fármaco' },
        { id: 'grupo', txt: 'Grupo farmacológico → fármaco' },
        { id: 'mezcla', txt: 'Mezclado' }
    ];
    var ETIQ = { mecanismo: 'Mecanismo', efecto: 'Efecto adverso', grupo: 'Grupo farmacológico' };

    function pool(tipo, sesiones, soloFalladas) {
        var t = tipo === 'mezcla' ? ['mecanismo', 'efecto', 'grupo'] : [tipo], r = [];
        t.forEach(function (x) { r = r.concat(FA.pares.lista(x, sesiones)); });
        if (soloFalladas) r = r.filter(function (p) { var s = FA.estado.par(p.id); return s && s.ult === false; });
        return r;
    }

    /* una ronda: izquierda y derecha mezcladas por separado */
    function jugar(el, pares, opc) {
        var izq = u.mezclar(pares), der = u.mezclar(pares);
        var hechos = {}, fallos = {}, intentos = 0, errores = 0, selI = null, selD = null, bloqueo = false;

        function pintar() {
            el.innerHTML =
                '<div class="emp-top"><span>Aciertos <b data-ac>0</b> de ' + pares.length + '</span><span>Errores <b data-er>0</b></span></div>' +
                '<p class="ayuda">Toca un elemento de cada columna para unirlos, o arrastra uno sobre el otro.</p>' +
                '<div class="emp" role="group" aria-label="Emparejar">' +
                '<div class="emp__col" data-col="i">' + izq.map(function (p, k) {
                    return '<button type="button" class="emp__item" draggable="true" data-i="' + k + '"><small>' + ETIQ[p.tipo] + '</small>' + u.esc(p.texto) + '</button>';
                }).join('') + '</div>' +
                '<div class="emp__col" data-col="d">' + der.map(function (p, k) {
                    return '<button type="button" class="emp__item emp__item--der" draggable="true" data-d="' + k + '">' + u.esc(p.farmaco) + '</button>';
                }).join('') + '</div></div>' +
                '<div class="feedback" data-fb hidden role="status"></div>';
        }

        function item(col, k) { return el.querySelector('[data-' + col + '="' + k + '"]'); }
        function marcar() {
            el.querySelectorAll('.emp__item').forEach(function (b) { b.classList.remove('emp__item--sel'); });
            if (selI != null) item('i', selI).classList.add('emp__item--sel');
            if (selD != null) item('d', selD).classList.add('emp__item--sel');
        }

        function intentar(i, d) {
            if (bloqueo || hechos[izq[i].id]) return;
            var pi = izq[i], pd = der[d];
            intentos++;
            if (pi === pd) {
                hechos[pi.id] = true;
                [item('i', i), item('d', d)].forEach(function (b) { b.classList.remove('emp__item--sel'); b.classList.add('emp__item--ok'); b.disabled = true; b.draggable = false; });
                selI = selD = null; marcar();
                el.querySelector('[data-ac]').textContent = Object.keys(hechos).length;
                if (Object.keys(hechos).length === pares.length) setTimeout(fin, 500);
            } else {
                errores++; fallos[pi.id] = true; fallos[pd.id] = true;
                bloqueo = true;
                var a = item('i', i), b = item('d', d);
                a.classList.add('emp__item--mal'); b.classList.add('emp__item--mal');
                el.querySelector('[data-er]').textContent = errores;
                setTimeout(function () {
                    a.classList.remove('emp__item--mal', 'emp__item--sel'); b.classList.remove('emp__item--mal', 'emp__item--sel');
                    selI = selD = null; bloqueo = false;
                }, 650);
            }
        }

        function elegir(col, k) {
            if (bloqueo) return;
            if (col === 'i') selI = selI === k ? null : k; else selD = selD === k ? null : k;
            marcar();
            if (selI != null && selD != null) intentar(selI, selD);
        }

        function fin() {
            pares.forEach(function (p) { FA.estado.parResultado(p.id, !fallos[p.id]); });
            var mal = pares.filter(function (p) { return fallos[p.id]; });
            var buenos = pares.length - mal.length;
            el.innerHTML = '<div class="panel resultado">' +
                '<h2 class="panel__tit">Ronda terminada</h2>' +
                '<p class="resultado__big">' + buenos + '<small>/' + pares.length + '</small></p>' +
                '<p class="resultado__num">pares a la primera · ' + errores + (errores === 1 ? ' error' : ' errores') + ' en ' + intentos + ' intentos</p>' +
                (mal.length ? '<h3>Para repasar</h3><ul class="falladas">' + mal.map(function (p) {
                    return '<li><b>' + u.esc(p.farmaco) + '</b><br><span class="ok-txt">' + u.esc(p.texto) + '</span><br>' +
                        '<small class="origen">' + ETIQ[p.tipo] + ' · <a href="#/farmaco/' + p.tema + '">ver el tema</a> · ' + u.esc(p.origen) + '</small></li>';
                }).join('') + '</ul>' : '<p class="ok-txt">¡Todos a la primera!</p>') +
                '<div class="fila-botones"><button type="button" class="btn" data-otra>Otra ronda</button>' +
                (mal.length ? '<button type="button" class="btn btn--sec" data-fallo>Repetir sólo los que fallé (' + mal.length + ')</button>' : '') +
                '<button type="button" class="btn btn--sec" data-cambiar>Cambiar opciones</button></div></div>';
            el.querySelector('[data-otra]').addEventListener('click', function () { opc.otra(); });
            var bf = el.querySelector('[data-fallo]'); if (bf) bf.addEventListener('click', function () { opc.repetir(mal); });
            el.querySelector('[data-cambiar]').addEventListener('click', function () { opc.cambiar(); });
        }

        pintar();
        el.addEventListener('click', function (e) {
            var b = e.target.closest('.emp__item'); if (!b || b.disabled) return;
            if (b.dataset.i != null) elegir('i', +b.dataset.i); else elegir('d', +b.dataset.d);
        });

        /* arrastrar: de cualquier columna hacia un elemento de la otra */
        var origen = null;
        el.addEventListener('dragstart', function (e) {
            var b = e.target.closest('.emp__item'); if (!b || b.disabled) { e.preventDefault(); return; }
            origen = b.dataset.i != null ? { col: 'i', k: +b.dataset.i } : { col: 'd', k: +b.dataset.d };
            b.classList.add('emp__item--arrastrando');
            if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', origen.col + origen.k); } catch (x) { } }
        });
        el.addEventListener('dragend', function () { el.querySelectorAll('.emp__item--arrastrando,.emp__item--sobre').forEach(function (x) { x.classList.remove('emp__item--arrastrando', 'emp__item--sobre'); }); origen = null; });
        el.addEventListener('dragover', function (e) {
            var b = e.target.closest('.emp__item'); if (!b || !origen || b.disabled) return;
            var col = b.dataset.i != null ? 'i' : 'd'; if (col === origen.col) return;
            e.preventDefault(); b.classList.add('emp__item--sobre');
        });
        el.addEventListener('dragleave', function (e) { var b = e.target.closest('.emp__item'); if (b) b.classList.remove('emp__item--sobre'); });
        el.addEventListener('drop', function (e) {
            var b = e.target.closest('.emp__item'); if (!b || !origen) return;
            e.preventDefault(); b.classList.remove('emp__item--sobre');
            var col = b.dataset.i != null ? 'i' : 'd', k = col === 'i' ? +b.dataset.i : +b.dataset.d;
            if (col === origen.col || bloqueo) return;
            selI = col === 'i' ? k : origen.k; selD = col === 'd' ? k : origen.k;
            intentar(selI, selD);
        });
    }

    return {
        titulo: 'Emparejar',
        render: function () {
            return '<div class="pagina pagina--estrecha">' +
                '<header class="cabecera"><p class="eyebrow">Practicar</p><h1>Emparejar</h1>' +
                '<p class="lead">Une cada mecanismo, efecto adverso o grupo con su fármaco. Es la mejor forma de no confundir fármacos parecidos.</p></header>' +
                '<div data-barra></div><div data-zona></div></div>';
        },
        montar: function (el) {
            var zona = el.querySelector('[data-zona]'), barra = el.querySelector('[data-barra]');
            var ses = FA.datos.sesiones.filter(function (s) { return FA.pares.todos().mecanismo.concat(FA.pares.todos().efecto, FA.pares.todos().grupo).some(function (p) { return p.sesion === s.n; }); });
            var st = { tipo: 'mecanismo', ses: [], n: 5, solo: false };

            function ronda(lista) {
                barra.innerHTML = '<div class="barra-alcance"><span><small>Emparejando</small> <b>' + u.esc((TIPOS.filter(function (t) { return t.id === st.tipo; })[0] || {}).txt) + '</b></span>' +
                    '<button type="button" class="btn btn--sec btn--chico" data-cambiar>Cambiar opciones</button></div>';
                barra.querySelector('[data-cambiar]').addEventListener('click', config);
                var pares = lista || FA.pares.ronda(pool(st.tipo, st.ses, st.solo), st.n);
                if (!pares.length) return config();
                jugar(zona, pares, {
                    otra: function () { ronda(); }, cambiar: config,
                    repetir: function (mal) {
                        var base = mal.slice();
                        if (base.length < 3) pool(st.tipo, st.ses, false).forEach(function (p) { if (base.length < 3 && base.indexOf(p) < 0 && base.every(function (q) { return FA.pares.compatibles(p, q); })) base.push(p); });
                        ronda(base);
                    }
                });
            }

            function config() {
                barra.innerHTML = '';
                zona.innerHTML =
                    '<div class="panel alcance"><h2 class="panel__tit">¿Qué quieres emparejar?</h2>' +
                    '<div class="chips" data-tipos role="group" aria-label="Tipo">' + TIPOS.map(function (t) { return '<button type="button" class="chip" data-t="' + t.id + '" aria-pressed="' + (st.tipo === t.id) + '">' + t.txt + '</button>'; }).join('') + '</div>' +
                    '<p class="ayuda">Sesiones (si no eliges ninguna, entran todas)</p>' +
                    '<div class="chips chips--lista" data-ses>' + ses.map(function (s) { return '<button type="button" class="chip" data-s="' + s.n + '" aria-pressed="' + (st.ses.indexOf(s.n) >= 0) + '">Sesión ' + s.n + ' · ' + u.esc(s.tema) + '</button>'; }).join('') + '</div>' +
                    '<label class="campo"><span>Pares por ronda</span><select data-n>' + [4, 5, 6, 8].map(function (n) { return '<option' + (n === st.n ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>' +
                    '<label class="check"><input type="checkbox" data-solo' + (st.solo ? ' checked' : '') + '> Sólo los pares que fallé la última vez</label>' +
                    '<p class="alcance__cuenta" data-cuenta aria-live="polite"></p>' +
                    '<button type="button" class="btn" data-empezar>Empezar ' + u.icono('flecha') + '</button></div>';
                var cuenta = zona.querySelector('[data-cuenta]'), btn = zona.querySelector('[data-empezar]');
                function act() {
                    var p = pool(st.tipo, st.ses, st.solo), n = FA.pares.ronda(p, st.n).length;
                    cuenta.textContent = p.length + ' pares disponibles' + (n < Math.min(st.n, 2) ? ' · muy pocos para armar una ronda' : '');
                    btn.disabled = n < 2;
                }
                zona.querySelector('[data-tipos]').addEventListener('click', function (e) {
                    var b = e.target.closest('.chip'); if (!b) return; st.tipo = b.dataset.t;
                    zona.querySelectorAll('[data-tipos] .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); act();
                });
                zona.querySelector('[data-ses]').addEventListener('click', function (e) {
                    var b = e.target.closest('.chip'); if (!b) return; var n = +b.dataset.s, i = st.ses.indexOf(n);
                    if (i >= 0) st.ses.splice(i, 1); else st.ses.push(n); b.setAttribute('aria-pressed', i < 0); act();
                });
                zona.querySelector('[data-n]').addEventListener('change', function (e) { st.n = +e.target.value; act(); });
                zona.querySelector('[data-solo]').addEventListener('change', function (e) { st.solo = e.target.checked; act(); });
                btn.addEventListener('click', function () { ronda(); });
                act();
            }
            config();
        }
    };
})();
