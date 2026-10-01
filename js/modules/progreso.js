/* ============================================================
   VISTA · #/progreso
   Todo sale de lo realmente hecho (temas estudiados, tarjetas
   marcadas, preguntas respondidas); nada es decorativo.
   ============================================================ */
FA.vistas.progreso = {
    titulo: 'Mi progreso',
    render: function () {
        var u = FA.u, T = FA.datos.totales(), E = FA.estado.todo();
        var estudiados = FA.datos.farmacos.filter(function (f) { return FA.estado.estudiado(f.id); }).length;
        var sabe = FA.datos.cards(FA.datos.farmacos).filter(function (c) { return FA.estado.card(c.id) === 'sabe'; }).length;
        var resp = FA.datos.preguntas(FA.datos.farmacos).filter(function (q) { return FA.estado.pregunta(q.id); });
        var falladas = FA.estado.falladas().filter(function (id) { return FA.datos.preguntas(FA.datos.farmacos).some(function (q) { return q.id === id; }); }).length;

        var debiles = FA.datos.farmacos.map(function (f) {
            var fail = 0, ok = 0;
            f.quiz.forEach(function (q) { var r = FA.estado.pregunta(q.id); if (r) { fail += r.fail; ok += r.ok; } });
            return { f: f, fail: fail, ok: ok };
        }).filter(function (x) { return x.fail > 0; }).sort(function (a, b) {
            return (b.fail / (b.fail + b.ok)) - (a.fail / (a.fail + a.ok)) || b.fail - a.fail;
        }).slice(0, 5);

        function fecha(iso) { try { return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }); } catch (e) { return ''; } }

        return '<div class="pagina">' +
            '<header class="cabecera"><p class="eyebrow">Seguimiento</p><h1>Mi progreso</h1>' +
            '<p class="lead">Se guarda sólo en este navegador. Úsalo para enfocar el repaso en lo más débil.</p></header>' +
            '<dl class="cifras cifras--claro">' +
            '<div><dt>Temas estudiados</dt><dd>' + estudiados + '<small>/' + T.farmacos + '</small></dd></div>' +
            '<div><dt>Flashcards "La sé"</dt><dd>' + sabe + '<small>/' + T.cards + '</small></dd></div>' +
            '<div><dt>Preguntas respondidas</dt><dd>' + resp.length + '<small>/' + T.preguntas + '</small></dd></div>' +
            '<div><dt>Falladas por repasar</dt><dd>' + falladas + '</dd></div></dl>' +

            '<section class="seccion-inicio"><h2>Por sesión</h2><div class="lista-sesiones">' + FA.datos.sesiones.map(FA.c.tarjetaSesion).join('') + '</div></section>' +

            '<section class="seccion-inicio"><h2>Lo más débil</h2>' +
            (debiles.length ? '<ul class="debiles">' + debiles.map(function (x) {
                return '<li><a href="#/farmaco/' + x.f.id + '"><b>' + u.esc(x.f.nombre) + '</b></a><span>' + x.fail + ' errores · ' + x.ok + ' aciertos</span>' +
                    '<a class="btn btn--sec btn--chico" href="#/quiz/farmaco:' + x.f.id + '">Practicar</a></li>';
            }).join('') + '</ul>' : '<p class="ayuda">Aún no hay errores registrados. Haz un quiz y aquí aparecerán los temas a reforzar.</p>') +
            (falladas ? '<div class="fila-botones"><a class="btn" href="#/quiz/falladas">Repetir las ' + falladas + ' preguntas que fallé</a></div>' : '') + '</section>' +

            '<section class="seccion-inicio"><h2>Últimos quizzes</h2>' +
            (E.historial.length ? '<ul class="historial">' + E.historial.slice(0, 8).map(function (h) {
                var p = u.pct(h.ok, h.t);
                return '<li><span>' + fecha(h.f) + '</span><b>' + u.esc(h.e) + '</b><span class="historial__nota ' + (p >= 60 ? 'ok-txt' : 'mal-txt') + '">' + h.ok + '/' + h.t + ' · ' + p + '%</span></li>';
            }).join('') + '</ul>' : '<p class="ayuda">Todavía no has completado ningún quiz.</p>') + '</section>' +

            '<section class="seccion-inicio"><button type="button" class="btn btn--sec btn--chico" data-reiniciar>Borrar mi progreso</button></section></div>';
    },
    montar: function (el) {
        el.querySelector('[data-reiniciar]').addEventListener('click', function () {
            if (window.confirm('¿Borrar todo tu progreso en este navegador? Esta acción no se puede deshacer.')) {
                FA.estado.reiniciar(); FA.router.render();
            }
        });
    }
};
