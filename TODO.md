### 🔴 **1. Bundle de 9.5s de ejecución JS**

Los culpables principales en tu `package.json`:

| Librería       | Tamaño aprox.         | Acción                         |
| -------------- | --------------------- | ------------------------------ |
| `highlight.js` | ~1MB si importas todo | Importar solo lenguajes usados |

### 🔴 **2. Imágenes sin dimensiones (CLS)**

Necesitas agregar `width` y `height` a:

- `/astronaut_blog.svg`
- `work-001-768w.webp`, `work-002-768w.webp`, etc.

### 🔴 **3. Accesibilidad (botones/links sin nombres)**

---
