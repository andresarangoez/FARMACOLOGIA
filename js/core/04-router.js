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
        { re: /^\/farmaco\/([\w-]+)(?:\/([\w-]+))?$/, vista: 'farmaco', params: ['id', 'sec'] },
        { re: /^\/buscar$/,                     vista: 'buscar' },
        { re: /^\/emparejar$/,                  vista: 'emparejar' },
        { re: /^\/distractores$/,               vista: 'distractores' },
        { re: /^\/comparar$/,                   vista: 'comparar' },
        { re: /^\/(?:farmacos|vademecum)$/,     vista: 'listado' },
        { re: /^\/flashcards(?:\/([^/]+))?$/,   vista: 'flashcards',  params: ['alcance'] },
        { re: /^\/quiz(?:\/([^/]+))?$/,         vista: 'quiz',        params: ['alcance'] },
        { re: /^\/calculadora(?:\/([\w-]+))?$/, vista: 'calculadora', params: ['id'] },
        { re: /^\/estudio$/,                    vista: 'inicio' },   // «Modo estudio» (pomodoro) retirado
        { re: /^\/examen$/,                     vista: 'examen' },
        { re: /^\/examen\/practicar(?:\/([\w-]+))?$/, vista: 'bancoExamen', params: ['id'] },
        { re: /^\/examen\/([\w-]+)$/,           vista: 'recurso',     params: ['id'] },
        { re: /^\/progreso$/,                   vista: 'inicio' }   // «Mi progreso» oculto por ahora (no hay base de datos de estudiantes)
    ];
    var SECCION = { listado: 'listado', emparejar: 'quiz', distractores: 'quiz', comparar: 'estudio', buscar: 'buscar', inicio: 'inicio', sesiones: 'sesiones', sesion: 'sesiones', farmaco: 'sesiones',
                    flashcards: 'flashcards', quiz: 'quiz', calculadora: 'calculadora',
                    examen: 'sesiones', recurso: 'sesiones', bancoExamen: 'sesiones', progreso: 'progreso', estudio: 'estudio' };

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
        document.querySelectorAll('.nav a, .btn-lupa').forEach(function (a) {
            if (a.dataset.sec === sec) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
        });
        var nav = document.querySelector('.nav');
        if (nav) nav.classList.remove('abierta');
        var btn = document.querySelector('.barra__menu');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    /* Encabezado de cada página como banda azul con brillos y olas (igual que la página de articulación) */
    var nOla = 0;
    function bandaOlas(cont) {
        var h = cont.querySelector('.pagina > .cabecera');
        if (!h || h.classList.contains('banda')) return;
        var k = ++nOla, ola = 'M0 200C240 140 480 140 720 200S1200 260 1440 200V320H0Z', olb = 'M0 240C240 200 480 280 720 240S1200 200 1440 240V320H0Z';
        h.classList.add('banda');
        var migas = h.previousElementSibling;
        if (migas && migas.classList.contains('migas')) h.insertBefore(migas, h.firstChild);
        h.insertAdjacentHTML('afterbegin', '<div class="fx" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i>' +
            '<svg viewBox="0 0 1440 320" preserveAspectRatio="none"><defs>' +
            '<linearGradient id="ola-a' + k + '" x1="0" x2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".5"/><stop offset=".35" stop-color="#a78bfa" stop-opacity=".45"/><stop offset=".65" stop-color="#FBD785" stop-opacity=".4"/><stop offset="1" stop-color="#38bdf8" stop-opacity=".5"/></linearGradient>' +
            '<linearGradient id="ola-b' + k + '" x1="1" x2="0"><stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset=".5" stop-color="#818cf8" stop-opacity=".35"/><stop offset="1" stop-color="#22d3ee" stop-opacity=".35"/></linearGradient></defs>' +
            '<g class="ola o1"><path fill="url(#ola-a' + k + ')" d="' + ola + '"/><path fill="url(#ola-a' + k + ')" transform="translate(1440 0)" d="' + ola + '"/></g>' +
            '<g class="ola o2"><path fill="url(#ola-b' + k + ')" d="' + olb + '"/><path fill="url(#ola-b' + k + ')" transform="translate(1440 0)" d="' + olb + '"/></g></svg></div>');
    }

    var primeraVista = true;
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
        bandaOlas(cont);
        if (vista.montar) {
            try { vista.montar(cont, r.params); } catch (e) { console.error(e); }
        }
        var t = typeof vista.titulo === 'function' ? vista.titulo(r.params) : vista.titulo;
        document.title = (t ? t + ' · ' : '') + 'Farmacología · Soy Andrés Arango';
        marcarMenu(r.vista);
        window.scrollTo(0, 0);
        /* en la carga inicial no se enfoca el contenido: así el primer Tab llega al enlace "Saltar al contenido" */
        if (primeraVista) primeraVista = false; else main.focus({ preventScroll: true });
    }

    function ir(hash) {
        if (location.hash === hash) render();
        else location.hash = hash;
    }

    return { iniciar: function () { window.addEventListener('hashchange', render); render(); }, render: render, ir: ir };
})();
