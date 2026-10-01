# Farmacología · soy Andrés Arango

Tutorías y material de estudio de Farmacología en Enfermería (cuidado crítico neo-pediátrico).
**Elaborado por soy Andrés Arango.** © 2026 Andrés Arango. Todos los derechos reservados.
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
| Datos de examen | Todos los ⭐ reunidos por sesión y fármaco |
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
assets/branding/         logo real de soy Andrés Arango (sin modificar)
tools/                   construir.ps1 (empaquetado) · servir.ps1 (servidor local opcional)
docs/                    brief original y fórmulas fuente
```

## Reglas del proyecto

- El contenido académico sale tal cual de los `.md` entregados (transcripciones de clase resumidas). No se inventa contenido.
- Las dosis y fórmulas son material de estudio; el pie de página y la calculadora piden verificar con el protocolo institucional.
- El logo se usa desde el archivo real, sin rediseñarlo.
