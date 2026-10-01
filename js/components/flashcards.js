/* ============================================================
   COMPONENTE · flashcards
   Muestra la pregunta, se voltea para ver la respuesta, y cada
   tarjeta se marca "La sé" / "Repasar" (se guarda en el progreso).
   Atajos: Espacio voltear · ← → mover · 1 repasar · 2 la sé
   ============================================================ */
FA.flashcards = (function () {
    var u = FA.u;

    function montar(el, cartas, opc) {
        var mazo = u.mezclar(cartas), i = 0, volteada = false, sabe = 0, repasar = 0;

        function nombre(id) { var f = FA.datos.farmaco(id); return f ? f.nombre : ''; }

        function pintar() {
            if (i >= mazo.length) return fin();
            var c = mazo[i], est = FA.estado.card(c.id);
            el.innerHTML =
                '<div class="fc">' +
                '<div class="fc__top"><span>Tarjeta <b>' + (i + 1) + '</b> de ' + mazo.length + '</span>' +
                '<span class="chip chip--fijo">' + u.esc(nombre(c.farmaco)) + '</span></div>' +
                '<div class="barra-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + mazo.length + '" aria-valuenow="' + i + '"><i style="width:' + u.pct(i, mazo.length) + '%"></i></div>' +
                '<button type="button" class="fc__carta' + (volteada ? ' fc__carta--resp' : '') + '" data-voltear aria-live="polite">' +
                '<span class="fc__lado">' + (volteada ? 'Respuesta' : 'Pregunta') + '</span>' +
                '<span class="fc__txt">' + u.inline(volteada ? c.a : c.q) + '</span>' +
                '<span class="fc__pista">' + (volteada ? 'Toca para volver a la pregunta' : 'Toca para ver la respuesta') + '</span>' +
                '</button>' +
                '<div class="fc__acciones">' +
                '<button type="button" class="btn btn--sec" data-ant ' + (i === 0 ? 'disabled' : '') + '>' + u.icono('atras') + ' Anterior</button>' +
                '<button type="button" class="btn btn--rep' + (est === 'repasar' ? ' btn--on' : '') + '" data-marca="repasar">Repasar</button>' +
                '<button type="button" class="btn btn--sabe' + (est === 'sabe' ? ' btn--on' : '') + '" data-marca="sabe">' + u.icono('check') + ' La sé</button>' +
                '<button type="button" class="btn btn--sec" data-sig>Siguiente ' + u.icono('flecha') + '</button>' +
                '</div>' +
                '<p class="ayuda ayuda--centro">Atajos: Espacio voltear · ← → mover · 1 repasar · 2 la sé</p>' +
                '</div>';
        }

        function fin() {
            var tot = mazo.length;
            var s = mazo.filter(function (c) { return FA.estado.card(c.id) === 'sabe'; }).length;
            var r = mazo.filter(function (c) { return FA.estado.card(c.id) === 'repasar'; }).length;
            el.innerHTML =
                '<div class="panel resultado">' +
                '<h2 class="panel__tit">¡Terminaste el mazo!</h2>' +
                '<p class="resultado__num"><b>' + s + '</b> de ' + tot + ' marcadas como "La sé"</p>' +
                '<p class="ayuda">' + r + ' para repasar · ' + (tot - s - r) + ' sin marcar</p>' +
                '<div class="fila-botones">' +
                '<button type="button" class="btn" data-otra>Mezclar y repetir</button>' +
                (r ? '<button type="button" class="btn btn--sec" data-solo-rep>Sólo las que debo repasar (' + r + ')</button>' : '') +
                '<button type="button" class="btn btn--sec" data-cambiar>Cambiar alcance</button>' +
                '</div></div>';
        }

        function avanzar(d) {
            var n = i + d;
            if (n < 0) return;
            i = n; volteada = false; pintar();
        }

        function marcar(v) {
            var c = mazo[i]; if (!c) return;
            FA.estado.marcarCard(c.id, FA.estado.card(c.id) === v ? null : v);
            if (FA.estado.card(c.id)) avanzar(1); else pintar();
        }

        el.addEventListener('click', function (e) {
            var b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-voltear')) { volteada = !volteada; pintar(); var n = el.querySelector('[data-voltear]'); if (n) n.focus(); }
            else if (b.hasAttribute('data-sig')) avanzar(1);
            else if (b.hasAttribute('data-ant')) avanzar(-1);
            else if (b.dataset.marca) marcar(b.dataset.marca);
            else if (b.hasAttribute('data-otra')) { mazo = u.mezclar(cartas); i = 0; volteada = false; pintar(); }
            else if (b.hasAttribute('data-solo-rep')) {
                mazo = u.mezclar(mazo.filter(function (c) { return FA.estado.card(c.id) === 'repasar'; }));
                i = 0; volteada = false; pintar();
            }
            else if (b.hasAttribute('data-cambiar')) opc.alCambiar();
        });

        function teclas(e) {
            if (!el.isConnected) { document.removeEventListener('keydown', teclas); return; }
            if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || i >= mazo.length) return;
            if (e.key === ' ') {
                if (e.target.tagName === 'BUTTON') return;   // un botón enfocado ya reacciona al espacio
                e.preventDefault(); volteada = !volteada; pintar();
            }
            else if (e.key === 'ArrowRight') avanzar(1);
            else if (e.key === 'ArrowLeft') avanzar(-1);
            else if (e.key === '1') marcar('repasar');
            else if (e.key === '2') marcar('sabe');
        }
        document.addEventListener('keydown', teclas);

        pintar();
    }

    return { montar: montar };
})();
