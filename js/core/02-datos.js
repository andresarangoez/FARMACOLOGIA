/* ============================================================
   NÚCLEO · modelo de datos
   Convierte window.FARMA_RAW (los .md de /content, empaquetados
   por tools/construir.ps1) en sesiones → fármacos → secciones,
   preguntas, flashcards y datos de examen.
   Para agregar una sesión: nueva carpeta en /content y volver
   a ejecutar construir.bat. No hay nada más que tocar.
   ============================================================ */
FA.datos = (function () {
    var u = FA.u;
    var ESTRELLA = '\u2B50';
    var farmacos = [], sesiones = [], porId = {}, advertencias = [];

    function parsearQuiz(lineas, fid) {
        var arr = [], q = null;
        lineas.forEach(function (l) {
            var m = /^\s*(\d+)\.\s+\*\*\(([^)]+)\)\*\*\s*(.*)$/.exec(l);
            if (m) {
                q = { n: +m[1], tipo: /verdadero/i.test(m[2]) ? 'vf' : 'mc', texto: m[3], opciones: [], farmaco: fid };
                if (q.tipo === 'vf') {
                    var p = /^(.*?)\s*\u2192\s*\*\*(Verdadero|Falso)\*\*\s*(?:\((.*)\))?\s*$/.exec(m[3]);
                    if (p) { q.texto = p[1]; q.correcta = p[2]; q.explicacion = p[3] || ''; }
                }
                arr.push(q);
                return;
            }
            m = /^\s*-\s*([a-d])\)\s*(.*)$/.exec(l);
            if (m && q && q.tipo === 'mc') {
                q.opciones.push({ txt: m[2].replace(/\u2713/g, '').replace(/\*\*/g, '').trim(), ok: /\u2713/.test(m[2]) });
            }
        });
        return arr.filter(function (x) {
            var ok = x.tipo === 'vf' ? !!x.correcta :
                (x.opciones.length >= 2 && x.opciones.filter(function (o) { return o.ok; }).length === 1);
            if (!ok) advertencias.push('Pregunta inválida en ' + fid + ' #' + x.n);
            return ok;
        }).map(function (x) { x.id = fid + '#q' + x.n; return x; });
    }

    function parsearCards(lineas, fid) {
        var arr = [];
        lineas.forEach(function (l) {
            var m = /^\s*-\s*\*\*Q:\*\*\s*(.*?)\s*\u2192\s*\*\*A:\*\*\s*(.*)$/.exec(l);
            if (m) arr.push({ q: m[1], a: m[2], farmaco: fid, id: fid + '#f' + (arr.length + 1) });
        });
        return arr;
    }

    /* Datos de examen: se leen del HTML ya generado (citas ⭐, filas, ítems y títulos) */
    function extraerExamen(secciones) {
        var res = [];
        secciones.forEach(function (s) {
            var d = document.createElement('div');
            d.innerHTML = s.html;
            d.querySelectorAll('blockquote.dato').forEach(function (b) {
                res.push({ seccion: s.titulo, html: b.innerHTML });
            });
            d.querySelectorAll('tr.fila-examen').forEach(function (tr) {
                var c = Array.prototype.map.call(tr.children, function (td) { return td.innerHTML; });
                res.push({ seccion: s.titulo, html: c.join(' — ') });
            });
            d.querySelectorAll('li.item-examen').forEach(function (li) {
                var cl = li.cloneNode(true);
                cl.querySelectorAll('ul,ol').forEach(function (x) { x.remove(); });
                res.push({ seccion: s.titulo, html: cl.innerHTML });
            });
            d.querySelectorAll('h2 .badge-examen, h3 .badge-examen').forEach(function (b) {
                var h = b.parentNode;
                res.push({ seccion: s.titulo, html: '<strong>' + h.firstChild.textContent.trim() + '</strong> · sección marcada como dato de examen', esSeccion: true });
            });
        });
        return res;
    }

    function construir() {
        (window.FARMA_RAW || []).forEach(function (r) {
            var f = FA.md.frontmatter(r.md);
            var meta = f.meta;
            if (!meta.id || !meta.sesion) { advertencias.push('Sin id/sesion: ' + r.ruta); return; }

            var secs = [], quiz = [], cards = [], act = { titulo: 'Introducción', lineas: [] };
            function cerrar() { if (act.lineas.join('').trim() || act.titulo !== 'Introducción') secs.push(act); }
            f.cuerpo.split('\n').forEach(function (l) {
                var h = /^##\s+(.*)$/.exec(l);
                if (h) { cerrar(); act = { titulo: h[1].trim(), lineas: [] }; }
                else act.lineas.push(l);
            });
            cerrar();

            var contenido = [];
            secs.forEach(function (s) {
                if (/^preguntas de quiz/i.test(s.titulo)) quiz = parsearQuiz(s.lineas, meta.id);
                else if (/^flashcards/i.test(s.titulo)) cards = parsearCards(s.lineas, meta.id);
                else contenido.push({
                    titulo: s.titulo.replace(new RegExp('\\s*' + ESTRELLA + '.*$'), ''),
                    id: u.slug(s.titulo),
                    html: FA.md.html('## ' + s.titulo + '\n' + s.lineas.join('\n'))
                });
            });

            var fa = {
                id: meta.id, nombre: meta.nombre || meta.id, sesion: parseInt(meta.sesion, 10),
                tema: meta.tema || ('Sesión ' + meta.sesion), grupo: meta.grupo_farmacologico || '',
                mecanismo: meta.mecanismo_resumen || '', linea: meta.linea_celular || '',
                tags: meta.tags || [], dificultad: meta.dificultad_quiz || '',
                ruta: r.ruta, secciones: contenido, quiz: quiz, cards: cards
            };
            fa.examen = extraerExamen(contenido);
            farmacos.push(fa);
            porId[fa.id] = fa;
        });

        farmacos.sort(function (a, b) { return a.sesion - b.sesion || (a.ruta < b.ruta ? -1 : 1); });
        farmacos.forEach(function (fa) {
            var s = sesiones.filter(function (x) { return x.n === fa.sesion; })[0];
            if (!s) { s = { n: fa.sesion, tema: fa.tema, farmacos: [] }; sesiones.push(s); }
            s.farmacos.push(fa);
        });
        sesiones.sort(function (a, b) { return a.n - b.n; });
        if (advertencias.length && window.console) console.warn('Contenido con advertencias:', advertencias);
    }

    /* Recursos de "Datos de examen" con página propia (talleres, simulacros) */
    var extras = [];
    (window.FARMA_EXAMEN || []).forEach(function (r) {
        var f = FA.md.frontmatter(r.md), meta = f.meta;
        if (!meta.id) { advertencias.push('Recurso sin id: ' + r.ruta); return; }
        var secs = [], act = { titulo: 'Introducción', lineas: [] };
        function cerrar() { if (act.lineas.join('').trim()) secs.push(act); }
        f.cuerpo.split('\n').forEach(function (l) {
            var h = /^##\s+(.*)$/.exec(l);
            if (h) { cerrar(); act = { titulo: h[1].trim(), lineas: [] }; } else act.lineas.push(l);
        });
        cerrar();
        extras.push({
            id: meta.id, nombre: meta.nombre || meta.id, descripcion: meta.descripcion || '',
            orden: parseInt(meta.orden, 10) || 99,
            secciones: secs.map(function (s) {
                return { titulo: s.titulo, id: u.slug(s.titulo), html: FA.md.html('## ' + s.titulo + '\n' + s.lineas.join('\n')) };
            })
        });
    });
    extras.sort(function (a, b) { return a.orden - b.orden; });

    construir();

    function preguntas(lista) { return [].concat.apply([], lista.map(function (f) { return f.quiz; })); }
    function cards(lista) { return [].concat.apply([], lista.map(function (f) { return f.cards; })); }

    return {
        farmacos: farmacos, sesiones: sesiones, advertencias: advertencias,
        extras: extras,
        extra: function (id) { return extras.filter(function (x) { return x.id === id; })[0]; },
        farmaco: function (id) { return porId[id]; },
        sesion: function (n) { return sesiones.filter(function (s) { return s.n === +n; })[0]; },
        preguntas: preguntas, cards: cards,
        totales: function () {
            return {
                sesiones: sesiones.length, farmacos: farmacos.length,
                preguntas: preguntas(farmacos).length, cards: cards(farmacos).length,
                examen: farmacos.reduce(function (a, f) { return a + f.examen.length; }, 0)
            };
        },
        siguiente: function (id, d) {
            var f = porId[id]; if (!f) return null;
            var lista = this.sesion(f.sesion).farmacos;
            return lista[lista.indexOf(f) + d] || null;
        }
    };
})();
