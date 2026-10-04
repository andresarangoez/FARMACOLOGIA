/* ============================================================
   VISTAS · #/flashcards y #/quiz
   Sin alcance en la ruta → muestra el selector.
   Con alcance (todo | sesion:7 | farmaco:id | falladas) → arranca directo.
   ============================================================ */
(function () {
    var u = FA.u;

    function cabecera(titulo, lead) {
        return '<header class="cabecera"><p class="eyebrow">Practicar</p><h1>' + titulo + '</h1><p class="lead">' + lead + '</p></header>';
    }

    function barraAlcance(a, ruta) {
        return '<div class="barra-alcance"><span><small>Repasando</small> <b>' + u.esc(FA.alcance.etiqueta(a)) + '</b></span>' +
            '<a class="btn btn--sec btn--chico" href="#/' + ruta + '" data-cambiar-alcance>Cambiar alcance</a></div>';
    }

    /* ── Flashcards ── */
    FA.vistas.flashcards = {
        titulo: 'Flashcards',
        render: function (p) {
            return '<div class="pagina pagina--estrecha">' + cabecera('Flashcards', 'Lee la pregunta, piensa la respuesta y voltea la tarjeta. Marca lo que ya sabes y repite sólo lo que te falta.') +
                '<div data-barra></div><div data-zona></div></div>';
        },
        montar: function (el, p) {
            var zona = el.querySelector('[data-zona]'), barra = el.querySelector('[data-barra]');
            function selector() {
                barra.innerHTML = '';
                FA.alcance.render(zona, { tipo: 'cards', alEmpezar: function (a) { empezar(a); } });
            }
            function empezar(a) {
                var cartas = FA.alcance.conjunto(a, 'cards');
                if (!cartas.length) return selector();
                barra.innerHTML = barraAlcance(a, 'flashcards');
                barra.querySelector('[data-cambiar-alcance]').addEventListener('click', function (e) { e.preventDefault(); selector(); });
                FA.flashcards.montar(zona, cartas, { alCambiar: selector });
            }
            if (p.alcance) empezar(FA.alcance.desdeTexto(p.alcance)); else selector();
        }
    };

    /* ── Quiz ── */
    FA.vistas.quiz = {
        titulo: 'Quiz',
        render: function () {
            return '<div class="pagina pagina--estrecha">' + cabecera('Quiz', 'Opción múltiple y verdadero/falso. Puedes hacer un quiz por fármaco, por sesión completa o mezclando varias sesiones.') +
                '<div class="fila-botones fila-botones--suelta"><a class="btn btn--sec" href="#/emparejar">' + u.icono('tarjeta') + ' Emparejar mecanismos, efectos y fármacos</a> <a class="btn btn--sec" href="#/distractores">' + u.icono('quiz') + ' ¿A qué fármaco pertenece?</a></div>' +
                '<div data-barra></div><div data-zona></div></div>';
        },
        montar: function (el, p) {
            var zona = el.querySelector('[data-zona]'), barra = el.querySelector('[data-barra]');
            function selector() {
                barra.innerHTML = '';
                FA.alcance.render(zona, { tipo: 'quiz', alEmpezar: function (a, n) { empezar(a, n); } });
            }
            function empezar(a, n) {
                var todas = FA.alcance.conjunto(a, 'quiz');
                if (!todas.length) return selector();
                var cuantas = n > 0 ? n : (p.alcance ? 10 : 0);
                function lote() { var m = u.mezclar(todas); return cuantas > 0 ? m.slice(0, cuantas) : m; }
                barra.innerHTML = barraAlcance(a, 'quiz');
                barra.querySelector('[data-cambiar-alcance]').addEventListener('click', function (e) { e.preventDefault(); selector(); });
                FA.quiz.montar(zona, lote(), { etiqueta: FA.alcance.etiqueta(a), nuevoLote: lote, alCambiar: selector });
            }
            if (p.alcance) empezar(FA.alcance.desdeTexto(p.alcance), 0); else selector();
        }
    };
})();
