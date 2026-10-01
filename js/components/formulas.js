/* ============================================================
   COMPONENTE · fórmulas de la calculadora
   Cada fórmula: { id, nombre, desc, campos, ejemplo, nota, calcular(v) }
   calcular devuelve { error } o { pasos:[{t,f,s,r}], resultados:[{l,v,u}] }
     t = título del paso · f = fórmula · s = con tus números · r = resultado del paso
   Se muestra el procedimiento paso a paso, no sólo el número final.
   Fuente: calculadora-formulas.md (clase de cuidado crítico neo-pediátrico).
   Para agregar una fórmula, basta con sumar un objeto a la lista.
   ============================================================ */
FA.formulas = (function () {
    var n = FA.u.num;

    function positivos(v, campos, etiquetas) {
        for (var i = 0; i < campos.length; i++) {
            if (!(v[campos[i]] > 0)) return 'El campo «' + (etiquetas[campos[i]] || campos[i]) + '» debe ser mayor que 0.';
        }
        return null;
    }
    function etiq(f) { var o = {}; f.campos.forEach(function (c) { o[c.id] = c.label; }); return o; }

    var LISTA = [
        /* 1 ─────────────────────────────────────────── */
        {
            id: 'holliday-segar', nombre: 'Holliday-Segar', desc: 'Líquidos de mantenimiento según el peso',
            campos: [{ id: 'peso', label: 'Peso', unidad: 'kg' }],
            ejemplo: { peso: 14 },
            nota: 'Los primeros 10 kg a 100 mL/kg, los siguientes 10 kg a 50 mL/kg y el resto a 20 mL/kg.',
            calcular: function (v) {
                var e = positivos(v, ['peso'], { peso: 'Peso' }); if (e) return { error: e };
                var p = v.peso, total, t, f, s;
                if (p <= 10) { total = p * 100; t = 'Peso ≤ 10 kg'; f = 'total = peso × 100'; s = n(p) + ' × 100'; }
                else if (p <= 20) { total = 1000 + (p - 10) * 50; t = 'Peso entre 10 y 20 kg'; f = 'total = 1000 + (peso − 10) × 50'; s = '1000 + (' + n(p) + ' − 10) × 50'; }
                else { total = 1500 + (p - 20) * 20; t = 'Peso > 20 kg'; f = 'total = 1000 + 500 + (peso − 20) × 20'; s = '1500 + (' + n(p) + ' − 20) × 20'; }
                var a = Math.min(p, 10), b = Math.max(0, Math.min(p, 20) - 10), c = Math.max(0, p - 20);
                var rapido = a * 4 + b * 2 + c;
                return {
                    pasos: [
                        { t: 'Paso 1 · Líquidos en 24 horas (' + t + ')', f: f, s: s, r: n(total) + ' mL/24 h' },
                        { t: 'Paso 2 · Pasar a mL por hora', f: 'mL/hora = total ÷ 24', s: n(total) + ' ÷ 24', r: n(total / 24) + ' mL/h' },
                        { t: 'Paso 3 · Regla abreviada de cc/hora (4-2-1)', f: 'cc/hora = 10 kg × 4 + siguientes 10 kg × 2 + resto × 1',
                          s: n(a) + ' × 4 + ' + n(b) + ' × 2 + ' + n(c) + ' × 1', r: n(rapido) + ' cc/h',
                          n: 'La regla abreviada y el total ÷ 24 pueden diferir ligeramente.' }
                    ],
                    resultados: [{ l: 'Mantenimiento', v: n(total), u: 'mL/24 h' }, { l: 'Velocidad', v: n(total / 24), u: 'mL/h' }, { l: 'Regla abreviada', v: n(rapido), u: 'cc/h' }]
                };
            }
        },

        /* 2 ─────────────────────────────────────────── */
        {
            id: 'superficie-corporal', nombre: 'Superficie corporal', desc: 'Mosteller y variantes sin talla',
            campos: [
                { id: 'metodo', label: 'Método', tipo: 'select', opciones: [
                    { v: 'mosteller', t: 'Mosteller (peso y talla)' },
                    { v: 'menor10', t: 'Sin talla · menor de 10 kg' },
                    { v: 'mayor10', t: 'Sin talla · mayor de 10 kg' }] },
                { id: 'peso', label: 'Peso', unidad: 'kg' },
                { id: 'talla', label: 'Talla', unidad: 'cm', si: function (v) { return v.metodo === 'mosteller'; } }
            ],
            ejemplo: { metodo: 'mosteller', peso: 18, talla: 108 },
            nota: 'Resultado en m². Las variantes sin talla se usan cuando no se tiene la estatura.',
            calcular: function (v) {
                var m = v.metodo || 'mosteller', p = v.peso, sc, pasos;
                if (!(p > 0)) return { error: 'El campo «Peso» debe ser mayor que 0.' };
                if (m === 'mosteller') {
                    if (!(v.talla > 0)) return { error: 'El campo «Talla» debe ser mayor que 0.' };
                    var prod = p * v.talla; sc = Math.sqrt(prod / 3600);
                    pasos = [
                        { t: 'Paso 1 · Multiplicar peso por talla', f: 'peso × talla', s: n(p) + ' × ' + n(v.talla), r: n(prod) },
                        { t: 'Paso 2 · Dividir entre 3600', f: '(peso × talla) ÷ 3600', s: n(prod) + ' ÷ 3600', r: n(prod / 3600, 4) },
                        { t: 'Paso 3 · Raíz cuadrada', f: 'SC = √( (peso × talla) ÷ 3600 )', s: '√' + n(prod / 3600, 4), r: n(sc, 3) + ' m²' }
                    ];
                } else if (m === 'menor10') {
                    if (p >= 10) return { error: 'Esta variante es para pacientes de menos de 10 kg.' };
                    sc = (p * 4 + 9) / 100;
                    pasos = [
                        { t: 'Paso 1 · Peso × 4 + 9', f: 'peso × 4 + 9', s: n(p) + ' × 4 + 9', r: n(p * 4 + 9) },
                        { t: 'Paso 2 · Dividir entre 100', f: 'SC = (peso × 4 + 9) ÷ 100', s: n(p * 4 + 9) + ' ÷ 100', r: n(sc, 3) + ' m²' }
                    ];
                } else {
                    if (p <= 10) return { error: 'Esta variante es para pacientes de más de 10 kg.' };
                    sc = (p * 4 + 7) / (p + 90);
                    pasos = [
                        { t: 'Paso 1 · Numerador', f: 'peso × 4 + 7', s: n(p) + ' × 4 + 7', r: n(p * 4 + 7) },
                        { t: 'Paso 2 · Denominador', f: 'peso + 90', s: n(p) + ' + 90', r: n(p + 90) },
                        { t: 'Paso 3 · Dividir', f: 'SC = (peso × 4 + 7) ÷ (peso + 90)', s: n(p * 4 + 7) + ' ÷ ' + n(p + 90), r: n(sc, 3) + ' m²' }
                    ];
                }
                return { pasos: pasos, resultados: [{ l: 'Superficie corporal', v: n(sc, 3), u: 'm²' }] };
            }
        },

        /* 3 ─────────────────────────────────────────── */
        {
            id: 'flujo-metabolico', nombre: 'Flujo metabólico (VIG)', desc: 'Velocidad de infusión de glucosa con dextrosa',
            campos: [
                { id: 'modo', label: 'Qué quieres calcular', tipo: 'select', opciones: [
                    { v: 'flujo', t: 'Flujo deseado → cc/hora' },
                    { v: 'verificar', t: 'Verificar el flujo que recibe el paciente' }] },
                { id: 'flujo', label: 'Flujo deseado', unidad: 'mg/kg/min', si: function (v) { return v.modo !== 'verificar'; } },
                { id: 'cch', label: 'Volumen de la infusión', unidad: 'cc/hora', si: function (v) { return v.modo === 'verificar'; } },
                { id: 'peso', label: 'Peso', unidad: 'kg' },
                { id: 'conc', label: 'Concentración de dextrosa', unidad: '%' }
            ],
            ejemplo: { modo: 'flujo', flujo: 6, peso: 3, conc: 10 },
            nota: 'Referencia: RNAT 4–6 mg/kg/min · RNPT 6–8 mg/kg/min.',
            calcular: function (v) {
                var verif = v.modo === 'verificar';
                var e = positivos(v, verif ? ['cch', 'peso', 'conc'] : ['flujo', 'peso', 'conc'],
                    { flujo: 'Flujo deseado', cch: 'Volumen de la infusión', peso: 'Peso', conc: 'Concentración de dextrosa' });
                if (e) return { error: e };
                if (v.conc > 100) return { error: 'La concentración debe estar entre 0 y 100 %.' };
                var nota6 = 'El 6 sale de 60 min ÷ 10: una dextrosa al X % tiene X × 10 mg por mL, y una hora tiene 60 min.';
                if (!verif) {
                    var num = v.flujo * v.peso * 6, r = num / v.conc;
                    return {
                        pasos: [
                            { t: 'Paso 1 · Flujo × peso × 6', f: 'flujo × peso × 6', s: n(v.flujo) + ' × ' + n(v.peso) + ' × 6', r: n(num), n: nota6 },
                            { t: 'Paso 2 · Dividir entre la concentración', f: 'cc/hora = (flujo × peso × 6) ÷ % dextrosa', s: n(num) + ' ÷ ' + n(v.conc), r: n(r) + ' cc/hora' }
                        ],
                        resultados: [{ l: 'Velocidad de infusión', v: n(r), u: 'cc/hora' }]
                    };
                }
                var a = v.cch * v.conc, b = v.peso * 6, fl = a / b;
                return {
                    pasos: [
                        { t: 'Paso 1 · Volumen × concentración', f: 'cc/hora × % dextrosa', s: n(v.cch) + ' × ' + n(v.conc), r: n(a) },
                        { t: 'Paso 2 · Peso × 6', f: 'peso × 6', s: n(v.peso) + ' × 6', r: n(b), n: nota6 },
                        { t: 'Paso 3 · Dividir', f: 'flujo = (cc/hora × %) ÷ (peso × 6)', s: n(a) + ' ÷ ' + n(b), r: n(fl) + ' mg/kg/min' }
                    ],
                    resultados: [{ l: 'Flujo administrado', v: n(fl), u: 'mg/kg/min' }]
                };
            }
        },

        /* 4 ─────────────────────────────────────────── */
        {
            id: 'mezcla-soluciones', nombre: 'Mezcla de soluciones', desc: 'Regla de aligación (resta en cruz)',
            campos: [
                { id: 'alta', label: 'Concentración alta', unidad: '%' },
                { id: 'baja', label: 'Concentración baja', unidad: '%' },
                { id: 'deseada', label: 'Concentración deseada', unidad: '%' },
                { id: 'vol', label: 'Volumen total', unidad: 'mL' }
            ],
            ejemplo: { alta: 50, baja: 5, deseada: 12.5, vol: 500 },
            nota: 'La concentración deseada debe quedar entre la baja y la alta.',
            calcular: function (v) {
                var e = positivos(v, ['vol'], { vol: 'Volumen total' }); if (e) return { error: e };
                if (!(v.baja >= 0 && v.alta <= 100 && v.baja < v.deseada && v.deseada < v.alta))
                    return { error: 'Debe cumplirse: baja < deseada < alta (todas entre 0 y 100 %).' };
                var pb = v.alta - v.deseada, pa = v.deseada - v.baja, sum = pa + pb, fac = v.vol / sum;
                var vb = pb * fac, va = pa * fac;
                return {
                    pasos: [
                        { t: 'Paso 1 · Resta en cruz', f: 'partes de la baja = alta − deseada\npartes de la alta = deseada − baja',
                          s: 'baja: ' + n(v.alta) + ' − ' + n(v.deseada) + '\nalta: ' + n(v.deseada) + ' − ' + n(v.baja), r: n(pb) + ' partes baja · ' + n(pa) + ' partes alta' },
                        { t: 'Paso 2 · Suma de partes', f: 'suma = partes baja + partes alta', s: n(pb) + ' + ' + n(pa), r: n(sum) },
                        { t: 'Paso 3 · Factor', f: 'factor = volumen total ÷ suma de partes', s: n(v.vol) + ' ÷ ' + n(sum), r: n(fac, 4) },
                        { t: 'Paso 4 · Volumen de cada solución', f: 'mL = partes × factor', s: 'baja: ' + n(pb) + ' × ' + n(fac, 4) + '\nalta: ' + n(pa) + ' × ' + n(fac, 4), r: n(vb) + ' mL + ' + n(va) + ' mL = ' + n(vb + va) + ' mL' }
                    ],
                    resultados: [
                        { l: 'Solución al ' + n(v.baja) + ' %', v: n(vb), u: 'mL' },
                        { l: 'Solución al ' + n(v.alta) + ' %', v: n(va), u: 'mL' }
                    ]
                };
            }
        },

        /* 5 ─────────────────────────────────────────── */
        {
            id: 'constante-k', nombre: 'Constante K (vasoactivos)', desc: 'Infusión en mcg/kg/min: adrenalina, noradrenalina, dopamina, dobutamina',
            campos: [
                { id: 'modo', label: 'Qué quieres calcular', tipo: 'select', opciones: [
                    { v: 'cch', t: 'Dosis deseada → cc/hora' },
                    { v: 'dosis', t: 'Goteo actual → dosis que recibe' }] },
                { id: 'mg', label: 'Fármaco en la mezcla', unidad: 'mg' },
                { id: 'volmez', label: 'Volumen de la mezcla', unidad: 'cc' },
                { id: 'peso', label: 'Peso', unidad: 'kg' },
                { id: 'dosis', label: 'Dosis deseada', unidad: 'mcg/kg/min', si: function (v) { return v.modo !== 'dosis'; } },
                { id: 'cch', label: 'Goteo actual', unidad: 'cc/hora', si: function (v) { return v.modo === 'dosis'; } }
            ],
            ejemplo: { modo: 'cch', mg: 4, volmez: 100, peso: 12, dosis: 0.1 },
            nota: 'K es la cantidad de fármaco (mcg/min) que entra por cada cc/hora de goteo.',
            calcular: function (v) {
                var inv = v.modo === 'dosis';
                var e = positivos(v, inv ? ['mg', 'volmez', 'peso', 'cch'] : ['mg', 'volmez', 'peso', 'dosis'],
                    { mg: 'Fármaco en la mezcla', volmez: 'Volumen de la mezcla', peso: 'Peso', dosis: 'Dosis deseada', cch: 'Goteo actual' });
                if (e) return { error: e };
                var K = (v.mg * 1000) / (v.volmez * 60);
                var p1 = { t: 'Paso 1 · Constante K', f: 'K = (mg × 1000) ÷ (volumen × 60)', s: '(' + n(v.mg) + ' × 1000) ÷ (' + n(v.volmez) + ' × 60)', r: 'K = ' + n(K, 4) };
                if (!inv) {
                    var num = v.dosis * v.peso, cch = num / K;
                    return {
                        pasos: [p1,
                            { t: 'Paso 2 · Dosis × peso', f: 'dosis × peso', s: n(v.dosis) + ' × ' + n(v.peso), r: n(num, 3) + ' mcg/min' },
                            { t: 'Paso 3 · Dividir entre K', f: 'cc/hora = (dosis × peso) ÷ K', s: n(num, 3) + ' ÷ ' + n(K, 4), r: n(cch) + ' cc/hora' }],
                        resultados: [{ l: 'Goteo', v: n(cch), u: 'cc/hora' }, { l: 'Constante K', v: n(K, 4), u: '' }]
                    };
                }
                var up = v.cch * K, dosis = up / v.peso;
                return {
                    pasos: [p1,
                        { t: 'Paso 2 · Goteo × K', f: 'cc/hora × K', s: n(v.cch) + ' × ' + n(K, 4), r: n(up, 3) + ' mcg/min' },
                        { t: 'Paso 3 · Dividir entre el peso', f: 'dosis = (cc/hora × K) ÷ peso', s: n(up, 3) + ' ÷ ' + n(v.peso), r: n(dosis, 3) + ' mcg/kg/min' }],
                    resultados: [{ l: 'Dosis que recibe', v: n(dosis, 3), u: 'mcg/kg/min' }, { l: 'Constante K', v: n(K, 4), u: '' }]
                };
            }
        },

        /* 6 ─────────────────────────────────────────── */
        {
            id: 'soluciones-salinas', nombre: 'Soluciones salinas', desc: 'Preparar una concentración de sodio a partir de cloruro de sodio',
            campos: [
                { id: 'vol', label: 'Volumen deseado', unidad: 'cc' },
                { id: 'conc', label: 'Concentración deseada', unidad: '%' },
                { id: 'amp', label: 'Concentración de la ampolla de NaCl', unidad: 'mEq/mL' }
            ],
            ejemplo: { vol: 100, conc: 3, amp: 3.4 },
            nota: 'Dato base: 1000 cc de SSN 0.9 % = 154 mEq de sodio (100 cc = 15.4 mEq).',
            calcular: function (v) {
                var e = positivos(v, ['vol', 'conc', 'amp'], { vol: 'Volumen deseado', conc: 'Concentración deseada', amp: 'Concentración de la ampolla' });
                if (e) return { error: e };
                var por100 = (v.conc * 15.4) / 0.9, tot = por100 * v.vol / 100, vNa = tot / v.amp, vDil = v.vol - vNa;
                if (vDil < 0) return { error: 'Con esa ampolla el volumen de NaCl supera el volumen deseado. Revisa los datos.' };
                return {
                    pasos: [
                        { t: 'Paso 1 · mEq por cada 100 cc a esa concentración (regla de tres)', f: 'mEq/100 cc = (% deseado × 15.4) ÷ 0.9', s: '(' + n(v.conc) + ' × 15.4) ÷ 0.9', r: n(por100) + ' mEq/100 cc' },
                        { t: 'Paso 2 · mEq totales', f: 'mEq totales = (mEq/100 cc × volumen) ÷ 100', s: '(' + n(por100) + ' × ' + n(v.vol) + ') ÷ 100', r: n(tot) + ' mEq' },
                        { t: 'Paso 3 · Volumen de cloruro de sodio', f: 'cc de NaCl = mEq totales ÷ mEq/mL de la ampolla', s: n(tot) + ' ÷ ' + n(v.amp), r: n(vNa) + ' cc' },
                        { t: 'Paso 4 · Volumen de diluyente', f: 'diluyente = volumen deseado − cc de NaCl', s: n(v.vol) + ' − ' + n(vNa), r: n(vDil) + ' cc' }
                    ],
                    resultados: [{ l: 'Cloruro de sodio', v: n(vNa), u: 'cc' }, { l: 'Diluyente (agua estéril o SSN base)', v: n(vDil), u: 'cc' }, { l: 'Sodio total', v: n(tot), u: 'mEq' }]
                };
            }
        },

        /* 7 ─────────────────────────────────────────── */
        {
            id: 'dosis-mg-kg-dia', nombre: 'Dosis mg/kg/día', desc: 'Dosis diaria → mg por toma',
            campos: [
                { id: 'dosis', label: 'Dosis', unidad: 'mg/kg/día' },
                { id: 'peso', label: 'Peso', unidad: 'kg' },
                { id: 'tomas', label: 'Número de dosis al día', unidad: 'dosis' }
            ],
            ejemplo: { dosis: 15, peso: 20, tomas: 3 },
            nota: '',
            calcular: function (v) {
                var e = positivos(v, ['dosis', 'peso', 'tomas'], { dosis: 'Dosis', peso: 'Peso', tomas: 'Número de dosis al día' });
                if (e) return { error: e };
                var dia = v.dosis * v.peso, toma = dia / v.tomas;
                return {
                    pasos: [
                        { t: 'Paso 1 · Dosis total del día', f: 'dosis total = mg/kg/día × peso', s: n(v.dosis) + ' × ' + n(v.peso), r: n(dia) + ' mg/día' },
                        { t: 'Paso 2 · Dosis por toma', f: 'mg por toma = dosis total ÷ número de dosis', s: n(dia) + ' ÷ ' + n(v.tomas), r: n(toma) + ' mg' }
                    ],
                    resultados: [{ l: 'Dosis total', v: n(dia), u: 'mg/día' }, { l: 'Por toma', v: n(toma), u: 'mg' }]
                };
            }
        },

        /* 8 ─────────────────────────────────────────── */
        {
            id: 'dosis-mg-kg-hora', nombre: 'Dosis mg/kg/hora', desc: 'Infusión continua → cc/hora (ej. furosemida, vecuronio)',
            campos: [
                { id: 'dosis', label: 'Dosis', unidad: 'mg/kg/hora' },
                { id: 'peso', label: 'Peso', unidad: 'kg' },
                { id: 'mg', label: 'Fármaco en la mezcla', unidad: 'mg' },
                { id: 'volmez', label: 'Volumen de la mezcla', unidad: 'cc' }
            ],
            ejemplo: { dosis: 0.1, peso: 8, mg: 10, volmez: 50 },
            nota: '',
            calcular: function (v) {
                var e = positivos(v, ['dosis', 'peso', 'mg', 'volmez'], { dosis: 'Dosis', peso: 'Peso', mg: 'Fármaco en la mezcla', volmez: 'Volumen de la mezcla' });
                if (e) return { error: e };
                var mgh = v.dosis * v.peso, cch = mgh * v.volmez / v.mg;
                return {
                    pasos: [
                        { t: 'Paso 1 · mg necesarios por hora', f: 'mg/hora = dosis × peso', s: n(v.dosis) + ' × ' + n(v.peso), r: n(mgh, 3) + ' mg/hora' },
                        { t: 'Paso 2 · Regla de tres con la concentración de la mezcla', f: 'cc/hora = (mg/hora × volumen de la mezcla) ÷ mg en la mezcla', s: '(' + n(mgh, 3) + ' × ' + n(v.volmez) + ') ÷ ' + n(v.mg), r: n(cch) + ' cc/hora' }
                    ],
                    resultados: [{ l: 'Velocidad de infusión', v: n(cch), u: 'cc/hora' }, { l: 'Fármaco por hora', v: n(mgh, 3), u: 'mg/hora' }]
                };
            }
        },

        /* acetaminofén ───────────────────────────────── */
        {
            id: 'acetaminofen', nombre: 'Acetaminofén', desc: 'Dosis por kilo según fiebre o dolor, y volumen de jarabe',
            campos: [
                { id: 'motivo', label: 'Indicación', tipo: 'select', opciones: [
                    { v: '10', t: 'Fiebre: 10 mg/kg' },
                    { v: '15', t: 'Dolor: 15 mg/kg' }] },
                { id: 'peso', label: 'Peso', unidad: 'kg' }
            ],
            ejemplo: { motivo: '10', peso: 12 },
            nota: 'Jarabe de 150 mg en 5 cc (30 mg/cc). Dosis de referencia: 10-15 mg/kg/dosis.',
            calcular: function (v) {
                if (!(v.peso > 0)) return { error: 'El campo «Peso» debe ser mayor que 0.' };
                var k = v.motivo === '15' ? 15 : 10, mg = k * v.peso, cc = mg / 30;
                return {
                    pasos: [
                        { t: 'Paso 1 · Dosis en mg', f: 'mg = mg/kg × peso', s: n(k) + ' × ' + n(v.peso), r: n(mg) + ' mg' },
                        { t: 'Paso 2 · Volumen de jarabe (150 mg en 5 cc = 30 mg/cc)', f: 'cc = mg ÷ 30', s: n(mg) + ' ÷ 30', r: n(cc) + ' cc' }
                    ],
                    resultados: [{ l: 'Dosis', v: n(mg), u: 'mg' }, { l: 'Jarabe 150 mg/5 cc', v: n(cc), u: 'cc' }]
                };
            }
        },

        /* 9 ─────────────────────────────────────────── */
        {
            id: 'reposicion-potasio', nombre: 'Reposición de potasio', desc: 'Dosis EV, concentración y vía de administración',
            campos: [
                { id: 'modo', label: 'Situación', tipo: 'select', opciones: [
                    { v: 'moderada', t: 'Hipokalemia moderada (2,6-3,0): 0,3 mEq/kg' },
                    { v: 'severa', t: 'Hipokalemia severa (< 2,5): 0,5 mEq/kg' },
                    { v: 'mant', t: 'Requerimiento diario: 2 mEq/kg/día' }] },
                { id: 'peso', label: 'Peso', unidad: 'kg' },
                { id: 'vol', label: 'Volumen de dilución', unidad: 'mL', si: function (v) { return v.modo !== 'mant'; } }
            ],
            ejemplo: { modo: 'severa', peso: 15, vol: 100 },
            nota: 'Límites: vía periférica ≤ 40 mEq/L · vía central hasta 80 mEq/L · velocidad máxima 0,5 mEq/kg/hora · infusión en no menos de 1 hora.',
            calcular: function (v) {
                if (!(v.peso > 0)) return { error: 'El campo «Peso» debe ser mayor que 0.' };
                if (v.modo === 'mant') {
                    var est = 2 * v.peso, max = 3 * v.peso;
                    return {
                        pasos: [
                            { t: 'Paso 1 · Requerimiento estándar', f: 'mEq/día = 2 mEq/kg/día × peso', s: '2 × ' + n(v.peso), r: n(est) + ' mEq/día' },
                            { t: 'Paso 2 · Máximo permitido', f: 'mEq/día = 3 mEq/kg/día × peso', s: '3 × ' + n(v.peso), r: n(max) + ' mEq/día' }
                        ],
                        resultados: [{ l: 'Requerimiento estándar', v: n(est), u: 'mEq/día' }, { l: 'Máximo', v: n(max), u: 'mEq/día' }]
                    };
                }
                if (!(v.vol > 0)) return { error: 'El campo «Volumen de dilución» debe ser mayor que 0.' };
                var k = v.modo === 'severa' ? 0.5 : 0.3;
                var dosis = k * v.peso, conc = dosis / (v.vol / 1000);
                var via = conc <= 40 ? 'Puede administrarse por vía periférica (≤ 40 mEq/L).'
                    : conc <= 80 ? 'Supera el límite periférico: requiere vía central con monitorización estricta, o más dilución si va por vía periférica.'
                    : 'Supera incluso el límite central (80 mEq/L): diluir en mayor volumen.';
                var tMin = Math.max(1, dosis / (0.5 * v.peso));
                return {
                    pasos: [
                        { t: 'Paso 1 · Dosis total', f: 'mEq = mEq/kg × peso', s: n(k) + ' × ' + n(v.peso), r: n(dosis) + ' mEq' },
                        { t: 'Paso 2 · Concentración en el volumen de dilución', f: 'mEq/L = mEq ÷ (mL ÷ 1000)', s: n(dosis) + ' ÷ ' + n(v.vol / 1000, 3), r: n(conc) + ' mEq/L' },
                        { t: 'Paso 3 · ¿Vía periférica o central?', f: 'Periférica ≤ 40 mEq/L · central hasta 80 mEq/L', s: n(conc) + ' mEq/L', r: via },
                        { t: 'Paso 4 · Tiempo mínimo de infusión', f: 'No menos de 1 hora y máximo 0,5 mEq/kg/hora', s: n(dosis) + ' ÷ (0,5 × ' + n(v.peso) + ')', r: 'no menos de ' + n(tMin) + ' h' }
                    ],
                    resultados: [{ l: 'Dosis total', v: n(dosis), u: 'mEq' }, { l: 'Concentración', v: n(conc), u: 'mEq/L' }]
                };
            }
        },

        /* 10 ────────────────────────────────────────── */
        {
            id: 'reposicion-calcio', nombre: 'Reposición de calcio', desc: 'Dosis por kilo: rango y dosis máxima',
            campos: [{ id: 'peso', label: 'Peso', unidad: 'kg' }],
            ejemplo: { peso: 3.7 },
            nota: 'Dosis: 100 a 200 mg/kg/dosis, máximo 4 dosis al día, o 500 mg/kg/dosis.',
            calcular: function (v) {
                if (!(v.peso > 0)) return { error: 'El campo «Peso» debe ser mayor que 0.' };
                var mn = 100 * v.peso, mx = 200 * v.peso, tope = 500 * v.peso;
                return {
                    pasos: [
                        { t: 'Paso 1 · Dosis mínima', f: 'mg = 100 mg/kg × peso', s: '100 × ' + n(v.peso), r: n(mn) + ' mg' },
                        { t: 'Paso 2 · Dosis máxima del rango', f: 'mg = 200 mg/kg × peso', s: '200 × ' + n(v.peso), r: n(mx) + ' mg' },
                        { t: 'Paso 3 · Dosis máxima única (500 mg/kg)', f: 'mg = 500 mg/kg × peso', s: '500 × ' + n(v.peso), r: n(tope) + ' mg', n: 'Máximo 4 dosis al día. Evaluar si realmente se necesita repetir dosis altas por el riesgo de hipercalcemia.' }
                    ],
                    resultados: [{ l: 'Rango por dosis', v: n(mn) + ' – ' + n(mx), u: 'mg' }, { l: 'Dosis máxima única', v: n(tope), u: 'mg' }]
                };
            }
        }
    ];

    return {
        lista: LISTA,
        buscar: function (id) { return LISTA.filter(function (f) { return f.id === id; })[0]; },
        etiquetas: etiq
    };
})();
