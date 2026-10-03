/* ============================================================
   VISTA · #/examen/<id>  ·  Recurso de examen con página propia
   (taller resuelto, simulacro…). Se agrega con un .md en content/examen/.
   ============================================================ */
FA.vistas.recurso = {
    titulo: function (p) { var r = FA.datos.extra(p.id); return r ? r.nombre : 'Recurso'; },
    render: function (p) {
        var u = FA.u, r = FA.datos.extra(p.id);
        if (!r) return '<div class="vacio"><b>No encontré ese recurso</b><p><a href="#/examen">Volver a Datos de examen</a></p></div>';
        var preguntas = r.secciones.filter(function (s) { return /^pregunta\s+\d+/i.test(s.titulo); });
        return '<div class="pagina pagina--lectura">' +
            '<nav class="migas" aria-label="Ruta"><a href="#/examen">Datos de examen</a><span>/</span><b>' + u.esc(r.nombre) + '</b></nav>' +
            '<header class="cabecera"><p class="eyebrow">Datos de examen · ' + u.esc(r.tipo) + '</p><h1>' + u.esc(r.nombre) + '</h1>' +
            (r.descripcion ? '<p class="lead">' + u.esc(r.descripcion) + '</p>' : '') +
            '<div class="fila-botones"><button type="button" class="btn btn--sec" data-imprimir>Imprimir o guardar en PDF</button></div></header>' +
            (preguntas.length ? '<nav class="indice" aria-label="Preguntas"><b>Ir a</b>' + preguntas.map(function (s) {
                var n = /^pregunta\s+(\d+)/i.exec(s.titulo)[1];
                return '<a href="#" data-ir="' + s.id + '" title="' + u.esc(s.titulo) + '">P' + n + '</a>';
            }).join('') + '</nav>' : '') +
            '<article class="contenido">' + r.secciones.map(function (s) {
                return '<section class="seccion" data-sec="' + s.id + '">' + s.html + '</section>';
            }).join('') + '</article>' +
            '<nav class="paginado"><a href="#/examen">' + u.icono('atras') + '<span><small>Volver</small>Datos de examen</span></a><span></span></nav></div>';
    },
    montar: function (el) {
        el.querySelectorAll('[data-ir]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                var s = el.querySelector('[data-sec="' + a.dataset.ir + '"]');
                if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
        var b = el.querySelector('[data-imprimir]');
        if (b) b.addEventListener('click', function () { window.print(); });
    }
};
