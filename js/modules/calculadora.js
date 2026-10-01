/* ============================================================
   VISTA · #/calculadora[/<id>]
   Selector de fórmula, campos con sus unidades, resultado y
   procedimiento paso a paso. Se recalcula al escribir.
   ============================================================ */
FA.vistas.calculadora = {
    titulo: 'Calculadora',
    render: function (p) {
        var u = FA.u;
        return '<div class="pagina">' +
            '<header class="cabecera"><p class="eyebrow">Herramienta</p><h1>Calculadora de fórmulas</h1>' +
            '<p class="lead">Elige una fórmula, escribe los datos y revisa el procedimiento paso a paso, como se explica en clase.</p></header>' +
            '<div class="calc">' +
            '<nav class="calc__lista" aria-label="Fórmulas">' +
            FA.formulas.lista.map(function (f, i) {
                return '<button type="button" class="calc__op" data-f="' + f.id + '"><span class="calc__n">' + (i + 1) + '</span><span><b>' + u.esc(f.nombre) + '</b><small>' + u.esc(f.desc) + '</small></span></button>';
            }).join('') + '</nav>' +
            '<section class="calc__panel" data-panel aria-live="polite"></section></div>' +
            '<p class="aviso">Herramienta de estudio. Antes de preparar o administrar un medicamento, verifica el cálculo con el protocolo y la guía de tu institución.</p></div>';
    },
    montar: function (el, p) {
        var u = FA.u;
        var actual = FA.formulas.buscar(p.id) || FA.formulas.lista[0];
        var valores = {};
        var panel = el.querySelector('[data-panel]');

        function numero(x) { var n = parseFloat(String(x).replace(',', '.')); return isNaN(n) ? NaN : n; }

        function visibles(f) { return f.campos.filter(function (c) { return !c.si || c.si(lectura(f)); }); }

        function lectura(f) {
            var v = {};
            f.campos.forEach(function (c) {
                var raw = valores[f.id + '.' + c.id];
                if (c.tipo === 'select') v[c.id] = raw != null ? raw : c.opciones[0].v;
                else v[c.id] = raw === undefined || raw === '' ? NaN : numero(raw);
            });
            return v;
        }

        function pintarCampos() {
            var f = actual, v = lectura(f);
            el.querySelectorAll('.calc__op').forEach(function (b) { b.setAttribute('aria-current', b.dataset.f === f.id ? 'true' : 'false'); });
            panel.innerHTML =
                '<h2>' + u.esc(f.nombre) + '</h2><p class="ayuda">' + u.esc(f.desc) + (f.nota ? ' · ' + u.esc(f.nota) : '') + '</p>' +
                '<form class="calc__form" novalidate>' +
                f.campos.filter(function (c) { return !c.si || c.si(v); }).map(function (c) {
                    if (c.tipo === 'select') {
                        return '<label class="campo"><span>' + u.esc(c.label) + '</span><select data-c="' + c.id + '">' +
                            c.opciones.map(function (o) { return '<option value="' + o.v + '"' + (v[c.id] === o.v ? ' selected' : '') + '>' + u.esc(o.t) + '</option>'; }).join('') + '</select></label>';
                    }
                    var val = valores[f.id + '.' + c.id];
                    return '<label class="campo"><span>' + u.esc(c.label) + '</span><span class="campo__inp"><input type="number" inputmode="decimal" step="any" min="0" data-c="' + c.id + '" value="' + (val == null ? '' : u.esc(val)) + '"><em>' + u.esc(c.unidad) + '</em></span></label>';
                }).join('') +
                '<div class="fila-botones"><button type="button" class="btn btn--sec" data-ejemplo>Cargar ejemplo</button><button type="button" class="btn btn--sec" data-limpiar>Limpiar</button></div></form>' +
                '<div data-resultado></div>';
            calcular();
        }

        function calcular() {
            var f = actual, v = lectura(f), cont = panel.querySelector('[data-resultado]');
            var faltan = visibles(f).filter(function (c) { return c.tipo !== 'select' && isNaN(v[c.id]); });
            if (faltan.length) {
                cont.innerHTML = '<div class="calc__vacio">Completa los datos para ver el resultado y el procedimiento.</div>';
                return;
            }
            var r = f.calcular(v);
            if (r.error) { cont.innerHTML = '<div class="feedback feedback--mal"><b>Revisa los datos:</b> ' + u.esc(r.error) + '</div>'; return; }
            cont.innerHTML =
                '<div class="resultados">' + r.resultados.map(function (x) {
                    return '<div class="res"><small>' + u.esc(x.l) + '</small><b>' + u.esc(x.v) + '</b><span>' + u.esc(x.u) + '</span></div>';
                }).join('') + '</div>' +
                '<h3>Procedimiento</h3><ol class="pasos">' + r.pasos.map(function (s) {
                    return '<li><b>' + u.esc(s.t) + '</b>' +
                        '<div class="paso__f"><small>Fórmula</small><code>' + u.esc(s.f) + '</code></div>' +
                        '<div class="paso__f"><small>Con tus datos</small><code>' + u.esc(s.s) + '</code></div>' +
                        '<div class="paso__r">= ' + u.esc(s.r) + '</div>' +
                        (s.n ? '<p class="paso__n">' + u.esc(s.n) + '</p>' : '') + '</li>';
                }).join('') + '</ol>';
        }

        el.addEventListener('click', function (e) {
            var op = e.target.closest('.calc__op');
            if (op) { actual = FA.formulas.buscar(op.dataset.f); history.replaceState(null, '', '#/calculadora/' + actual.id); pintarCampos(); return; }
            if (e.target.closest('[data-ejemplo]')) {
                var ej = actual.ejemplo;
                Object.keys(ej).forEach(function (k) { valores[actual.id + '.' + k] = ej[k]; });
                pintarCampos(); return;
            }
            if (e.target.closest('[data-limpiar]')) {
                actual.campos.forEach(function (c) { delete valores[actual.id + '.' + c.id]; });
                pintarCampos();
            }
        });
        el.addEventListener('input', function (e) {
            var c = e.target.closest('[data-c]'); if (!c || c.tagName === 'SELECT') return;
            valores[actual.id + '.' + c.dataset.c] = c.value; calcular();
        });
        el.addEventListener('change', function (e) {
            var c = e.target.closest('[data-c]'); if (!c || c.tagName !== 'SELECT') return;
            valores[actual.id + '.' + c.dataset.c] = c.value; pintarCampos();
        });

        pintarCampos();
    }
};
