/* ============================================================
   VISTA · #/farmacos[?l=a&p=ab&q=texto]  ·  Listado de fármacos (antes «Vademécum»)
   Letras A-Z, filtro por segunda letra y lista debajo (como un vademécum).
   Las entradas salen de los nombres de los temas (content/): el nombre del
   grupo y cada fármaco que aparece entre paréntesis o separado por «,» «/» «y».
   No se inventa nada: cada entrada enlaza al tema donde está explicada.
   ============================================================ */
FA.vistas.listado = (function () {
    var u = FA.u;
    var OTROS_NOMBRES = /^(EPO|G-CSF|Fenicoles|Polimixina E)$/i;
    var EXTRA = ['potasio', 'calcio', 'magnesio'];                 // electrolitos de la sesión 1 que sí son "fármacos"
    // Temas cuyo nombre no se puede partir de forma automática: se indican a mano las entradas (nombre, tipo)
    var MANUAL = {
        potasio: [["Potasio", "Fármaco"], ["K+", "Otro nombre"]],
        calcio: [["Calcio", "Fármaco"], ["Ca2+", "Otro nombre"]],
        magnesio: [["Magnesio", "Fármaco"], ["Mg2+", "Otro nombre"]],
        "expectorantes-mucoliticos": [["Expectorantes", "Grupo"], ["Mucolíticos", "Grupo"], ["Guaifenesina", "Fármaco"], ["N-acetilcisteína", "Fármaco"], ["Ambroxol", "Fármaco"], ["Bromhexina", "Fármaco"]],
        "estreptograminas-linezolid": [["Estreptograminas", "Grupo"], ["Quinupristina", "Fármaco"], ["Dalfopristina", "Fármaco"], ["Linezolid", "Fármaco"]]
    };

    function sinTilde(s) { return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s; }
    function clave(s) { return sinTilde(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }
    function partir(t) { return t.split(/\s*[,\/]\s*|\s+y\s+/).map(function (x) { return x.trim(); }).filter(Boolean); }

    /* ── presentaciones en Colombia (data/presentaciones.js, generado por tools/presentaciones-invima.ps1) ── */
    var PRES = (window.FARMA_PRES && window.FARMA_PRES.items) || {};
    var NOMBRE_CAT = { ampolla: 'Ampolla', pastilla: 'Pastilla', jarabe: 'Jarabe' };

    function presentaciones(e) {
        var d = PRES[clave(e.nombre)];
        if (!d || e.tipo === 'Grupo') return { d: null };
        var formas = d.formas || [], cats = {}, otras = [];
        formas.forEach(function (f) {
            if (f.cat === 'otra') { if (f.n + f.comb > 0) otras.push(f.forma + (f.via ? ' (' + f.via.toLowerCase() + ')' : '')); return; }
            var c = cats[f.cat] || (cats[f.cat] = { solo: 0, comb: 0 });
            c.solo += f.n; c.comb += f.comb;
        });
        return { d: d, cats: cats, otras: otras, formas: formas };
    }

    function detalle(p) {
        if (!p.formas.length) return '';
        var fuente = (window.FARMA_PRES && window.FARMA_PRES.fuente) || '';
        var lis = p.formas.map(function (f) {
            var n = f.n ? f.n + (f.n === 1 ? ' registro' : ' registros') : '', c = f.comb ? f.comb + ' en combinación' : '';
            var cuenta = [n, c].filter(Boolean).join(' · ');
            return '<li><b>' + u.esc(f.forma) + '</b>' + (f.via ? ' · ' + u.esc(f.via.toLowerCase()) : '') + (cuenta ? ' — ' + cuenta : '') +
                (f.ej && f.ej.length ? '. Ej.: ' + f.ej.map(u.esc).join('; ') : '') +
                (f.fuente ? ' <span class="fuente">(' + (f.url ? '<a href="' + u.esc(f.url) + '" target="_blank" rel="noopener">' + u.esc(f.fuente) + '</a>' : u.esc(f.fuente)) + ')</span>' : '') + '</li>';
        }).join('');
        var total = p.d.registros;
        return '<details class="vm__det"><summary>Presentaciones en Colombia' + (total ? ' (' + total + ' ' + (total === 1 ? 'registro' : 'registros') + ')' : '') + '</summary><ul>' + lis + '</ul>' +
            (p.d.nota ? '<p class="fuente">' + u.esc(p.d.nota) + '</p>' : '') +
            '<p class="fuente">Fuente: ' + u.esc(fuente) + (window.FARMA_PRES ? ' · consulta del ' + window.FARMA_PRES.fecha : '') + '.</p></details>';
    }

    function fila(e) {
        var p = e.tipo === 'Grupo' ? { d: null } : presentaciones(e);
        var rico = p.d != null;
        var iconos = '', nota = '';
        if (rico) {
            ['ampolla', 'vial', 'jarabe', 'pastilla', 'inhalador'].forEach(function (cat) {
                var c = p.cats[cat]; if (!c || (c.solo + c.comb) === 0) return;
                iconos += FA.frascos.html(cat, clave(e.nombre), { tenue: c.solo === 0, titulo: c.solo === 0 ? 'Sólo en combinación con otros principios activos' : '' });
            });
            if (!iconos) nota = '<p class="vm__nota">' + u.esc(p.d.nota || 'Sin presentación en ampolla, vial, pastilla, jarabe o inhalador.') + '</p>';
            else if (p.otras.length) nota = '<p class="vm__nota">También: ' + u.esc(p.otras.slice(0, 4).join(', ')) + '.</p>';
        }
        return '<li class="vm__item' + (rico ? ' vm__item--rico' : '') + '">' +
            (rico ? '<div class="vm__icos">' + (iconos || '') + '</div>' : '') +
            (rico ? '<div class="vm__cuerpo">' : '') +
            '<div class="vm__linea"><a href="#/farmaco/' + e.tema + '"><b>' + u.esc(e.nombre) + '</b></a>' +
            '<span class="chip chip--fijo vm__tipo">' + e.tipo + '</span></div>' +
            '<small>' + (e.nombre === e.temaNombre ? '' : u.esc(e.temaNombre) + ' · ') + 'Sesión ' + e.sesion + '</small>' +
            (rico ? nota + detalle(p) + '</div>' : '') + '</li>';
    }

    var cache = null;
    function entradas() {
        if (cache) return cache;
        var por = {}, lista = [];
        function sumar(nombre, tipo, f) {
            nombre = nombre.replace(/\s+/g, ' ').trim();
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
            var k = clave(nombre); if (!k || !/[a-z]/.test(sinTilde(nombre).toLowerCase())) return;
            var id = k + '|' + f.id; if (por[id]) return;
            var e = { nombre: nombre, key: sinTilde(nombre).toLowerCase(), tipo: tipo, tema: f.id, temaNombre: f.nombre, sesion: f.sesion, grupo: f.grupo || '' };
            por[id] = e; lista.push(e);
        }
        FA.datos.farmacos.forEach(function (f) {
            if (!(f.quiz || []).length) return;                    // plantillas vacías: aún no hay contenido
            if (!(f.sesion >= 4 || EXTRA.indexOf(f.id) >= 0)) return;
            if (MANUAL[f.id]) { MANUAL[f.id].forEach(function (m) { sumar(m[0], m[1], f); }); return; }
            var nombre = f.nombre, dentro = [], base = nombre.replace(/\(([^)]*)\)/g, function (_, d) { dentro.push(d); return ' '; });
            var partesBase = partir(base);
            var hayLista = dentro.some(function (d) { return !OTROS_NOMBRES.test(d.trim()); });
            partesBase.forEach(function (p) { sumar(p, (partesBase.length === 1 && hayLista) ? 'Grupo' : 'Fármaco', f); });
            dentro.forEach(function (d) {
                if (OTROS_NOMBRES.test(d.trim())) sumar(d, 'Otro nombre', f);
                else partir(d).forEach(function (p) { sumar(p, 'Fármaco', f); });
            });
        });
        lista.sort(function (a, b) { return a.key < b.key ? -1 : a.key > b.key ? 1 : 0; });
        cache = lista; return lista;
    }

    function leerEstado() {
        var q = (location.hash.split('?')[1] || ''), o = { l: '', p: '', q: '' };
        q.split('&').forEach(function (kv) { var a = kv.split('='); if (a[0] in o) o[a[0]] = decodeURIComponent((a[1] || '').replace(/\+/g, ' ')); });
        return o;
    }

    return {
        titulo: 'Listado de fármacos',
        render: function () {
            return '<div class="pagina">' +
                '<header class="cabecera"><p class="eyebrow">Consulta</p><h1>Listado de fármacos</h1>' +
                '<p class="lead">Índice alfabético de los fármacos y grupos que aparecen en los temas. Toca uno para abrir su explicación.</p></header>' +
                '<div class="panel vm__panel"><h2 class="vm__tit">Índice alfabético</h2><div class="vm__letras" data-letras role="group" aria-label="Letra inicial"></div></div>' +
                '<div class="panel vm__panel" data-segunda hidden><h2 class="vm__tit">Filtrar por segunda letra</h2><div class="vm__letras vm__letras--chicas" data-pref role="group" aria-label="Dos primeras letras"></div></div>' +
                '<label class="campo vm__buscar"><span>Buscar en el índice</span><input type="search" data-q placeholder="Escribe el nombre del fármaco o del grupo…" autocomplete="off"></label>' +
                '<p class="alcance__cuenta" data-cuenta aria-live="polite"></p><div data-lista></div></div>';
        },
        montar: function (el) {
            FA.frascos.defs();
            var E = entradas(), st = leerEstado();
            var letrasEl = el.querySelector('[data-letras]'), prefEl = el.querySelector('[data-pref]'), segEl = el.querySelector('[data-segunda]');
            var listaEl = el.querySelector('[data-lista]'), cuenta = el.querySelector('[data-cuenta]'), qEl = el.querySelector('[data-q]');
            var ABC = 'abcdefghijklmnopqrstuvwxyz'.split(''), hay = {};
            E.forEach(function (e) { hay[e.key.charAt(0)] = true; });
            qEl.value = st.q;

            function guardarUrl() {
                var p = []; if (st.l) p.push('l=' + st.l); if (st.p) p.push('p=' + st.p); if (st.q) p.push('q=' + encodeURIComponent(st.q));
                try { history.replaceState(null, '', '#/farmacos' + (p.length ? '?' + p.join('&') : '')); } catch (e) { }
            }

            function pintarLetras() {
                letrasEl.innerHTML = '<button type="button" class="vm__letra vm__letra--todos" data-l="" aria-pressed="' + (!st.l) + '">Todos</button>' +
                    ABC.map(function (c) {
                        return '<button type="button" class="vm__letra" data-l="' + c + '" aria-pressed="' + (st.l === c) + '"' + (hay[c] ? '' : ' disabled') + '>' + c.toUpperCase() + '</button>';
                    }).join('');
                var pref = [];
                if (st.l) E.forEach(function (e) { var p = e.key.slice(0, 2); if (e.key.charAt(0) === st.l && pref.indexOf(p) < 0) pref.push(p); });
                segEl.hidden = !(st.l && pref.length > 1);
                prefEl.innerHTML = '<button type="button" class="vm__letra vm__letra--chica" data-p="" aria-pressed="' + (!st.p) + '">Todos</button>' +
                    pref.map(function (p) { return '<button type="button" class="vm__letra vm__letra--chica" data-p="' + p + '" aria-pressed="' + (st.p === p) + '">' + p + '</button>'; }).join('');
            }

            function pintarLista() {
                var q = sinTilde(st.q.trim()).toLowerCase();
                var v = E.filter(function (e) {
                    if (st.l && e.key.charAt(0) !== st.l) return false;
                    if (st.p && e.key.slice(0, 2) !== st.p) return false;
                    if (!q) return true;
                    return (e.key + ' ' + sinTilde(e.temaNombre).toLowerCase() + ' ' + sinTilde(e.grupo).toLowerCase()).indexOf(q) >= 0;
                });
                cuenta.textContent = v.length + (v.length === 1 ? ' entrada' : ' entradas') + (st.l ? ' · empiezan por «' + (st.p || st.l).toUpperCase() + '»' : '');
                if (!v.length) { listaEl.innerHTML = '<div class="vacio"><b>Sin resultados</b><p>Prueba con otra letra o borra la búsqueda.</p></div>'; return; }
                var html = '', ult = '';
                v.forEach(function (e) {
                    var L = e.key.charAt(0).toUpperCase();
                    if (L !== ult) { if (ult) html += '</ul></section>'; html += '<section class="vm__grupo"><h2 class="vm__letra-tit" id="vm-' + L + '">' + L + '</h2><ul class="vm__lista">'; ult = L; }
                    html += fila(e);
                });
                listaEl.innerHTML = html + '</ul></section>';
                listaEl.insertAdjacentHTML("beforeend", '<p class="vm__pie">Presentaciones: ' + ((window.FARMA_PRES && window.FARMA_PRES.fuente) ? u.esc(window.FARMA_PRES.fuente) : "sin datos") + '. Sólo presentaciones colombianas; si una no aparece, no se inventa. Verifica siempre en el registro sanitario de INVIMA.</p>');
            }

            function todo() { pintarLetras(); pintarLista(); guardarUrl(); }

            letrasEl.addEventListener('click', function (e) {
                var b = e.target.closest('[data-l]'); if (!b || b.disabled) return;
                st.l = b.dataset.l; st.p = ''; todo();
            });
            prefEl.addEventListener('click', function (e) {
                var b = e.target.closest('[data-p]'); if (!b) return; st.p = b.dataset.p; todo();
            });
            qEl.addEventListener('input', function () { st.q = qEl.value; pintarLista(); guardarUrl(); });
            todo();
        }
    };
})();
