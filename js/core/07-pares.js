/* ============================================================
   NÚCLEO · pares (mecanismo ↔ fármaco, efecto ↔ fármaco, grupo ↔ fármaco)
   Todo se EXTRAE AUTOMÁTICAMENTE de content/sesion-*; no se escribe ni se
   inventa contenido. Cada par lleva su origen (archivo, tema y de dónde
   salió: frontmatter, flashcard o tabla) para poder rastrearlo.

   Fuentes
     mecanismo → frontmatter `mecanismo_resumen`, flashcards "Mecanismo de acción de X"
                 y tablas "Fármaco | Mecanismo…" de las secciones.
     efecto    → flashcards de efecto adverso/secundario/complicación y tablas "Fármaco | Efecto…".
     grupo     → frontmatter `grupo_farmacologico`.
   Temas elegibles: los de fármacos (sesiones 7, 8 y 9) → FA.pares.configurar({ esFarmaco }).
   Lo marcado [complemento] de content/examen/ NO se usa.

   Reglas para que los ejercicios no sean ambiguos
     · un mismo fármaco no repite mecanismo (se prefiere tabla > flashcard > frontmatter);
     · en una ronda sólo entra un par por tema y nunca dos textos casi iguales
       (por ejemplo dapsona y sulfonamidas comparten mecanismo en la clase).
   ============================================================ */
FA.pares = (function () {
    var esFarmaco = function (f) { return f.sesion >= 7 && (f.quiz || []).length > 0; };   // sesiones 7+ con contenido (las plantillas vacías no cuentan)
    var PRIORIDAD = { tabla: 0, flashcard: 1, frontmatter: 2 };

    function corto(n) { return n.replace(/\s*\(.*$/, '').trim(); }
    function cap(s) { s = s.trim(); return s.charAt(0).toUpperCase() + s.slice(1); }
    function plano(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/⭐/g, '').replace(/\s+/g, ' ').trim(); }
    function sinTilde(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function clave(s) { return FA.buscar ? FA.buscar.norm(s) : sinTilde(s); }
    var GEN = {};   // palabras genéricas (aparecen en muchos mecanismos: "inhibe", "bloquea"…); se calcula al construir
    function palabras(s) { return clave(s).split(/[^a-z0-9]+/).filter(function (t) { return t.length > 3 && !GEN[t]; }); }
    function similitud(a, b) {
        var A = palabras(a), B = palabras(b); if (!A.length || !B.length) return 0;
        var inter = A.filter(function (x) { return B.indexOf(x) >= 0; }).length;
        return inter / Math.min(A.length, B.length);
    }

    /* A qué fármaco se refiere una flashcard: si la pregunta menciona una etiqueta o una palabra del nombre
       del tema (p. ej. "linezolid"), se usa esa; si no, el nombre del tema */
    function etiquetaDe(f, q) {
        var nq = clave(q), cand = f.tags.slice(), mejor = null;
        f.nombre.split(/[(),]|\sy\s/).forEach(function (p) { if (p.trim()) cand.push(p.trim()); });
        cand.forEach(function (c) {
            var k = clave(c);
            if (k.length >= 5 && nq.indexOf(k) >= 0 && (!mejor || k.length > clave(mejor).length)) mejor = c;
        });
        return mejor ? cap(mejor) : corto(f.nombre);
    }

    function construir() {
        var mec = [], efe = [], grp = [];
        function par(tipo, f, farmaco, texto, fuente, origen) {
            texto = texto.replace(/\s*\.$/, '').trim();
            if (!farmaco || !texto) return null;
            return { tipo: tipo, farmaco: farmaco, texto: texto, tema: f.id, sesion: f.sesion, grupo: f.grupo, fuente: fuente, origen: origen, archivo: f.ruta,
                     id: tipo + ':' + f.id + ':' + clave(farmaco).replace(/[^a-z0-9]+/g, '') + ':' + clave(texto).replace(/[^a-z0-9]+/g, '').slice(0, 24) };
        }

        FA.datos.farmacos.filter(esFarmaco).forEach(function (f) {
            var p;
            if (f.grupo && !/^esquema/i.test(f.nombre)) { p = par('grupo', f, corto(f.nombre), f.grupo, 'frontmatter', 'frontmatter: grupo_farmacologico'); if (p) grp.push(p); }
            if (f.mecanismo) { p = par('mecanismo', f, corto(f.nombre), f.mecanismo, 'frontmatter', 'frontmatter: mecanismo_resumen'); if (p) mec.push(p); }

            f.secciones.forEach(function (s) {
                var d = document.createElement('div'); d.innerHTML = s.html;
                d.querySelectorAll('table').forEach(function (t) {
                    var cab = Array.prototype.map.call(t.querySelectorAll('th'), function (x) { return sinTilde(x.textContent); });
                    if (cab[0] !== 'farmaco') return;
                    var iM = cab.findIndex(function (c) { return /^mecanismo/.test(c); }), iE = cab.findIndex(function (c) { return /^efecto/.test(c); });
                    t.querySelectorAll('tbody tr').forEach(function (tr) {
                        var td = tr.children, nombre = plano(td[0].innerHTML);
                        if (/,/.test(nombre)) return;                                  // filas de varios fármacos a la vez
                        if (iM > 0) { p = par('mecanismo', f, cap(nombre), plano(td[iM].innerHTML), 'tabla', 'tabla «' + s.titulo + '»'); if (p) mec.push(p); }
                        if (iE > 0) { p = par('efecto', f, cap(nombre), plano(td[iE].innerHTML), 'tabla', 'tabla «' + s.titulo + '»'); if (p) efe.push(p); }
                    });
                });
            });

            f.cards.forEach(function (c) {
                var m = /^Mecanismo de acción (?:común )?(?:de todos los |de todas las |de los |de las |de la |del |de )(.+)$/i.exec(c.q), p2;
                if (m) { p2 = par('mecanismo', f, cap(m[1].replace(/^(todas las|todos los)\s+/i, '')), c.a, 'flashcard', 'flashcard: «' + c.q + '»'); if (p2) mec.push(p2); }
                else if (/efecto (adverso|secundario)|complicaci[oó]n|¿qué efecto/i.test(c.q)) {
                    p2 = par('efecto', f, etiquetaDe(f, c.q), c.a, 'flashcard', 'flashcard: «' + c.q + '»'); if (p2) efe.push(p2);
                }
            });
        });

        /* palabras que aparecen en 4 o más mecanismos distintos no sirven para decir que dos textos se parecen */
        GEN = {};
        var cuenta = {};
        mec.forEach(function (p) {
            var vistas = {};
            clave(p.texto).split(/[^a-z0-9]+/).forEach(function (t) { if (t.length > 3 && !vistas[t]) { vistas[t] = 1; cuenta[t] = (cuenta[t] || 0) + 1; } });
        });
        Object.keys(cuenta).forEach(function (t) { if (cuenta[t] >= 4) GEN[t] = 1; });

        /* mecanismos: un solo par por fármaco y sin repetir el mismo texto dentro de un tema */
        mec.sort(function (a, b) { return PRIORIDAD[a.fuente] - PRIORIDAD[b.fuente]; });
        var uni = [];
        mec.forEach(function (p) {
            var rep = uni.some(function (q) { return q.tema === p.tema && (clave(q.farmaco) === clave(p.farmaco) || similitud(q.texto, p.texto) >= 0.5); });
            if (!rep) uni.push(p);
        });
        /* efectos: sin repetidos exactos */
        var vistos = {}, efU = efe.filter(function (p) { var k = p.tema + clave(p.farmaco) + clave(p.texto); if (vistos[k]) return false; vistos[k] = 1; return true; });
        return { mecanismo: uni, efecto: efU, grupo: grp };
    }

    var cache = null;
    function todos() { return cache || (cache = construir()); }
    function lista(tipo, sesiones) {
        return todos()[tipo].filter(function (p) { return !sesiones || !sesiones.length || sesiones.indexOf(p.sesion) >= 0; });
    }

    /* ¿dos pares pueden convivir en un mismo ejercicio sin ambigüedad? */
    function compatibles(a, b) {
        if (clave(a.farmaco) === clave(b.farmaco)) return false;
        /* si el texto de uno nombra al otro ("igual que sulfonamidas"), no son distinguibles */
        if (clave(a.texto).indexOf(clave(b.farmaco)) >= 0 || clave(b.texto).indexOf(clave(a.farmaco)) >= 0) return false;
        /* o comparten 3 o más términos específicos (PABA, dihidropteroato, sintasa…) */
        var A = palabras(a.texto), B = palabras(b.texto);
        return A.filter(function (x) { return B.indexOf(x) >= 0; }).length < 3;
    }

    /* n pares al azar, sin ambigüedad. `pool` ya viene filtrado (tipo, sesiones, "sólo los que fallé"…) */
    function ronda(pool, n) {
        var m = FA.u.mezclar(pool), out = [];
        m.forEach(function (p) { if (out.length < n && out.every(function (q) { return compatibles(p, q); })) out.push(p); });
        return out;
    }

    /* Distractores para "¿a qué fármaco pertenece?": mismos tipo, preferentemente de la misma sesión y de un grupo parecido */
    function opciones(par, k) {
        var base = todos()[par.tipo].filter(function (q) { return compatibles(par, q); });
        var inicioGrupo = function (g) { return (g || '').split(' ').slice(0, 3).join(' '); };
        var cercano = FA.u.mezclar(base.filter(function (q) { return q.sesion === par.sesion && inicioGrupo(q.grupo) === inicioGrupo(par.grupo); }));
        var misma = FA.u.mezclar(base.filter(function (q) { return q.sesion === par.sesion; }));
        var resto = FA.u.mezclar(base);
        var elegidos = [];
        cercano.concat(misma, resto).forEach(function (q) {
            if (elegidos.length < (k || 3) && elegidos.every(function (e) { return compatibles(e, q); })) elegidos.push(q);
        });
        return FA.u.mezclar([par].concat(elegidos));
    }

    /* Tabla comparativa por fármaco: une grupo, mecanismo y efectos del mismo tema */
    function filas() {
        var P = todos(), por = {};
        function fila(tema, farmaco, sesion, grupo) {
            var k = tema + '|' + clave(farmaco);
            return por[k] || (por[k] = { tema: tema, farmaco: farmaco, sesion: sesion, grupo: grupo, mecanismo: '', efectos: [], origenes: [] });
        }
        P.mecanismo.forEach(function (p) { var r = fila(p.tema, p.farmaco, p.sesion, p.grupo); r.mecanismo = p.texto; r.origenes.push(p.origen); });
        FA.datos.farmacos.filter(esFarmaco).forEach(function (f) {
            var hay = Object.keys(por).some(function (k) { return por[k].tema === f.id; });
            if (!hay) fila(f.id, corto(f.nombre), f.sesion, f.grupo);          // temas sin mecanismo aún: fila con "—"
        });
        P.efecto.forEach(function (p) {
            var en = Object.keys(por).map(function (k) { return por[k]; }).filter(function (r) { return r.tema === p.tema; });
            var obj = en.filter(function (r) { var a = clave(r.farmaco), b = clave(p.farmaco); return a.indexOf(b) >= 0 || b.indexOf(a) >= 0; })[0] || en[0] || fila(p.tema, p.farmaco, p.sesion, p.grupo);
            obj.efectos.push(p.texto); obj.origenes.push(p.origen);
        });
        return Object.keys(por).map(function (k) { return por[k]; }).sort(function (a, b) { return a.sesion - b.sesion || (a.farmaco < b.farmaco ? -1 : 1); });
    }

    return {
        todos: todos, lista: lista, ronda: ronda, opciones: opciones, filas: filas, compatibles: compatibles, similitud: similitud,
        configurar: function (o) { if (o && o.esFarmaco) { esFarmaco = o.esFarmaco; cache = null; } },
        esFarmaco: function (f) { return esFarmaco(f); }
    };
})();
