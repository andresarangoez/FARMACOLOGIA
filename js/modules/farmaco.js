/* ============================================================
   VISTA · #/farmaco/<id>
   Lectura del tema con el dato de examen destacado, atajos a
   flashcards y quiz del tema, y marca de "estudiado".
   ============================================================ */
FA.vistas.farmaco = {
    titulo: function (p) { var f = FA.datos.farmaco(p.id); return f ? f.nombre : 'Tema'; },
    render: function (p) {
        var u = FA.u, f = FA.datos.farmaco(p.id);
        if (!f) return '<div class="vacio"><b>No encontré ese tema</b><p><a href="#/sesiones">Ver las sesiones</a></p></div>';
        var est = FA.estado.estudiado(f.id);
        var prev = FA.datos.siguiente(f.id, -1), next = FA.datos.siguiente(f.id, 1);
        var DIF = { baja: 'Dificultad baja', media: 'Dificultad media', alta: 'Dificultad alta' };

        return '<div class="pagina pagina--lectura">' +
            '<nav class="migas" aria-label="Ruta"><a href="#/sesiones">Sesiones</a><span>/</span><a href="#/sesion/' + f.sesion + '">Sesión ' + f.sesion + '</a><span>/</span><b>' + u.esc(f.nombre) + '</b></nav>' +
            '<header class="cabecera">' +
            '<p class="eyebrow">Sesión ' + f.sesion + ' · ' + u.esc(f.tema) + '</p>' +
            '<h1>' + u.esc(f.nombre) + '</h1>' +
            '<div class="meta">' +
            (f.grupo ? '<span><small>Grupo farmacológico</small><a class="enlace-filtro" href="#/buscar?g=' + encodeURIComponent(f.grupo) + '" title="Ver otros temas de este grupo">' + u.esc(f.grupo) + '</a></span>' : '') +
            (f.linea ? '<span><small>Línea celular</small>' + u.esc(f.linea) + '</span>' : '') +
            (f.mecanismo ? '<span><small>Mecanismo en una línea</small>' + u.esc(f.mecanismo) + '</span>' : '') +
            '</div>' +
            '<div class="etiquetas">' +
            (f.dificultad ? '<span class="chip chip--fijo">' + u.esc(DIF[f.dificultad] || f.dificultad) + '</span>' : '') +
            f.tags.map(function (t) { return '<a class="chip" href="#/buscar?t=' + encodeURIComponent(t) + '" title="Ver temas con esta etiqueta">#' + u.esc(t) + '</a>'; }).join('') +
            '</div>' +
            '<div class="fila-botones">' +
            '<button type="button" class="btn ' + (est ? 'btn--sabe btn--on' : 'btn--sec') + '" data-estudiado aria-pressed="' + est + '">' + u.icono('check') + ' <span>' + (est ? 'Estudiado' : 'Marcar como estudiado') + '</span></button>' +
            (f.cards.length ? '<a class="btn btn--sec" href="#/flashcards/farmaco:' + f.id + '">' + u.icono('tarjeta') + ' Flashcards (' + f.cards.length + ')</a>' : '') +
            (f.quiz.length ? '<a class="btn btn--sec" href="#/quiz/farmaco:' + f.id + '">' + u.icono('quiz') + ' Quiz (' + f.quiz.length + ')</a>' : '') +
            '<button type="button" class="btn btn--sec" data-imprimir>Imprimir este tema</button>' +
            '</div></header>' +
            (f.secciones.length > 2 ? '<nav class="indice" aria-label="En esta página"><b>En esta página</b>' +
                f.secciones.map(function (s) { return '<a href="#" data-ir="' + s.id + '">' + u.inline(s.titulo) + '</a>'; }).join('') + '</nav>' : '') +
            '<article class="contenido">' +
            f.secciones.map(function (s) { return '<section class="seccion" data-sec="' + s.id + '">' + s.html + '</section>'; }).join('') +
            '</article>' +
            '<p class="solo-impresion">' + u.esc(f.nombre) + ' · Sesión ' + f.sesion + ' · Material de estudio de Soy Andrés Arango · © 2026 Andrés Arango. Resumen de clase: verifica dosis y datos con tu docente y los protocolos de tu institución.</p>' +
            '<nav class="paginado" aria-label="Siguiente y anterior">' +
            (prev ? '<a href="#/farmaco/' + prev.id + '">' + u.icono('atras') + '<span><small>Anterior</small>' + u.esc(prev.nombre) + '</span></a>' : '<span></span>') +
            (next ? '<a href="#/farmaco/' + next.id + '" class="paginado__sig"><span><small>Siguiente</small>' + u.esc(next.nombre) + '</span>' + u.icono('flecha') + '</a>' : '<span></span>') +
            '</nav></div>';
    },
    montar: function (el, p) {
        var f = FA.datos.farmaco(p.id); if (!f) return;
        /* venir desde el buscador: saltar a la sección encontrada (después de que el enrutador suba al inicio) */
        if (p.sec) setTimeout(function () {
            var s = el.querySelector('[data-sec="' + p.sec + '"]');
            if (s) { s.scrollIntoView({ block: 'start' }); s.classList.add('seccion--hallazgo'); setTimeout(function () { s.classList.remove('seccion--hallazgo'); }, 2200); }
        }, 30);
        var imp = el.querySelector('[data-imprimir]');
        if (imp) imp.addEventListener('click', function () { window.print(); });
        var btn = el.querySelector('[data-estudiado]');
        btn.addEventListener('click', function () {
            var v = !FA.estado.estudiado(f.id);
            FA.estado.marcarEstudiado(f.id, v);
            btn.setAttribute('aria-pressed', v);
            btn.classList.toggle('btn--sabe', v); btn.classList.toggle('btn--on', v); btn.classList.toggle('btn--sec', !v);
            btn.querySelector('span').textContent = v ? 'Estudiado' : 'Marcar como estudiado';
        });
        el.querySelectorAll('[data-ir]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                var s = el.querySelector('[data-sec="' + a.dataset.ir + '"]');
                if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }
};
