/* ============================================================
   COMPONENTE · quiz
   Opción múltiple y verdadero/falso. Las opciones se mezclan en
   cada intento. Retroalimentación inmediata, puntaje final y
   repaso de lo fallado. Cada respuesta alimenta el progreso.
   ============================================================ */
FA.quiz = (function () {
    var u = FA.u, LETRAS = ['a', 'b', 'c', 'd', 'e'];

    function preparar(q) {
        if (q.tipo === 'vf') {
            return { q: q, opciones: [{ txt: 'Verdadero', ok: q.correcta === 'Verdadero' }, { txt: 'Falso', ok: q.correcta === 'Falso' }] };
        }
        return { q: q, opciones: u.mezclar(q.opciones) };
    }

    function montar(el, banco, opc) {
        var items, i, aciertos, falladas, respondida;

        function iniciar(lista) {
            items = lista.map(preparar); i = 0; aciertos = 0; falladas = []; respondida = false;
            pintar();
        }

        function pintar() {
            if (i >= items.length) return fin();
            var it = items[i], q = it.q, f = FA.datos.farmaco(q.farmaco);
            el.innerHTML =
                '<div class="quiz">' +
                '<div class="fc__top"><span>Pregunta <b>' + (i + 1) + '</b> de ' + items.length + '</span>' +
                '<span class="chip chip--fijo">' + u.esc(f ? f.nombre : '') + '</span></div>' +
                '<div class="barra-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + items.length + '" aria-valuenow="' + i + '"><i style="width:' + u.pct(i, items.length) + '%"></i></div>' +
                '<div class="panel">' +
                '<p class="quiz__tipo">' + (q.tipo === 'vf' ? 'Verdadero o falso' : 'Opción múltiple') + '</p>' +
                '<h2 class="quiz__texto">' + u.inline(q.texto) + '</h2>' +
                '<div class="opciones" role="group" aria-label="Opciones">' +
                it.opciones.map(function (o, k) {
                    return '<button type="button" class="op" data-k="' + k + '"><b>' + (q.tipo === 'vf' ? (k ? 'F' : 'V') : LETRAS[k]) + '</b><span>' + u.inline(o.txt) + '</span></button>';
                }).join('') +
                '</div>' +
                '<div class="feedback" data-fb hidden></div>' +
                '<div class="fila-botones"><button type="button" class="btn" data-sig hidden>' + (i + 1 === items.length ? 'Ver resultado' : 'Siguiente') + ' ' + u.icono('flecha') + '</button></div>' +
                '</div></div>';
            respondida = false;
        }

        function responder(k) {
            if (respondida) return;
            respondida = true;
            var it = items[i], o = it.opciones[k], ok = !!o.ok, q = it.q;
            FA.estado.resultado(q.id, ok);
            if (ok) aciertos++; else falladas.push(it);

            el.querySelectorAll('.op').forEach(function (b, j) {
                b.disabled = true;
                if (it.opciones[j].ok) b.classList.add('op--ok');
                else if (j === k) b.classList.add('op--mal');
            });
            var correcta = it.opciones.filter(function (x) { return x.ok; })[0];
            var fb = el.querySelector('[data-fb]');
            fb.className = 'feedback ' + (ok ? 'feedback--ok' : 'feedback--mal');
            fb.hidden = false;
            fb.innerHTML = '<b>' + (ok ? '¡Correcto!' : 'Incorrecto.') + '</b> ' +
                (ok ? '' : 'La respuesta es: ' + u.inline(correcta.txt) + (q.explicacion ? ' — ' : '. ')) +
                (q.explicacion ? '<span>' + u.inline(q.explicacion.charAt(0).toUpperCase() + q.explicacion.slice(1)) + (/[.!?]$/.test(q.explicacion) ? '' : '.') + '</span> ' : '') +
                '<a href="#/farmaco/' + q.farmaco + '">Repasar ' + u.esc(FA.datos.farmaco(q.farmaco).nombre) + '</a>';
            var s = el.querySelector('[data-sig]');
            s.hidden = false; s.focus();
        }

        function fin() {
            var tot = items.length, p = u.pct(aciertos, tot);
            FA.estado.fin(opc.etiqueta, aciertos, tot);
            var msg = p >= 85 ? 'Excelente dominio.' : p >= 60 ? 'Buen avance; refuerza lo que fallaste.' : 'Vale la pena repasar el contenido y volver a intentarlo.';
            el.innerHTML =
                '<div class="panel resultado">' +
                '<h2 class="panel__tit">Resultado</h2>' +
                '<p class="resultado__big">' + aciertos + '<small>/' + tot + '</small></p>' +
                '<p class="resultado__num"><b>' + p + '%</b> · ' + msg + '</p>' +
                (falladas.length ?
                    '<h3>Para repasar</h3><ul class="falladas">' + falladas.map(function (it) {
                        var c = it.opciones.filter(function (x) { return x.ok; })[0];
                        return '<li><b>' + u.inline(it.q.texto) + '</b><br><span class="ok-txt">Correcta: ' + u.inline(c.txt) + '</span> · <a href="#/farmaco/' + it.q.farmaco + '">' + u.esc(FA.datos.farmaco(it.q.farmaco).nombre) + '</a></li>';
                    }).join('') + '</ul>' : '') +
                '<div class="fila-botones">' +
                '<button type="button" class="btn" data-otra>Otro intento</button>' +
                (falladas.length ? '<button type="button" class="btn btn--sec" data-fallo>Repetir sólo las falladas (' + falladas.length + ')</button>' : '') +
                '<button type="button" class="btn btn--sec" data-cambiar>Cambiar alcance</button>' +
                '</div></div>';
        }

        el.addEventListener('click', function (e) {
            var b = e.target.closest('button'); if (!b) return;
            if (b.classList.contains('op')) responder(+b.dataset.k);
            else if (b.hasAttribute('data-sig')) { i++; pintar(); }
            else if (b.hasAttribute('data-otra')) iniciar(opc.nuevoLote());
            else if (b.hasAttribute('data-fallo')) iniciar(u.mezclar(falladas.map(function (it) { return it.q; })));
            else if (b.hasAttribute('data-cambiar')) opc.alCambiar();
        });

        function teclas(e) {
            if (!el.isConnected) { document.removeEventListener('keydown', teclas); return; }
            if (!items || i >= items.length) return;
            var k = LETRAS.indexOf(e.key.toLowerCase());
            if (k < 0 && /^[1-4]$/.test(e.key)) k = +e.key - 1;
            if (!respondida && k >= 0 && k < items[i].opciones.length) responder(k);   // Enter avanza: el botón "Siguiente" ya tiene el foco
        }
        document.addEventListener('keydown', teclas);

        iniciar(banco);
    }

    return { montar: montar };
})();
