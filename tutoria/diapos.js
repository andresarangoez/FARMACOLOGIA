/* Contenido de la tutoría: cada diapositiva lleva sus notas en «notas». */
window.DIAPOS = [
  {
    tipo: 'portada',
    titulo: 'Repaso del último parcial',
    notas: 'Bueno muchachos, buenas noches, ¿cómo están? Gracias por sacar el ratico y conectarse. Hoy vamos a hacer el repaso del último parcial de Farmacología, y la idea no es que salgan de aquí con una lista de nombres raros memorizada, sino que entiendan qué hace cada fármaco dentro de la célula, porque cuando uno entiende el mecanismo, los efectos adversos y los cuidados salen casi solos. Les cuento de una vez cómo va a ser esto: primero les muestro qué entra, después les doy un par de truquitos para leer los nombres, y luego nos vamos sesión por sesión viendo la animación de cada mecanismo. Al final hacemos unas preguntas tipo parcial para que se midan. Si en algún momento algo no les queda claro, me interrumpen sin pena, que para eso estamos.'
  },
  {
    tipo: 'temario',
    titulo: '¿Qué entra en el parcial?',
    notas: 'Pelados, miren, esto es todo lo que entra, y es importante que lo tengan claro para no ponerse a estudiar cosas que no van. La docente dijo que entran solamente las sesiones 10 a 14, o sea, todo lo que vimos después del segundo parcial. En la 10 están los inhibidores de BCR-ABL y de BRAF; en la 11, los inmunosupresores y los inhibidores del EGFR; en la 12, angiogénesis, el bortezomib con el proteasoma y los anticuerpos conjugados; en la 13, todo lo de trasplante, el denosumab, el eculizumab y la psoriasis; y en la 14, los antiparasitarios. Otra cosa que es una buena noticia: no hay fórmulas. Pero ojo, chicos, que no haya fórmulas no quiere decir que no pregunten datos; los cuidados de enfermería, las vigilancias y algunas dosis sí pueden salir. Y el parcial es este sábado 21 de noviembre.'
  },
  {
    tipo: 'cadena', ceja: 'Fisiología base',
    titulo: 'Así le llega a la célula la orden de dividirse',
    pasos: [
      { t: 'Factor de crecimiento', s: 'EGF, VEGF: llega desde afuera', f: '-mab lo atrapa' },
      { t: 'Receptor', s: 'en la membrana (EGFR, VEGFR)', f: '-mab bloquea el receptor' },
      { t: 'Tirosina quinasa', s: 'parte interna del receptor; usa ATP', f: '-tinib ocupa el ATP' },
      { t: 'Cascada interna', s: 'RAS → BRAF → MEK → ERK', f: 'vemurafenib · trametinib' },
      { t: 'Núcleo', s: 'la célula se divide', f: 'sin señal: apoptosis' }
    ],
    nota: 'Casi todo el parcial es bloquear algún punto de esta cadena.',
    notas: 'Antes de meternos con los fármacos, muchachos, quiero que entiendan una sola cadena, porque si la entienden, entienden medio parcial. Sucede que la célula normal no se divide porque sí: necesita que le llegue una orden desde afuera. Esa orden es un factor de crecimiento, como el EGF o el VEGF. Ese factor se pega a un receptor que está en la membrana, y ese receptor tiene por dentro una parte que se llama tirosina quinasa, que gasta ATP para encender lo que sigue. Lo que sigue es una cascada: RAS, luego BRAF, luego MEK, luego ERK, y al final la orden llega al núcleo y la célula se divide. En el cáncer, alguno de esos pasos queda encendido todo el tiempo. Entonces fíjense en la fila de abajo, que es el tipcito del día: los anticuerpos, los -mab, actúan afuera, atrapando el factor o tapando el receptor; los -tinib entran y ocupan el sitio del ATP de la quinasa; y otros, como el vemurafenib o el trametinib, bloquean la cascada más abajo. Cuando ningún paso pasa la señal, la célula tumoral termina en apoptosis.'
  },
  {
    tipo: 'claves',
    titulo: 'Leer el nombre ya dice el mecanismo',
    notas: 'Chicos, este es el truco que más les va a servir en el parcial, así que préstenle atención. El final del nombre les dice cómo actúa el fármaco. Si termina en -tinib, es un inhibidor de tirosina quinasa: una molécula pequeñita, casi siempre oral, que entra a la célula y se sienta en el sitio donde iba el ATP de la enzima. Si termina en -mab, es un anticuerpo monoclonal: una proteína grande, que se pone intravenosa o subcutánea, y que actúa afuera de la célula o en su superficie, o sea, se pega a un receptor o atrapa una molécula que anda suelta. Y si termina en -cept, es una proteína de fusión que funciona como receptor señuelo, como el aflibercept o el belatacept. Y otro detallito que a veces preguntan: dentro de los -mab, si dice -ximab es quimérico, como el basiliximab, y si dice -umab es humano, como el denosumab. Entonces, si en el parcial les sale un nombre que no recuerdan, no se bloqueen: miren cómo termina y ya tienen media respuesta.'
  },
  {
    tipo: 'mecanismo', ses: 10, id: 'inhibidores-bcr-abl',
    titulo: 'Inhibidores de BCR-ABL',
    linea: 'Ocupan el sitio del ATP de la cinasa BCR-ABL, que está siempre encendida, y frenan la proliferación de la célula leucémica.',
    datos: [
      '<b>Cromosoma Filadelfia:</b> translocación 9;22 que fusiona BCR (cromosoma 22) con ABL (cromosoma 9).',
      'BCR-ABL activa <b>RAS, STAT y PI3K/AKT</b>: la célula se divide sin control.',
      '<b>Imatinib</b> (FDA 2001): LMC Ph+, LLA y tumores del estroma gastrointestinal; también inhibe c-KIT y PDGFR.',
      '<b>Bosutinib</b> inhibe además la familia SRC; <b>no sirve contra T315I</b>.',
      '<b>Ponatinib</b> (3.ª generación): su enlace triple de etinilo esquiva la mutación <b>T315I</b>.'
    ],
    notas: 'Bueno muchachos, arrancamos con la sesión 10 y con la leucemia mieloide crónica. Resulta que en estos pacientes hay un intercambio de pedazos entre el cromosoma 9 y el 22; el 22 queda cortico y a ese cromosoma corto le decimos cromosoma Filadelfia. En ese intercambio se pegan dos genes, BCR y ABL, y sale una proteína nueva, la BCR-ABL, que es una cinasa que nunca se apaga y que activa RAS, STAT y PI3K/AKT. Miren la animación: la cinasa le manda señal al núcleo todo el tiempo; entonces llega el imatinib, se mete justo en el bolsillo donde iba el ATP, la señal se corta y la célula leucémica se muere por apoptosis. El imatinib fue aprobado en 2001 y también bloquea c-KIT y PDGFR, por eso sirve en los tumores del estroma gastrointestinal. Ahora, chicos, no se queden solo con el imatinib, porque aquí viene lo que más preguntan: algunas células desarrollan la mutación T315I y se vuelven resistentes. El bosutinib, que bloquea BCR-ABL y la familia SRC, no sirve contra esa mutación. El único que la vence es el ponatinib, gracias a su enlace triple de etinilo. Y de cuidados con ponatinib: tensión arterial, amilasa y lipasa, signos de isquemia periférica y función renal.'
  },
  {
    tipo: 'mecanismo', ses: 10, id: 'inhibidores-braf',
    titulo: 'Inhibidores de BRAF y MEK',
    linea: 'Bloquean la BRAF mutada (V600E) o la MEK de la vía RAS-RAF-MEK-ERK y apagan la señal de crecimiento.',
    datos: [
      'Cascada: <b>receptor → RAS → BRAF → MEK → ERK → núcleo</b>.',
      'Mutación BRAF: melanoma, leucemia de células peludas, colorrectal y tiroides papilar.',
      '<b>Vemurafenib:</b> fotosensibilidad extrema, <b>QT prolongado</b> (ECG a los 15 días y luego mensual) y artralgias.',
      '<b>Dabrafenib:</b> pirexia, hiperglucemia, síndrome mano-pie y uveítis.',
      '<b>Trametinib</b> inhibe MEK 1/2; con dabrafenib, <b>en ayunas</b>: glioma de bajo grado V600E en pediatría.'
    ],
    notas: '¿Se acuerdan de la cadena que les mostré al principio? Bueno, aquí la usamos. La vía es receptor, RAS, BRAF, MEK, ERK y núcleo. Cuando BRAF tiene la mutación V600E, queda encendida aunque no le llegue ninguna orden de afuera, y eso pasa en el melanoma, en la leucemia de células peludas, en el cáncer colorrectal y en el de tiroides papilar. El vemurafenib y el dabrafenib compiten con el ATP en esa BRAF mutada y la apagan; el trametinib actúa un pasito más abajo, se pega a MEK de forma alostérica. ¿Y por qué los combinan, pelados? Porque así cortan la vía en dos puntos y es más difícil que la célula se escape; en pediatría, dabrafenib más trametinib se usa en el glioma de bajo grado con V600E. Ahora, tengan muy en cuenta los efectos: el vemurafenib da una fotosensibilidad tremenda y alarga el QT, entonces se toma electrocardiograma a los 15 días y luego cada mes, vigilando potasio y magnesio. El dabrafenib da fiebre. Y dabrafenib y trametinib se toman en ayunas, porque las grasas les alteran la absorción.'
  },
  {
    tipo: 'tabla', ceja: 'Mapa de la sesión 10 a la 12',
    titulo: 'Los -tinib: ¿qué bloquea cada uno?',
    cols: ['Fármaco', 'Blanco', 'Lo que no se puede olvidar'],
    filas: [
      ['Imatinib', 'BCR-ABL (+ c-KIT, PDGFR)', 'Primero en LMC Ph+; FDA 2001'],
      ['Bosutinib', 'BCR-ABL + SRC', 'No sirve contra T315I'],
      ['Ponatinib', 'BCR-ABL con T315I', 'Enlace triple de etinilo; vigilar PA e isquemia'],
      ['Vemurafenib · dabrafenib', 'BRAF V600E', 'Fotosensibilidad y QT · fiebre'],
      ['Trametinib', 'MEK 1/2', 'Con dabrafenib, en ayunas'],
      ['Gefitinib · erlotinib · afatinib', 'Tirosina quinasa del EGFR', 'Hígado · pulmón · diarrea y rash'],
      ['Sunitinib', 'VEGFR, PDGFR y c-KIT', 'Cuidado con CYP3A4']
    ],
    notas: 'Chicos, esta tabla es para que no se les revuelvan los -tinib, porque en el examen ponen dos o tres juntos para confundir. Fíjense que todos hacen lo mismo en el fondo: entran a la célula y ocupan el sitio del ATP de una quinasa. Lo que cambia es cuál quinasa. Imatinib, bosutinib y ponatinib van contra BCR-ABL, y lo que los diferencia es la mutación T315I, que solo la vence el ponatinib. Vemurafenib y dabrafenib van contra BRAF mutada, y el trametinib contra MEK. Gefitinib, erlotinib y afatinib van contra el receptor del EGF, y el sunitinib contra los receptores de la angiogénesis, VEGFR y PDGFR, más c-KIT. Un tipcito para estudiar: tápense la columna del blanco con la mano y traten de decirlo ustedes; si lo logran con todos, esta parte la tienen.'
  },
  {
    tipo: 'mecanismo', ses: 11, id: 'inmunosupresores-mtor-calcineurina',
    titulo: 'Inmunosupresores: mTOR, calcineurina e IMPDH',
    linea: 'Sirolimus y everolimus bloquean mTORC1; tacrolimus bloquea la calcineurina; micofenolato inhibe la IMPDH y la síntesis de purinas.',
    datos: [
      '<b>mTOR</b> = diana de la rapamicina en mamíferos; en esclerosis tuberosa mutan TSC1 y TSC2.',
      'Sirolimus y everolimus: niveles <b>valle 5-15 ng/mL</b>; estomatitis, hiperlipidemia, neumonitis.',
      '<b>Tacrolimus + FKBP-12</b> bloquea la calcineurina: NF-AT no entra al núcleo y no hay IL-2.',
      'Las grasas reducen hasta <b>27 %</b> la absorción del tacrolimus.',
      '<b>Micofenolato:</b> categoría D en el embarazo (teratogénico).'
    ],
    notas: 'Pasamos a la sesión 11, muchachos, y aquí sí les pido calma, porque son tres mecanismos que la gente confunde muchísimo. Vamos uno por uno. El sirolimus y el everolimus se pegan a una proteína que se llama FKBP-12, y ese complejo bloquea mTORC1; sin mTOR la célula no fabrica proteínas y se frena el ciclo celular. mTOR, por cierto, significa diana de la rapamicina en mamíferos, y en la esclerosis tuberosa lo que falla es el freno de mTOR, los genes TSC1 y TSC2. El tacrolimus también se pega a FKBP-12, y aquí viene la trampa: ese complejo no bloquea mTOR, bloquea la calcineurina; entonces NF-AT no entra al núcleo, no se produce IL-2 y el linfocito T no se multiplica. Y el micofenolato va por otro lado: se convierte en ácido micofenólico e inhibe la IMPDH, que es una enzima para fabricar purinas, y sin purinas el linfocito no puede copiar su ADN. Si les preguntan qué es un nivel valle: es la concentración en sangre justo antes de la siguiente dosis, el punto más bajo; para sirolimus y everolimus va entre 5 y 15. Y llévense dos datos: las grasas bajan hasta un 27 por ciento la absorción del tacrolimus, y el micofenolato es categoría D en el embarazo.'
  },
  {
    tipo: 'mecanismo', ses: 11, id: 'inhibidores-egfr',
    titulo: 'Inhibidores del receptor EGFR',
    linea: 'Bloquean el receptor del factor de crecimiento epidérmico o su tirosina quinasa y apagan AKT, ERK y PI3K.',
    datos: [
      '<b>Gefitinib:</b> hepatotoxicidad (CYP3A4) y triquiasis.',
      '<b>Erlotinib:</b> toxicidad pulmonar, fatiga y anorexia.',
      '<b>Afatinib:</b> diarrea severa (se reduce la dosis en grado 2-3), rash acneiforme, paroniquia; comida baja su absorción hasta 50 %.',
      '<b>Nimotuzumab</b> (anticuerpo): se une de forma bivalente; premedicar con antihistamínico y analgésico <b>30 min antes</b>.'
    ],
    notas: 'Seguimos con el EGFR, el receptor del factor de crecimiento epidérmico. El EGF es una proteína pequeñita que le ordena a la célula crecer, y en el cáncer ese receptor puede estar de más, como en colon y en cabeza y cuello, o mutado, como en pulmón. Aquí ven clarito el truco de los nombres, pelados: gefitinib, erlotinib y afatinib son -tinib, entonces entran y bloquean la quinasa del receptor por dentro. El nimotuzumab es -mab, entonces se pega al receptor por fuera, de forma bivalente; el EGF ya no se puede unir y además las células NK atacan a la célula tumoral. Ahora, de efectos adversos, tengan en cuenta esto: el gefitinib es hepatotóxico, el erlotinib da toxicidad pulmonar, y el afatinib da diarrea severa y un rash como de acné; si la diarrea llega a grado 2 o 3, se baja la dosis, y como la comida le reduce la absorción hasta la mitad, va en ayunas. Y con el nimotuzumab, el cuidado clave es premedicar con antihistamínico y analgésico media hora antes de la infusión.'
  },
  {
    tipo: 'mecanismo', ses: 12, id: 'inhibidores-angiogenesis',
    titulo: 'Inhibidores de la angiogénesis',
    linea: 'Bloquean el VEGF o sus receptores e impiden que se formen los vasos nuevos que alimentan al tumor o dañan la retina.',
    datos: [
      '<b>Bevacizumab</b> atrapa el VEGF-A: no se une a VEGFR-1 ni VEGFR-2.',
      'Efectos: hipertensión, hemorragias, proteinuria, trombosis, mala cicatrización, perforación GI.',
      '<b>Sunitinib</b> bloquea VEGFR, PDGFR y c-KIT; evitar inhibidores o inductores de CYP3A4.',
      '<b>Ranibizumab, aflibercept, pegaptanib:</b> intravítreos; no frotar el ojo, evitar agua y polvo 24 h.',
      '<b>No agitar el vial</b> de un anticuerpo: la proteína se rompe y hace espuma.'
    ],
    notas: 'Vamos con la sesión 12, muchachos. La angiogénesis es la formación de vasos sanguíneos nuevos a partir de los que ya existen. Un tumor, para seguir creciendo, necesita sangre, entonces libera VEGF para que le lleguen vasos. En la animación ven al bevacizumab, que es un anticuerpo: atrapa el VEGF-A afuera, y como el VEGF queda atrapado, no se puede pegar a sus receptores y no se forman vasos. El sunitinib llega al mismo resultado pero desde adentro, bloqueando la quinasa de VEGFR, PDGFR y c-KIT; ojo con él y los fármacos que tocan el CYP3A4, como el ketoconazol o la rifampicina. En el ojo usamos ranibizumab, aflibercept y pegaptanib inyectados dentro del ojo, y después de la inyección el paciente no se puede frotar el ojo y debe evitar agua y polvo por 24 horas. Chicos, de efectos del bevacizumab llévense la hipertensión, la hemorragia, la proteinuria y la perforación intestinal. Y un cuidado de enfermería que sale siempre: el vial de un anticuerpo no se agita, porque la proteína se rompe, hace espuma y deja de servir.'
  },
  {
    tipo: 'mecanismo', ses: 12, id: 'inhibidores-proteasoma',
    titulo: 'Bortezomib: inhibidor del proteasoma',
    linea: 'Bloquea de forma reversible el proteasoma 26S: se acumulan proteínas dañadas y la célula tumoral entra en apoptosis.',
    datos: [
      'El <b>proteasoma 26S</b> degrada las proteínas marcadas con <b>ubiquitina</b>.',
      'Dosis pediátrica: <b>1,3 mg/m²</b>, 2 veces por semana por 3 semanas, con doxorubicina.',
      'Efectos: <b>neuropatía periférica</b> (parestesias, dolor) y PRES.',
      'Al destruir muchas células puede desencadenar <b>lisis tumoral</b>.'
    ],
    notas: 'Ahora el bortezomib, que es bien bonito de entender. Sucede que la célula todo el tiempo produce proteínas que se dañan, y para no llenarse de basura las marca con una etiqueta que se llama ubiquitina y las manda al proteasoma 26S, que las tritura. ¿Qué hace el bortezomib, pelados? Bloquea ese proteasoma de forma reversible. Entonces las proteínas dañadas se empiezan a acumular, la célula tumoral entra en estrés y termina en apoptosis; eso es justo lo que ven en la animación. El efecto adverso que más preguntan es la neuropatía periférica, con hormigueo y dolor, y también puede dar PRES, que es un síndrome neurológico. Y aquí les dejo el puente para la siguiente diapositiva: cuando un fármaco como este destruye muchas células tumorales al mismo tiempo, todo lo que tenían adentro sale a la sangre, y eso es el síndrome de lisis tumoral.'
  },
  {
    tipo: 'tarjetas', ses: 12, ceja: 'Sesión 12 · urgencia oncológica',
    titulo: 'Síndrome de lisis tumoral',
    items: [
      ['¿Qué pasa?', 'Se destruyen muchas células tumorales a la vez y su contenido sale a la sangre.'],
      ['¿Qué sube?', '<b>Potasio</b> (arritmias), <b>fósforo</b> y <b>ácido úrico</b>, que precipita en el túbulo renal.'],
      ['Hiperhidratación', '<b>2000-3000 cc/m²/día</b> con lactato de Ringer, buscando gasto urinario de 100-200 cc/m²/hora.'],
      ['Fármacos', '<b>Rasburicasa</b> al inicio, luego <b>alopurinol</b>; <b>sevelamer</b> para el fósforo.'],
      ['¿Cuándo UCI?', 'Leucocitos &gt; 50.000 o elevación de ácido úrico o fósforo.'],
      ['Enfermería', 'Balance de líquidos, gasto urinario, monitoreo cardíaco y control de electrolitos.']
    ],
    notas: 'Chicos, la lisis tumoral no es un fármaco, pero la vimos en clase y es una pregunta muy probable, así que no la dejen pasar. Cuando se destruyen muchas células tumorales al mismo tiempo, todo lo que tenían adentro sale a la sangre. ¿Y qué tienen adentro las células? Mucho potasio, mucho fósforo y ácidos nucleicos que se convierten en ácido úrico. El potasio alto da arritmias, y el ácido úrico se precipita en el túbulo del riñón y lo tapa, que es la nefropatía obstructiva. Entonces, ¿qué hacemos? Hiperhidratar, entre 2000 y 3000 centímetros cúbicos por metro cuadrado al día, con lactato de Ringer, porque la solución salina en pediatría da acidosis hiperclorémica, y buscando un gasto urinario de 100 a 200 por metro cuadrado por hora. Más rasburicasa al inicio, luego alopurinol para bajar el ácido úrico, y sevelamer para el fósforo. Y si el paciente tiene más de 50.000 leucocitos o le suben el ácido úrico o el fósforo, va para UCI. Desde enfermería, lo nuestro es el balance de líquidos, el gasto urinario, el monitoreo cardíaco y los electrolitos.'
  },
  {
    tipo: 'mecanismo', ses: 12, id: 'modificadores-respuesta-biologica',
    titulo: 'Anticuerpos conjugados',
    linea: 'El anticuerpo reconoce un antígeno del tumor, se internaliza y libera dentro de la célula un citotóxico o radiación.',
    datos: [
      '<b>Gemtuzumab</b> → CD33 · ozogamicina · leucemia mieloide aguda.',
      '<b>Brentuximab vedotin</b> → CD30 · MMAE (bloquea microtúbulos) · linfoma de Hodgkin.',
      '<b>Ibritumomab</b> → CD20 · itrio-90 (radiación beta) · linfoma no Hodgkin.',
      'Radioinmunoconjugado = anticuerpo + radionúclido.'
    ],
    notas: 'Los anticuerpos conjugados son un anticuerpo que lleva pegada una carga tóxica. El anticuerpo reconoce un antígeno que está en la célula tumoral, la célula se lo traga, o sea, lo internaliza, y adentro se suelta la carga y destruye el ADN o los microtúbulos. Fíjense en la animación cómo el fármaco se pega a la membrana y después entra hasta cerca del núcleo. Si no les queda claro cómo estudiarlo, se los explico así: armen en la cabeza una tablita con tres columnas, a qué se une, qué carga lleva y para qué se usa. Gemtuzumab: CD33, ozogamicina, leucemia mieloide aguda. Brentuximab vedotin: CD30, una auristatina que se llama MMAE y que bloquea los microtúbulos, linfoma de Hodgkin. Ibritumomab: CD20, itrio-90, que suelta radiación beta, linfoma no Hodgkin; a este último le dicen radioinmunoconjugado justamente porque la carga es radiactiva. Con esa tablita tienen la pregunta asegurada.'
  },
  {
    tipo: 'tabla', ceja: 'Mapa de anticuerpos',
    titulo: 'Anticuerpos contra el tumor: ¿a qué se pega cada uno?',
    cols: ['Fármaco', 'Se une a', 'Para qué'],
    filas: [
      ['Nimotuzumab', 'EGFR', 'Tumores de cabeza y cuello y gliomas'],
      ['Bevacizumab · ranibizumab · aflibercept', 'VEGF', 'Tumor · retina'],
      ['Gemtuzumab', 'CD33', 'Leucemia mieloide aguda'],
      ['Brentuximab vedotin', 'CD30', 'Linfoma de Hodgkin'],
      ['Ibritumomab', 'CD20', 'Linfoma no Hodgkin']
    ],
    notas: 'Muchachos, así como hicimos con los -tinib, aquí está el mapa de los anticuerpos que van contra el tumor, y esta es una diapositiva que yo me tomaría en foto. Todos los -mab se pegan a algo, y el examen casi siempre pregunta a qué. Fíjense que se agrupan: unos se pegan a factores de crecimiento o a sus receptores, como el nimotuzumab al EGFR o el bevacizumab al VEGF; y otros a marcadores de la superficie de la célula tumoral, que son los conjugados: el gemtuzumab al CD33 de la célula mieloide, el brentuximab al CD30 del linfoma de Hodgkin y el ibritumomab al CD20 del linfocito B. No se queden solo con el nombre: si saben a qué se une, ya pueden deducir para qué sirve.'
  },
  {
    tipo: 'tabla', ceja: 'Mapa de anticuerpos',
    titulo: 'Anticuerpos de trasplante, hueso, complemento y piel',
    cols: ['Fármaco', 'Se une a', 'Para qué'],
    filas: [
      ['Basiliximab', 'CD25', 'Prevenir el rechazo del trasplante'],
      ['Belatacept', 'CD80/CD86', 'Prevenir el rechazo del trasplante'],
      ['Denosumab', 'RANKL', 'Frenar la resorción ósea'],
      ['Eculizumab', 'C5', 'HPN, SHUa, miastenia y NMOSD'],
      ['Ustekinumab', 'p40 de IL-12/23', 'Psoriasis'],
      ['Ixekizumab · secukinumab', 'IL-17A', 'Psoriasis']
    ],
    notas: 'Y esta es la segunda parte del mapa, pelados: los anticuerpos que no van contra el tumor sino que frenan al sistema inmune o atrapan una molécula. El basiliximab se pega al CD25, que es parte del receptor de la IL-2, y el belatacept al CD80 y CD86 de la célula presentadora; los dos previenen el rechazo del trasplante. El denosumab atrapa el RANKL y frena al osteoclasto. El eculizumab se pega al C5 del complemento. Y los de psoriasis atrapan interleucinas: el ustekinumab la p40 que comparten la IL-12 y la IL-23, y el ixekizumab y el secukinumab la IL-17A. Si en el parcial les dan el blanco, ya saben cuál es el fármaco.'
  },
  {
    tipo: 'cadena', ses: 13, ceja: 'Sesión 11 y 13 · cómo se activa el linfocito T',
    titulo: '¿Dónde frena cada inmunosupresor al linfocito T?',
    pasos: [
      { t: 'Señal 1', s: 'reconoce el antígeno del injerto', f: '' },
      { t: 'Señal 2', s: 'CD28 con CD80/CD86', f: 'belatacept' },
      { t: 'Calcineurina', s: 'NF-AT entra al núcleo → IL-2', f: 'tacrolimus' },
      { t: 'Receptor de IL-2', s: 'CD25', f: 'basiliximab' },
      { t: 'Proliferación', s: 'mTOR · síntesis de purinas', f: 'sirolimus · micofenolato' }
    ],
    nota: 'Cada fármaco corta un paso distinto; por eso se combinan.',
    notas: 'Pelados, esta diapositiva junta la sesión 11 con la 13, y si la entienden ya no se les confunden los inmunosupresores. Miren cómo se activa un linfocito T contra un órgano trasplantado. Primero reconoce el antígeno del injerto: esa es la señal uno. Pero eso no le basta; necesita una segunda señal, que es el CD28 del linfocito pegándose al CD80 o CD86 de la célula presentadora, y ahí actúa el belatacept, bloqueando esa segunda señal. Si el linfocito se activa, prende la calcineurina, NF-AT entra al núcleo y produce IL-2; ahí actúa el tacrolimus. La IL-2 se pega a su receptor, que tiene una parte llamada CD25; ahí actúa el basiliximab. Y finalmente el linfocito tiene que multiplicarse, para lo cual necesita mTOR y fabricar purinas; ahí actúan el sirolimus y el micofenolato. ¿Ven por qué se combinan? Porque cada uno corta un paso distinto. De hecho, en clase vimos que el belatacept se combina con basiliximab para la inducción y micofenolato para el mantenimiento.'
  },
  {
    tipo: 'mecanismo', ses: 13, esq: ['inmunosupresores-trasplante', 'belatacept'],
    titulo: 'Trasplante: basiliximab y belatacept',
    linea: 'Basiliximab bloquea el receptor de IL-2 (CD25); belatacept bloquea la segunda señal de activación del linfocito T.',
    datos: [
      '<b>Basiliximab:</b> anticuerpo quimérico anti-CD25; &gt; 35 kg 20 mg, &lt; 35 kg 10 mg, 2 h antes del trasplante y el día 4.',
      '<b>Belatacept:</b> proteína de fusión CTLA-4 + Fc; se une a CD80/CD86 e impide la señal CD28.',
      'Antes del belatacept: <b>serología para EBV</b> (riesgo de linfoproliferativo postrasplante).',
      'Belatacept se combina con basiliximab (inducción) y micofenolato (mantenimiento).'
    ],
    notas: 'Ahora sí, los dos de trasplante con su animación; en las pestañas de arriba pueden cambiar entre uno y otro. El basiliximab es un anticuerpo quimérico, por eso termina en -ximab, que se pega al CD25 del linfocito activado; la IL-2 no puede actuar y hay menos linfocitos atacando el riñón o el órgano que se trasplantó. Se pone dos horas antes del trasplante y el día cuatro: 20 miligramos si el paciente pesa más de 35 kilos y 10 si pesa menos. El belatacept es una proteína de fusión, por eso termina en -cept, y se pega al CD80 y CD86 para bloquear la segunda señal. Chicos, tengan en cuenta este dato que es muy de examen: antes de iniciar belatacept se confirma la serología para virus de Epstein-Barr, porque hay más riesgo de un trastorno linfoproliferativo después del trasplante. Y con el basiliximab, desde enfermería vigilamos reacciones de hipersensibilidad, signos de infección y la función del injerto.'
  },
  {
    tipo: 'mecanismo', ses: 13, id: 'denosumab-eculizumab',
    titulo: 'Denosumab y eculizumab',
    linea: 'Denosumab se une a RANKL y frena al osteoclasto; eculizumab se une a C5 y no se forma el complejo de ataque a la membrana.',
    datos: [
      '<b>Denosumab:</b> hipocalcemia, osteonecrosis de mandíbula y fracturas vertebrales al suspenderlo.',
      'La osteoprotegerina es el receptor señuelo natural de RANKL.',
      '<b>Eculizumab:</b> HPN, SHUa, miastenia gravis y NMOSD.',
      'Infusión IV en 2-6 horas, <b>nunca en bolo</b>.',
      'Vacunar antes: <b>meningococo ACWY y B</b>, neumococo y Hib.'
    ],
    notas: 'Estos dos son anticuerpos que atrapan una molécula afuera de la célula. Empecemos por el hueso: el osteoclasto es la célula que reabsorbe hueso, y se activa cuando RANKL se pega a su receptor RANK. El denosumab se pega a RANKL, entonces RANKL ya no encuentra a RANK y baja la resorción. Es exactamente lo que hace de forma natural la osteoprotegerina, que es un receptor señuelo. De efectos llévense la hipocalcemia, la osteonecrosis de mandíbula y las fracturas vertebrales cuando se suspende. Ahora el eculizumab: el complemento, cuando se activa, termina formando un complejo que perfora membranas, el C5b-9. El eculizumab se pega al C5 y ese complejo no se forma, entonces hay menos hemólisis; por eso sirve en la hemoglobinuria paroxística nocturna y en el síndrome hemolítico urémico atípico. Y aquí viene lo importante, muchachos: ese complejo es justamente lo que nos defiende del meningococo, entonces antes de iniciarlo se vacuna contra meningococo ACWY y B, neumococo y Haemophilus. Y se infunde en 2 a 6 horas, nunca en bolo.'
  },
  {
    tipo: 'mecanismo', ses: 13, id: 'psoriasis-biologicos',
    titulo: 'Biológicos para psoriasis',
    linea: 'Ustekinumab bloquea la subunidad p40 de IL-12 e IL-23; ixekizumab y secukinumab neutralizan la IL-17A.',
    datos: [
      'Psoriasis: inflamación crónica que acelera el crecimiento de las células de la piel.',
      '<b>Ustekinumab:</b> p40 → no se activan Th1 ni Th17.',
      '<b>Ixekizumab y secukinumab:</b> anti-IL-17A.',
      'Anti-IL-17A: <b>candidiasis</b>, infecciones respiratorias y aparición o empeoramiento de enfermedad inflamatoria intestinal.'
    ],
    notas: 'Y cerramos la sesión 13 con psoriasis. La psoriasis es una enfermedad inflamatoria crónica de la piel en la que el sistema inmune se activa de más y acelera el crecimiento de los queratinocitos, por eso salen esas placas con descamación. Aquí hay dos blancos, pelados. El ustekinumab se pega a una pieza que se llama p40, que la comparten la IL-12 y la IL-23; al bloquearla, esas interleucinas no activan a los linfocitos Th1 y Th17. El ixekizumab y el secukinumab, en cambio, atrapan la IL-17A, que es la que estimula directamente al queratinocito. Y un tipcito para el examen: los anti-IL-17A dan candidiasis, infecciones respiratorias y pueden hacer aparecer o empeorar una enfermedad inflamatoria intestinal. Entonces, desde enfermería, preguntamos por síntomas digestivos y vigilamos infecciones.'
  },
  {
    tipo: 'mecanismo', ses: 14, id: 'antihelminticos',
    titulo: 'Antihelmínticos',
    linea: 'Benzimidazoles inhiben la tubulina; ivermectina abre canales de cloro; pirantel da parálisis espástica y piperazina, flácida.',
    datos: [
      '<b>Albendazol y mebendazol:</b> sin microtúbulos el parásito no absorbe glucosa y muere sin energía.',
      'Albendazol: ≤ 2 años 200 mg, &gt; 2 años 400 mg, dosis única; repetir en 2-3 semanas.',
      '<b>Ivermectina:</b> canales de cloro dependientes de glutamato → parálisis; síndrome de <b>Mazzotti</b>.',
      '<b>Pirantel:</b> agonista nicotínico → parálisis <b>espástica</b>.',
      '<b>Piperazina:</b> agonista GABA → parálisis <b>flácida</b>.'
    ],
    notas: 'Llegamos a la sesión 14, muchachos, ya vamos terminando. Los antihelmínticos son para los gusanos. El albendazol y el mebendazol inhiben la formación de la tubulina del parásito; sin microtúbulos el parásito no puede absorber glucosa, se queda sin energía y se muere. El albendazol se da en dosis única: 200 miligramos en menores de dos años y 400 en mayores, y se repite en dos o tres semanas. La ivermectina abre canales de cloro que dependen de glutamato; entra cloro, la célula del parásito se hiperpolariza y queda paralizado. Si se mueren muchos parásitos de una, puede salir una reacción inflamatoria que se llama síndrome de Mazzotti. Y ahora sí, chicos, apunten esto que es casi seguro que lo preguntan: el pirantel es agonista nicotínico, despolariza el músculo del gusano y lo deja rígido, en parálisis espástica; la piperazina es agonista GABA, lo hiperpolariza y lo deja blandito, en parálisis flácida.'
  },
  {
    tipo: 'mecanismo', ses: 14, id: 'antiprotozoarios',
    titulo: 'Antiprotozoarios',
    linea: 'Nitroimidazoles se activan por reducción y dañan el ADN; nitazoxanida bloquea la PFOR; paromomicina se une a la 30S.',
    datos: [
      '<b>Metronidazol:</b> anaerobios (C. difficile, B. fragilis), Entamoeba, Giardia y Trichomonas.',
      'Efectos: sabor metálico, neurotoxicidad, hemólisis en déficit de G6PD y <b>efecto antabuse</b> con alcohol.',
      'Amebicidas <b>luminales</b> (diloxanida, teclozán) vs. <b>tisulares</b> (metronidazol, tinidazol).',
      '<b>Paromomicina:</b> aminoglucósido, subunidad 30S, con las comidas.'
    ],
    notas: 'Y el último tema de contenido, los antiprotozoarios. El metronidazol y el tinidazol son nitroimidazoles: entran al microorganismo, y como allá adentro no hay oxígeno, se reducen, se activan y forman radicales libres que dañan el ADN. Por eso sirven para anaerobios como el Clostridium difficile y para protozoos como la Entamoeba, la Giardia y la Trichomonas. La nitazoxanida se convierte en tizoxanida y bloquea una enzima que se llama PFOR, entonces el parásito se queda sin energía. Y la paromomicina es un aminoglucósido que se pega a la subunidad 30S y frena la síntesis de proteínas. Pelados, con el metronidazol no se les olvide: nada de alcohol, porque da efecto antabuse, y el paciente se va a quejar de sabor metálico. Y otra cosa que preguntan: la diferencia entre amebicidas luminales, que actúan en la luz del intestino, como la diloxanida o el teclozán, y tisulares, que actúan en los tejidos, como el metronidazol.'
  },
  {
    tipo: 'tabla', ses: 14, ceja: 'Sesión 14 · comparativo',
    titulo: 'Antiparasitarios: no los confundas',
    cols: ['Fármaco', 'Qué hace', 'Resultado'],
    filas: [
      ['Albendazol · mebendazol', 'Inhiben la polimerización de la tubulina', 'Sin glucosa ni energía → muere'],
      ['Ivermectina', 'Abre canales de cloro (glutamato)', 'Hiperpolariza → parálisis'],
      ['Pirantel', 'Agonista nicotínico', 'Parálisis espástica'],
      ['Piperazina', 'Agonista GABA', 'Parálisis flácida'],
      ['Metronidazol · tinidazol', 'Se activan por reducción → radicales', 'Daño del ADN'],
      ['Nitazoxanida', 'Bloquea la enzima PFOR', 'Cae la energía'],
      ['Paromomicina', 'Se une a la subunidad 30S', 'Sin proteínas']
    ],
    notas: 'Chicos, esta tabla es para que la sesión 14 no se les vuelva un enredo. Fíjense que los antihelmínticos casi todos terminan en parálisis o en dejar al gusano sin energía, y la gracia está en saber por qué camino. Tubulina para albendazol y mebendazol, canales de cloro para ivermectina, nicotínico y espástica para pirantel, GABA y flácida para piperazina. Los antiprotozoarios, en cambio, atacan el ADN, la energía o las proteínas del microorganismo. Un tipcito: lean la tabla de izquierda a derecha diciendo la frase completa, por ejemplo, la piperazina es agonista GABA y produce parálisis flácida, y así se les queda mucho más fácil que memorizando palabras sueltas.'
  },
  {
    tipo: 'flip', ceja: 'Repaso rápido',
    titulo: '¿Quién da qué? Toca cada tarjeta',
    items: [
      ['Vemurafenib', 'Fotosensibilidad extrema y QT prolongado'],
      ['Dabrafenib', 'Fiebre (pirexia) e hiperglucemia'],
      ['Ponatinib', 'Hipertensión e isquemia periférica'],
      ['Afatinib', 'Diarrea severa y rash acneiforme'],
      ['Gefitinib', 'Hepatotoxicidad y triquiasis'],
      ['Sirolimus · everolimus', 'Estomatitis, hiperlipidemia y neumonitis'],
      ['Bevacizumab', 'Hipertensión, proteinuria y perforación GI'],
      ['Bortezomib', 'Neuropatía periférica'],
      ['Denosumab', 'Hipocalcemia y osteonecrosis de mandíbula'],
      ['Anti-IL-17A', 'Candidiasis y empeoramiento de EII'],
      ['Ivermectina', 'Síndrome de Mazzotti'],
      ['Metronidazol', 'Sabor metálico y efecto antabuse']
    ],
    notas: 'Bueno muchachos, ahora juguemos un poquito. En esta diapositiva cada tarjeta tiene el nombre de un fármaco, y cuando la toco se voltea y muestra su efecto adverso característico. La idea es que ustedes me digan el efecto antes de que yo la voltee; escríbanlo en el chat o activen el micrófono. Vamos con el vemurafenib, ¿qué da? Fotosensibilidad y QT largo. ¿Y el bortezomib? Neuropatía periférica. Así vamos con todas. Si alguno falla, tranquilos, que para eso es el repaso; lo importante es que el sábado no les pase. Y fíjense que muchos efectos se explican por el mecanismo: el denosumab baja la resorción de hueso y por eso baja el calcio; el bevacizumab frena los vasos y por eso afecta la cicatrización y el riñón.'
  },
  {
    tipo: 'cuidados',
    titulo: 'Cuidados de enfermería que más se repiten',
    notas: 'Antes de las preguntas, chicos, repasemos los cuidados que se repiten en todo el parcial, porque a enfermería siempre le preguntan qué hacer, no solo cómo actúa. Con los -tinib orales, revisen si van en ayunas, como el dabrafenib, el trametinib y el afatinib, vigilen la piel y, con el vemurafenib, el electrocardiograma. Con los anticuerpos: el vial no se agita, se premedica cuando toca, la infusión es lenta, el eculizumab nunca en bolo, y siempre pendientes de una reacción de hipersensibilidad. Con los inmunosupresores: niveles valle, signos de infección, y el tacrolimus lejos de las comidas grasosas. Si el tratamiento destruye muchas células, piensen en lisis tumoral. Antes de ciertos fármacos hay requisitos: vacuna de meningococo antes del eculizumab y serología de Epstein-Barr antes del belatacept. Y con los antiparasitarios: cero alcohol con metronidazol y atentos a Mazzotti con la ivermectina.'
  },
  {
    tipo: 'quiz',
    titulo: 'Preguntas tipo parcial',
    preguntas: [
      { ses: 10, q: '¿Qué mutación esquiva el ponatinib?', ops: ['V600E', 'T315I', 'TSC1', 'C5b-9'], ok: 1,
        exp: 'El ponatinib tiene un enlace triple de etinilo que le permite unirse a BCR-ABL con la mutación T315I. V600E es la mutación de BRAF.' },
      { ses: 12, q: '¿Cómo actúa el bevacizumab?', ops: ['Bloquea por dentro la tirosina quinasa de VEGFR', 'Se une al VEGF-A y le impide unirse a sus receptores', 'Inhibe el proteasoma 26S', 'Se une a CD25 del linfocito T'], ok: 1,
        exp: 'Es un anticuerpo que atrapa el VEGF-A fuera de la célula. Bloquear por dentro la quinasa de VEGFR es lo que hace el sunitinib.' },
      { ses: 11, q: '¿Qué bloquea el complejo tacrolimus–FKBP-12?', ops: ['mTORC1', 'La IMPDH', 'La calcineurina', 'El receptor de IL-2'], ok: 2,
        exp: 'Tacrolimus + FKBP-12 bloquea la calcineurina: NF-AT no entra al núcleo y no hay IL-2. El complejo de sirolimus con FKBP-12 es el que bloquea mTORC1.' },
      { ses: 12, q: 'En el síndrome de lisis tumoral se eleva:', ops: ['Sodio, calcio y glucosa', 'Potasio, fósforo y ácido úrico', 'Magnesio, cloro y albúmina', 'Bicarbonato, calcio y urea'], ok: 1,
        exp: 'Al destruirse las células tumorales liberan potasio, fósforo y ácido úrico; el ácido úrico precipita en el túbulo renal.' },
      { ses: 13, q: '¿Qué vacuna es obligatoria antes del eculizumab?', ops: ['BCG', 'Fiebre amarilla', 'Meningococo ACWY y B', 'Varicela'], ok: 2,
        exp: 'Al bloquear C5 no se forma el complejo de ataque a la membrana, que defiende contra el meningococo. También se vacuna contra neumococo y Hib.' },
      { ses: 13, q: '¿Qué se confirma antes de iniciar belatacept?', ops: ['Serología para virus de Epstein-Barr', 'Densitometría ósea', 'Niveles de IL-17A', 'Prueba de G6PD'], ok: 0,
        exp: 'Hay mayor riesgo de trastorno linfoproliferativo postrasplante, por eso se confirma la serología para EBV.' },
      { ses: 14, q: '¿Cuál produce parálisis flácida del helminto?', ops: ['Pirantel', 'Ivermectina', 'Albendazol', 'Piperazina'], ok: 3,
        exp: 'La piperazina es agonista GABA: hiperpolariza y deja al nematodo en parálisis flácida. El pirantel produce parálisis espástica.' },
      { ses: 10, q: '¿Qué vigilancia exige el vemurafenib?', ops: ['Calcio por hipocalcemia', 'ECG por prolongación del QT', 'Serología para EBV', 'Niveles valle de 5-15 ng/mL'], ok: 1,
        exp: 'El vemurafenib prolonga el QT: ECG a los 15 días y luego mensual. Hipocalcemia es del denosumab, EBV del belatacept y niveles valle de sirolimus y everolimus.' }
    ],
    notas: 'Bueno muchachos, llegó la hora de medirse. Esta diapositiva va pasando las preguntas una por una; yo leo la pregunta, les doy unos segundos, ustedes responden en el chat y luego toco la opción para ver si acertaron. No le tengan miedo a equivocarse, que es mejor equivocarse hoy que el sábado. Les dejo las respuestas para que yo no me enrede: la primera, T315I, y ojo que V600E es de BRAF. La segunda, el bevacizumab atrapa el VEGF-A afuera; la trampa es el sunitinib, que bloquea por dentro. La tercera, el tacrolimus con FKBP-12 bloquea la calcineurina; el que bloquea mTOR es el sirolimus. La cuarta, en lisis tumoral suben potasio, fósforo y ácido úrico. La quinta, meningococo antes del eculizumab. La sexta, serología para Epstein-Barr antes del belatacept. La séptima, parálisis flácida es la piperazina; espástica es el pirantel. Y la octava, el vemurafenib exige electrocardiograma por el QT. Si alguno falló varias, que repase las tablas de los -tinib y de los anticuerpos.'
  },
  {
    tipo: 'cierre',
    titulo: 'Sigue estudiando en la web',
    notas: 'Bueno chicos, eso es todo por hoy. Muchas gracias por quedarse hasta el final. Les recuerdo que en la página tienen todas las sesiones con la animación de cada mecanismo, igualita a la que vimos hoy, y además flashcards, quiz por tema y el listado de fármacos, para que sigan repasando estos días. Pueden escanear el código o entrar a la dirección que está en pantalla. Mi consejo para estos días: no se pongan a leer todo de corrido; repasen las tablas, vuelvan a ver las animaciones y hagan los quiz. Mucha suerte el sábado, ya verán que les va muy bien, y si les queda alguna duda me escriben por el grupo sin problema. Un abrazo, nos vemos.'
  }
];
