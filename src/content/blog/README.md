# Estándar de producción de contenido — Blog

## Nombre del archivo

- Extensión: `.mdx`
- Formato: `kebab-case` (guiones, no espacios ni guiones bajos)
- Ejemplo válido: `intro-bayesiano.mdx`
- Ejemplo inválido: `9-prediccion y causalidad.mdx` → usar `9-prediccion-y-causalidad.mdx`
- El **slug** se deriva del nombre del archivo (sin `.mdx`). Aparece en la URL: `/es/blog/{slug}`

## Frontmatter (YAML entre `---`)

Todos los campos son obligatorios:

| Campo         | Tipo     | Descripción                              | Ejemplo                          |
|---------------|----------|------------------------------------------|----------------------------------|
| `title`       | string   | Título en español                        | `"Estadística Bayesiana..."`     |
| `titleEn`     | string   | Título en inglés                         | `"Bayesian Statistics..."`       |
| `date`        | string   | Fecha de publicación (`YYYY-MM-DD`)      | `"2026-04-22"`                   |
| `tags`        | string[] | Lista de etiquetas (3-5 recomendadas)    | `["Bayes", "Probabilidad"]`      |
| `excerpt`     | string   | Resumen en español (1-2 frases)          |                                  |
| `excerptEn`   | string   | Resumen en inglés (1-2 frases)           |                                  |
| `readingTime` | number   | Tiempo de lectura en minutos             | `12`                             |
| `bodyEn`      | string   | Contenido completo en inglés (block scalar) | Ver formato abajo             |

## Formato del `bodyEn`

Usar **block scalar literal** (`|`) con indentación de **2 espacios**:

```yaml
bodyEn: |
  ## First heading

  Paragraph text here.

  ```r
  library(example)
  ```
```

### Reglas críticas del block scalar

1. **Indentación uniforme de 2 espacios** en todas las líneas del bloque
2. **No usar tabs** — YAML no permite tabs para indentación de block scalars
3. **No dejar líneas a columna 0** dentro del bloque — el parser interpreta que el bloque terminó
4. Usar `|-` en lugar de `|` si no quieres una línea vacía al final del contenido
5. Los ` ``` ` (code fences) dentro del bloque también deben estar indentados con 2 espacios

## Contenido en español (body del .mdx)

El contenido en español va **después** del frontmatter (después del segundo `---`), sin indentación:

```mdx
---
title: "Mi post"
...frontmatter...
bodyEn: |
  English content here...
---

## Mi título en español

Contenido en español aquí...
```

## Reglas de contenido

- Usar `##` para headings de sección (no `#` — el título del post ya es el h1)
- Los `---` dentro del body se renderizan como `<hr>` (separadores)
- Soporta LaTeX inline (`$formula$`) y block (`$$formula$$`)
- Soporta code blocks con syntax highlighting básico (` ```r `, ` ```python `, etc.)
- Soporta listas `- `, listas numeradas `1. `, blockquotes `> `, y enlaces `[text](url)`

## Orden recomendado de campos en el frontmatter

```yaml
---
title: "..."
titleEn: "..."
date: "YYYY-MM-DD"
tags: ["...", "..."]
excerpt: "..."
excerptEn: "..."
readingTime: N
bodyEn: |
  ...
---
```

## Checklist antes de publicar

- [ ] Nombre de archivo en `kebab-case` sin espacios
- [ ] Todos los campos del frontmatter presentes
- [ ] `date` en formato `YYYY-MM-DD`
- [ ] `tags` es un array (no string suelto)
- [ ] `bodyEn` con indentación consistente de 2 espacios (sin tabs)
- [ ] No hay líneas a columna 0 dentro del bloque `bodyEn`
- [ ] Contenido en español después del frontmatter
- [ ] No hay `---` sueltos dentro del frontmatter (solo los que abren y cierran)
