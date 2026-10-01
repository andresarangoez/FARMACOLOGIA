/* ============================================================
   NÚCLEO · progreso (localStorage, sólo en este navegador)
   ============================================================ */
FA.estado = (function () {
    var CLAVE = 'farmacologia-v1';
    var vacio = function () { return { estudiado: {}, cards: {}, preg: {}, historial: [] }; };
    var E = vacio();

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

        todo: function () { return E; },
        reiniciar: function () { E = vacio(); guardar(); }
    };
})();
