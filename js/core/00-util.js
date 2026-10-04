/* ============================================================
   NÚCLEO · utilidades
   ============================================================ */
window.FA = window.FA || {};
FA.vistas = FA.vistas || {};

FA.u = (function () {
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* Markdown en línea: `código`, **negrita**, *cursiva* */
    function inline(s) {
        s = esc(s);
        s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
        s = s.replace(/\*\*(.+?)\*\*(?!\*)/g, '<strong>$1</strong>');
        s = s.replace(/(^|[^*\w])\*([^*\s](?:[^*]*?[^*\s])?)\*(?!\*)/g, '$1<em>$2</em>');
        return s;
    }

    function slug(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function mezclar(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    /* Número con hasta 2 decimales, sin ceros sobrantes */
    function num(x, dec) {
        if (!isFinite(x)) return '—';
        var d = dec == null ? 2 : dec;
        return String(+x.toFixed(d));
    }

    function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }

    function icono(nombre) {
        var P = {
            check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
            flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
            atras: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
            barra: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
            tarjeta: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h10M7 14h6"/>',
            quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8M12 17h.01"/>',
            calc: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
            estrella: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/>',
            libro: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10"/>',
            candado: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2"/>',
            reloj: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/>',
            buscar:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'
        };
        return '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[nombre] || '') + '</svg>';
    }

    return { esc: esc, inline: inline, slug: slug, mezclar: mezclar, num: num, pct: pct, icono: icono };
})();
