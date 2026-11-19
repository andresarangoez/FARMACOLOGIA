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

        return '<section class="hero">' +
            '<div class="hero__fondo" aria-hidden="true"><i class="hero__brillo b1"></i><i class="hero__brillo b2"></i><i class="hero__brillo b3"></i>' +
            '<svg class="hero__olas" viewBox="0 0 1440 320" preserveAspectRatio="none"><defs>' +
            '<linearGradient id="ola-a" x1="0" x2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".5"/><stop offset=".35" stop-color="#a78bfa" stop-opacity=".45"/><stop offset=".65" stop-color="#FBD785" stop-opacity=".4"/><stop offset="1" stop-color="#38bdf8" stop-opacity=".5"/></linearGradient>' +
            '<linearGradient id="ola-b" x1="1" x2="0"><stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset=".5" stop-color="#818cf8" stop-opacity=".35"/><stop offset="1" stop-color="#22d3ee" stop-opacity=".35"/></linearGradient></defs>' +
            '<g class="ola o1"><path fill="url(#ola-a)" d="M0 200C240 140 480 140 720 200S1200 260 1440 200V320H0Z"/><path fill="url(#ola-a)" transform="translate(1440 0)" d="M0 200C240 140 480 140 720 200S1200 260 1440 200V320H0Z"/></g>' +
            '<g class="ola o2"><path fill="url(#ola-b)" d="M0 240C240 200 480 280 720 240S1200 200 1440 240V320H0Z"/><path fill="url(#ola-b)" transform="translate(1440 0)" d="M0 240C240 200 480 280 720 240S1200 200 1440 240V320H0Z"/></g>' +
            '</svg></div>' +
            '<div class="hero__int">' +
            '<div class="hero__fila"><div class="hero__txt">' +
            '<p class="eyebrow eyebrow--claro">Material de estudio de cuidado neopediátrico</p>' +
            '<h1>Farmacología</h1>' +
            '<p class="hero__lead">Lee, practica con flashcards, pruébate con quizzes y calcula dosis paso a paso.</p>' +
            '<div class="fila-botones">' +
            '<a class="btn btn--amarillo" href="#/sesiones">Ver sesiones</a>' +
            '<a class="btn btn--fantasma" href="#/quiz">Hacer un quiz</a>' +
            '</div></div>' +
            '<span class="hero__halo"><img class="hero__logo" src="assets/branding/logo-soy-andres-arango-circulo-blanco.svg" alt="Logo Soy Andrés Arango" width="260" height="260"></span>' +
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
            '<a class="herr" href="#/flashcards">' + u.icono('tarjeta') + '<b>Flashcards</b><span>Voltea tarjetas y marca lo que ya sabes.</span></a>' +
            '<a class="herr" href="#/emparejar">' + u.icono('tarjeta') + '<b>Emparejar</b><span>Une cada mecanismo, efecto o grupo con su fármaco.</span></a>' +
            '<a class="herr" href="#/farmacos">' + u.icono('tarjeta') + '<b>Listado de fármacos</b><span>Índice A-Z con dibujos de las presentaciones en Colombia.</span></a>' +
            '<a class="herr" href="#/comparar">' + u.icono('tarjeta') + '<b>Comparar fármacos</b><span>Grupo, mecanismo y efectos adversos en una tabla.</span></a>' +
            '<a class="herr" href="#/distractores">' + u.icono('quiz') + '<b>¿A qué fármaco pertenece?</b><span>Elige el fármaco entre 4 parecidos y ve qué hace cada opción.</span></a>' +
            '<a class="herr" href="#/quiz">' + u.icono('quiz') + '<b>Quiz</b><span>Por fármaco, por sesión o mezclando varias.</span></a>' +
            '<a class="herr" href="#/calculadora">' + u.icono('calc') + '<b>Calculadora</b><span>' + FA.formulas.lista.length + ' fórmulas con el procedimiento paso a paso.</span></a>' +
            '</div></section></div>';
    },
    montar: function (el) {
        var u = FA.u, inp = el.querySelector('[data-buscar]'), res = el.querySelector('[data-resultados]');
        /* usa el buscador global: busca en todo el texto y tolera variantes de escritura */
        inp.addEventListener('input', function () {
            var q = inp.value.trim();
            if (!q) { res.innerHTML = ''; return; }
            var r = FA.buscar.buscar(q, {});
            res.innerHTML = r.length
                ? r.slice(0, 6).map(function (x) { return FA.c.tarjetaFarmaco(x.f); }).join('') +
                  '<p class="ayuda" style="grid-column:1/-1"><a href="#/buscar?q=' + encodeURIComponent(q) + '">Ver los ' + r.length + ' resultados con el texto donde aparece →</a></p>'
                : '<p class="ayuda">Sin resultados para «' + u.esc(inp.value) + '». <a href="#/buscar">Probar con filtros</a></p>';
        });
        inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && inp.value.trim()) FA.router.ir('#/buscar?q=' + encodeURIComponent(inp.value.trim()));
        });
    }
};
