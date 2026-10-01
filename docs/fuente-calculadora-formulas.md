---
id: calculadora-formulas
nombre: Fórmulas de cálculo para la calculadora interactiva
tags: [calculadora, dosis, goteo, formulas]
---

# Fórmulas para implementar en la calculadora de la app

Cada fórmula debe quedar como un "modo" independiente dentro de la calculadora, con sus propios campos de entrada y la fórmula aplicada. Formato sugerido: `{ id, nombre, inputs: [...], formula: fn, resultado_unidad }`.

---

## 1. Holliday-Segar (líquidos de mantenimiento)

**Inputs:** peso_kg

**Lógica:**
```
Si peso <= 10: total_ml = peso * 100
Si 10 < peso <= 20: total_ml = 1000 + (peso - 10) * 50
Si peso > 20: total_ml = 1000 + 500 + (peso - 20) * 20

cc_hora = total_ml / 24
```

**Resultado:** mL/24h y mL/hora

---

## 2. Superficie corporal (ASC) — Mosteller

**Inputs:** peso_kg, talla_cm

**Fórmula:**
```
SC (m²) = raíz_cuadrada( (peso_kg * talla_cm) / 3600 )
```

**Variante sin talla (Mosteller modificada), para menores de 10kg:**
```
SC = (peso * 4 + 9) / 100
```

**Variante sin talla, para mayores de 10kg:**
```
SC = (peso * 4 + 7) / (peso + 90)
```

---

## 3. Flujo metabólico / VIG (velocidad de infusión de glucosa — dextrosa)

**Inputs:** flujo_deseado_mg_kg_min, peso_kg, concentracion_dextrosa_porcentaje

**Fórmula (flujo deseado → cc/hora):**
```
cc_hora = (flujo_mg_kg_min * peso_kg * 6) / concentracion_dextrosa_porcentaje
```

**Fórmula inversa (verificación — administrado):**
```
flujo_administrado = (volumen_infusion_cc_hora * concentracion_dextrosa_porcentaje) / (peso_kg * 6)
```

**Valores de referencia:**
- RNAT (recién nacido a término): 4-6 mg/kg/min
- RNPT (recién nacido pretérmino): 6-8 mg/kg/min

---

## 4. Mezcla de soluciones (regla de aliligación / resta en cruz)

**Inputs:** concentracion_alta, concentracion_baja, concentracion_deseada, volumen_total_ml

**Lógica:**
```
parte_baja = concentracion_alta - concentracion_deseada
parte_alta = concentracion_deseada - concentracion_baja
suma_partes = parte_alta + parte_baja
factor = volumen_total_ml / suma_partes

volumen_solucion_baja = parte_baja * factor
volumen_solucion_alta = parte_alta * factor
```

**Resultado:** mL de cada solución (debe sumar el volumen total)

---

## 5. Infusión mcg/kg/min — Constante K (vasoactivos: adrenalina, noradrenalina, dopamina, dobutamina)

**Inputs:** mg_farmaco, volumen_mezcla_cc, dosis_mcg_kg_min, peso_kg

**Fórmula de la constante K:**
```
K = (mg_farmaco * 1000) / (volumen_mezcla_cc * 60)
```

**cc/hora a partir de K:**
```
cc_hora = (dosis_mcg_kg_min * peso_kg) / K
```

**Fórmula alternativa (un solo paso, sin K intermedio):**
```
cc_hora = (dosis_mcg_kg_min * peso_kg * volumen_mezcla_cc * 60) / (mg_farmaco * 1000)
```

**Fórmula inversa (dado un goteo, calcular la dosis que recibe el paciente):**
```
dosis_mcg_kg_min = (cc_hora * K) / peso_kg
```

---

## 6. Soluciones salinas — conversión de concentración

**Dato base:** 1000 cc de SSN 0.9% = 154 mEq de sodio (equivalente: 100 cc = 15.4 mEq)

**Inputs:** volumen_deseado_cc, concentracion_deseada_porcentaje

**Paso 1 — mEq necesarios (regla de tres):**
```
mEq_por_100cc_al_X% = (concentracion_deseada_porcentaje * 15.4) / 0.9
mEq_totales = (mEq_por_100cc_al_X% * volumen_deseado_cc) / 100
```

**Paso 2 — volumen de cloruro de sodio necesario (dado concentración de la ampolla en mEq/mL):**
```
volumen_NaCl_cc = mEq_totales / concentracion_ampolla_mEq_mL
```

**Paso 3 — volumen de diluyente (agua estéril o SSN base):**
```
volumen_diluyente_cc = volumen_deseado_cc - volumen_NaCl_cc
```

---

## 7. Dosis mg/kg/día → mg por toma

**Inputs:** dosis_mg_kg_dia, peso_kg, numero_dosis_dia

**Fórmula:**
```
dosis_total_dia_mg = dosis_mg_kg_dia * peso_kg
dosis_por_toma_mg = dosis_total_dia_mg / numero_dosis_dia
```

---

## 8. Dosis mg/kg/hora → cc/hora (infusión continua, ej. furosemida, vecuronio)

**Inputs:** dosis_mg_kg_hora, peso_kg, mg_farmaco_en_mezcla, volumen_mezcla_cc

**Fórmula (dos pasos):**
```
mg_hora_necesarios = dosis_mg_kg_hora * peso_kg

# regla de tres con la concentración de la mezcla
cc_hora = (mg_hora_necesarios * volumen_mezcla_cc) / mg_farmaco_en_mezcla
```

---

## Notas de implementación para Claude Code

- Todas las fórmulas deben aceptar inputs en las unidades indicadas (kg, cc, mg, mcg, %, mEq/mL) y mostrar el resultado con 1-2 decimales.
- Incluir validación básica: peso > 0, volúmenes > 0, concentraciones entre 0-100%.
- Para la fórmula de mezcla de soluciones (#4), validar que `concentracion_baja < concentracion_deseada < concentracion_alta`.
- Sería ideal mostrar el procedimiento paso a paso (no solo el resultado final), replicando el estilo de "Paso 1 / Paso 2 / Paso 3" usado en clase, ya que el usuario prefiere explicaciones conceptuales de la estructura de la fórmula, no solo el resultado.
- Considerar una sección de "ejemplos resueltos" precargados para cada fórmula, como casos de prueba.
