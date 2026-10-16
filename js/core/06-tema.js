/* ============================================================
   NÚCLEO · tema claro / oscuro
   El atributo <html data-tema> ya lo puso el script mínimo del <head>
   (para que no haya parpadeo). Aquí se gestiona el botón.
   Por defecto la página se ve en modo claro; el modo oscuro lo activa el estudiante con el botón.
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

    etiquetas();

    return { actual: actual, alternar: alternar, aplicar: aplicar };
})();
