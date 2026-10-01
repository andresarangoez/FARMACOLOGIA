# App de estudio — Farmacología (Sesiones 7, 8 y 9)

Brief para construir una aplicación web de estudio con el contenido de tres sesiones de farmacología de enfermería (cuidado crítico neo-pediátrico, FUCS). El objetivo es tener una app funcional para repasar antes de un parcial, con intención de ir agregando más sesiones después.

## Alcance de esta primera versión

Solo estas 3 sesiones (ya incluidas en `/content`):
- **Sesión 7** — Fármacos del sistema sanguíneo (eritropoyetina, antitrombina III, eltrombopag, filgrastim/pegfilgrastim)
- **Sesión 8** — Antiinfecciosos de amplio espectro (tetraciclinas, cloranfenicol, sulfonamidas, fluoroquinolonas, estreptograminas, linezolid, polimixinas, glicopéptidos, lipopéptidos)
- **Sesión 9** — Antituberculosos y antileprosos (esquema de TB, dapsona, clofacimina, talidomida)

La estructura debe quedar pensada para **agregar más sesiones después** sin rehacer nada (nuevas carpetas en `/content`, mismo formato de frontmatter).

## Estructura del contenido

```
content/
  sesion-7-sistema-sanguineo/
    01-eritropoyetina.md
    02-antitrombina-iii.md
    03-eltrombopag.md
    04-filgrastim-pegfilgrastim.md
  sesion-8-antiinfecciosos/
    01-tetraciclinas.md
    02-cloranfenicol.md
    03-sulfonamidas.md
    04-fluoroquinolonas.md
    05-estreptograminas-linezolid.md
    06-polimixinas.md
    07-glicopeptidos.md
    08-lipopeptidos.md
  sesion-9-tuberculosis-lepra/
    01-esquema-tuberculosis.md
    02-dapsona.md
    03-clofacimina.md
    04-talidomida.md
  formulas/
    calculadora-formulas.md
```

Cada archivo de fármaco/tema tiene:
- **Frontmatter YAML** con metadata (`id`, `nombre`, `sesion`, `tema`, `grupo_farmacologico`, `mecanismo_resumen`, `tags`, `dificultad_quiz`)
- **Contenido en Markdown** con secciones consistentes: Concepto/Historia, Indicaciones, Mecanismo de acción, Dosis, Efectos secundarios, Cuidados de enfermería
- **Sección "Preguntas de quiz sugeridas"** — ya redactadas como opción múltiple o verdadero/falso, con la respuesta correcta marcada con ✓
- **Sección "Flashcards sugeridas"** — pares pregunta/respuesta en formato `**Q:** ... → **A:** ...`

El archivo `formulas/calculadora-formulas.md` trae las fórmulas de cálculo (Holliday-Segar, superficie corporal, flujo metabólico/VIG, mezcla de soluciones, constante K para vasoactivos, conversión de soluciones salinas, dosis mg/kg/día y mg/kg/hora) con su lógica ya resuelta en pseudocódigo, lista para traducir a funciones.

> ⚠️ Los datos marcados con **⭐ "DATO DE EXAMEN"** en los archivos fueron señalados explícitamente por la docente en clase como posibles preguntas de parcial — vale la pena que la UI los pueda destacar visualmente de alguna forma (ej. con un ícono o color distinto) en la vista de contenido.

## Funcionalidad esperada

1. **Navegación por sesión** → por fármaco/tema (usar el frontmatter para listar y filtrar)
2. **Vista de contenido** de cada fármaco, renderizando el Markdown (tablas, el bloque de "dato de examen" destacado)
3. **Flashcards** — extraídas de la sección "Flashcards sugeridas" de cada archivo; modo de repaso tipo tarjeta (mostrar pregunta, voltear para ver respuesta, siguiente/anterior)
4. **Quiz de opción múltiple** — extraído de "Preguntas de quiz sugeridas"; se puede generar un quiz por fármaco, por sesión completa, o mezclando varias sesiones; mostrar puntaje al final
5. **Calculadora de fórmulas** — un selector de fórmula (de las 8 en `calculadora-formulas.md`) con sus inputs correspondientes y el resultado paso a paso (no solo el número final — mostrar el procedimiento)
6. **(Opcional, si da tiempo) Seguimiento de progreso** — guardar localmente qué quizzes/flashcards ya se repasaron y con qué puntaje, para enfocar el repaso en lo más débil

## Decisiones ya tomadas (no hace falta volver a preguntar)

- Contenido fuente: transcripciones reales de las clases (ya resumidas y estructuradas en estos .md)
- Un archivo por fármaco/tema (no uno grande por sesión) — pensado para que cada archivo se pueda mapear a una "tarjeta" o ruta individual en la app
- La calculadora debe incluir el procedimiento paso a paso, no solo el resultado (coherente con cómo se explica en clase)
- Prioridad: que funcione bien para estas 3 sesiones primero; la escalabilidad a más sesiones es el criterio de diseño, pero no hay que implementar sesiones que no existen todavía

## Lo que queda abierto para decidir en Claude Code

- Stack técnico (framework, si será SPA o con backend, si se persiste progreso en localStorage o en una base de datos)
- Diseño visual / UI kit
- Si el parseo del Markdown + frontmatter se hace en build time o en runtime
- Cómo se randomiza/mezcla el banco de preguntas para el quiz
