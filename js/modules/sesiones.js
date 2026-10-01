/* ============================================================
   VISTAS · #/sesiones y #/sesion/<n>
   También define FA.c: piezas de interfaz que reutilizan otras vistas.
   ============================================================ */
FA.c = (function () {
    var u = FA.u;

    function barra(pct, etiqueta) {
        return '<div class="barra-prog" role="progressbar" aria-label="' + u.esc(etiqueta || 'Progreso') + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div>';
    }

    function progresoSesion(s) {
        var hechos = s.farmacos.filter(function (f) { return FA.estado.estudiado(f.id); }).length;
        return { hechos: hechos, total: s.farmacos.length, pct: u.pct(hechos, s.farmacos.length) };
    }

    function tarjetaFarmaco(f) {
        var est = FA.estado.estudiado(f.id);
        return '<a class="tarjeta-f" href="#/farmaco/' + f.id + '">' +
            '<span class="tarjeta-f__top"><span class="chip chip--fijo">Sesión ' + f.sesion + '</span>' +
            (est ? '<span class="estado estado--ok">' + u.icono('check') + ' Estudiado</span>' : '<span class="estado">Pendiente</span>') + '</span>' +
            '<b class="tarjeta-f__nom">' + u.esc(f.nombre) + '</b>' +
            '<span class="tarjeta-f__grupo">' + u.esc(f.grupo) + '</span>' +
            '<span class="tarjeta-f__meta">' +
            (f.examen.length ? '<span title="Datos de examen">' + '⭐ ' + f.examen.length + '</span>' : '') +
            '<span>' + f.cards.length + ' flashcards</span><span>' + f.quiz.length + ' preguntas</span></span>' +
            '</a>';
    }

    function tarjetaSesion(s) {
        var p = progresoSesion(s);
        return '<a class="tarjeta-s" href="#/sesion/' + s.n + '">' +
            '<span class="tarjeta-s__n">' + s.n + '</span>' +
            '<span class="tarjeta-s__txt"><small>Sesión</small><b>' + u.esc(s.tema) + '</b>' +
            '<span class="tarjeta-s__lista">' + s.farmacos.map(function (f) { return u.esc(f.nombre.replace(/\s*\(.*$/, '')); }).join(' · ') + '</span></span>' +
            '<span class="tarjeta-s__prog">' + barra(p.pct, 'Progreso de la sesión ' + s.n) + '<small>' + p.hechos + ' de ' + p.total + ' temas estudiados</small></span>' +
            '</a>';
    }

    return { barra: barra, progresoSesion: progresoSesion, tarjetaFarmaco: tarjetaFarmaco, tarjetaSesion: tarjetaSesion };
})();

FA.vistas.sesiones = {
    titulo: 'Sesiones',
    render: function () {
        return '<div class="pagina">' +
            '<header class="cabecera"><p class="eyebrow">Material de estudio</p><h1>Sesiones</h1>' +
            '<p class="lead">Cada sesión reúne sus fármacos y temas. Entra a uno para leerlo, practicar con flashcards y probarte con un quiz.</p></header>' +
            FA.datos.sesiones.map(function (s) {
                var p = FA.c.progresoSesion(s);
                return '<section class="bloque-sesion">' +
                    '<div class="bloque-sesion__cab"><div><p class="eyebrow">Sesión ' + s.n + '</p><h2><a href="#/sesion/' + s.n + '">' + FA.u.esc(s.tema) + '</a></h2></div>' +
                    '<div class="bloque-sesion__prog">' + FA.c.barra(p.pct, 'Progreso de la sesión ' + s.n) + '<small>' + p.hechos + '/' + p.total + ' estudiados</small></div></div>' +
                    '<div class="rejilla">' + s.farmacos.map(FA.c.tarjetaFarmaco).join('') + '</div></section>';
            }).join('') + '</div>';
    }
};

FA.vistas.sesion = {
    titulo: function (p) { var s = FA.datos.sesion(p.n); return s ? 'Sesión ' + s.n : 'Sesión'; },
    render: function (p) {
        var u = FA.u, s = FA.datos.sesion(p.n);
        if (!s) return '<div class="vacio"><b>Esa sesión no existe</b><p><a href="#/sesiones">Ver todas las sesiones</a></p></div>';
        var pr = FA.c.progresoSesion(s);
        var nq = FA.datos.preguntas(s.farmacos).length, nc = FA.datos.cards(s.farmacos).length;
        var ex = s.farmacos.reduce(function (a, f) { return a + f.examen.length; }, 0);
        return '<div class="pagina">' +
            '<nav class="migas" aria-label="Ruta"><a href="#/sesiones">Sesiones</a><span>/</span><b>Sesión ' + s.n + '</b></nav>' +
            '<header class="cabecera"><p class="eyebrow">Sesión ' + s.n + '</p><h1>' + u.esc(s.tema) + '</h1>' +
            '<div class="cabecera__prog">' + FA.c.barra(pr.pct, 'Progreso') + '<small>' + pr.hechos + ' de ' + pr.total + ' temas estudiados · ' + ex + ' datos de examen</small></div>' +
            '<div class="fila-botones">' +
            '<a class="btn" href="#/flashcards/sesion:' + s.n + '">' + u.icono('tarjeta') + ' Flashcards de la sesión (' + nc + ')</a>' +
            '<a class="btn btn--sec" href="#/quiz/sesion:' + s.n + '">' + u.icono('quiz') + ' Quiz de la sesión (' + nq + ')</a>' +
            '</div></header>' +
            '<div class="rejilla">' + s.farmacos.map(FA.c.tarjetaFarmaco).join('') + '</div></div>';
    }
};
