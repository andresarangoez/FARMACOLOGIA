/* ============================================================
   COMPONENTE · alcance
   Selector de "qué quiero repasar" para flashcards y quiz:
   una o varias sesiones, un fármaco, o sólo lo pendiente.
   alcance = { sesiones: [n…], farmaco: id|null, solo: bool }
   ============================================================ */
FA.alcance = (function () {
    var u = FA.u;

    function desdeTexto(t) {
        var a = { sesiones: [], farmaco: null, solo: false };
        if (!t || t === 'todo') return a;
        if (t === 'falladas' || t === 'pendientes') { a.solo = true; return a; }
        var m = /^(sesion|sesiones|farmaco):(.+)$/.exec(t);
        if (m && m[1] === 'farmaco' && FA.datos.farmaco(m[2])) a.farmaco = m[2];
        else if (m && m[1] !== 'farmaco') a.sesiones = m[2].split(',').map(Number).filter(function (n) { return FA.datos.sesion(n); });
        return a;
    }

    function farmacos(a) {
        if (a.farmaco) return [FA.datos.farmaco(a.farmaco)];
        return FA.datos.farmacos.filter(function (f) { return !a.sesiones.length || a.sesiones.indexOf(f.sesion) >= 0; });
    }

    function etiqueta(a) {
        var t;
        if (a.farmaco) t = FA.datos.farmaco(a.farmaco).nombre;
        else if (a.sesiones.length) t = (a.sesiones.length > 1 ? 'Sesiones ' : 'Sesión ') + a.sesiones.join(' + ');
        else t = 'Todas las sesiones';
        return a.solo ? t + ' · pendientes' : t;
    }

    /* tipo: 'quiz' | 'cards' */
    function conjunto(a, tipo) {
        var f = farmacos(a);
        if (tipo === 'quiz') {
            var p = FA.datos.preguntas(f);
            return a.solo ? p.filter(function (q) { var r = FA.estado.pregunta(q.id); return r && r.ult === false; }) : p;
        }
        var c = FA.datos.cards(f);
        return a.solo ? c.filter(function (x) { return FA.estado.card(x.id) !== 'sabe'; }) : c;
    }

    function render(el, opc) {
        var tipo = opc.tipo, a = { sesiones: [], farmaco: null, solo: false };
        var esQuiz = tipo === 'quiz';
        var chips = FA.datos.sesiones.map(function (s) {
            return '<button type="button" class="chip" data-s="' + s.n + '" aria-pressed="false">Sesión ' + s.n + ' · ' + u.esc(s.tema) + '</button>';
        }).join('');
        var opts = FA.datos.sesiones.map(function (s) {
            return '<optgroup label="Sesión ' + s.n + ' · ' + u.esc(s.tema) + '">' +
                s.farmacos.map(function (f) { return '<option value="' + f.id + '">' + u.esc(f.nombre) + '</option>'; }).join('') + '</optgroup>';
        }).join('');

        el.innerHTML =
            '<div class="panel alcance">' +
            '<h2 class="panel__tit">¿Qué quieres repasar?</h2>' +
            '<p class="ayuda">Elige una o varias sesiones para mezclarlas, o un solo fármaco. Si no eliges nada, entran todas.</p>' +
            '<div class="chips" data-chips>' + chips + '</div>' +
            '<label class="campo"><span>O un solo fármaco / tema</span><select data-farmaco><option value="">Todos</option>' + opts + '</select></label>' +
            '<label class="check"><input type="checkbox" data-solo> ' +
            (esQuiz ? 'Sólo las preguntas que fallé la última vez' : 'Sólo las que aún no sé') + '</label>' +
            (esQuiz ? '<label class="campo"><span>Número de preguntas</span><select data-n><option value="5">5</option><option value="10" selected>10</option><option value="20">20</option><option value="0">Todas</option></select></label>' : '') +
            '<p class="alcance__cuenta" data-cuenta aria-live="polite"></p>' +
            '<button type="button" class="btn" data-empezar>' + (esQuiz ? 'Empezar quiz' : 'Empezar flashcards') + ' ' + u.icono('flecha') + '</button>' +
            '</div>';

        var sel = el.querySelector('[data-farmaco]');
        var solo = el.querySelector('[data-solo]');
        var cuenta = el.querySelector('[data-cuenta]');
        var btn = el.querySelector('[data-empezar]');
        var chipsEl = el.querySelector('[data-chips]');

        function actualizar() {
            chipsEl.classList.toggle('chips--off', !!a.farmaco);
            var n = conjunto(a, tipo).length;
            cuenta.textContent = n + (esQuiz ? (n === 1 ? ' pregunta disponible' : ' preguntas disponibles') : (n === 1 ? ' tarjeta disponible' : ' tarjetas disponibles')) + ' · ' + etiqueta(a);
            btn.disabled = n === 0;
        }
        chipsEl.addEventListener('click', function (e) {
            var b = e.target.closest('.chip'); if (!b) return;
            var n = +b.dataset.s, i = a.sesiones.indexOf(n);
            if (i >= 0) a.sesiones.splice(i, 1); else a.sesiones.push(n);
            a.sesiones.sort(function (x, y) { return x - y; });
            b.setAttribute('aria-pressed', i < 0);
            actualizar();
        });
        sel.addEventListener('change', function () { a.farmaco = sel.value || null; actualizar(); });
        solo.addEventListener('change', function () { a.solo = solo.checked; actualizar(); });
        btn.addEventListener('click', function () {
            var nSel = el.querySelector('[data-n]');
            opc.alEmpezar(a, nSel ? +nSel.value : 0);
        });
        actualizar();
    }

    return { desdeTexto: desdeTexto, farmacos: farmacos, etiqueta: etiqueta, conjunto: conjunto, render: render };
})();
