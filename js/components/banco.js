/* ============================================================
   COMPONENTE · banco de examen (zona con clave)
   Dos modos sobre las preguntas tipo caso de content/examen/:
     práctica   → respondes y ves al instante la justificación
     simulacro  → cronometrado, sin retroalimentación hasta terminar;
                  se puede ir y volver entre preguntas
   Las opciones se muestran SIEMPRE en el orden original: la justificación
   cita letras ("la opción b describe…") y no tendría sentido al barajarlas.
   FA.banco.montar(el, preguntas, { modo, minutos, etiqueta, alCambiar, nuevoLote })
   ============================================================ */
FA.banco = (function () {
    var u = FA.u;

    function mmss(s) { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
    function nombreFuente(id) { var e = FA.datos.extra(id); return e ? e.nombre.replace(/\s*\(.*$/, '') : ''; }

    function montar(el, preguntas, opc) {
        var modo = opc.modo, banco, i, resp, inicio, restante, intervalo = null, terminado;

        function iniciar(lista) {
            detener();
            banco = lista; i = 0; resp = new Array(lista.length); terminado = false; inicio = Date.now();
            restante = (opc.minutos || 0) * 60;
            if (modo === 'simulacro') { intervalo = setInterval(tic, 500); }
            pintar();
        }
        function detener() { if (intervalo) { clearInterval(intervalo); intervalo = null; } }

        function tic() {
            var usado = (Date.now() - inicio) / 1000, rest = restante - usado;
            var r = el.querySelector('[data-reloj]');
            if (r) { r.textContent = mmss(rest); r.classList.toggle('sim-reloj--alerta', rest <= 60); }
            if (rest <= 0) terminar(true);
        }

        function opcionesHtml(q, k) {
            var elegida = resp[k];
            return q.opciones.map(function (o, j) {
                var cls = 'op';
                if (modo === 'practica' && elegida != null) { if (o.ok) cls += ' op--ok'; else if (j === elegida) cls += ' op--mal'; }
                else if (modo === 'simulacro' && j === elegida) cls += ' op--sel';
                return '<button type="button" class="' + cls + '" data-k="' + j + '"' + (modo === 'practica' && elegida != null ? ' disabled' : '') + '><b>' + o.letra + '</b><span>' + u.inline(o.txt) + '</span></button>';
            }).join('');
        }

        function pintar() {
            if (terminado) return resultado();
            var q = banco[i], respondida = resp[i] != null;
            var cabeza = modo === 'simulacro'
                ? '<div class="sim-top"><span>Pregunta <b>' + (i + 1) + '</b> de ' + banco.length + '</span><span class="sim-reloj" data-reloj role="timer" aria-live="off">' + mmss(restante - (Date.now() - inicio) / 1000) + '</span></div>' +
                  '<div class="sim-nav" role="group" aria-label="Preguntas">' + banco.map(function (_, k) {
                      return '<button type="button" data-ir="' + k + '" class="' + (resp[k] != null ? 'resp' : '') + '"' + (k === i ? ' aria-current="true"' : '') + ' aria-label="Pregunta ' + (k + 1) + (resp[k] != null ? ', respondida' : '') + '">' + (k + 1) + '</button>';
                  }).join('') + '</div>'
                : '<div class="fc__top"><span>Pregunta <b>' + (i + 1) + '</b> de ' + banco.length + '</span><span class="chip chip--fijo">' + u.esc(nombreFuente(q.fuente)) + '</span></div>' +
                  '<div class="barra-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + banco.length + '" aria-valuenow="' + i + '"><i style="width:' + u.pct(i, banco.length) + '%"></i></div>';
            var fb = '';
            if (modo === 'practica' && respondida) {
                var ok = banco[i].opciones[resp[i]].ok, corr = q.opciones.filter(function (x) { return x.ok; })[0];
                fb = '<div class="feedback ' + (ok ? 'feedback--ok' : 'feedback--mal') + '"><b>' + (ok ? '¡Correcto!' : 'Incorrecto.') + '</b> ' +
                    (ok ? '' : 'La respuesta es la <b>' + corr.letra + '</b>. ') + (q.justificacion ? '<span class="just">' + u.inline(q.justificacion) + '</span>' : '') + '</div>';
            }
            var botones = modo === 'simulacro'
                ? '<div class="fila-botones"><button type="button" class="btn btn--sec" data-nav="-1"' + (i === 0 ? ' disabled' : '') + '>' + u.icono('atras') + ' Anterior</button>' +
                  (i < banco.length - 1 ? '<button type="button" class="btn btn--sec" data-nav="1">Siguiente ' + u.icono('flecha') + '</button>' : '') +
                  '<button type="button" class="btn" data-terminar>Terminar simulacro</button></div>'
                : '<div class="fila-botones">' + (respondida ? '<button type="button" class="btn" data-sig>' + (i + 1 === banco.length ? 'Ver resultado' : 'Siguiente') + ' ' + u.icono('flecha') + '</button>' : '') + '</div>';
            el.innerHTML = '<div class="quiz">' + cabeza + '<div class="panel">' +
                '<p class="quiz__tipo">' + u.esc(q.titulo) + '</p>' +
                '<p class="caso">' + u.inline(q.caso) + '</p>' +
                '<div class="opciones" role="group" aria-label="Opciones">' + opcionesHtml(q, i) + '</div>' + fb + botones + '</div></div>';
            var foco = el.querySelector('[data-sig]'); if (foco) foco.focus();
        }

        function elegir(j) {
            if (terminado) return;
            if (modo === 'practica') {
                if (resp[i] != null) return;
                resp[i] = j; FA.estado.examenResultado(banco[i].id, banco[i].opciones[j].ok);
            } else { resp[i] = j; }
            pintar();
        }

        function terminar(porTiempo) {
            if (terminado) return;
            terminado = true; detener();
            var seg = Math.round((Date.now() - inicio) / 1000);
            if (modo === 'simulacro') banco.forEach(function (q, k) { if (resp[k] != null) FA.estado.examenResultado(q.id, q.opciones[resp[k]].ok); else FA.estado.examenResultado(q.id, false); });
            var aciertos = banco.filter(function (q, k) { return resp[k] != null && q.opciones[resp[k]].ok; }).length;
            FA.estado.examenFin((modo === 'simulacro' ? 'Simulacro · ' : 'Práctica · ') + opc.etiqueta, aciertos, banco.length, seg);
            resultado(porTiempo, seg, aciertos);
        }

        function resultado(porTiempo, seg, aciertos) {
            if (aciertos == null) { aciertos = banco.filter(function (q, k) { return resp[k] != null && q.opciones[resp[k]].ok; }).length; seg = seg || 0; }
            var tot = banco.length, p = u.pct(aciertos, tot), sinResp = banco.filter(function (_, k) { return resp[k] == null; }).length;
            var fallos = banco.filter(function (q, k) { return resp[k] == null || !q.opciones[resp[k]].ok; });
            el.innerHTML = '<div class="panel resultado">' +
                '<h2 class="panel__tit">' + (modo === 'simulacro' ? 'Resultado del simulacro' : 'Resultado') + '</h2>' +
                '<p class="resultado__big">' + aciertos + '<small>/' + tot + '</small></p>' +
                '<p class="resultado__num"><b>' + p + '%</b>' + (modo === 'simulacro' ? ' · tiempo usado ' + mmss(seg) + ' de ' + mmss((opc.minutos || 0) * 60) : '') + '</p>' +
                (porTiempo ? '<p class="ayuda">Se acabó el tiempo.' + (sinResp ? ' ' + sinResp + ' sin responder.' : '') + '</p>' : (sinResp ? '<p class="ayuda">' + sinResp + ' sin responder.</p>' : '')) +
                (fallos.length ? '<h3>Para repasar</h3>' + fallos.map(function (q) {
                    var k = banco.indexOf(q), corr = q.opciones.filter(function (x) { return x.ok; })[0], mia = resp[k] != null ? q.opciones[resp[k]] : null;
                    return '<details class="rev"><summary><b>' + u.esc(q.titulo) + '</b> <small>' + u.esc(nombreFuente(q.fuente)) + ' · P' + q.n + '</small></summary>' +
                        '<p class="caso">' + u.inline(q.caso) + '</p>' +
                        '<p><span class="mal-txt">Tu respuesta: ' + (mia ? mia.letra + ') ' + u.inline(mia.txt) : 'sin responder') + '</span></p>' +
                        '<p><span class="ok-txt">Correcta: ' + corr.letra + ') ' + u.inline(corr.txt) + '</span></p>' +
                        (q.justificacion ? '<p class="just">' + u.inline(q.justificacion) + '</p>' : '') + '</details>';
                }).join('') : '<p class="ok-txt">¡Sin errores!</p>') +
                '<div class="fila-botones">' +
                '<button type="button" class="btn" data-otra>Otro intento</button>' +
                (fallos.length ? '<button type="button" class="btn btn--sec" data-fallo>Repetir sólo las falladas (' + fallos.length + ')</button>' : '') +
                '<button type="button" class="btn btn--sec" data-cambiar>Cambiar opciones</button></div></div>';
        }

        el.addEventListener('click', function (e) {
            var b = e.target.closest('button'); if (!b) return;
            if (b.classList.contains('op')) elegir(+b.dataset.k);
            else if (b.hasAttribute('data-sig')) { i++; if (i >= banco.length) terminar(false); else pintar(); }
            else if (b.dataset.nav) { i = Math.max(0, Math.min(banco.length - 1, i + +b.dataset.nav)); pintar(); }
            else if (b.dataset.ir != null) { i = +b.dataset.ir; pintar(); }
            else if (b.hasAttribute('data-terminar')) {
                var sin = banco.filter(function (_, k) { return resp[k] == null; }).length;
                if (!sin || window.confirm('Tienes ' + sin + ' pregunta(s) sin responder. ¿Terminar el simulacro?')) terminar(false);
            }
            else if (b.hasAttribute('data-otra')) iniciar(opc.nuevoLote());
            else if (b.hasAttribute('data-fallo')) {
                var f = banco.filter(function (q, k) { return resp[k] == null || !q.opciones[resp[k]].ok; });
                iniciar(u.mezclar(f));
            }
            else if (b.hasAttribute('data-cambiar')) opc.alCambiar();
        });

        function teclas(e) {
            if (!el.isConnected) { document.removeEventListener('keydown', teclas); detener(); return; }
            if (!banco || terminado || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
            var k = ['a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase());
            if (k >= 0) { elegir(k); return; }
            if (modo === 'simulacro') {
                if (e.key === 'ArrowRight' && i < banco.length - 1) { i++; pintar(); }
                else if (e.key === 'ArrowLeft' && i > 0) { i--; pintar(); }
            }
        }
        document.addEventListener('keydown', teclas);

        /* si la vista se reemplaza, parar el reloj */
        var obs = new MutationObserver(function () { if (!document.body.contains(el)) { detener(); obs.disconnect(); } });
        obs.observe(document.getElementById('app'), { childList: true });

        iniciar(preguntas);
    }

    return { montar: montar };
})();
