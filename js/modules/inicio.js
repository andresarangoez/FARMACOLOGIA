/* ============================================================
   VISTA · #/inicio
   ============================================================ */
FA.vistas.inicio = {
    titulo: '',
    render: function () {
        var u = FA.u, T = FA.datos.totales();
        var hechos = FA.datos.farmacos.filter(function (f) { return FA.estado.estudiado(f.id); }).length;
        var nums = FA.datos.sesiones.map(function (s) { return s.n; });
        var lista = nums.length > 1 ? nums.slice(0, -1).join(', ') + ' y ' + nums[nums.length - 1] : String(nums[0] || '');

        return '<section class="hero"><div class="hero__int">' +
            '<p class="eyebrow eyebrow--claro">Tutorías y material de estudio</p>' +
            '<h1>Farmacología</h1>' +
            '<p class="hero__lead">Cuidado crítico neo-pediátrico · Sesiones ' + u.esc(lista) + '. Lee, practica con flashcards, pruébate con quizzes y calcula dosis paso a paso.</p>' +
            '<div class="fila-botones">' +
            '<a class="btn btn--amarillo" href="#/estudio">' + u.icono('reloj') + ' Modo estudio</a>' +
            '<a class="btn btn--fantasma" href="#/sesiones">Ver sesiones</a>' +
            '<a class="btn btn--fantasma" href="#/quiz">Hacer un quiz</a>' +
            '</div>' +
            '<dl class="cifras">' +
            '<div><dt>Sesiones</dt><dd>' + T.sesiones + '</dd></div>' +
            '<div><dt>Fármacos y temas</dt><dd>' + T.farmacos + '</dd></div>' +
            '<div><dt>Preguntas</dt><dd>' + T.preguntas + '</dd></div>' +
            '<div><dt>Flashcards</dt><dd>' + T.cards + '</dd></div>' +
            '</dl></div></section>' +

            '<div class="pagina">' +
            '<section class="seccion-inicio"><h2>Busca un fármaco o tema</h2>' +
            '<label class="buscador">' + u.icono('buscar') + '<input type="search" data-buscar placeholder="Ej. isoniazida, quinolonas, neutropenia…" aria-label="Buscar fármaco o tema" autocomplete="off"></label>' +
            '<div class="rejilla" data-resultados></div></section>' +

            '<section class="seccion-inicio" data-sesiones><div class="seccion-inicio__cab"><h2>Sesiones</h2>' +
            '<span class="ayuda">' + hechos + ' de ' + T.farmacos + ' temas estudiados</span></div>' +
            '<div class="lista-sesiones">' + FA.datos.sesiones.map(FA.c.tarjetaSesion).join('') + '</div>' +
            '<p class="ayuda">Aquí se irán sumando nuevas sesiones para complementar el material.</p></section>' +

            '<section class="seccion-inicio"><h2>Herramientas</h2><div class="herramientas">' +
            '<a class="herr" href="#/estudio">' + u.icono('reloj') + '<b>Modo estudio</b><span>¿Cuánto tiempo tienes hoy? Sesión con temporizador (pomodoro).</span></a>' +
            '<a class="herr" href="#/flashcards">' + u.icono('tarjeta') + '<b>Flashcards</b><span>Voltea tarjetas y marca lo que ya sabes.</span></a>' +
            '<a class="herr" href="#/quiz">' + u.icono('quiz') + '<b>Quiz</b><span>Por fármaco, por sesión o mezclando varias.</span></a>' +
            '<a class="herr" href="#/calculadora">' + u.icono('calc') + '<b>Calculadora</b><span>' + FA.formulas.lista.length + ' fórmulas con el procedimiento paso a paso.</span></a>' +
            '<a class="herr herr--ex" href="#/examen">' + u.icono('estrella') + '<b>Datos de examen</b><span>' + T.examen + ' puntos que la docente marcó para el parcial.</span></a>' +
            '</div></section></div>';
    },
    montar: function (el) {
        var u = FA.u, inp = el.querySelector('[data-buscar]'), res = el.querySelector('[data-resultados]'), ses = el.querySelector('[data-sesiones]');
        function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
        inp.addEventListener('input', function () {
            var q = norm(inp.value.trim());
            if (!q) { res.innerHTML = ''; return; }
            var r = FA.datos.farmacos.filter(function (f) {
                return norm([f.nombre, f.grupo, f.tema, f.tags.join(' ')].join(' ')).indexOf(q) >= 0;
            });
            res.innerHTML = r.length ? r.map(FA.c.tarjetaFarmaco).join('') :
                '<p class="ayuda">Sin resultados para «' + u.esc(inp.value) + '».</p>';
        });
    }
};
