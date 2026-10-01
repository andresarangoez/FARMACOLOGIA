/* ============================================================
   COMPONENTE · Modo estudio: bloques y temporizador (pomodoro)
   FA.estudio.bloques(minutos, temaId) → [{ fase, min, titulo, desc, enlace }]
   FA.estudio.temporizador(contenedor, { bloques, alTerminar })

   El tiempo se reparte entre comprender, elaborar, recordar y
   comprobar. Desde 45 min se agrega una pausa corta. Los enlaces
   de cada bloque abren en otra pestaña para no interrumpir el reloj.
   ============================================================ */
FA.estudio = (function () {
    var u = FA.u;

    var FASES = {
        comprension: { titulo: 'Comprensión', desc: 'Lectura activa del tema: ideas clave y una pregunta por párrafo.' },
        elaboracion: { titulo: 'Elaboración', desc: 'Responde ¿qué es?, ¿cómo funciona?, ¿con qué se relaciona? Haz tu propia tabla comparativa.' },
        recall:      { titulo: 'Recuperación activa', desc: 'Cierra el material. Flashcards o escribe todo lo que recuerdes.' },
        autoeval:    { titulo: 'Autoevaluación', desc: 'Quiz del tema y revisión de errores. Anota qué repasar.' },
        pausa:       { titulo: 'Pausa corta', desc: 'Levántate, toma agua, lejos de la pantalla.' }
    };
    var REPARTO = [['comprension', .25], ['elaboracion', .25], ['recall', .25], ['autoeval', .25]];

    function enlace(fase, tema) {
        if (fase === 'comprension') return tema ? { href: '#/farmaco/' + tema, txt: 'Abrir el tema' } : { href: '#/sesiones', txt: 'Ver sesiones' };
        if (fase === 'recall') return { href: '#/flashcards/' + (tema ? 'farmaco:' + tema : 'todo'), txt: 'Abrir flashcards' };
        if (fase === 'autoeval') return { href: '#/quiz/' + (tema ? 'farmaco:' + tema : 'todo'), txt: 'Abrir el quiz' };
        return null;
    }

    function bloques(minutos, tema) {
        var pausa = minutos >= 45 ? 5 : 0, util = minutos - pausa;
        var mins = REPARTO.map(function (x) { return Math.max(5, Math.round(util * x[1] / 5) * 5); });
        mins[mins.indexOf(Math.max.apply(null, mins))] += util - mins.reduce(function (a, b) { return a + b; }, 0);
        var lista = REPARTO.map(function (x, k) {
            var f = FASES[x[0]];
            return { fase: x[0], min: mins[k], titulo: f.titulo, desc: f.desc, enlace: enlace(x[0], tema) };
        });
        if (pausa) lista.splice(Math.ceil(lista.length / 2), 0, { fase: 'pausa', min: pausa, titulo: FASES.pausa.titulo, desc: FASES.pausa.desc, enlace: null });
        return lista;
    }

    function lista(bl, activo) {
        return '<ol class="bloques">' + bl.map(function (b, k) {
            var cls = activo == null ? '' : k < activo ? ' hecho' : k === activo ? ' activo' : '';
            return '<li class="bloque' + cls + '"' + (k === activo ? ' aria-current="step"' : '') + '>' +
                '<div class="bloque__min">' + b.min + '<small>min</small></div>' +
                '<div><b>' + u.esc(b.titulo) + '</b><span>' + u.esc(b.desc) +
                (b.enlace ? ' <a href="' + b.enlace.href + '" target="_blank" rel="noopener">' + u.esc(b.enlace.txt) + '</a>' : '') + '</span></div></li>';
        }).join('') + '</ol>';
    }

    function temporizador(el, o) {
        var bl = o.bloques, k = 0, restante = bl[0].min * 60, fin = null, intervalo = null, tituloOriginal = document.title;

        function mmss(s) { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }

        function dibujar() {
            var corriendo = !!intervalo, terminado = k >= bl.length;
            el.innerHTML =
                '<div class="pila">' +
                (terminado
                    ? '<div class="tarjeta tarjeta--alt"><h3>Sesión terminada</h3><p class="suave">Buen trabajo. Antes de cerrar, anota en una frase qué aprendiste hoy y qué quedó pendiente. Marca el tema como estudiado si ya lo dominas.</p>' +
                      '<div class="fila-botones"><button type="button" class="btn" data-t="reiniciar">Otra sesión igual</button><a class="btn btn--sec" href="#/progreso">Ver mi progreso</a></div></div>'
                    : '<div class="tarjeta tarjeta--alt reloj-caja">' +
                      '<span class="eyebrow">Bloque ' + (k + 1) + ' de ' + bl.length + ' · ' + u.esc(bl[k].titulo) + '</span>' +
                      '<div class="reloj" role="timer" aria-live="off">' + mmss(restante) + '</div>' +
                      '<p class="ayuda">' + u.esc(bl[k].desc) + '</p>' +
                      '<div class="fila-botones fila-botones--centro">' +
                      '<button type="button" class="btn" data-t="' + (corriendo ? 'pausa' : 'iniciar') + '">' + (corriendo ? 'Pausar' : (restante < bl[k].min * 60 ? 'Continuar' : 'Iniciar')) + '</button>' +
                      '<button type="button" class="btn btn--sec" data-t="saltar">Siguiente bloque</button>' +
                      '<button type="button" class="btn btn--sec" data-t="reiniciar">Reiniciar</button></div></div>') +
                lista(bl, terminado ? bl.length : k) + '</div>';
        }

        function tic() {
            restante = (fin - Date.now()) / 1000;
            if (restante <= 0) { siguiente(true); return; }
            var r = el.querySelector('.reloj'); if (r) r.textContent = mmss(restante);
            document.title = mmss(restante) + ' · ' + bl[k].titulo;
        }
        function iniciar() { fin = Date.now() + restante * 1000; intervalo = setInterval(tic, 250); dibujar(); }
        function pausar() { clearInterval(intervalo); intervalo = null; document.title = tituloOriginal; dibujar(); }
        function siguiente(auto) {
            clearInterval(intervalo); intervalo = null; document.title = tituloOriginal;
            k++;
            if (k < bl.length) {
                restante = bl[k].min * 60;
                if (auto) { iniciar(); return; }
            } else if (o.alTerminar) o.alTerminar();
            dibujar();
        }

        el.addEventListener('click', function (e) {
            var b = e.target.closest('[data-t]'); if (!b) return;
            var a = b.dataset.t;
            if (a === 'iniciar') iniciar();
            else if (a === 'pausa') pausar();
            else if (a === 'saltar') siguiente(false);
            else if (a === 'reiniciar') { clearInterval(intervalo); intervalo = null; document.title = tituloOriginal; k = 0; restante = bl[0].min * 60; dibujar(); }
        });

        /* Si la vista se reemplaza, detener el reloj */
        var obs = new MutationObserver(function () {
            if (!document.body.contains(el)) { clearInterval(intervalo); document.title = tituloOriginal; obs.disconnect(); }
        });
        obs.observe(document.getElementById('app'), { childList: true });

        dibujar();
    }

    return { bloques: bloques, lista: lista, temporizador: temporizador };
})();
