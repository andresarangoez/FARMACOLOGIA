/* ============================================================
   VISTA · #/examen
   Todo lo que la docente marcó como posible pregunta de parcial,
   reunido por sesión y fármaco (viene de los ⭐ de los .md).
   ============================================================ */
FA.vistas.examen = {
    titulo: 'Datos de examen',
    render: function () {
        var u = FA.u, T = FA.datos.totales();
        return '<div class="pagina pagina--lectura">' +
            '<header class="cabecera"><p class="eyebrow">Para el parcial</p><h1>⭐ Datos de examen</h1>' +
            '<p class="lead">' + T.examen + ' puntos que la docente señaló en clase como posibles preguntas. Cada uno lleva al tema donde está explicado.</p>' +
            '<div class="fila-botones"><a class="btn" href="#/quiz">' + u.icono('quiz') + ' Probarme con un quiz</a></div></header>' +
            FA.datos.sesiones.map(function (s) {
                return '<section class="bloque-sesion"><div class="bloque-sesion__cab"><div><p class="eyebrow">Sesión ' + s.n + '</p><h2>' + u.esc(s.tema) + '</h2></div></div>' +
                    s.farmacos.filter(function (f) { return f.examen.length; }).map(function (f) {
                        return '<div class="ex-grupo"><h3><a href="#/farmaco/' + f.id + '">' + u.esc(f.nombre) + '</a></h3><ul class="ex-lista">' +
                            f.examen.map(function (x) {
                                return '<li class="' + (x.esSeccion ? 'ex--sec' : '') + '"><span class="ex__sec">' + u.inline(x.seccion) + '</span>' +
                                    '<p>' + x.html.replace(/^⭐\s*/, '') + '</p></li>';
                            }).join('') + '</ul></div>';
                    }).join('') + '</section>';
            }).join('') + '</div>';
    }
};
