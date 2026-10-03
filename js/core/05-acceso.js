/* ============================================================
   NÚCLEO · acceso con clave a "Datos examen"
   La página no guarda la clave: guarda solo su huella SHA-256 y
   compara la huella de lo que escribe la persona (sin distinguir
   mayúsculas). Al acertar, el acceso dura mientras la pestaña esté
   abierta.
   OJO: es un candado de cortesía. En una página estática el
   contenido sigue estando en los archivos; no es seguridad real.
   Para cambiar la clave: reemplaza HUELLA por el SHA-256 de la
   nueva clave en MAYÚSCULAS.
   ============================================================ */
FA.acceso = (function () {
    var HUELLA = '4b2328cbd2d98f15b890a9ec93d5cd32d8b58535be8d74954fcb979cccfe8484';
    var CLAVE_SESION = 'fa-examen-ok';
    var enMemoria = false;

    /* SHA-256 en JavaScript puro (funciona también al abrir index.html con doble clic) */
    function sha256(texto) {
        var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
        var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
        var bytes = unescape(encodeURIComponent(texto)).split('').map(function (c) { return c.charCodeAt(0); });
        var bits = bytes.length * 8;
        bytes.push(0x80);
        while (bytes.length % 64 !== 56) bytes.push(0);
        for (var s = 56; s >= 0; s -= 8) bytes.push(s >= 32 ? 0 : (bits >>> s) & 0xff);
        function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
        for (var i = 0; i < bytes.length; i += 64) {
            var w = [];
            for (var t = 0; t < 16; t++) w[t] = (bytes[i + 4 * t] << 24) | (bytes[i + 4 * t + 1] << 16) | (bytes[i + 4 * t + 2] << 8) | bytes[i + 4 * t + 3];
            for (t = 16; t < 64; t++) {
                var s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
                var s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
                w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
            }
            var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
            for (t = 0; t < 64; t++) {
                var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g);
                var t1 = (h + S1 + ch + K[t] + w[t]) | 0;
                var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c);
                var t2 = (S0 + mj) | 0;
                h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
            }
            H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
        }
        return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
    }

    function abierto() {
        if (enMemoria) return true;
        try { return window.sessionStorage.getItem(CLAVE_SESION) === HUELLA; } catch (e) { return false; }
    }

    function probar(clave) {
        var ok = sha256(String(clave).trim().toUpperCase()) === HUELLA;
        if (ok) {
            enMemoria = true;
            try { window.sessionStorage.setItem(CLAVE_SESION, HUELLA); } catch (e) { }
        }
        return ok;
    }

    /* Pantalla de clave; al acertar vuelve a dibujar la vista actual */
    function pantalla() {
        var u = FA.u;
        return '<div class="pagina pagina--estrecha"><div class="panel candado">' +
            '<div class="candado__icono">' + u.icono('candado') + '</div>' +
            '<h1>Datos examen</h1>' +
            '<p class="lead">Este material está protegido. Escribe la clave para entrar.</p>' +
            '<form class="candado__form" data-candado novalidate>' +
            '<label class="campo"><span>Clave</span><input type="password" data-clave autocomplete="off" placeholder="Escribe la clave" aria-describedby="candado-msg"></label>' +
            '<p class="candado__error" id="candado-msg" role="alert" hidden>La clave no es correcta. Inténtalo de nuevo.</p>' +
            '<div class="fila-botones"><button type="submit" class="btn">Entrar ' + u.icono('flecha') + '</button>' +
            '<a class="btn btn--sec" href="#/sesiones">Volver a sesiones</a></div>' +
            '</form></div></div>';
    }

    function montar(el) {
        var f = el.querySelector('[data-candado]'); if (!f) return;
        var inp = f.querySelector('[data-clave]'), msg = f.querySelector('.candado__error');
        f.addEventListener('submit', function (e) {
            e.preventDefault();
            if (probar(inp.value)) FA.router.render();
            else { msg.hidden = false; inp.value = ''; inp.focus(); }
        });
        inp.focus();
    }

    return { abierto: abierto, pantalla: pantalla, montar: montar, _sha256: sha256 };
})();
