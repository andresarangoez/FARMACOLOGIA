/* ============================================================
   COMPONENTE · dibujos animados de presentaciones (ampolla, pastilla, jarabe)
   FA.frascos.html(cat, clave) → HTML de un dibujo con sombra y animación (flotar, burbujas, brillo).
   El color sale de la clave del fármaco (cada fármaco, un color). Sólo CSS: sin imágenes ni librerías.
   La ampolla está basada en ampolla_animada_de_digoxina.html. Con «reducir movimiento» activado en el
   sistema, los dibujos quedan quietos.
   ============================================================ */
FA.frascos = (function () {
    var CAB = {
        ampolla: 'Ampolla', vial: 'Vial', pastilla: 'Pastilla', jarabe: 'Jarabe', inhalador: 'Inhalador'
    };

    function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; }
    function tono(clave) { return (hash(clave) * 47) % 360; }                 // matiz 0-359, estable por fármaco
    function retraso(clave, cat) { return -((hash(clave + cat) % 40) / 10); }  // desfase negativo para que no floten todos a la vez

    /* Recortes (geometría fija, sin colores): se agregan una sola vez al documento */
    function defs() {
        if (document.getElementById('fr-defs')) return;
        var d = document.createElement('div');
        d.id = 'fr-defs'; d.setAttribute('aria-hidden', 'true');
        d.innerHTML = '<svg width="0" height="0" style="position:absolute"><defs>' +
            '<clipPath id="fr-clip-amp"><path d="M55 240V460C55 480 75 490 100 490C125 490 145 480 145 460V240Z"/></clipPath>' +
            '<clipPath id="fr-clip-bot"><path d="M24 92C24 80 32 74 46 70L46 60H94L94 70C108 74 116 80 116 92V196C116 204 110 210 102 210H38C30 210 24 204 24 196Z"/></clipPath>' +
            '<clipPath id="fr-clip-vial"><path d="M44 62C30 66 26 72 26 84V176C26 188 34 194 46 194H94C106 194 114 188 114 176V84C114 72 110 66 96 62Z"/></clipPath>' +
            '</defs></svg>';
        document.body.appendChild(d);
    }

    var DIBUJOS = {
        ampolla:
            '<svg class="fr fr--amp" viewBox="0 0 200 520" aria-hidden="true" focusable="false">' +
              '<g clip-path="url(#fr-clip-amp)">' +
                '<rect class="fr-c1" x="50" y="250" width="100" height="250"/>' +
                '<ellipse class="fr-c2 fr-ola" cx="100" cy="250" rx="50" ry="12"/>' +
                '<circle class="fr-bur b1" cx="80" cy="440" r="7"/><circle class="fr-bur b2" cx="112" cy="462" r="9"/><circle class="fr-bur b3" cx="95" cy="420" r="6"/>' +
              '</g>' +
              '<path class="fr-vidrio" d="M90 30C90 20 110 20 110 30L112 100C112 110 106 125 106 135L106 150C106 160 145 180 145 210L145 460C145 485 125 495 100 495C75 495 55 485 55 460L55 210C55 180 94 160 94 150L94 135C94 125 88 110 88 100Z"/>' +
              '<rect x="88" y="112" width="24" height="6" rx="3" fill="#dc2626"/><rect class="fr-c3" x="89" y="124" width="22" height="7" rx="3"/><circle cx="100" cy="143" r="4" fill="#dc2626"/>' +
              '<rect x="58" y="270" width="84" height="140" rx="5" fill="#fff" opacity=".96"/><rect class="fr-c3" x="58" y="270" width="84" height="16" rx="3"/>' +
              '<rect x="72" y="304" width="56" height="9" rx="4" fill="#0f172a"/><rect class="fr-c3" x="76" y="324" width="48" height="7" rx="3"/>' +
              '<rect x="70" y="344" width="60" height="4" rx="2" fill="#cbd5e1"/><rect x="78" y="356" width="44" height="4" rx="2" fill="#cbd5e1"/>' +
              '<path class="fr-brillo" d="M63 215L63 450" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>' +
              '<path d="M64 200C70 180 90 165 92 155" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7" fill="none"/>' +
            '</svg>',
        vial:
            '<svg class="fr fr--vial" viewBox="0 0 140 210" aria-hidden="true" focusable="false">' +
              '<g clip-path="url(#fr-clip-vial)">' +
                '<rect class="fr-c1" x="20" y="130" width="100" height="70"/>' +
                '<ellipse class="fr-c2 fr-ola" cx="70" cy="130" rx="46" ry="7"/>' +
                '<circle class="fr-bur b1" cx="52" cy="180" r="3.5"/><circle class="fr-bur b2" cx="86" cy="186" r="4.5"/><circle class="fr-bur b3" cx="68" cy="172" r="3"/>' +
              '</g>' +
              '<path class="fr-vidrio" d="M44 62C30 66 26 72 26 84V176C26 188 34 194 46 194H94C106 194 114 188 114 176V84C114 72 110 66 96 62Z"/>' +
              '<rect class="fr-vidrio" x="44" y="46" width="52" height="18" rx="2"/>' +
              '<rect x="34" y="36" width="72" height="12" rx="3" fill="#475569"/><rect class="fr-c3" x="38" y="12" width="64" height="26" rx="6"/>' +
              '<ellipse cx="70" cy="14" rx="18" ry="5" fill="#fff" opacity=".45"/><rect x="38" y="30" width="64" height="3" fill="#fff" opacity=".3"/>' +
              '<rect x="34" y="92" width="72" height="62" rx="5" fill="#fff" opacity=".96"/><rect class="fr-c3" x="34" y="92" width="72" height="12" rx="3"/>' +
              '<rect x="44" y="114" width="52" height="8" rx="4" fill="#0f172a"/><rect class="fr-c3" x="50" y="129" width="40" height="6" rx="3"/><rect x="48" y="141" width="44" height="4" rx="2" fill="#cbd5e1"/>' +
              '<path class="fr-brillo" d="M31 90L31 178" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>' +
            '</svg>',
        inhalador:
            '<svg class="fr fr--inh" viewBox="0 0 190 210" aria-hidden="true" focusable="false">' +
              '<circle class="fr-vapor v1" cx="150" cy="156" r="6"/><circle class="fr-vapor v2" cx="150" cy="156" r="5"/><circle class="fr-vapor v3" cx="150" cy="156" r="7"/>' +
              '<rect class="fr-c1" x="46" y="8" width="46" height="100" rx="8"/>' +
              '<rect class="fr-c3" x="46" y="8" width="46" height="14" rx="6"/>' +
              '<rect x="52" y="42" width="34" height="46" rx="4" fill="#fff" opacity=".95"/><rect class="fr-c3" x="56" y="52" width="26" height="6" rx="3"/><rect x="56" y="64" width="26" height="4" rx="2" fill="#cbd5e1"/><rect x="56" y="74" width="20" height="4" rx="2" fill="#cbd5e1"/>' +
              '<path class="fr-c3" d="M30 100H108A12 12 0 0 1 120 112V150H146A14 14 0 0 1 160 164V170A14 14 0 0 1 146 184H46A16 16 0 0 1 30 168Z"/>' +
              '<path class="fr-vidrio" d="M30 100H108A12 12 0 0 1 120 112V150H146A14 14 0 0 1 160 164V170A14 14 0 0 1 146 184H46A16 16 0 0 1 30 168Z" fill="none"/>' +
              '<ellipse cx="152" cy="167" rx="5" ry="9" fill="#0f172a" opacity=".55"/>' +
              '<path class="fr-brillo" d="M38 112L38 160" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>' +
            '</svg>',
        pastilla:
            '<svg class="fr fr--pas" viewBox="0 0 170 130" aria-hidden="true" focusable="false">' +
              '<g class="fr-oscila"><g transform="translate(60 66)">' +
                '<circle class="fr-c3" r="46"/><circle class="fr-c1" r="42"/><circle class="fr-c2" r="30" opacity=".35"/>' +
                '<path d="M-42 0H42" stroke="#0f172a" stroke-opacity=".28" stroke-width="3" stroke-linecap="round"/>' +
                '<path d="M-33 -22C-24 -34 -10 -39 2 -39" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".75"/>' +
              '</g></g>' +
              '<g class="fr-oscila fr-oscila--b"><g transform="translate(128 74) rotate(-38)">' +
                '<rect class="fr-c3" x="-34" y="-16" width="68" height="32" rx="16"/>' +
                '<path class="fr-c1" d="M0 -14H18A14 14 0 0 1 18 14H0Z"/><path d="M-18 -14H0V14H-18A14 14 0 0 1 -18 -14Z" fill="#fff"/>' +
                '<path d="M-26 -8H-4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/><path d="M6 -8H24" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>' +
              '</g></g>' +
            '</svg>',
        jarabe:
            '<svg class="fr fr--bot" viewBox="0 0 140 220" aria-hidden="true" focusable="false">' +
              '<g clip-path="url(#fr-clip-bot)">' +
                '<rect class="fr-c1" x="20" y="112" width="100" height="100"/>' +
                '<ellipse class="fr-c2 fr-ola" cx="70" cy="112" rx="52" ry="8"/>' +
                '<circle class="fr-bur b1" cx="48" cy="180" r="4"/><circle class="fr-bur b2" cx="88" cy="190" r="5"/><circle class="fr-bur b3" cx="68" cy="170" r="3.5"/>' +
              '</g>' +
              '<path class="fr-vidrio" d="M24 92C24 80 32 74 46 70L46 60H94L94 70C108 74 116 80 116 92V196C116 204 110 210 102 210H38C30 210 24 204 24 196Z"/>' +
              '<rect class="fr-c3" x="40" y="14" width="60" height="30" rx="6"/><rect x="40" y="22" width="60" height="3" fill="#fff" opacity=".35"/><rect x="40" y="31" width="60" height="3" fill="#fff" opacity=".25"/>' +
              '<rect x="44" y="44" width="52" height="16" rx="2" fill="#fff" opacity=".5"/>' +
              '<rect x="30" y="118" width="80" height="68" rx="5" fill="#fff" opacity=".96"/><rect class="fr-c3" x="30" y="118" width="80" height="14" rx="3"/>' +
              '<rect x="42" y="144" width="56" height="8" rx="4" fill="#0f172a"/><rect class="fr-c3" x="48" y="160" width="44" height="6" rx="3"/><rect x="46" y="173" width="48" height="4" rx="2" fill="#cbd5e1"/>' +
              '<path class="fr-brillo" d="M31 100L31 190" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>' +
            '</svg>'
    };

    return {
        categorias: CAB,
        defs: defs,
        /* un dibujo con sombra y etiqueta; cat = ampolla | pastilla | jarabe */
        html: function (cat, clave, opciones) {
            var o = opciones || {};
            if (!DIBUJOS[cat]) return '';
            return '<figure class="fr-caja' + (o.tenue ? ' fr-caja--tenue' : '') + '" style="--h:' + tono(clave) + ';--d:' + retraso(clave, cat).toFixed(1) + 's"' +
                (o.titulo ? ' title="' + o.titulo + '"' : '') + '>' +
                '<span class="fr-esc">' + DIBUJOS[cat] + '</span><i class="fr-sombra" aria-hidden="true"></i>' +
                '<figcaption>' + CAB[cat] + '</figcaption></figure>';
        }
    };
})();
