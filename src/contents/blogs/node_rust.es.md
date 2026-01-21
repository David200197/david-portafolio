---
title: 'JavaScript y Rust: Dos direcciones para optimizar tu backend'
createAt: '2026-10-01'
updateAt: '2026-10-01'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['nodejs', 'rust', 'nestjs', 'performance', 'napi-rs', 'deno_core']
description: 'Descubre cómo integrar Rust y JavaScript/TypeScript en ambas direcciones: acelera Node.js con Rust, o añade flexibilidad a Rust con JS/TS'
image: '/david-portafolio/blogs/rust_node.webp'
---

# JavaScript y Rust: Dos direcciones para optimizar tu backend

<img src='/david-portafolio/blogs/rust_node.webp' alt="Node.js + Rust con napi-rs" class="img-blog" />

Hace unas semanas vi un video que me voló la cabeza: [Python + Rust: La Arquitectura Backend que Reduce 60x la Latencia en SaaS Escalables](https://www.youtube.com/watch?v=KD4XsJFOxIE). El autor explica cómo usar PyO3 para integrar Rust directamente en Python, y lo más interesante: muestra que **la integración funciona en ambas direcciones**. Python puede llamar a Rust para operaciones pesadas, y Rust puede ejecutar código Python para lógica de negocio flexible.

Y me quedé pensando: ¿se puede hacer lo mismo con JavaScript/TypeScript?

La respuesta es sí. Y hay herramientas para ambas direcciones.

## El problema real

Seguro te ha pasado: tienes una aplicación en NestJS (o Express, o Fastify) que funciona perfectamente... hasta que no. De repente hay un endpoint que tarda demasiado. Analizas y descubres que el cuello de botella está en una función que se llama millones de veces, o que hace cálculos pesados, o que procesa datos de manera ineficiente.

Las opciones tradicionales son:

1. **Optimizar el código JavaScript** - A veces funciona, a veces no es suficiente
2. **Cachear resultados** - Útil, pero no siempre aplicable
3. **Escalar horizontalmente** - Más servidores, más dinero, más complejidad
4. **Microservicios en Rust** - Separar la funcionalidad pesada en un servicio independiente

Esta última opción (microservicios) es válida y muchas empresas la usan. Escribes un servicio en Rust que expone una API HTTP o gRPC, y tu aplicación Node.js lo consume. Funciona, pero tiene costos: latencia de red (5-10ms mínimo), serialización JSON, infraestructura adicional, complejidad operacional.

Pero hay otra opción que pocos conocen: **integración directa entre Rust y JavaScript, sin red de por medio**.

## Dos direcciones, dos casos de uso

Dependiendo de tu situación, puedes elegir entre dos enfoques:

| Escenario                                       | Dirección    | Herramienta | Caso de uso                              |
| ----------------------------------------------- | ------------ | ----------- | ---------------------------------------- |
| App Node.js existente con cuellos de botella    | JS → Rust    | napi-rs     | Acelerar funciones específicas           |
| Backend nuevo en Rust que necesita flexibilidad | Rust → JS/TS | deno_core   | Plugins, reglas de negocio configurables |

Vamos a explorar ambas.

---

## Dirección 1: Node.js llamando a Rust (napi-rs)

Este es el caso más común. Tienes una aplicación en Node.js y quieres acelerar funciones específicas sin cambiar tu arquitectura.

### La filosofía: No reescribas todo

Esto es importante y lo enfatizo porque es fácil caer en la trampa de querer reescribir todo en Rust. **No lo hagas**.

La idea es simple:

- Identifica las funciones que son cuellos de botella
- Si una función se llama millones de veces y es lenta, esa es tu candidata
- Mueve **solo esa función** a Rust
- El resto de tu código sigue en JavaScript/TypeScript

Es como hacer cirugía con láser en lugar de una operación a corazón abierto.

### ¿Qué es napi-rs?

napi-rs es el equivalente a PyO3 pero para el ecosistema Node.js. Te permite escribir código en Rust que compila a un addon nativo de Node.js (un archivo `.node`).

La magia está en que desde JavaScript, importas el módulo como cualquier otro:

```typescript
import { miFuncionRapida } from './native-addon'

const resultado = miFuncionRapida(datos)
```

No hay HTTP de por medio, no hay serialización JSON, no hay latencia de red. Es una llamada directa a código nativo.

### Instalación de napi-rs

Primero, necesitas tener Rust instalado:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Luego, instala el CLI de napi-rs globalmente:

```bash
npm install -g @napi-rs/cli
```

Para crear un nuevo proyecto de addon nativo:

```bash
napi new mi-addon
cd mi-addon
```

El CLI te preguntará algunas cosas: package name, targets (linux, macos, windows) y si quieres GitHub Actions.

La estructura que genera es:

```
mi-addon/
├── Cargo.toml          # Dependencias Rust
├── package.json        # Configuración npm
├── src/
│   └── lib.rs          # Tu código Rust
├── index.js            # Bindings auto-generados
└── index.d.ts          # Tipos TypeScript auto-generados
```

### Tu primer addon en Rust

Abre `src/lib.rs`:

```rust
use napi_derive::napi;

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
    a + b
}
```

El macro `#[napi]` es la magia. Le dice a napi-rs que exponga esta función a JavaScript.

Para compilar:

```bash
npm run build
```

Y para usarlo:

```typescript
import { sum } from './mi-addon'

console.log(sum(2, 3)) // 5
```

### El tema del archivo .node

Un detalle importante: el archivo `.node` que genera napi-rs es **específico por plataforma**. Un addon compilado en macOS no funciona en Linux.

napi-rs maneja esto generando packages separados por plataforma (`@mi-addon/linux-x64-gnu`, `@mi-addon/darwin-arm64`, etc.) que se instalan automáticamente según tu sistema operativo.

---

## Dirección 2: Rust ejecutando JavaScript/TypeScript (deno_core)

Ahora viene lo interesante: **la dirección inversa**. ¿Qué pasa si tu backend principal está en Rust, pero quieres la flexibilidad de JavaScript para ciertas partes?

Casos de uso típicos:

- **Sistema de plugins**: Los usuarios pueden extender tu aplicación con scripts JS
- **Reglas de negocio configurables**: Lógica que cambia frecuentemente sin recompilar
- **DSL para no-programadores**: Interfaces de scripting para usuarios técnicos
- **Migración gradual**: Mover un backend Node.js a Rust sin reescribir todo de golpe

### ¿Qué es deno_core?

deno_core es la biblioteca que usa Deno internamente para ejecutar JavaScript. Te permite embeber el motor V8 (el mismo de Chrome y Node.js) dentro de una aplicación Rust.

Lo mejor: el código JS/TS corre en un **sandbox** por defecto. No tiene acceso al filesystem ni a la red a menos que explícitamente lo habilites mediante operaciones de Rust.

### Instalación

En tu `Cargo.toml`:

```toml
[dependencies]
deno_core = "0.311"
tokio = { version = "1", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### Ejemplo básico

```rust
use deno_core::{op2, JsRuntime, RuntimeOptions, Extension};

// Definir una operación de Rust callable desde JS
#[op2(fast)]
fn op_sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    // Crear extensión con las operaciones
    let ext = Extension {
        name: "my_ops",
        ops: std::borrow::Cow::Borrowed(&[op_sum::DECL]),
        ..Default::default()
    };

    // Crear runtime con la extensión
    let mut runtime = JsRuntime::new(RuntimeOptions {
        extensions: vec![ext],
        ..Default::default()
    });

    // Ejecutar código JavaScript
    runtime.execute_script("<main>", r#"
        const result = Deno.core.ops.op_sum(2, 3);
        console.log("Result:", result);
    "#).unwrap();
}
```

### Concepto clave: Reutilizar el runtime

**Esto es crítico**: crear un nuevo runtime V8 cuesta aproximadamente 5.7ms. Si creas un runtime por cada operación, tu rendimiento será desastroso.

```rust
// ❌ MAL: Crear runtime por operación
fn process_request(data: &str) -> Result<String> {
    let mut runtime = JsRuntime::new(Default::default()); // 5.7ms cada vez
    runtime.execute_script("<main>", data)
}

// ✅ BIEN: Reutilizar el runtime
struct AppState {
    runtime: JsRuntime,
}

impl AppState {
    fn process_request(&mut self, data: &str) -> Result<String> {
        self.runtime.execute_script("<main>", data) // ~0.0007ms
    }
}
```

La diferencia es de **8,121x** según mis benchmarks. Sí, leíste bien: ocho mil veces más rápido.

---

## Comparación: napi-rs vs deno_core vs microservicios

| Aspecto             | napi-rs (JS→Rust) | deno_core (Rust→JS)   | Microservicios          |
| ------------------- | ----------------- | --------------------- | ----------------------- |
| **Latencia**        | ~0.01ms           | ~0.1ms                | ~5-10ms (red)           |
| **Complejidad**     | Media             | Media                 | Alta                    |
| **Caso de uso**     | Acelerar Node.js  | Flexibilizar Rust     | Escalar independiente   |
| **Sandbox**         | No                | Sí (por defecto)      | Sí (proceso separado)   |
| **Hot reload**      | No (recompilar)   | Sí (recargar módulos) | Sí (redeploy)           |
| **Infraestructura** | Ninguna adicional | Ninguna adicional     | Service mesh, discovery |

---

## Cuándo usar cada enfoque

**napi-rs (JS → Rust):**

- Tienes una app Node.js existente
- Necesitas acelerar funciones CPU-bound específicas
- El cuello de botella está identificado y es puntual
- Tu equipo puede mantener código Rust

**deno_core (Rust → JS/TS):**

- Estás construyendo un backend nuevo en Rust
- Necesitas lógica de negocio que cambie frecuentemente
- Quieres un sistema de plugins para usuarios
- Necesitas sandboxing para código no confiable

**Microservicios:**

- Necesitas escalar componentes de forma independiente
- Equipos diferentes mantienen diferentes partes
- Ya tienes infraestructura de orquestación (Kubernetes)
- La latencia de red (5-10ms) es aceptable para tu caso de uso

---

## Benchmark: Resultados reales

Para no quedarme en la teoría, hice un benchmark completo probando ambas direcciones. El código está disponible en [GitHub](https://github.com/David200197/rust-javascript-bidirectional-benchmarks).

### Resultados con napi-rs (JS → Rust)

| Operación            | Mejora promedio | Mejor caso |
| -------------------- | --------------- | ---------- |
| String Hashing       | **51-66x**      | 65.7x      |
| Contar Primos        | **8.8-9.2x**    | 9.2x       |
| Fibonacci            | **4-6x**        | 6.0x       |
| Métricas Financieras | **0.9-2.5x**    | 2.5x       |
| Sorting              | **1.3-2.4x**    | 2.4x       |

**Speedup promedio: 15.1x**

### Resultados con deno_core (Rust → JS)

| Métrica                          | Valor                    |
| -------------------------------- | ------------------------ |
| Inicialización V8                | **5.7ms** promedio       |
| Overhead V8 (1K elementos)       | 9.3x vs Rust puro        |
| Overhead V8 (100K elementos)     | 6.6x vs Rust puro        |
| **Mejora al reutilizar runtime** | **8,121x**               |
| Plugin JS vs Rust                | Rust **1.4x** más rápido |
| Throughput pagos (Rust)          | **1.1M pagos/seg**       |

### Optimización de JavaScript puro

Antes de integrar Rust, probé optimizar el JavaScript:

| Tamaño Array | JS Básico | JS Optimizado | Mejora   |
| ------------ | --------- | ------------- | -------- |
| 10,000       | 0.121ms   | 0.121ms       | 1.0x     |
| 100,000      | 3.155ms   | 1.424ms       | **2.2x** |
| 1,000,000    | 34.03ms   | 6.506ms       | **5.2x** |

**Conclusión**: Optimizar JavaScript con `Float64Array` y bucles simples da hasta **5x de mejora** sin tocar Rust.

### Hallazgos clave

**✅ Lo que SÍ funciona:**

| Técnica                           | Impacto    | Cuándo usarla                   |
| --------------------------------- | ---------- | ------------------------------- |
| Reutilizar runtime V8             | **8,121x** | SIEMPRE con deno_core           |
| String hashing en Rust            | **66x**    | Cualquier operación de hashing  |
| Cálculo de primos en Rust         | **9x**     | Algoritmos matemáticos          |
| Optimizar JS primero              | **5x**     | Antes de integrar Rust          |
| Mover lógica pesada a ops de Rust | **1.4x**   | Plugins con cálculos intensivos |

**❌ Lo que NO funciona como esperado:**

| Técnica                           | Resultado       | Por qué                                        |
| --------------------------------- | --------------- | ---------------------------------------------- |
| Batch vs Individual (ops rápidas) | **0.9x** (peor) | La serialización del array supera el beneficio |
| Rust para arrays pequeños (<10K)  | **0.9x**        | El overhead de FFI domina                      |
| Microservicios para rendimiento   | **-10x**        | La latencia de red (5-10ms) domina             |

### Regla de oro

1. **Optimiza JavaScript primero** → 5x gratis sin complejidad
2. **Reutiliza el runtime V8** → 8,000x de diferencia
3. **Rust para operaciones específicas** → Hashing (66x), matemáticas (9x)
4. **No sobre-ingenieres** → 2x de mejora raramente justifica la complejidad de Rust

---

## Conclusión

La integración entre Rust y JavaScript no es una calle de un solo sentido. Dependiendo de tu arquitectura y necesidades, puedes:

1. **Acelerar Node.js con Rust** usando napi-rs para funciones críticas
2. **Flexibilizar Rust con JS/TS** usando deno_core para lógica dinámica
3. **Combinar ambos** en arquitecturas híbridas
4. **Usar microservicios** cuando necesites escalar independientemente (aceptando la latencia)

La clave es elegir la herramienta correcta para cada problema. No reescribas todo en Rust solo porque es rápido, y no mantengas todo en JavaScript solo porque es familiar.

Optimiza donde importa. Mantén la flexibilidad donde la necesitas.

---

📊 **Benchmark completo**: [github.com/David200197/rust-javascript-bidirectional-benchmarks](https://github.com/David200197/rust-javascript-bidirectional-benchmarks)
