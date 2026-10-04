/* ============================================================
   ARRANQUE · acciones globales e inicio del enrutador
   ============================================================ */
(function () {
    var ACCIONES = {
        tema: function () { FA.tema.alternar(); },
        saltar: function () { var m = document.getElementById('app'); if (m) { m.focus(); m.scrollIntoView(); } },
        menu: function (btn) {
            var nav = document.getElementById('nav');
            var abierta = nav.classList.toggle('abierta');
            btn.setAttribute('aria-expanded', abierta);
            btn.setAttribute('aria-label', abierta ? 'Cerrar menú' : 'Abrir menú');
        }
    };
    document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-accion]');
        if (b && ACCIONES[b.dataset.accion]) { e.preventDefault(); ACCIONES[b.dataset.accion](b, e); }
    });
    FA.router.iniciar();
})();
