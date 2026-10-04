# Farmacología · Soy Andrés Arango

Tutorías y material de estudio de Farmacología en Enfermería (cuidado crítico neo-pediátrico).
**Elaborado por Soy Andrés Arango.** © 2026 Andrés Arango. Todos los derechos reservados.
No es una plataforma oficial de la FUCS.

Misma familia visual y de marca que `PROYECTO CENTRO DE ESTUDIO` (paleta azul profundo / azul / amarillo, Inter + Archivo Black, logo real).

## Cómo abrirlo

- **Doble clic en `index.html`** (scripts clásicos, sin `fetch`: funciona sin servidor).
- O con servidor local: `powershell -ExecutionPolicy Bypass -File tools\servir.ps1` → http://localhost:8080

El progreso se guarda en `localStorage` del navegador (clave `farmacologia-v1`).

## Qué incluye

| Sección | Qué hace |
|---|---|
| Sesiones | Sesión → fármaco/tema. Lectura con tablas y los **⭐ datos de examen** destacados en amarillo |
| Flashcards | Por fármaco, sesión, varias sesiones o todo. Voltear, "La sé" / "Repasar", filtrar lo pendiente |
| Quiz | Opción múltiple y V/F, opciones mezcladas, puntaje final, repaso de lo fallado |
| Calculadora | 11 fórmulas con procedimiento **paso a paso** y ejemplo precargado |
| Datos examen | Los ⭐ reunidos por sesión y fármaco, más el taller y el simulacro resueltos. **Protegido con clave**: ya no está en el menú; se entra desde la slide al final de Sesiones (clave en `js/core/05-acceso.js`, solo guarda su huella SHA-256) |
| Mi progreso | Temas estudiados, flashcards, preguntas falladas, temas más débiles, historial |

## Cómo agregar una sesión nueva

1. Crea una carpeta en `content/`, por ejemplo `content/sesion-10-nombre-del-tema/`.
2. Dentro, un `.md` por fármaco/tema con el **mismo formato** de los existentes:
   - Frontmatter: `id`, `nombre`, `sesion`, `tema`, `grupo_farmacologico`, `tags`, `dificultad_quiz` (opcionales: `mecanismo_resumen`, `linea_celular`).
   - Secciones `## ...` con el contenido. Un dato de examen se escribe `> ⭐ **DATO DE EXAMEN:** ...` (también funciona ⭐ en una fila de tabla, un ítem de lista o un título).
   - `## Preguntas de quiz sugeridas` → `1. **(Opción múltiple)** ...` con opciones `   - a) ...` y la correcta con `✓`; `**(Verdadero/Falso)** ... → **Falso** (explicación)`.
   - `## Flashcards sugeridas` → `- **Q:** pregunta → **A:** respuesta`.
3. Doble clic en **`construir.bat`** (empaqueta los `.md` en `data/contenido.js`).
4. Recarga la página. La sesión, el quiz, las flashcards y los datos de examen aparecen solos; no hay que tocar código.

Si una pregunta no tiene el formato correcto, se omite y se avisa en la consola del navegador (`FA.datos.advertencias`).

## Estructura

```
index.html               esqueleto y orden de carga de scripts
content/                 FUENTE: un .md por fármaco/tema, en carpetas sesion-N-…
data/contenido.js        GENERADO por construir.bat (no editar a mano)
css/                     01-variables · 02-base · 03-componentes · 04-vistas
js/core/                 util · markdown · datos (modelo) · estado (progreso) · router
js/components/           alcance · flashcards · quiz · formulas (las 8 de la calculadora)
js/modules/              inicio · sesiones · farmaco · practica · calculadora · examen · progreso
assets/branding/         logo vectorial (SVG currentColor, negro, blanco, azul profundo), insignias circulares y favicon; logo-color.html cambia el color en RGB; el PNG original se conserva
tools/                   construir.ps1 (empaquetado) · servir.ps1 (servidor local opcional)
docs/                    brief original y fórmulas fuente
```

## Reglas del proyecto

- El contenido académico sale tal cual de los `.md` entregados (transcripciones de clase resumidas). No se inventa contenido.
- Las dosis y fórmulas son material de estudio; el pie de página y la calculadora piden verificar con el protocolo institucional.
- Encabezado: insignia azul profundo con logo blanco. Portada y pie: insignia blanca con logo azul profundo. Favicon: insignia azul. Todo sale del logo vectorizado (huecos uniformes de 8); la versión fiel al PNG original está en `logo-soy-andres-arango-fiel-original.svg`.

## Banco de examen (dentro de la zona con clave)

Entrando a **Datos examen** (clave en `js/core/05-acceso.js`) hay un botón **Banco de examen: práctica y simulacro**.

- Usa las preguntas tipo caso de `content/examen/` que tienen 4 opciones (`- a) …`, la correcta con ✓), un `**Caso:**` y una `**Justificación:**`. Las preguntas abiertas del taller no entran. Agregar un `.md` nuevo con ese formato en `content/examen/` y correr `construir.bat` suma sus preguntas solas.
- **Práctica:** respondes y ves la justificación al instante.
- **Simulacro:** N preguntas al azar con tiempo (1, 1,5 o 2 min por pregunta), se puede ir y volver, y la justificación llega al terminar. Atajos: a-d responder, flechas moverse.
- Las opciones se muestran en su orden original porque las justificaciones citan letras.
- Los resultados se guardan aparte (`ex` y `exHist` en el progreso), por lo que no aparecen en "Mi progreso".

## Buscador global y filtros

Menú **Buscar** (`#/buscar`). Busca en **todo el texto** de los temas, no solo en el nombre.

- Varias palabras = deben aparecer todas (en cualquier parte del tema).
- Tolera tildes y variantes de escritura (clofazimina / clofacimina, vancomicina / bancomicina). La normalización está en `FA.buscar.norm` (`js/modules/buscar.js`) y mantiene la longitud del texto para que el resaltado caiga bien.
- Filtros por **sesión**, **grupo farmacológico** y **etiqueta** (salen del frontmatter), solos o junto con la búsqueda. El estado queda en la URL (`#/buscar?q=…&s=7,8&g=…&t=…`), así que se puede compartir.
- Cada fragmento enlaza a la **sección exacta** del tema (`#/farmaco/<id>/<sección>`) y la resalta un momento.
- Las etiquetas y el grupo de cada tema son enlaces a esta búsqueda; el cuadro de la portada usa el mismo motor.
- No incluye la zona con clave (Datos examen).

## Repaso espaciado de flashcards

Sistema de **3 cajas** (se guarda en el navegador, clave `lei` dentro de `farmacologia-v1`):

| Caja | Vuelve a tocar |
|---|---|
| 1 | cada día |
| 2 | cada 3 días |
| 3 | cada 7 días |

- **La sé** sube la tarjeta de caja; **Repasar** la manda a la caja 1 y toca de nuevo hoy. Una tarjeta nunca vista cuenta como "toca hoy".
- En **Flashcards** hay una casilla "Repaso espaciado: sólo las que me tocan hoy", el resumen de cuántas hay en cada caja y un botón directo (`#/flashcards/hoy`).
- Cada tarjeta muestra su caja ("Nueva", "Caja 1 de 3"…). Los intervalos están en `DIAS_CAJA` (`js/core/03-estado.js`).
- Convive con las marcas anteriores "La sé / Repasar" y con el filtro "Sólo las que aún no sé".

## Modo oscuro, accesibilidad e impresión

- **Modo oscuro:** botón con luna/sol en el encabezado. Por defecto sigue la preferencia del sistema; si la persona elige a mano, se recuerda (`farmacologia-tema` en localStorage). Un script mínimo del `<head>` pone el tema antes de pintar, así no hay parpadeo.
  - Los colores semánticos están en `css/01-variables.css` (`--sup`, `--titulo`, `--enlace`, `--sel`, `--amb…`) y el modo oscuro solo los redefine en `css/05-oscuro.css`. En claro valen lo que valían antes.
  - Si agregas un componente nuevo, usa esas variables (superficie = `--sup`, títulos = `--titulo`, enlaces = `--enlace`, botones/seleccionado = `--sel`) y se verá bien en los dos modos. Texto blanco sobre `--azul-profundo` es seguro; texto oscuro sobre amarillo hay que corregirlo en `05-oscuro.css`.
  - Se midió el contraste de todo el texto en ambos modos: 0 casos bajo 4,5:1 (se oscureció el gris tenue del modo claro, que estaba en 3,2:1).
- **Saltar al contenido:** primer elemento al pulsar Tab. El enrutador ya no enfoca el contenido en la carga inicial para que esto funcione.
- **Imprimir un tema:** botón "Imprimir este tema" en cada tema. La hoja de impresión oculta menú, botones y pie, deja tablas y datos de examen con bordes y agrega la línea de autoría.
