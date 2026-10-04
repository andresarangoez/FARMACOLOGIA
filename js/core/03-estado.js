/* ============================================================
   NÚCLEO · progreso (localStorage, sólo en este navegador)
   ============================================================ */
FA.estado = (function () {
    var CLAVE = 'farmacologia-v1';
    var vacio = function () { return { estudiado: {}, cards: {}, preg: {}, historial: [], ex: {}, exHist: [], lei: {} }; };
    var E = vacio();
    var DIAS_CAJA = { 1: 1, 2: 3, 3: 7 };
    function finDeHoy() { var d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); }

    try {
        var raw = window.localStorage.getItem(CLAVE);
        if (raw) E = Object.assign(vacio(), JSON.parse(raw));
    } catch (e) { /* sin almacenamiento: la app funciona igual, sin guardar */ }

    function guardar() {
        try { window.localStorage.setItem(CLAVE, JSON.stringify(E)); } catch (e) { }
    }

    return {
        estudiado: function (id) { return !!E.estudiado[id]; },
        marcarEstudiado: function (id, v) { if (v) E.estudiado[id] = 1; else delete E.estudiado[id]; guardar(); },

        card: function (id) { return E.cards[id] || null; },                 // 'sabe' | 'repasar' | null
        marcarCard: function (id, v) { if (v) E.cards[id] = v; else delete E.cards[id]; guardar(); },

        /* Repaso espaciado de flashcards (3 cajas). Caja 1 = cada día, caja 2 = cada 3 días, caja 3 = cada 7 días.
           "La sé" sube de caja; "Repasar" vuelve a la caja 1 y la tarjeta toca de nuevo hoy.
           Una tarjeta nunca vista cuenta como "toca hoy". */
        leitner: function (id) { return (E.lei || {})[id] || null; },
        leitnerToca: function (id) { var l = (E.lei || {})[id]; return !l || l.p <= finDeHoy(); },
        leitnerMarcar: function (id, sabe) {
            E.lei = E.lei || {};
            var l = E.lei[id], ahora = Date.now(), acc = sabe ? 's' : 'r';
            if (l && l.a === acc && ahora - l.u < 600000) return l;          // evita subir dos veces por un doble toque
            var c = sabe ? Math.min((l ? l.c : 1) + 1, 3) : 1;
            E.lei[id] = { c: c, p: sabe ? ahora + DIAS_CAJA[c] * 86400000 : ahora, u: ahora, a: acc };
            guardar(); return E.lei[id];
        },
        leitnerResumen: function (ids) {
            var r = { nuevas: 0, c1: 0, c2: 0, c3: 0, hoy: 0 };
            ids.forEach(function (id) {
                var l = (E.lei || {})[id];
                if (!l) r.nuevas++; else r['c' + l.c]++;
                if (!l || l.p <= finDeHoy()) r.hoy++;
            });
            return r;
        },
        leitnerManana: function (ids) {
            var ini = finDeHoy(), fin = ini + 86400000;
            return ids.filter(function (id) { var l = (E.lei || {})[id]; return l && l.p > ini && l.p <= fin; }).length;
        },

        resultado: function (qid, ok) {
            var r = E.preg[qid] || { ok: 0, fail: 0 };
            if (ok) r.ok++; else r.fail++;
            r.ult = ok;
            E.preg[qid] = r; guardar();
        },
        pregunta: function (qid) { return E.preg[qid] || null; },
        falladas: function () { return Object.keys(E.preg).filter(function (k) { return E.preg[k].ult === false; }); },

        fin: function (etiqueta, ok, total) {
            E.historial.unshift({ f: new Date().toISOString(), e: etiqueta, ok: ok, t: total });
            E.historial = E.historial.slice(0, 30);
            guardar();
        },
        historial: function () { return E.historial; },

        /* Actividades de pares (emparejar y "¿a qué fármaco pertenece?"): resultado por par */
        parResultado: function (id, ok) {
            E.par = E.par || {};
            var r = E.par[id] || { ok: 0, fail: 0 };
            if (ok) r.ok++; else r.fail++;
            r.ult = ok; E.par[id] = r; guardar();
        },
        par: function (id) { return (E.par || {})[id] || null; },

        /* Banco de examen (zona con clave): se guarda aparte para no mezclarlo con el progreso público */
        examenResultado: function (qid, ok) {
            E.ex = E.ex || {};
            var r = E.ex[qid] || { ok: 0, fail: 0 };
            if (ok) r.ok++; else r.fail++;
            r.ult = ok; E.ex[qid] = r; guardar();
        },
        examenPregunta: function (qid) { return (E.ex || {})[qid] || null; },
        examenFin: function (etiqueta, ok, total, seg) {
            E.exHist = [{ f: new Date().toISOString(), e: etiqueta, ok: ok, t: total, s: seg || 0 }].concat(E.exHist || []).slice(0, 20);
            guardar();
        },
        examenHistorial: function () { return E.exHist || []; },

        registrarSesion: function (min, tema) {
            E.sesiones = (E.sesiones || []).concat([{ f: new Date().toISOString(), min: min, tema: tema }]).slice(-200);
            guardar();
        },
        sesiones: function () { return E.sesiones || []; },

        todo: function () { return E; },
        reiniciar: function () { E = vacio(); guardar(); }
    };
})();
