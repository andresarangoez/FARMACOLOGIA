/* ============================================================
   NÚCLEO · enrutador por hash
   #/inicio  #/sesiones  #/sesion/<n>  #/farmaco/<id>
   #/flashcards[/<alcance>]  #/quiz[/<alcance>]
   #/calculadora[/<id>]  #/examen  #/progreso
   alcance = todo | sesion:7 | farmaco:eritropoyetina | falladas
   Cada vista: titulo, render(params) → HTML, montar(el, params)
   ============================================================ */
FA.router = (function () {
    var RUTAS = [
        { re: /^\/?$/,                          vista: 'inicio' },
        { re: /^\/inicio$/,                     vista: 'inicio' },
        { re: /^\/sesiones$/,                   vista: 'sesiones' },
        { re: /^\/sesion\/(\d+)$/,              vista: 'sesion',      params: ['n'] },
        { re: /^\/farmaco\/([\w-]+)$/,          vista: 'farmaco',     params: ['id'] },
        { re: /^\/flashcards(?:\/([^/]+))?$/,   vista: 'flashcards',  params: ['alcance'] },
        { re: /^\/quiz(?:\/([^/]+))?$/,         vista: 'quiz',        params: ['alcance'] },
        { re: /^\/calculadora(?:\/([\w-]+))?$/, vista: 'calculadora', params: ['id'] },
        { re: /^\/estudio$/,                    vista: 'estudio' },
        { re: /^\/examen$/,                     vista: 'examen' },
        { re: /^\/examen\/([\w-]+)$/,           vista: 'recurso',     params: ['id'] },
        { re: /^\/progreso$/,                   vista: 'progreso' }
    ];
    var SECCION = { inicio: 'inicio', sesiones: 'sesiones', sesion: 'sesiones', farmaco: 'sesiones',
                    flashcards: 'flashcards', quiz: 'quiz', calculadora: 'calculadora',
                    examen: 'sesiones', recurso: 'sesiones', progreso: 'progreso', estudio: 'estudio' };

    function resolver() {
        var ruta = decodeURIComponent(location.hash.replace(/^#/, '').split('?')[0]);
        for (var i = 0; i < RUTAS.length; i++) {
            var m = RUTAS[i].re.exec(ruta);
            if (m) {
                var p = {};
                (RUTAS[i].params || []).forEach(function (n, k) { p[n] = m[k + 1]; });
                return { vista: RUTAS[i].vista, params: p };
            }
        }
        return { vista: 'inicio', params: {} };
    }

    function marcarMenu(vista) {
        var sec = SECCION[vista] || '';
        document.querySelectorAll('.nav a').forEach(function (a) {
            if (a.dataset.sec === sec) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
        });
        var nav = document.querySelector('.nav');
        if (nav) nav.classList.remove('abierta');
        var btn = document.querySelector('.barra__menu');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    function render() {
        var r = resolver();
        var vista = FA.vistas[r.vista];
        var main = document.getElementById('app');
        var cont = document.createElement('div');
        try {
            cont.innerHTML = vista.render(r.params);
        } catch (e) {
            console.error(e);
            cont.innerHTML = '<div class="vacio"><b>Algo salió mal</b><p>No se pudo mostrar esta sección. <a href="#/inicio">Volver al inicio</a>.</p></div>';
        }
        main.innerHTML = '';
        main.appendChild(cont);
        if (vista.montar) {
            try { vista.montar(cont, r.params); } catch (e) { console.error(e); }
        }
        var t = typeof vista.titulo === 'function' ? vista.titulo(r.params) : vista.titulo;
        document.title = (t ? t + ' · ' : '') + 'Farmacología · soy Andrés Arango';
        marcarMenu(r.vista);
        window.scrollTo(0, 0);
        main.focus({ preventScroll: true });
    }

    function ir(hash) {
        if (location.hash === hash) render();
        else location.hash = hash;
    }

    return { iniciar: function () { window.addEventListener('hashchange', render); render(); }, render: render, ir: ir };
})();
