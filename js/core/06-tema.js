/* ============================================================
   NÚCLEO · tema claro / oscuro
   El atributo <html data-tema> ya lo puso el script mínimo del <head>
   (para que no haya parpadeo). Aquí se gestiona el botón y el cambio
   de preferencia del sistema mientras la persona no haya elegido.
   La elección manual se guarda en localStorage ('farmacologia-tema').
   ============================================================ */
FA.tema = (function () {
    var CLAVE = 'farmacologia-tema';
    var raiz = document.documentElement;

    function guardado() { try { return window.localStorage.getItem(CLAVE); } catch (e) { return null; } }
    function actual() { return raiz.getAttribute('data-tema') === 'oscuro' ? 'oscuro' : 'claro'; }

    function etiquetas() {
        var b = document.querySelector('[data-accion="tema"]'); if (!b) return;
        var osc = actual() === 'oscuro';
        b.setAttribute('aria-pressed', osc);
        b.setAttribute('aria-label', osc ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        b.title = osc ? 'Modo claro' : 'Modo oscuro';
    }

    function aplicar(t) { raiz.setAttribute('data-tema', t); etiquetas(); }

    function alternar() {
        var t = actual() === 'oscuro' ? 'claro' : 'oscuro';
        aplicar(t);
        try { window.localStorage.setItem(CLAVE, t); } catch (e) { }
    }

    /* si no eligió a mano, seguir al sistema */
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var cambio = function (e) { if (!guardado()) aplicar(e.matches ? 'oscuro' : 'claro'); };
        if (mq.addEventListener) mq.addEventListener('change', cambio); else if (mq.addListener) mq.addListener(cambio);
    }
    etiquetas();

    return { actual: actual, alternar: alternar, aplicar: aplicar };
})();
