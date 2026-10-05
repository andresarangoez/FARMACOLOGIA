/* ============================================================
   VISTA · #/comparar  ·  Tabla comparativa de fármacos
   Fármaco | Grupo | Mecanismo | Efectos adversos | Sesión
   Las filas las genera FA.pares.filas() desde content/ (sin texto nuevo).
   Cuando un tema no tiene mecanismo en los apuntes se muestra "—".
   Filtros: sesión y texto libre; también se puede ordenar por columna.
   ============================================================ */
FA.vistas.comparar = (function () {
    var u = FA.u;

    function norm(s) { return FA.buscar && FA.buscar.norm ? FA.buscar.norm(s) : String(s).toLowerCase(); }

    function celda(t) { return t ? u.esc(t) : '<span class="sin-dato" title="Aún no está en los apuntes">—</span>'; }

    return {
        titulo: 'Comparar fármacos',
        render: function () {
            return '<div class="pagina">' +
                '<header class="cabecera"><p class="eyebrow">Estudio</p><h1>Comparar fármacos</h1>' +
                '<p class="lead">Grupo, mecanismo y efectos adversos lado a lado, tomados de los apuntes. Útil para distinguir fármacos que se parecen.</p></header>' +
                '<div class="panel comp__filtros"><label class="campo"><span>Buscar</span><input type="search" data-q placeholder="Fármaco, grupo, mecanismo…" autocomplete="off"></label>' +
                '<div class="chips" data-ses role="group" aria-label="Sesión"></div>' +
                '<p class="alcance__cuenta" data-cuenta aria-live="polite"></p></div>' +
                '<div class="tabla-wrap"><table class="comp"><thead><tr>' +
                ['farmaco:Fármaco', 'grupo:Grupo', 'mecanismo:Mecanismo', 'efectos:Efectos adversos', 'sesion:Sesión'].map(function (c) {
                    var p = c.split(':'); return '<th scope="col"><button type="button" class="comp__ord" data-ord="' + p[0] + '">' + p[1] + '</button></th>';
                }).join('') + '</tr></thead><tbody data-cuerpo></tbody></table></div></div>';
        },
        montar: function (el) {
            var filas = FA.pares.filas(), st = { q: '', ses: [], ord: 'sesion', asc: true };
            var ses = []; filas.forEach(function (f) { if (ses.indexOf(f.sesion) < 0) ses.push(f.sesion); });
            var cuerpo = el.querySelector('[data-cuerpo]'), cuenta = el.querySelector('[data-cuenta]');
            el.querySelector('[data-ses]').innerHTML = ses.map(function (n) { return '<button type="button" class="chip" data-s="' + n + '" aria-pressed="false">Sesión ' + n + '</button>'; }).join('');

            function pintar() {
                var q = norm(st.q.trim()), toks = q ? q.split(/\s+/) : [];
                var v = filas.filter(function (f) {
                    if (st.ses.length && st.ses.indexOf(f.sesion) < 0) return false;
                    var h = norm([f.farmaco, f.grupo, f.mecanismo, f.efectos.join(' ')].join(' '));
                    return toks.every(function (t) { return h.indexOf(t) >= 0; });
                });
                v.sort(function (a, b) {
                    var x = a[st.ord], y = b[st.ord];
                    if (st.ord === 'efectos') { x = a.efectos.length; y = b.efectos.length; }
                    var c = x < y ? -1 : x > y ? 1 : 0;
                    return (st.asc ? c : -c) || (a.farmaco < b.farmaco ? -1 : 1);
                });
                cuerpo.innerHTML = v.map(function (f) {
                    return '<tr><th scope="row"><a href="#/farmaco/' + f.tema + '">' + u.esc(f.farmaco) + '</a></th>' +
                        '<td>' + celda(f.grupo) + '</td><td>' + celda(f.mecanismo) + '</td>' +
                        '<td>' + (f.efectos.length ? '<ul class="comp__lista">' + f.efectos.map(function (e) { return '<li>' + u.esc(e) + '</li>'; }).join('') + '</ul>' : celda('')) + '</td>' +
                        '<td>' + f.sesion + '</td></tr>';
                }).join('') || '<tr><td colspan="5" class="vacio">Ningún fármaco coincide.</td></tr>';
                cuenta.textContent = v.length + (v.length === 1 ? ' fármaco' : ' fármacos');
                el.querySelectorAll('[data-ord]').forEach(function (b) {
                    var on = b.dataset.ord === st.ord;
                    b.parentNode.setAttribute('aria-sort', on ? (st.asc ? 'ascending' : 'descending') : 'none');
                });
            }

            el.querySelector('[data-q]').addEventListener('input', function (e) { st.q = e.target.value; pintar(); });
            el.querySelector('[data-ses]').addEventListener('click', function (e) {
                var b = e.target.closest('.chip'); if (!b) return; var n = +b.dataset.s, i = st.ses.indexOf(n);
                if (i >= 0) st.ses.splice(i, 1); else st.ses.push(n); b.setAttribute('aria-pressed', i < 0); pintar();
            });
            el.querySelector('thead').addEventListener('click', function (e) {
                var b = e.target.closest('[data-ord]'); if (!b) return;
                if (st.ord === b.dataset.ord) st.asc = !st.asc; else { st.ord = b.dataset.ord; st.asc = true; }
                pintar();
            });
            pintar();
        }
    };
})();
