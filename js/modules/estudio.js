/* ============================================================
   VISTA · #/estudio  ·  Modo estudio
   "¿Cuánto tiempo tienes hoy?" → plan por bloques con temporizador
   (el de 25 min es el pomodoro clásico). Conectado a flashcards y quiz.
   ============================================================ */
FA.vistas.estudio = (function () {
    var u = FA.u, MINUTOS = [25, 40, 45, 60, 90];
    var cfg = null;

    function porDefecto() {
        var pend = FA.datos.farmacos.filter(function (f) { return !FA.estado.estudiado(f.id); })[0];
        return { min: 25, tema: pend ? pend.id : '' };
    }

    return {
        titulo: 'Modo estudio',
        render: function (p) {
            cfg = cfg || porDefecto();
            var opciones = FA.datos.sesiones.map(function (s) {
                return '<optgroup label="Sesión ' + s.n + ' · ' + u.esc(s.tema) + '">' + s.farmacos.map(function (f) {
                    return '<option value="' + f.id + '"' + (cfg.tema === f.id ? ' selected' : '') + '>' + u.esc(f.nombre) + '</option>';
                }).join('') + '</optgroup>';
            }).join('');
            return '<div class="pagina">' +
                '<header class="cabecera"><p class="eyebrow">Modo estudio</p><h1>¿Cuánto tiempo tienes hoy?</h1>' +
                '<p class="lead">Una sesión corta y estructurada rinde más que horas sin plan. Elige el tiempo, silencia el celular y empieza. ' +
                'Con 25 minutos es un pomodoro.</p></header>' +
                '<div class="sesion-estudio">' +
                '<div class="pila">' +
                '<div class="panel"><div class="campo"><span id="lbl-min">Tiempo disponible</span>' +
                '<div class="segmento" role="group" aria-labelledby="lbl-min">' + MINUTOS.map(function (m) {
                    return '<button type="button" data-min="' + m + '" aria-pressed="' + (cfg.min === m) + '">' + m + ' min' + (m === 25 ? '<small>pomodoro</small>' : '') + '</button>';
                }).join('') + '</div></div>' +
                '<label class="campo"><span>Tema de hoy</span><select data-tema><option value="">Sin tema: repaso general</option>' + opciones + '</select></label>' +
                '<p class="ayuda">El tiempo se reparte entre comprender, elaborar, recordar y comprobar' + (cfg.min >= 45 ? ', con una pausa de 5 minutos a la mitad' : '') + '.</p></div>' +
                '<div class="aviso aviso--azul"><b>Al terminar</b><br>Marca el tema como estudiado en su página. Así tu progreso refleja lo que de verdad hiciste.</div>' +
                '</div>' +
                '<div data-reloj></div></div></div>';
        },
        montar: function (el) {
            FA.estudio.temporizador(el.querySelector('[data-reloj]'), {
                bloques: FA.estudio.bloques(cfg.min, cfg.tema),
                alTerminar: function () { FA.estado.registrarSesion(cfg.min, cfg.tema || null); }
            });
            el.addEventListener('click', function (e) {
                var b = e.target.closest('[data-min]'); if (!b) return;
                cfg.min = +b.dataset.min; FA.router.render();
            });
            el.addEventListener('change', function (e) {
                if (e.target.matches('[data-tema]')) { cfg.tema = e.target.value; FA.router.render(); }
            });
        }
    };
})();
