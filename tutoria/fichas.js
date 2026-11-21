/* Indicaciones y diapositivas de fármacos (dosis, efectos adversos y cuidados) por tema.
   armarDiapos() inserta cada bloque justo después de la diapositiva de mecanismo del tema. */
window.FICHAS = {
  'inhibidores-bcr-abl': {
    ind: ['Leucemia mieloide crónica con cromosoma Filadelfia positivo', 'Leucemia linfoblástica aguda (precursores B o T)', 'Tumores del estroma gastrointestinal (imatinib)', 'Resistencia o intolerancia al imatinib (bosutinib y ponatinib)'],
    slides: [{
      titulo: 'Imatinib, bosutinib y ponatinib',
      cards: [
        { t: 'Imatinib', s: '1.ª generación · FDA 2001', filas: [
          ['Efectos', 'Edema periorbitario (por bloqueo de PDGFR), náuseas y vómito, mielosupresión y hepatotoxicidad (CYP3A4).'],
          ['Cuidados', 'Hemograma frecuente, vigilar retención de líquidos (puede llegar a derrame pleural), AST, ALT y bilirrubinas, higiene estricta y revisar interacciones con azoles.']] },
        { t: 'Bosutinib', s: '2.ª generación · bloquea ABL + SRC', filas: [
          ['Dosis', '300 mg/m²/día si es recién diagnosticada; 400 mg/m²/día si hay resistencia o intolerancia.'],
          ['Efectos', 'Diarrea, hepatotoxicidad, rash y mielosupresión.'],
          ['Cuidados', 'Manejo agresivo de la diarrea, darlo con alimentos, transaminasas los primeros 3 meses y evitar omeprazol: necesita pH ácido.']] },
        { t: 'Ponatinib', s: '3.ª generación · vence T315I', filas: [
          ['Dosis', '15 a 30 mg/m² una vez al día; en niños, la mínima efectiva.'],
          ['Efectos', 'Trombosis arterial, hipertensión, pancreatitis, hepatotoxicidad y mielosupresión.'],
          ['Cuidados', 'Tensión arterial, amilasa y lipasa, pulsos y color de extremidades, hidratación y función renal (lisis tumoral) y neutropenia.']] }
      ],
      notas: 'Bueno muchachos, ya vimos cómo actúan; ahora vamos a lo que a nosotros como enfermeros nos toca, que es qué le pasa al paciente y qué vigilamos. Con el imatinib, fíjense en algo bonito: como también bloquea PDGFR, y el PDGFR es el que mantiene firmes las paredes de los vasos, el paciente se edematiza, sobre todo alrededor de los ojos, y ese líquido puede terminar en un derrame pleural. Por eso vigilamos el peso y los edemas. Además da mielosupresión, entonces hemograma frecuente, y como se metaboliza por el CYP3A4, ojo con los antifúngicos azoles, que lo acumulan. El bosutinib, pelados, da mucha diarrea, y no solo por irritar el intestino sino porque aumenta el peristaltismo; se maneja de forma agresiva con hidratación, sales de rehidratación y loperamida. Se da con comida, y un tipcito que preguntan: no se puede dar con omeprazol, porque el bosutinib necesita el estómago ácido para absorberse. Y el ponatinib, que bloquea también los receptores de la angiogénesis, sube la presión y da trombosis; por eso tensión arterial, pulsos, temperatura y color de las extremidades, y amilasa y lipasa por la pancreatitis.'
    }]
  },
  'inhibidores-braf': {
    ind: ['Melanoma metastásico o irresecable con BRAF V600E', 'Gliomas de bajo grado V600E en pediatría', 'Dabrafenib + trametinib: glioma de bajo grado pediátrico', 'Dabrafenib: melanoma adyuvante y cáncer de pulmón'],
    slides: [{
      titulo: 'Vemurafenib, dabrafenib y trametinib',
      cards: [
        { t: 'Vemurafenib', s: 'FDA 2011 · tabletas de 240 mg', filas: [
          ['Dosis', '550 a 720 mg/m² cada 12 horas.'],
          ['Efectos', 'Fotosensibilidad extrema, QT prolongado (bloquea canales hERG) y artralgias o mialgias.'],
          ['Cuidados', 'Protector SPF 50+ cada 2 horas y evitar el sol incluso tras vidrios, revisión de piel mensual y ECG a los 15 días y luego mensual con potasio y magnesio.']] },
        { t: 'Dabrafenib', s: '2.ª generación · V600E y V600K', filas: [
          ['Efectos', 'Pirexia (el más típico), hiperglucemia, hiperqueratosis o síndrome mano-pie y uveítis.'],
          ['Cuidados', 'Suspender si la fiebre pasa de 38,5 °C, glucometría semanal el primer mes, darlo en ayunas y preguntar por manchas en la visión, fotofobia u ojo rojo.']] },
        { t: 'Trametinib', s: 'Inhibe MEK 1/2 · tabletas de 0,5 y 2 mg', filas: [
          ['Dosis', '0,025 mg/kg/día.'],
          ['Efectos', 'Rash acneiforme, baja de la fracción de eyección, edema, coriorretinopatía y diarrea.'],
          ['Cuidados', 'Ecocardiograma (FEVI), vigilar visión y presión arterial, en ayunas, cuidar el rash (se sobreinfecta con S. aureus) y la fiebre que potencia con dabrafenib.']] }
      ],
      notas: 'Chicos, de estos tres lo más preguntado son los efectos, así que vamos con calma. El vemurafenib produce radicales libres que dañan la piel, y el paciente se puede quemar con el sol en minutos; entonces la educación es fuerte: protector SPF 50 o más cada dos horas, ropa con protección y nada de sol, ni siquiera a través de la ventana. Además bloquea unos canales de potasio del corazón, los hERG, y por eso alarga el QT; electrocardiograma a los 15 días y luego cada mes, y vigilamos potasio y magnesio, porque sin magnesio el potasio no se estabiliza. Con el dabrafenib, lo distintivo es la fiebre; si pasa de 38,5 se suspende. También sube la glucosa, porque la vía de BRAF está conectada con la insulina, y puede dar uveítis, así que en cada control preguntamos por la visión. Y el trametinib, pelados, como MEK también protege el corazón, la piel y los vasos, da baja de la fracción de eyección, rash y edema; por eso ecocardiograma, vigilancia de la visión y de la presión, y cuidado con el rash, que se sobreinfecta con estafilococo. Y los dos últimos van en ayunas.'
    }]
  },
  'inmunosupresores-mtor-calcineurina': {
    ind: ['Prevención del rechazo de trasplante (riñón, hígado, corazón)', 'Esclerosis tuberosa y astrocitoma subependimario (everolimus)', 'Malformación linfática vascular (sirolimus)', 'Lupus y síndrome nefrótico resistente (micofenolato); dermatitis atópica severa (tacrolimus tópico)'],
    slides: [{
      titulo: 'Sirolimus, everolimus, tacrolimus y micofenolato',
      cards: [
        { t: 'Sirolimus · everolimus', s: 'Inhiben mTORC1', filas: [
          ['Dosis', 'Sirolimus 0,8 mg/m² cada 12 h · everolimus 4,5 mg/m² al día · niveles valle 5-15 ng/mL.'],
          ['Efectos', 'Estomatitis, hiperlipidemia e hiperglucemia, neumonitis no infecciosa, mala cicatrización e infecciones.'],
          ['Cuidados', 'Higiene bucal con cepillo suave y bicarbonato, perfil lipídico, vigilar tos seca y disnea, no vacunas vivas y nivel valle antes de la dosis.']] },
        { t: 'Tacrolimus', s: 'Inhibe la calcineurina', filas: [
          ['Dosis', 'VO 0,15-0,30 mg/kg/día cada 12 h · IV 0,03-0,05 mg/kg/día · valle 5-15 ng/mL.'],
          ['Efectos', 'Nefrotoxicidad, temblor y cefalea, diabetes postrasplante, pierde magnesio y retiene potasio, alopecia.'],
          ['Cuidados', 'En ayunas (las grasas bajan 27 % su absorción), creatinina y diuresis, glucometrías, evaluar motricidad fina y no usar equipos de PVC.']] },
        { t: 'Micofenolato', s: 'Inhibe la IMPDH', filas: [
          ['Dosis', '15 a 23 mg/kg por dosis, dos veces al día.'],
          ['Efectos', 'Toxicidad gastrointestinal, leucopenia y anemia, infecciones (citomegalovirus, virus BK) y es teratogénico (categoría D).'],
          ['Cuidados', 'Temperatura y hemograma, anticoncepción en adolescentes y no darlo con antiácidos.']] }
      ],
      notas: 'Muchachos, aquí casi todo se explica por el mecanismo, así que no lo memoricen como lista. El sirolimus y el everolimus frenan mTOR, y mTOR es el que repara las mucosas y deja proliferar a los fibroblastos; por eso dan llagas en la boca y las heridas cicatrizan lento, y hay que tenerlo en cuenta antes de una cirugía. Además alteran las grasas y la glucosa, entonces perfil lipídico en ayunas, y vigilamos tos seca o disnea por la neumonitis. Con el tacrolimus, el riñón es lo primero: contrae la arteriola aferente y baja la filtración, así que creatinina, BUN y diuresis. También pasa al cerebro y da temblor, por eso en cada turno evaluamos la motricidad fina del niño; y ojo, que ese temblor también puede ser por falta de magnesio, porque el tacrolimus hace perder magnesio por el riñón. Va en ayunas y, un tipcito de clase, se pega al PVC, entonces si va intravenoso hay que usar el equipo adecuado. Y con el micofenolato: infecciones como citomegalovirus, hemograma, nada de antiácidos y educación en anticoncepción, porque es teratogénico.'
    }]
  },
  'inhibidores-egfr': {
    ind: ['Cáncer de pulmón de células no pequeñas (gefitinib, erlotinib, afatinib)', 'Cáncer de páncreas metastásico con gemcitabina (erlotinib)', 'Gliomas y tumores del tronco encefálico en pediatría', 'Tumores avanzados de cabeza y cuello (nimotuzumab)'],
    slides: [{
      titulo: 'Gefitinib, erlotinib, afatinib y nimotuzumab',
      cards: [
        { t: 'Gefitinib · erlotinib', s: '1.ª generación · orales', filas: [
          ['Dosis', 'Gefitinib 100-500 mg/m² al día · erlotinib 85-125 mg/m² al día.'],
          ['Efectos', 'Gefitinib: hepatotoxicidad y triquiasis. Erlotinib: toxicidad pulmonar, fatiga y anorexia.'],
          ['Cuidados', 'Función hepática, revisar pestañas y sensación de cuerpo extraño, vigilar tos o disnea.']] },
        { t: 'Afatinib', s: '2.ª generación · unión irreversible', filas: [
          ['Dosis', '30 a 40 mg/m² una vez al día; se reduce si hay diarrea grado 2-3 (no se suspende).'],
          ['Efectos', 'Diarrea severa, rash acneiforme, paroniquia y mucositis.'],
          ['Cuidados', 'En ayunas (la comida baja 50 % su absorción), higiene de uñas y calzado holgado, electrolitos y signos de hipopotasemia.']] },
        { t: 'Nimotuzumab', s: 'Anticuerpo humanizado · IV', filas: [
          ['Dosis', '150 mg/m² semanal por 6 semanas; luego cada 15 o 21 días.'],
          ['Efectos', 'Escalofrío y fiebre, hipotensión con infusión rápida y piel seca.'],
          ['Cuidados', 'Premedicar 30 min antes (antihistamínico, acetaminofén y corticoide), signos vitales cada 15 min la primera hora, infusión lenta y cadena de frío 2-8 °C.']] }
      ],
      notas: 'Pelados, aquí piensen que el EGFR también cuida la piel, las uñas, las pestañas y el pulmón, y por eso salen los efectos. El gefitinib es puramente hepático, entonces función hepática, y da triquiasis: las pestañas crecen hacia adentro y rozan la córnea, el paciente siente como un cuerpo extraño. El erlotinib afecta la reparación del alvéolo y da toxicidad pulmonar. El afatinib es el más agresivo con el intestino: diarrea severa; y fíjense en el dato de clase: si la diarrea es grado 2 o 3 no se suspende, se baja la dosis a la mitad o a la cuarta parte. Va en ayunas, porque la comida le quita hasta la mitad de la absorción, y como da paroniquia, educamos en higiene de uñas y calzado holgado. Y con el nimotuzumab, chicos, lo de todo anticuerpo: premedicación media hora antes con antihistamínico, acetaminofén y un corticoide; signos vitales cada 15 minutos la primera hora, infusión lenta y cadena de frío entre 2 y 8 grados, sin congelar. Lo bonito del nimotuzumab es que casi no toca la piel, porque solo se pega fuerte donde hay muchos receptores.'
    }]
  },
  'inhibidores-angiogenesis': {
    ind: ['Cáncer colorrectal metastásico (bevacizumab, primer antiangiogénico)', 'Carcinoma renal y tumores del estroma gastrointestinal (sunitinib)', 'Degeneración macular y edema macular diabético (oculares)', 'Retinopatía del prematuro (aflibercept)'],
    slides: [{
      titulo: 'Bevacizumab, sunitinib y antiangiogénicos oculares',
      cards: [
        { t: 'Bevacizumab', s: 'Anticuerpo humanizado · IV', filas: [
          ['Dosis', '5 a 10 mg/kg IV; viales de 100 mg/4 mL y 400 mg/16 mL.'],
          ['Efectos', 'Hipertensión, hemorragias, proteinuria (orina espumosa), tromboembolismo, mala cicatrización y perforación GI.'],
          ['Cuidados', 'Diluir solo en SSN 0,9 % (no dextrosa), no agitar el vial, función renal, hepática y presión antes de cada ciclo, vigilar proteinuria o hematuria.']] },
        { t: 'Sunitinib', s: 'Oral · sintético', filas: [
          ['Dosis', '15 mg/m²/día por 4 semanas y 2 de descanso; cápsulas de 12,5, 25 y 50 mg.'],
          ['Efectos', 'Fatiga, mucositis, síndrome mano-pie, hipertensión y diarrea.'],
          ['Cuidados', 'ECG por QT, ictericia, hemograma semanal, función tiroidea y evitar inhibidores o inductores del CYP3A4.']] },
        { t: 'Ranibizumab · aflibercept · pegaptanib', s: 'Intravítreos', filas: [
          ['Dosis', 'Ranibizumab y aflibercept 0,2 mg cada 4 semanas · pegaptanib 0,3 mg cada 6 semanas (0,1 mg en < 5 años).'],
          ['Efectos', 'Endoftalmitis, presión intraocular alta transitoria, visión borrosa; aflibercept: epistaxis.'],
          ['Cuidados', 'Técnica estéril, no frotar el ojo, evitar agua y polvo 24 h y educar en signos de alarma.']] }
      ],
      notas: 'Muchachos, el VEGF no solo hace vasos nuevos; también produce óxido nítrico, repara el endotelio y mantiene el filtro del riñón. Entonces, si lo bloqueamos, ¿qué pasa? Sube la presión, el paciente sangra más fácil y pierde proteína por la orina, que se ve espumosa. Eso es el bevacizumab. Y de enfermería, tengan en cuenta: se diluye solo en solución salina al 0,9, nunca con dextrosa; el vial no se agita, se mezcla suavecito; y antes de cada ciclo revisamos función renal, hepática y tensión arterial. El sunitinib es oral y se da cuatro semanas con dos de descanso para que no se acumule la toxicidad; da síndrome mano-pie, mucositis e hipertensión, y vigilamos el electrocardiograma, el hemograma cada semana y la tiroides. Y los oculares, ranibizumab, aflibercept y pegaptanib, los pone el oftalmólogo dentro del ojo con técnica estéril; lo que más miedo da es la endoftalmitis, entonces educamos: si hay dolor intenso, pus, ojo muy rojo o pérdida de visión, consultar de inmediato. Un datico: el pegaptanib dura más, cada seis semanas, porque está pegilado.'
    }]
  },
  'inhibidores-proteasoma': {
    ind: ['Mieloma múltiple: sus células producen muchísimas proteínas', 'Neoplasias en pediatría, combinado con doxorubicina'],
    slides: [{
      titulo: 'Bortezomib: dosis, efectos y cuidados',
      cards: [
        { t: 'Administración', s: 'Vial de 3,5 mg · IV o SC', filas: [
          ['Dosis', '1,3 mg/m²/día, 2 veces por semana por 3 semanas, con doxorubicina.'],
          ['Ciclo', 'En 21 días recibe 6 dosis de bortezomib; la doxorubicina va los días 1, 4, 7, 14 y 21 (efecto sinérgico).']] },
        { t: 'Efectos adversos', s: 'Por sistemas', filas: [
          ['Neurológico', 'Parestesias y dolor neuropático; grave: PRES (confusión, cambios visuales).'],
          ['Sangre', 'Trombocitopenia y neutropenia.'],
          ['Otros', 'Náuseas, diarrea o estreñimiento, fatiga, hipotensión e insuficiencia cardíaca; lisis tumoral.']] },
        { t: 'Cuidados de enfermería', s: 'Esenciales', filas: [
          ['Neuropatía', 'Valoración neurológica previa, rotar el sitio SC y cambios de posición graduales.'],
          ['Vigilancia', 'Presión arterial antes y después, plaquetas y neutrófilos, lavado de manos, hidratación y antieméticos.'],
          ['Dieta', 'Nada de té verde ni vitamina C 12 h antes y después de la dosis.']] }
      ],
      notas: 'Chicos, del bortezomib les quiero dejar claro el esquema y los cuidados, porque la profe le dio bastante peso. Viene en un vial de 3,5 miligramos y se puede poner intravenoso o subcutáneo. La dosis es 1,3 miligramos por metro cuadrado, dos veces por semana durante tres semanas, casi siempre con doxorubicina; en un ciclo de 21 días el paciente recibe seis dosis. Ahora los efectos: lo neurológico es lo más importante, hormigueo, adormecimiento y dolor neuropático, y la complicación grave es el PRES, que se ve como confusión o cambios en la visión. También baja plaquetas y neutrófilos, y puede dar hipotensión, por eso tomamos la presión antes y después y hacemos los cambios de posición despacio. Si va subcutáneo, rotamos el sitio. Y un tipcito que es muy de examen y que casi nadie se acuerda: el paciente no puede tomar té verde ni suplementos de vitamina C desde 12 horas antes hasta 12 horas después de la dosis. No se queden solo con la neuropatía, ¿listo?'
    }]
  },
  'modificadores-respuesta-biologica': {
    ind: ['Leucemia mieloide aguda (gemtuzumab)', 'Linfoma de Hodgkin (brentuximab vedotin)', 'Linfoma no Hodgkin (ibritumomab)'],
    slides: [{
      titulo: 'Gemtuzumab, brentuximab e ibritumomab',
      cards: [
        { t: 'Gemtuzumab ozogamicina', s: 'Anti-CD33 · retirado 2010, re-aprobado 2017', filas: [
          ['Dosis', '3 mg/m² cada 14 días, máximo 3 dosis; IV en 2-4 horas en SSN 0,9 %.'],
          ['Efectos', 'Pancitopenia, vómito y diarrea, transaminasas y bilirrubina elevadas.'],
          ['Cuidados', 'Premedicar (corticoide, antihistamínico y paracetamol), función hepática, electrolitos, sobrehidratar por lisis tumoral y no vacunas vivas.']] },
        { t: 'Brentuximab vedotin', s: 'Anti-CD30 · MMAE', filas: [
          ['Dosis', '1,8 mg/kg en 30 minutos cada 3 semanas.'],
          ['Efectos', 'Citopenias, herpes zóster, candidiasis oral, neumonía, fiebre y reacciones a la infusión.'],
          ['Cuidados', 'Nunca con bleomicina (toxicidad pulmonar), línea blanca, función hepática y vigilar herpes zóster (aislamiento).']] },
        { t: 'Ibritumomab tiuxetán', s: 'Anti-CD20 · itrio-90', filas: [
          ['Dosis', '0,3 mg/kg IV en 10-15 min; al día siguiente con rituximab.'],
          ['Efectos', 'Infecciones, citopenias, hemorragias e hipotensión.'],
          ['Cuidados', 'Premedicar, infusión lenta, lavar la vía con 10 mL de SSN y manejo con protección radiactiva (guantes de nitrilo, caneca de material radiactivo).']] }
      ],
      notas: 'Bueno pelados, de los conjugados la clase dejó varios cuidados que son muy prácticos. Primero, una regla general que dijo la profe: todo anticuerpo monoclonal requiere premedicación, normalmente corticoide, antihistamínico y paracetamol. Con el gemtuzumab, que va contra CD33 en la leucemia mieloide aguda, se pone en 2 a 4 horas en solución salina, y como mata muchas células leucémicas de una, hay que sobrehidratar y vigilar electrolitos por la lisis tumoral; también la función hepática. Un datico de historia: lo retiraron en 2010 por toxicidad y lo volvieron a aprobar en 2017 con dosis más bajas. El brentuximab, contra CD30 en el Hodgkin, tiene una regla de oro: no se administra con bleomicina, porque da toxicidad pulmonar grave. Además baja las defensas y puede reactivar el herpes zóster, entonces vigilamos lesiones en la piel y aislamos si aparece. Y el ibritumomab, como lleva itrio-90, es radiactivo: se manipula con guantes de nitrilo, se desecha en la caneca de material radiactivo y al final se lava la vía con 10 mililitros de solución salina para que pase la dosis completa.'
    }]
  },
  'inmunosupresores-trasplante+belatacept': {
    ind: ['Prevención del rechazo agudo del trasplante renal (no trata un rechazo ya establecido)', 'Basiliximab: terapia de inducción', 'Belatacept: con basiliximab (inducción) y micofenolato (mantenimiento); off-label en pediatría'],
    slides: [{
      titulo: 'Basiliximab y belatacept: dosis y cuidados',
      cards: [
        { t: 'Basiliximab', s: 'Simulect · Novartis 1998', filas: [
          ['Dosis', '> 35 kg: 20 mg IV · < 35 kg: 10 mg IV; 2 horas antes del trasplante y el día 4.'],
          ['Efectos', 'Cefalea, náuseas, diarrea, edema, hipertensión, alteraciones electrolíticas, anemia e infecciones.'],
          ['Cuidados', 'Hipersensibilidad (urticaria, broncoespasmo, hipotensión), signos de infección y función renal del injerto: creatinina, diuresis y balance.']] },
        { t: 'Belatacept', s: 'Nulojix 250 mg · CTLA-4 + Fc', filas: [
          ['Dosis', '10 mg/kg IV el día 1, el día 5, la semana 2 y la semana 4.'],
          ['Antes', 'Confirmar serología positiva para virus de Epstein-Barr (riesgo de linfoproliferativo postrasplante).'],
          ['Cuidados', 'Verificar dosis por peso, infusión en 30 minutos sin bolo, laboratorios, lesiones de piel e infección.']] },
        { t: 'Esquema combinado', s: 'Inducción y mantenimiento', filas: [
          ['Inducción', 'Basiliximab + corticoide.'],
          ['Mantenimiento', 'Inhibidor de calcineurina (tacrolimus o ciclosporina) + micofenolato.'],
          ['Recuerda', 'Los efectos del paciente trasplantado no siempre son del basiliximab: recibe varios inmunosupresores.']] }
      ],
      notas: 'Chicos, aquí lo importante es entender que el paciente trasplantado nunca recibe un solo inmunosupresor. El basiliximab se usa en la inducción, para prevenir el rechazo agudo; no sirve para tratar un rechazo que ya arrancó, y eso lo pueden preguntar. Se pone dos veces: dos horas antes del trasplante y el día cuatro, 20 miligramos si pesa más de 35 kilos y 10 si pesa menos. Lo que vigilamos es la hipersensibilidad durante la infusión, las infecciones y, sobre todo, el riñón nuevo: creatinina, BUN, diuresis y balance. Y algo que dijo la profe y que me parece muy sensato: si el paciente presenta algún efecto, no asuman de una que es el basiliximab, porque está recibiendo varios fármacos a la vez. Con el belatacept, la dosis es por peso, 10 miligramos por kilo, el día uno, el día cinco, la semana dos y la semana cuatro, en infusión de 30 minutos, nunca en bolo. Y no se les olvide, pelados: antes de iniciarlo se confirma la serología para Epstein-Barr.'
    }]
  },
  'denosumab-eculizumab': {
    ind: ['Denosumab: osteoporosis con alto riesgo de fractura, tumores que afectan el hueso y tumor óseo de células gigantes (esqueleto maduro)', 'Eculizumab: hemoglobinuria paroxística nocturna, síndrome hemolítico urémico atípico, miastenia gravis generalizada y NMOSD'],
    slides: [{
      titulo: 'Denosumab y eculizumab: dosis, efectos y cuidados',
      cards: [
        { t: 'Denosumab', s: 'Humano IgG2 · Amgen (Prolia, Xgeva)', filas: [
          ['Dosis', 'Tumor de células gigantes: 120 mg SC los días 1, 8 y 15, luego cada 4 semanas.'],
          ['Efectos', 'Hipocalcemia, osteonecrosis de mandíbula y fracturas vertebrales múltiples al suspenderlo (rebote).'],
          ['Cuidados', 'Calcio, dolor o inflamación mandibular y no suspenderlo sin un plan; vida media de 26 días.']] },
        { t: 'Eculizumab: dosis', s: 'Humanizado anti-C5 · IV', filas: [
          ['5-10 kg', '300 mg semana 1; luego 300 mg cada 3 semanas.'],
          ['10-20 kg', '600 mg semana 1; luego 300 mg cada 2 semanas.'],
          ['20-30 kg', '600 mg semanas 1 y 2; luego 600 mg cada 2 semanas.'],
          ['Infusión', '2 a 6 horas, nunca en bolo.']] },
        { t: 'Eculizumab: cuidados', s: 'Riesgo principal: meningococo', filas: [
          ['Antes', 'Vacunas contra meningococo ACWY y B, neumococo y Hib.'],
          ['Vigilar', 'Fiebre, cefalea y rigidez de nuca; reacciones en la infusión.'],
          ['Laboratorios', 'Hemoglobina, reticulocitos, LDH y bilirrubina; creatinina y diuresis (SHUa).']] }
      ],
      notas: 'Pelados, del denosumab tengan en cuenta los tres efectos y entiendan el porqué. Si baja la resorción, el hueso suelta menos calcio, y por eso hipocalcemia. Puede dar osteonecrosis de la mandíbula, sobre todo después de procedimientos dentales, entonces preguntamos por dolor o inflamación en la mandíbula. Y el tercero es muy curioso: si se suspende de golpe, la resorción rebota y aparecen fracturas vertebrales múltiples; por eso el denosumab no se suspende ni se retrasa sin un plan. Ahora el eculizumab, y aquí la profe dijo textualmente que esto puede ser pregunta de parcial: antes de iniciarlo hay que verificar las vacunas contra meningococo ACWY, meningococo B, neumococo y Haemophilus. ¿Por qué? Porque el complejo de ataque a la membrana es lo que mata a la Neisseria, y si lo bloqueamos el paciente queda desprotegido. Entonces vigilamos signos de meningitis: fiebre, dolor de cabeza y rigidez de nuca, y si aparecen se actúa de inmediato. La dosis va por peso, la infusión dura de 2 a 6 horas, nunca en bolo, y controlamos LDH y hemoglobina para ver si la hemólisis está bajando.'
    }]
  },
  'psoriasis-biologicos': {
    ind: ['Psoriasis en placas moderada a grave (ustekinumab desde los 6 años)', 'Artritis psoriásica', 'Ustekinumab: enfermedad de Crohn y colitis ulcerosa', 'Ixekizumab y secukinumab: espondilitis anquilosante y espondiloartritis axial'],
    slides: [{
      titulo: 'Ustekinumab, ixekizumab y secukinumab',
      cards: [
        { t: 'Ustekinumab', s: 'Stelara 45 mg/0,5 mL · SC', filas: [
          ['Dosis', '< 60 kg: 0,75 mg/kg · 60-100 kg: 45 mg · > 100 kg: 90 mg; semanas 0 y 4, luego cada 12 semanas.'],
          ['Efectos', 'Infecciones respiratorias, cefalea, reacciones en el sitio de inyección, infecciones graves y PRES.'],
          ['Cuidados', 'Valorar la piel y el sitio de inyección, técnica aséptica, refrigerado y educar en adherencia.']] },
        { t: 'Ixekizumab', s: 'Humanizado anti-IL-17A · SC', filas: [
          ['Dosis', '25-50 kg: 80 mg y luego 40 mg cada 4 semanas · ≥ 50 kg: 160 mg y luego 80 mg cada 4 semanas.'],
          ['Efectos', 'Candidiasis oral, genital o esofágica, infecciones respiratorias, neutropenia y EII nueva o exacerbada.']] },
        { t: 'Secukinumab', s: 'Anti-IL-17A · Novartis 2015', filas: [
          ['Dosis', '15-50 kg: 75 mg · ≥ 50 kg: 150 mg; semanal de la semana 0 a la 4 y luego cada 4 semanas desde la 8.'],
          ['Efectos', 'Candidiasis, infecciones respiratorias, diarrea y EII.'],
          ['Cuidados', 'Tamizaje de tuberculosis, no iniciar con infección activa, revisar la boca y preguntar por síntomas digestivos.']] }
      ],
      notas: 'Muchachos, de los de psoriasis la clave es entender por qué dan esos efectos. La IL-17A es fundamental para defendernos de la Candida y para mantener la barrera de las mucosas, incluida la del intestino. Entonces, si la bloqueamos con ixekizumab o secukinumab, ¿qué esperamos? Candidiasis en la boca, en los genitales o en el esófago, y que aparezca o se empeore una enfermedad inflamatoria intestinal, como Crohn o colitis. Por eso revisamos la cavidad oral y preguntamos por diarrea o dolor abdominal. Y antes de iniciar, un cuidado que es muy de biológicos: tamizaje de tuberculosis y no empezar si hay una infección activa. El ustekinumab se pone subcutáneo, la dosis va según el peso y tiene un esquema fácil de recordar: semana cero, semana cuatro y después cada doce semanas. Se guarda refrigerado y se aplica con técnica aséptica. No se enreden con las dosis de cada uno; lo que más preguntan es el mecanismo y la candidiasis.'
    }]
  },
  'antihelminticos': {
    ind: ['Ascariasis, tricuriasis y anquilostomiasis (benzimidazoles)', 'Hidatidosis y neurocisticercosis (sobre todo albendazol)', 'Estrongiloidiasis, oncocercosis, filariasis, escabiosis y pediculosis (ivermectina)', 'Oxiuriasis y ascariasis (pirantel y piperazina)'],
    slides: [{
      titulo: 'Albendazol, mebendazol, ivermectina, pirantel y piperazina',
      cards: [
        { t: 'Albendazol · mebendazol', s: 'Benzimidazoles', filas: [
          ['Dosis', 'Albendazol: ≤ 2 años 200 mg, > 2 años 400 mg, dosis única, repetir en 2-3 semanas · mebendazol: 100 mg dosis única.'],
          ['Efectos', 'Molestias digestivas y cefalea; raro pero grave: mielosupresión.'],
          ['Cuidados', 'Con alimentos, vigilar ictericia y transaminasas, sangrados e infecciones, y completar el tratamiento.']] },
        { t: 'Ivermectina', s: 'Nobel 2015 · lactona macrocíclica', filas: [
          ['Dosis', '150-200 µg/kg dosis única; en > 5 años o > 15 kg.'],
          ['Efectos', 'Prurito, fiebre, cefalea; síndrome de Mazzotti; ataxia o convulsiones en sobredosis.'],
          ['Cuidados', 'Con alimentos, vigilar reacciones alérgicas y neurológicas y evitar la automedicación.']] },
        { t: 'Pirantel · piperazina', s: 'Paralizantes del nematodo', filas: [
          ['Pirantel', 'Agonista nicotínico → parálisis espástica; el gusano se suelta y sale por el peristaltismo. Mayores de 2 años.'],
          ['Piperazina', 'Agonista GABA → parálisis flácida; sale por las heces. Da mareo y somnolencia.'],
          ['Cuidados', 'Dosis por peso, con alimentos e higiene familiar para evitar reinfección.']] }
      ],
      notas: 'Bueno chicos, de los antihelmínticos los cuidados son más sencillos, pero hay detallitos. El albendazol y el mebendazol se dan con comida, que mejora la absorción y les cae mejor al estómago. Casi siempre son bien tolerados, pero el raro y grave es la mielosupresión, porque si el fármaco bloquea tubulina, también puede afectar las células humanas que se dividen rápido, como las de la médula; eso pasa más en tratamientos largos o con daño hepático. La ivermectina, que por cierto le dio el Nobel a sus descubridores en 2015, se usa también para la sarna y los piojos; se da en mayores de cinco años o de más de 15 kilos, y vigilamos el Mazzotti y reacciones neurológicas. Y ahora el tipcito para pirantel y piperazina: el pirantel deja al gusano rígido, se suelta de la pared intestinal y sale con el peristaltismo; la piperazina lo deja flácido y sale con las heces. Y algo que no puede faltar con cualquier antiparasitario: educación en higiene de toda la familia, porque si no, se vuelven a infectar.'
    }]
  },
  'antiprotozoarios': {
    ind: ['Amebiasis, giardiasis y tricomoniasis', 'Bacterias anaerobias y colitis por Clostridium difficile (metronidazol)', 'Cryptosporidium y Giardia (nitazoxanida)', 'Amebiasis intestinal y leishmaniasis (paromomicina)'],
    slides: [{
      titulo: 'Metronidazol, nitazoxanida, furazolidona y paromomicina',
      cards: [
        { t: 'Metronidazol · tinidazol', s: 'Nitroimidazoles · tisulares', filas: [
          ['Dosis', 'Metronidazol 30 mg/kg/día en 3 dosis (máximo 2 g/día) · tinidazol 50 mg/kg por 3 días.'],
          ['Efectos', 'Sabor metálico, náuseas, mareo o convulsiones, hemólisis en déficit de G6PD.'],
          ['Cuidados', 'Cero alcohol (efecto disulfiram), con alimentos, función hepática y renal y signos neurológicos.']] },
        { t: 'Nitazoxanida · furazolidona', s: 'PFOR · nitrofurano', filas: [
          ['Nitazoxanida', '1-3 años 100 mg y 4-11 años 200 mg cada 12 h por 3 días; orina amarilla inocua.'],
          ['Furazolidona', '5 mg/kg/dosis cada 6 h (máx. 100 mg) en > 5 años; también efecto antabuse.'],
          ['Cuidados', 'Con alimentos, vigilar alergias y completar el tratamiento.']] },
        { t: 'Paromomicina y luminales', s: 'Aminoglucósido · dicloroacetamidas', filas: [
          ['Paromomicina', '25-35 mg/kg/día en 3 dosis con las comidas por 5-10 días; vigilar oído y riñón.'],
          ['Luminales', 'Teclozán, etofamida, clefamida y diloxanida actúan en la luz intestinal; diloxanida para portadores asintomáticos.']] }
      ],
      notas: 'Y cerramos los fármacos con los antiprotozoarios, pelados. Con el metronidazol, el cuidado estrella es la educación: nada de alcohol, porque produce un efecto disulfiram, con náuseas, vómito y malestar fuerte; lo mismo con el tinidazol y la furazolidona. El paciente se va a quejar de sabor metálico, y eso es normal. Ojo con los pacientes con déficit de G6PD, porque pueden hacer hemólisis, y vigilamos signos neurológicos como mareo o convulsiones. La nitazoxanida es para Giardia y Cryptosporidium, se da por tres días, y un detallito que asusta a las mamás: pone la orina amarilla, pero es inofensivo, así que hay que avisarles. La paromomicina, como es aminoglucósido, en raros casos afecta el oído y el riñón, entonces monitoreo renal y auditivo, y se da con las comidas. Y recuerden la diferencia: los tisulares, como el metronidazol, sirven para la enfermedad invasiva, como el absceso hepático, y los luminales, como la diloxanida, limpian la luz del intestino y sirven para el portador que no tiene síntomas.'
    }]
  }
};

/* RECORTE TEMPORAL (tutoría en curso): sin detalle de fármacos desde psoriasis y sin «¿Quién da qué?». Poner en false para revertir. */
window.RECORTE = true;
var SIN_DETALLE = { 'psoriasis-biologicos': 1, 'antihelminticos': 1, 'antiprotozoarios': 1 };
window.armarDiapos = function () {
  var out = [];
  (window.DIAPOS || []).forEach(function (d) {
    if (d.tipo === 'cuidados') return;
    if (window.RECORTE && d.tipo === 'flip') return;
    var k = d.id || (d.esq && d.esq.join('+'));
    var f = k && window.FICHAS[k];
    if (d.tipo === 'mecanismo' && f) d.ind = f.ind;
    out.push(d);
    if (d.tipo === 'mecanismo' && f && !(window.RECORTE && SIN_DETALLE[k])) f.slides.forEach(function (s) { out.push({ tipo: 'farmacos', ses: d.ses, titulo: s.titulo, cards: s.cards, notas: s.notas }); });
  });
  return out;
};
