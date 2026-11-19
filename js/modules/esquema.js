/* ============================================================
   ESQUEMA ANIMADO DEL MECANISMO DE ACCIÓN
   Lee el frontmatter «esquema: Fármaco:: paso → paso ;; Otro:: …»
   y arma una escena ilustrada (célula, bacteria o parásito) que
   avanza paso a paso: contexto → llega el fármaco → bloqueo → desenlace.
   ============================================================ */
FA.esquemaMecanismo = (function () {
    var NS = 'http://www.w3.org/2000/svg';
    var RE_ACC = /se une|ocupa|bloquea|inhibe|atrapa|neutraliz|activa|estimula|compite|abre|se inserta|corta|rompe|desplaza|estabiliza|se convierte|administrado|disminuye|modula/i;
    var RE_BLOQ = /bloque|inhib|impid|no se|sin |neutraliz|atrapa|compite|rompe|corta|no |menos|cae /i;

    /* ---------- lectura del texto ---------- */
    function organismo(t) {
        if (/helminto|ivermectina|pirantel|piperazina|praziquantel|tubulina|gusano|tenia/i.test(t)) return 'parasito';
        if (/bacteri|bacilo|gram|30S|50S|23S|PABA|porinas|micobacter|leprae|anaerob|protozo|lipopolisac|D-Ala|ARNt|PFOR|tizoxanida|parásito/i.test(t)) return 'bacteria';
        return 'celula';
    }
    function diana(org, paso) {
        if (org === 'parasito') return 'cuerpo';
        if (org === 'bacteria') {
            if (/30S|50S|23S|ARNt|ribosom|ARNm/i.test(paso)) return 'ribosoma';
            if (/ADN|ARN polimerasa|girasa|topoisom/i.test(paso)) return 'adn';
            if (/pared|D-Ala|micólic|transpept|lipopolisac|membrana|poros|calcio/i.test(paso)) return 'pared';
            return 'enzima';
        }
        if (/atrapa|neutraliz|IgE|RANKL|C5\b|p40|proteína F|antígeno protector|VEGF-A|trombina|TNF|IL-17A|el VEGF/i.test(paso)) return 'fuera';
        if (/receptor|CD\d+|EGFR|VEGFR|bivalente|membrana|canal/i.test(paso)) return /quinasa|cinasa/i.test(paso) ? 'membrana-tk' : 'membrana';
        if (/ADN|núcleo|topoisom/i.test(paso)) return 'nucleo';
        return 'dentro';
    }
    function desenlace(fin) {
        if (/^más |más (glóbulos|plaquetas|surfactante)|sube|aumenta el recuento|más neutr/i.test(fin)) return 'aumenta';
        if (/apoptosis|muerte|(?:^|\s)lisis|parálisis|destrucción|bactericida|daño del ADN|rompe el ADN|muere/i.test(fin)) return 'muerte';
        return 'calma';
    }
    function etiquetaMuerte(t) {
        if (/parálisis/i.test(t)) return 'Parálisis';
        if (/(^|\s)lisis/i.test(t)) return 'Lisis';
        if (/apoptosis/i.test(t)) return 'Apoptosis';
        return 'Muerte';
    }
    function nombreCelula(t) {
        var L = [[/linfocito T|Th1|injerto|IL-2/i, 'Linfocito T'], [/linfocito B|CD20/i, 'Linfocito B'], [/osteoclasto|RANK/i, 'Osteoclasto'],
            [/mastocito/i, 'Mastocito'], [/megacariocito/i, 'Megacariocito'], [/eritroide/i, 'Precursor eritroide'], [/neutrófil|G-CSF/i, 'Precursor mieloide'],
            [/queratinocito|piel/i, 'Queratinocito'], [/leucém|tumor|cáncer|BCR-ABL|BRAF|EGFR/i, 'Célula tumoral'],
            [/arteria|endotel|vasos|retina/i, 'Célula vascular'], [/alvéol|neumocito|bronqu|vía aérea|moco|tos/i, 'Vía aérea'],
            [/colon|mucosa|digestiv/i, 'Mucosa intestinal'], [/coagul|hemólisis|complemento/i, 'Sangre']];
        for (var i = 0; i < L.length; i++) if (L[i][0].test(t)) return L[i][1];
        return 'Célula';
    }
    function etiquetaDiana(paso) {
        var m = /(?:se une(?: de forma \w+)?(?: alostéricamente)? (?:a|al)|ocupa|bloquea[n]?|inhibe[n]?|atrapa[n]?|neutraliza[n]?|activa[n]?|estimula|compite con|corta|rompe)\s+(?:(?:el|la|los|las|su|sus|a|al|selectivamente|de forma \w+)\s+)*(.+)$/i.exec(paso);
        var t = m ? m[1] : '';
        t = t.replace(/\s*\(.*$/, '').replace(/\s+(en|de los|del|y bloquea|de la médula).*$/i, '');
        var w = t.split(/\s+/), out = '';
        for (var i = 0; i < w.length; i++) { if ((out + ' ' + w[i]).trim().length > 20) break; out = (out + ' ' + w[i]).trim(); }
        return out.replace(/\s+(y|de|del|la|el|su)$/i, '') || 'Diana';
    }
    function corto(nombre) { return (nombre || 'Fármaco').split(/\s*\/\s*/)[0].replace(/\s*\(.*$/, ''); }

    /* ajustes revisados a mano: org, diana, des(enlace), lbl (diana), cel (célula), iF (paso del fármaco) */
    var AJUSTE = {
        'teofilina': { lbl: 'Fosfodiesterasa' }, 'montelukast': { lbl: 'Receptor CysLT1' }, 'cromoglicato': { lbl: 'Membrana' },
        'surfactante': { diana: 'fuera', lbl: 'Alvéolo', cel: 'Alvéolo' }, 'dornasa alfa': { diana: 'fuera', lbl: 'ADN del moco', cel: 'Vía aérea' },
        'palivizumab': { cel: 'Célula respiratoria', lbl: 'Proteína F' }, 'raxibacumab': { lbl: 'Toxina' },
        'codeína': { lbl: 'Receptor opioide', cel: 'Neurona del bulbo' }, 'dextrometorfano': { lbl: 'Receptor NMDA', cel: 'Neurona del bulbo' },
        'guaifenesina': { lbl: 'Glándula' }, 'n-acetilcisteína': { diana: 'fuera', lbl: 'Moco' }, 'ambroxol': { lbl: 'Neumocito II', cel: 'Neumocito tipo II' },
        'bosentán': { lbl: 'Receptor ETA/ETB' }, 'sildenafil': { lbl: 'PDE5', cel: 'Músculo liso' },
        'sulfasalazina': { org: 'celula', diana: 'dentro', lbl: '5-ASA', cel: 'Mucosa del colon' },
        'octreótido': { diana: 'membrana', lbl: 'Receptor SST', cel: 'Célula endocrina' },
        'metotrexato': { lbl: 'DHFR', cel: 'Célula en división' }, 'azatioprina': { lbl: 'Purinas', cel: 'Linfocito' }, 'ciclosporina': { lbl: 'Calcineurina' },
        'micofenolato': { lbl: 'IMPDH', cel: 'Linfocito' }, 'talidomida': { lbl: 'TNF-α', cel: 'Célula inmune' },
        'sulfonamida': { lbl: 'Enzima DHPS' }, 'trimetoprim': { lbl: 'DHFR bacteriana' }, 'linezolid': { lbl: 'ARN 23S (50S)' },
        'polimixina': { lbl: 'LPS de la membrana' }, 'daptomicina': { lbl: 'Membrana' }, 'clofazimina': { diana: 'adn', lbl: 'ADN' },
        'imatinib': { lbl: 'BCR-ABL' }, 'ponatinib': { lbl: 'BCR-ABL T315I' }, 'vemurafenib': { lbl: 'BRAF V600E' },
        'sirolimus': { lbl: 'mTORC1', cel: 'Linfocito' }, 'tacrolimus': { lbl: 'Calcineurina' },
        'gefitinib': { diana: 'membrana-tk', lbl: 'EGFR' }, 'nimotuzumab': { lbl: 'EGFR' }, 'sunitinib': { diana: 'membrana-tk', lbl: 'VEGFR / PDGFR' },
        'bortezomib': { lbl: 'Proteasoma 26S', cel: 'Célula tumoral' },
        'gemtuzumab': { diana: 'membrana', lbl: 'CD33', iF: 0, cel: 'Célula leucémica' }, 'brentuximab': { diana: 'membrana', lbl: 'CD30', iF: 0, cel: 'Célula tumoral' },
        'ibritumomab': { diana: 'membrana', lbl: 'CD20', iF: 0 }, 'eculizumab': { des: 'calma' },
        'albendazol': { lbl: 'Tubulina' }, 'ivermectina': { lbl: 'Canales de cloro' }, 'pirantel': { lbl: 'Receptor nicotínico' },
        'metronidazol': { diana: 'adn', lbl: 'ADN' }
    };
    function ajuste(nombre) { var k = nombre.toLowerCase(); for (var c in AJUSTE) if (k.indexOf(c) === 0) return AJUSTE[c]; return {}; }

    function analizar(nombre, pasos) {
        var todo = nombre + ' ' + pasos.join(' '), n = pasos.length;
        var toks = nombre.toLowerCase().split(/[\s\/,]+/).filter(function (x) { return x.length > 3; });
        toks.push('fármaco');
        var iF = -1, i;
        for (i = 0; i < n - 1 && iF < 0; i++) {
            var p = pasos[i].toLowerCase();
            if (toks.some(function (t) { return p.indexOf(t) >= 0; })) iF = i;
        }
        for (i = 1; i < n - 1 && iF < 0; i++) if (RE_ACC.test(pasos[i])) iF = i;
        if (iF < 0) iF = n > 2 ? 1 : 0;
        /* si el paso del fármaco es solo su nombre, la acción está en el siguiente */
        var pasoAcc = pasos[iF].split(/\s+/).length <= 2 && iF + 1 < n - 1 ? pasos[iF + 1] : pasos[iF];
        var aj = ajuste(nombre);
        var org = aj.org || organismo(todo);
        var d = aj.diana || diana(org, pasoAcc);
        if (aj.iF != null) iF = aj.iF;
        return {
            org: org, diana: d, des: aj.des || desenlace(pasos[n - 1]), iF: iF,
            interna: /internaliza/i.test(todo), mab: /mab\b|anticuerpo/i.test(nombre + ' ' + pasoAcc),
            lblDiana: aj.lbl || etiquetaDiana(pasoAcc), lblFarm: corto(nombre),
            lblOrg: aj.cel ? aj.cel : org === 'celula' ? nombreCelula(todo) : (org === 'parasito' ? 'Helminto' : (/protozo|parásito|PFOR/i.test(todo) ? 'Microorganismo' : (/bacilo|micobacter|leprae/i.test(todo) ? 'Micobacteria' : 'Bacteria'))),
            muerte: etiquetaMuerte(pasos[n - 1])
        };
    }

    /* ---------- dibujo ---------- */
    var POS = {
        celula: { membrana: [150, 44], 'membrana-tk': [150, 104], dentro: [150, 134], nucleo: [240, 132], fuera: [108, 46], interna: [232, 160] },
        bacteria: { ribosoma: [140, 128], adn: [232, 124], pared: [180, 84], enzima: [205, 164], interna: [232, 150] },
        parasito: { cuerpo: [180, 136], interna: [180, 150] }
    };
    var SENAL = {
        membrana: 'M150 92 Q150 140 208 156', 'membrana-tk': 'M150 92 Q150 140 208 156', fuera: 'M150 92 Q150 140 208 156',
        dentro: 'M166 150 Q190 166 208 160', nucleo: 'M160 150 Q190 168 208 160',
        ribosoma: 'M156 150 Q195 122 262 132', adn: 'M240 152 Q256 180 292 164', pared: 'M120 104 Q180 112 240 104', enzima: 'M216 178 Q240 192 276 172'
    };
    var EQUIS = { membrana: [160, 128], 'membrana-tk': [160, 128], fuera: [160, 128], dentro: [188, 160], nucleo: [190, 162], ribosoma: [196, 128], adn: [262, 172], pared: [180, 112], enzima: [244, 184] };

    function farmacoSVG(a) {
        var forma = a.mab
            ? '<path class="es-mab" d="M0 14 L0 2 L-9 -9 M0 2 L9 -9"/><circle class="es-mab-p" cx="-9" cy="-9" r="2.6"/><circle class="es-mab-p" cx="9" cy="-9" r="2.6"/>'
            : '<rect class="es-pil" x="-11" y="-6" width="22" height="12" rx="6"/><rect class="es-pil-m" x="0" y="-6" width="11" height="12" rx="0"/>';
        return '<g class="es-farm" data-farm><g class="es-farm-in"><g transform="scale(1.55)">' + forma + '</g><text class="es-lbl es-lbl--farm" y="-24" text-anchor="middle">' + FA.u.esc(a.lblFarm) + '</text></g></g>';
    }

    function escena(a) {
        var u = FA.u, s = '', d = a.diana;
        s += '<defs><radialGradient id="esg-cel" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#1e4f95"/><stop offset="1" stop-color="#0b2a5c"/></radialGradient></defs>';
        if (a.org === 'celula') {
            s += '<g class="es-org"><ellipse class="es-cel" cx="190" cy="150" rx="140" ry="78"/>' +
                '<circle class="es-nuc" cx="240" cy="160" r="30"/><text class="es-lbl es-lbl--suave" x="240" y="163" text-anchor="middle">Núcleo</text></g>';
            if (d === 'membrana' || d === 'membrana-tk' || d === 'fuera')
                s += '<g class="es-rec" transform="translate(150 75)"><rect x="-5" y="-12" width="10" height="34" rx="4"/><path d="M-12 -12 V-26 M12 -12 V-26"/></g>';
            if (d === 'dentro' || d === 'nucleo' || d === 'membrana-tk')
                s += '<g class="es-diana-g"><circle class="es-diana" cx="150" cy="' + (d === 'membrana-tk' ? 108 : 150) + '" r="19"/></g>';
            if (d === 'fuera')
                s += '<g class="es-lig">' + [0, 1, 2].map(function (i) { return '<circle class="es-lig-p" r="6" style="offset-path:path(\'M' + (40 + i * 22) + ' ' + (18 + (i % 2) * 18) + ' Q120 20 150 48\');animation-delay:-' + (i * 0.6) + 's"/>'; }).join('') + '</g>';
            else if (d === 'membrana' || d === 'membrana-tk')
                s += '<g class="es-lig es-lig--uno"><circle class="es-lig-p" r="6" style="offset-path:path(\'M70 18 Q120 18 150 48\')"/></g>';
        } else if (a.org === 'bacteria') {
            s += '<g class="es-org"><rect class="es-bac" x="50" y="92" width="260" height="110" rx="55"/>' +
                '<path class="es-pili" d="M50 147 h-22 M310 147 h22 M90 98 l-10 -14 M270 98 l10 -14 M90 196 l-10 14 M270 196 l10 14"/>' +
                '<g class="es-ribo" transform="translate(140 150)"><ellipse rx="16" ry="10" cy="-6"/><ellipse rx="12" ry="8" cy="9"/></g>' +
                '<path class="es-adn" d="M210 146 q8 -14 16 0 t16 0 t16 0"/><path class="es-adn es-adn--b" d="M210 146 q8 14 16 0 t16 0 t16 0"/>' +
                (d === 'enzima' ? '<circle class="es-diana" cx="205" cy="178" r="12"/>' : '') + '</g>';
        } else {
            s += '<g class="es-org es-gusano"><path class="es-worm" d="M40 150 C90 104 130 196 180 150 S270 104 320 150"/><circle class="es-worm-c" cx="322" cy="150" r="15"/></g>';
        }
        /* señal interna */
        if (SENAL[d]) s += '<g class="es-senal">' + [0, 1, 2].map(function (i) { return '<circle r="4.5" style="offset-path:path(\'' + SENAL[d] + '\');animation-delay:-' + (i * 0.5) + 's"/>'; }).join('') + '</g>';
        var x = EQUIS[d];
        if (x) s += '<g class="es-x" transform="translate(' + x[0] + ' ' + x[1] + ')"><circle r="12"/><path d="M-5 -5 L5 5 M5 -5 L-5 5"/></g>';
        /* desenlace */
        if (a.des === 'aumenta') s += '<g class="es-clon"><ellipse cx="44" cy="208" rx="28" ry="19"/><ellipse cx="322" cy="204" rx="26" ry="18"/><text class="es-lbl es-lbl--mas" x="44" y="214" text-anchor="middle">+</text><text class="es-lbl es-lbl--mas" x="322" y="210" text-anchor="middle">+</text></g>';
        if (a.des === 'muerte') s += '<g class="es-frag"><circle cx="70" cy="70" r="9"/><circle cx="310" cy="80" r="7"/><circle cx="300" cy="220" r="8"/><circle cx="60" cy="210" r="6"/></g>';
        /* etiquetas */
        var LBL = { fuera: [70, 70], membrana: [196, 50, 'start'], 'membrana-tk': [150, 146], dentro: [150, 190], nucleo: [240, 210], ribosoma: [140, 186], adn: [234, 186], pared: [180, 226], enzima: [205, 208], cuerpo: [180, 200] };
        var lp = LBL[d] || [180, 120];
        s += '<text class="es-lbl es-lbl--diana" text-anchor="' + (lp[2] || 'middle') + '" x="' + lp[0] + '" y="' + lp[1] + '">' + u.esc(a.lblDiana) + '</text>';
        s += '<text class="es-lbl es-lbl--org" x="180" y="237" text-anchor="middle">' + u.esc(a.lblOrg) + '</text>';
        s += farmacoSVG(a);
        return '<svg class="es-svg es-org--' + a.org + '" viewBox="0 0 360 240" role="img" aria-label="Animación del mecanismo">' + s + '</svg>';
    }

    /* ---------- HTML ---------- */
    function esquema(txt) {
        var u = FA.u;
        if (!txt) return '';
        var flujos = txt.split(/\s*;;\s*/).map(function (b) {
            var m = /^(.*?)::\s*(.*)$/.exec(b);
            return { nombre: m ? m[1].trim() : '', pasos: (m ? m[2] : b).split(/\s*→\s*/).filter(Boolean) };
        });
        var tabs = flujos.length > 1 ? '<div class="es-tabs" role="tablist">' + flujos.map(function (f, i) {
            return '<button type="button" role="tab" class="es-tab' + (i ? '' : ' es-tab--on') + '" aria-selected="' + (!i) + '" data-tab="' + i + '">' + u.esc(f.nombre) + '</button>';
        }).join('') + '</div>' : '';
        var cuerpos = flujos.map(function (f, i) {
            var a = analizar(f.nombre, f.pasos);
            var lista = '<ol class="esq__pasos">' + f.pasos.map(function (p, j) {
                var tipo = j === 0 ? 'inicio' : (j === f.pasos.length - 1 ? 'fin' : (RE_BLOQ.test(p) ? 'bloqueo' : 'medio'));
                return '<li class="esq__paso esq__paso--' + tipo + '"><span class="esq__n">' + (j + 1) + '</span><span class="esq__t">' + u.esc(p) + '</span></li>';
            }).join('') + '</ol>';
            return '<div class="esq__flujo" data-flujo="' + i + '"' + (i ? ' hidden' : '') + ' data-n="' + f.pasos.length + '" data-if="' + a.iF + '" data-diana="' + a.diana + '" data-org="' + a.org + '" data-des="' + a.des + '" data-interna="' + (a.interna ? 1 : 0) + '" data-pasos="' + u.esc(JSON.stringify(f.pasos)) + '">' +
                (f.nombre ? '<b class="esq__nombre">' + u.esc(f.nombre) + '</b>' : '') +
                '<div class="es-escena" data-k="0">' + escena(a) +
                '<span class="es-chip" data-chip></span></div>' +
                '<div class="es-paso" aria-live="polite"><span class="es-paso__n" data-num>1</span><p data-txt>' + u.esc(f.pasos[0]) + '</p></div>' +
                '<div class="es-ctrl">' +
                '<button type="button" class="es-btn" data-prev aria-label="Paso anterior">‹</button>' +
                '<button type="button" class="es-btn es-btn--play" data-play>▶ Reproducir</button>' +
                '<button type="button" class="es-btn" data-next aria-label="Paso siguiente">›</button>' +
                '<span class="es-puntos">' + f.pasos.map(function (_, j) { return '<button type="button" class="es-punto' + (j ? '' : ' es-punto--on') + '" data-ir-paso="' + j + '" aria-label="Paso ' + (j + 1) + '"></button>'; }).join('') + '</span>' +
                '</div><div class="es-lista">' + lista + '</div></div>';
        }).join('');
        return '<figure class="esquema" aria-label="Mecanismo de acción"><figcaption class="es-cab"><span>Mecanismo de acción</span><span class="es-modo" role="group" aria-label="Forma de ver el mecanismo"><button type="button" class="es-modo__b es-modo__b--on" data-modo="anim" aria-pressed="true">Animación</button><button type="button" class="es-modo__b" data-modo="esq" aria-pressed="false">Esquema</button></span></figcaption>' + tabs + cuerpos + '</figure>';
    }

    /* ---------- interacción ---------- */
    function montar(raiz) {
        var fig = raiz.querySelector('.esquema'); if (!fig) return;
        var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var flujos = [].slice.call(fig.querySelectorAll('[data-flujo]'));
        var ctl = flujos.map(function (fl) { return controlador(fl, reducido); });
        fig.querySelectorAll('[data-tab]').forEach(function (b) {
            b.addEventListener('click', function () {
                var i = +b.dataset.tab;
                fig.querySelectorAll('[data-tab]').forEach(function (x) { var on = x === b; x.classList.toggle('es-tab--on', on); x.setAttribute('aria-selected', on); });
                flujos.forEach(function (fl, j) { fl.hidden = j !== i; if (j !== i) ctl[j].parar(); });
                ctl[i].ir(0); if (!reducido) ctl[i].play();
            });
        });
        /* selector Animación | Esquema (por defecto, animación) */
        fig.querySelectorAll('[data-modo]').forEach(function (b) {
            b.addEventListener('click', function () {
                var esq = b.dataset.modo === 'esq';
                fig.classList.toggle('es--modo-esq', esq);
                fig.querySelectorAll('[data-modo]').forEach(function (x) { var on = x === b; x.classList.toggle('es-modo__b--on', on); x.setAttribute('aria-pressed', on); });
                if (esq) ctl.forEach(function (c) { c.parar(); });
            });
        });
        /* arranca solo la primera vez que el esquema entra en pantalla */
        if (!reducido && 'IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (ent) {
                if (ent[0].isIntersecting) { io.disconnect(); if (fig.classList.contains('es--modo-esq')) return; var v = flujos.filter(function (f) { return !f.hidden; })[0]; if (v) ctl[flujos.indexOf(v)].play(); }
            }, { threshold: 0.55 });
            io.observe(fig);
        }
    }

    function controlador(fl, reducido) {
        var n = +fl.dataset.n, iF = +fl.dataset.if, org = fl.dataset.org, d = fl.dataset.diana, des = fl.dataset.des, interna = fl.dataset.interna === '1';
        var pasos = JSON.parse(fl.dataset.pasos);
        var esc = fl.querySelector('.es-escena'), farm = fl.querySelector('[data-farm]'), chip = fl.querySelector('[data-chip]');
        var num = fl.querySelector('[data-num]'), txt = fl.querySelector('[data-txt]'), play = fl.querySelector('[data-play]');
        var puntos = [].slice.call(fl.querySelectorAll('[data-ir-paso]'));
        var k = 0, timer = null;
        var pos = POS[org], destino = pos[d] || [180, 120], inicio = [-30, 24];
        var muerte = (function () { var t = pasos[n - 1]; return etiquetaMuerte(t); })();

        function ir(i) {
            k = Math.max(0, Math.min(n - 1, i));
            var conF = k >= iF, efecto = k > iF, fin = k === n - 1;
            esc.dataset.k = k;
            esc.classList.toggle('es--farm', conF);
            esc.classList.toggle('es--efecto', efecto || (fin && conF));
            esc.classList.toggle('es--fin', fin);
            esc.classList.toggle('es--' + des, fin);
            var p = !conF ? inicio : (efecto && interna ? pos.interna : destino);
            farm.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px)';
            farm.style.opacity = conF ? 1 : 0;
            chip.textContent = fin ? (des === 'muerte' ? muerte : (des === 'aumenta' ? 'Más células' : 'Efecto logrado')) : (conF && k === iF ? 'Llega el fármaco' : (efecto ? 'Señal bloqueada' : 'Situación inicial'));
            chip.className = 'es-chip es-chip--' + (fin ? des : (conF && k === iF ? 'farm' : (efecto ? 'bloq' : 'ini')));
            num.textContent = k + 1; txt.textContent = pasos[k];
            puntos.forEach(function (b, j) { b.classList.toggle('es-punto--on', j === k); b.classList.toggle('es-punto--hecho', j < k); });
        }
        function parar() { if (timer) clearInterval(timer); timer = null; play.textContent = '▶ Reproducir'; play.setAttribute('aria-pressed', 'false'); }
        function reproducir() {
            if (timer) return parar();
            if (k === n - 1) ir(0);
            play.textContent = '❚❚ Pausa'; play.setAttribute('aria-pressed', 'true');
            timer = setInterval(function () {
                if (!fl.isConnected) return parar();
                if (k >= n - 1) return parar();
                ir(k + 1);
            }, 2600);
        }
        fl.querySelector('[data-prev]').addEventListener('click', function () { parar(); ir(k - 1); });
        fl.querySelector('[data-next]').addEventListener('click', function () { parar(); ir(k + 1); });
        play.addEventListener('click', reproducir);
        puntos.forEach(function (b) { b.addEventListener('click', function () { parar(); ir(+b.dataset.irPaso); }); });
        ir(0);
        return { ir: ir, parar: parar, play: function () { if (!timer) reproducir(); } };
    }

    esquema.montar = montar;
    return esquema;
})();
