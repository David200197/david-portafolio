---
title: 'BTAS: Programa en JavaScript, Despliega en Rust'
createAt: '2026-02-17'
updateAt: '2026-02-17'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags:
  [
    'btas',
    'transpilation',
    'rust',
    'javascript',
    'testing',
    'ai',
    'migration',
    'legacy',
    'methodology',
  ]
description: 'BTAS (Behavioral Transpilation with Auto-Specification) es una metodología que permite migrar código entre lenguajes — o modernizar dentro del mismo — preservando el comportamiento verificado por tests automáticos'
image: '/david-portafolio/blogs/btas.webp'
---

# BTAS: Programa en JavaScript, Despliega en Rust

<img src='/david-portafolio/blogs/btas.webp' alt="BTAS" class="img-blog" />

## La idea que lo empezó todo

BTAS significa **Behavioral Transpilation with Auto-Specification** — en español, Transpilación Conductual con Auto-Especificación. Es una metodología que creé porque tenía una frustración que probablemente conoces: JavaScript es genial para pensar, prototipar y construir rápido. Pero cuando tu aplicación crece, empieza a sudar. Los servidores se multiplican, la latencia sube, y terminas pagando una fortuna en infraestructura por algo que en otro lenguaje correría con la mitad de recursos.

Entonces pensé: **¿y si pudiera escribir mi código en JavaScript, pero que en producción corriera en Rust?**

No hablo de un wrapper ni de llamar funciones de Rust desde Node.js. Hablo de que mi lógica de negocio — esa que escribí cómodamente en TypeScript, con todo el ecosistema de npm a mi alcance — se convierta en un programa Rust de verdad. Uno que un ingeniero de Rust mire y diga "esto está bien escrito".

El problema es obvio: ¿cómo te aseguras de que la versión en Rust hace exactamente lo mismo que la de JavaScript? Porque traducir línea por línea no funciona. JavaScript y Rust piensan diferente. El event loop de Node no es el runtime de tokio. `null` y `undefined` no son `Option<T>`. Si simplemente "traduces", terminas con código que parece Rust pero se comporta como JavaScript mal disfrazado.

BTAS nació de esa pregunta. Y la respuesta es más simple de lo que parece: **no traduzcas el código, traduce el comportamiento**.

---

## ¿Qué significa "traducir comportamiento"?

Imagina que tienes un empleado estrella que se va de la empresa. Necesitas que alguien nuevo haga su trabajo. Tienes dos formas de entrenar al reemplazo:

**Opción A**: Le grabas un video de todo lo que hace tu empleado actual — cada clic, cada atajo de teclado, cada pestaña que abre — y le dices al nuevo "haz exactamente esto". El problema es que el nuevo usa Mac y el anterior usaba Windows, o usa otro navegador, u organiza su escritorio diferente. Las instrucciones paso a paso no funcionan porque el contexto es diferente.

**Opción B**: Le dices al nuevo "estos son los resultados que necesito: el cliente debe recibir su reembolso en menos de 3 días, el reporte de ventas debe cuadrar con la facturación, y cuando un pago falla, la tienda debe recibir una notificación". Le dejas que use sus propias herramientas y su propio estilo. Lo que importa no es que haga los mismos clics, sino que los resultados sean los mismos.

BTAS es la Opción B para código. En lugar de traducir instrucciones, definimos qué resultados debe producir el sistema (a través de tests automáticos), le damos el código original como referencia para que entienda el contexto, y dejamos que la IA escriba la mejor versión posible en el lenguaje destino. Lo único no negociable es que los resultados sean idénticos — que los tests pasen.

---

## Un caso real para entenderlo

María lleva un año y medio construyendo **PayFast**, una pasarela de pagos para tiendas online medianas. Node.js, Express, PostgreSQL, Redis. Todo funciona... hasta que no.

El Black Friday pasado, el sistema colapsó. María tuvo que pagar $40,000 en servidores extra que usó solo dos días. Cada transacción consume demasiada memoria. Y para colmo, un competidor nuevo está procesando pagos cinco veces más rápido usando Rust, y los clientes de María empiezan a preguntar "¿no tienen algo más moderno?".

María sabe que Rust resolvería sus problemas. Pero reescribir todo a mano son seis meses con dos ingenieros senior — más de $150,000 en salarios. Y mientras reescriben, tienen que mantener dos versiones del sistema. Un error en el código nuevo podría significar pagos perdidos, dinero de clientes que desaparece en el limbo. No es como reescribir un blog; es código que mueve dinero real.

Usar un transpilador automático tampoco sirve. Esas herramientas traducen la sintaxis, no la intención. El resultado es código Rust que piensa como JavaScript — no aprovecha ninguna de las ventajas de Rust.

María necesita una tercera opción.

---

## Cómo funciona BTAS, paso a paso

### Paso 1: Tu código funcionando (la verdad actual)

Nada cambia todavía. El sistema de María sigue corriendo en Node.js, procesando pagos en producción. Este es el punto de partida — la referencia de "así es como funciona hoy".

Este es el corazón de su sistema de pagos, simplificado:

```typescript
async function procesarPago(input) {
  // ¿Los datos son válidos?
  if (input.monto <= 0 || !input.tarjetaToken) {
    throw new Error('Datos de pago inválidos')
  }

  // ¿El comercio está activo y no ha excedido su límite diario?
  const comercio = await buscarComercio(input.comercioId)
  if (!comercio.activo) throw new Error('Comercio inactivo')

  const gastadoHoy = await verificarLimiteDiario(input.comercioId, input.monto)
  if (gastadoHoy > comercio.limiteDiario) {
    throw new Error('Límite diario excedido')
  }

  // Cobrar a través de Stripe
  const cobro = await stripe.charges.create({
    amount: input.monto * 100, // Stripe usa centavos
    currency: input.moneda,
    source: input.tarjetaToken,
  })

  if (cobro.status !== 'succeeded') {
    throw new Error('Pago rechazado')
  }

  // Calcular comisión y guardar en la base de datos
  const comision = input.monto * comercio.tasaComision
  const transaccion = await guardarTransaccion({
    comercioId: input.comercioId,
    monto: input.monto,
    comision: comision,
    estado: 'completado',
    stripeId: cobro.id,
  })

  // Avisarle a la tienda que el pago se procesó
  await enviarWebhook(comercio.webhookUrl, {
    tipo: 'pago_completado',
    transaccionId: transaccion.id,
    monto: input.monto,
    comision: comision,
  })

  return { transaccionId: transaccion.id, estado: 'exitoso' }
}
```

Lee ese código y piensa: ¿qué es lo que realmente importa aquí? No importa que use `async/await` de JavaScript o que `stripe.charges.create` sea una función específica de la librería de Stripe para Node. Lo que importa es:

- Si los datos son inválidos, rechaza el pago
- Si el comercio está inactivo, rechaza el pago
- Si el comercio ya gastó su límite del día, rechaza el pago
- Si todo está bien, cobra, calcula la comisión, guarda en la base de datos, y avisa a la tienda

**Eso** es el comportamiento. Y eso es lo que BTAS preserva.

### Paso 2: La IA crea los exámenes (Auto-Especificación)

Ahora viene lo interesante. Le damos a la IA tres cosas para que entienda el sistema completo:

**El código** — para que entienda la lógica, los patrones, las decisiones de diseño.

**Los tests que el equipo de María ya tiene** — para que sepa qué considera importante el equipo. Si María escribió un test para "pagos concurrentes no deben sobrepasar el límite", la IA sabe que la concurrencia es crítica.

**La estructura de la base de datos** — y esto es clave. Porque el código puede cambiar de lenguaje, pero la base de datos generalmente no. Si la tabla de transacciones tiene una columna `monto` con tipo `DECIMAL(12,2)`, la IA necesita saberlo para no usar números de punto flotante que pierden precisión (imagina perder centavos en cada transacción — en un sistema que procesa miles por día, eso se acumula).

¿Por qué la base de datos? Un ejemplo rápido: en la tabla de transacciones de María hay una columna `monto_neto` que la base de datos calcula automáticamente (`monto - comision`). Si la IA no sabe esto, podría intentar insertar ese valor manualmente y la base de datos devolvería un error. También hay un constraint que dice que el estado solo puede ser 'pendiente', 'completado', 'fallido' o 'reembolsado'. Sin conocer este constraint, la IA podría generar código que intente guardar 'exitoso' como estado y falle en producción.

Con estas tres fuentes, la IA genera tests exhaustivos. No son tests de código (que prueban funciones individuales), sino tests de comportamiento (que prueban lo que el usuario experimenta):

```typescript
// Estos tests los genera la IA, no el equipo de María
describe('PayFast - Especificación de Comportamiento', () => {
  it('procesa un pago válido y calcula bien la comisión', async () => {
    // Un comercio con comisión del 3% paga $200
    const resultado = await procesarPago({
      monto: 200.0,
      comercioId: 'tienda_ana',
      tarjetaToken: 'tok_visa',
    })

    // El pago debe ser exitoso
    expect(resultado.estado).toBe('exitoso')

    // Verificamos que se guardó correctamente en la base de datos
    const tx = await buscarTransaccion(resultado.transaccionId)
    expect(tx.monto).toBe(200.0)
    expect(tx.comision).toBe(6.0) // 3% de 200
    expect(tx.montoNeto).toBe(194.0) // 200 - 6, calculado por la BD
    expect(tx.estado).toBe('completado')
  })

  it('rechaza un pago si el comercio ya gastó su límite del día', async () => {
    // El comercio tiene límite de $10,000 y ya gastó $9,900
    // Un pago de $200 lo pasaría del límite
    await expect(
      procesarPago({
        monto: 200,
        comercioId: 'tienda_casi_llena',
      })
    ).rejects.toThrow('Límite diario excedido')
  })

  it('si dos pagos llegan al mismo tiempo, solo uno pasa el límite', async () => {
    // Esto es crucial: si el límite es $1,000 y llegan dos pagos
    // de $600 simultáneamente, solo uno debe procesarse
    const [pago1, pago2] = await Promise.allSettled([
      procesarPago({ monto: 600, comercioId: 'tienda_concurrente' }),
      procesarPago({ monto: 600, comercioId: 'tienda_concurrente' }),
    ])

    const exitosos = [pago1, pago2].filter((r) => r.status === 'fulfilled')
    expect(exitosos.length).toBe(1) // Solo uno debe haber pasado
  })

  it('avisa a la tienda después de guardar el pago', async () => {
    const webhooksRecibidos = capturarWebhooks()

    await procesarPago({
      monto: 300,
      comercioId: 'tienda_ana',
      tarjetaToken: 'tok_visa',
    })

    // La tienda debe recibir un aviso con los datos correctos
    const aviso = webhooksRecibidos.ultimo()
    expect(aviso.tipo).toBe('pago_completado')
    expect(aviso.monto).toBe(300)
    expect(aviso.comision).toBe(9.0)
  })
})
```

Fíjate en algo importante: estos tests no dicen nada sobre JavaScript, Node.js, ni ninguna tecnología específica. Dicen "cuando alguien paga $200, debe quedar registrado con comisión de $6". Eso es verdad sin importar si el código está en JavaScript, Rust, Go, o escrito en servilletas.

### Paso 3: Verificar que los exámenes son correctos

Antes de seguir, corremos esos tests contra el sistema de María que ya funciona. Si algún test falla, hay dos posibilidades: o la IA generó un test incorrecto (lo regeneramos), o descubrimos un bug en el sistema actual (lo documentamos).

Solo avanzamos cuando todos los tests pasan contra la implementación original. Si los tests no describen bien lo que hace el sistema, el resto del proceso no sirve de nada.

Aquí también medimos qué tan completos son los tests. No solo que pasen, sino que realmente cubran todo lo importante. Usamos tres técnicas:

**Cobertura de código**: ¿Qué porcentaje de las líneas del código original se ejecutan cuando corren los tests? Apuntamos a 85% o más.

**Prueba de mutantes**: Cambiamos algo pequeño en el código original (por ejemplo, cambiamos un `>` por `>=`) y verificamos que al menos un test falle. Si cambias la lógica y ningún test se da cuenta, hay un agujero en la especificación.

**Comparación directa**: Generamos miles de pagos aleatorios y comparamos las respuestas del sistema original con las del nuevo. Si alguna difiere, investigamos.

### Paso 4: La IA escribe la versión en Rust

Ahora sí. La IA tiene los tests (que le dicen qué debe hacer), el código original (que le dice cómo se hacía antes), y la estructura de la base de datos (que le dice con qué datos trabaja). Con todo eso, escribe una implementación en Rust desde cero.

Lo importante es que la IA tiene **libertad total** de diseño. No traduce línea por línea. Puede reorganizar, usar patrones diferentes, aprovechar las ventajas de Rust. Lo único que no puede cambiar es el resultado final: los mismos tests deben pasar.

```rust
// Esto lo genera la IA — es Rust idiomático, no JavaScript disfrazado

use rust_decimal::Decimal;  // Precisión financiera, porque la BD usa DECIMAL(12,2)

pub async fn procesar_pago(
    &self, input: PaymentInput
) -> Result<PaymentResult, PaymentError> {

    // Validación
    if input.monto <= Decimal::ZERO || input.tarjeta_token.is_empty() {
        return Err(PaymentError::Validacion("Datos de pago inválidos".into()));
    }

    // Buscar comercio
    let comercio = sqlx::query_as!(Comercio,
        "SELECT id, tasa_comision, limite_diario, webhook_url, activo
         FROM comercios WHERE id = $1", input.comercio_id
    ).fetch_optional(&self.db).await?
     .ok_or(PaymentError::ComercioInactivo)?;

    if !comercio.activo {
        return Err(PaymentError::ComercioInactivo);
    }

    // Verificar límite diario (Redis, misma clave que usa Node.js)
    let hoy = Utc::now().format("%Y-%m-%d").to_string();
    let clave = format!("limite:{}:{}", input.comercio_id, hoy);
    // ... verificación atómica con Redis ...

    // Cobrar con Stripe
    let cargo = self.stripe.cobrar(&input).await?;

    // Calcular comisión
    let comision = input.monto * comercio.tasa_comision;

    // Guardar (nota: monto_neto es columna generada, no se inserta)
    sqlx::query!(
        "INSERT INTO transactions
         (id, comercio_id, monto, moneda, estado, stripe_charge_id, comision)
         VALUES ($1, $2, $3, $4, 'completado', $5, $6)",
        Uuid::new_v4(), input.comercio_id, input.monto,
        input.moneda, cargo.id, comision
    ).execute(&self.db).await?;

    // Avisar a la tienda (sin bloquear la respuesta)
    tokio::spawn(async move {
        enviar_webhook(&comercio.webhook_url, &datos).await;
    });

    Ok(PaymentResult { /* ... */ })
}
```

¿Ves las diferencias? El código Rust:

- Usa `Decimal` en lugar de números de punto flotante (porque la base de datos usa `DECIMAL(12,2)` — la IA lo sabe por el esquema)
- No intenta insertar en la columna `monto_neto` (porque el esquema dice que es autocalculada)
- Usa `tokio::spawn` para enviar el webhook sin bloquear (más eficiente que el `await` de Node.js para esto)
- Maneja errores con `Result<>` en lugar de excepciones (idiomático en Rust)

Pero lo que importa es: **pasa exactamente los mismos tests**. El pago de $200 sigue dando comisión de $6. El límite diario sigue funcionando. Los pagos concurrentes siguen siendo seguros. El webhook sigue llegando.

---

## BTAS no es solo para cambiar de lenguaje

Hasta ahora hablamos de JavaScript a Rust, pero hay algo que descubrí mientras desarrollaba la metodología: BTAS funciona igual de bien **dentro del mismo lenguaje**.

Piénsalo. ¿Cuántas veces has heredado un proyecto en Node.js que tiene 3 años, usa Express 4, callbacks por todos lados, y una arquitectura que nadie planeó? Sabes que quieres modernizarlo — pasar a Fastify, usar async/await limpio, reorganizar en módulos coherentes — pero reescribir da miedo porque no sabes si vas a romper algo.

Ese es exactamente el mismo problema que resolver al pasar de JavaScript a Rust: **¿cómo garantizo que el sistema nuevo hace lo mismo que el viejo?**

La respuesta es la misma: tests como contrato.

### Ejemplos donde esto encaja perfecto

**Actualizar un framework**: Tu API está en Express 4 y quieres pasarla a Fastify, Hono, o Express 5. BTAS genera los tests de comportamiento de tu API actual y luego la IA reescribe usando el framework nuevo. Los tests te garantizan que todos los endpoints responden igual.

**Limpiar deuda técnica**: Tienes un archivo de 3,000 líneas con lógica de negocio enredada. Quieres separarlo en módulos con responsabilidad clara. BTAS captura el comportamiento actual, y la IA genera la versión reorganizada. Si los tests pasan, la refactorización es segura.

**Modernizar sintaxis y patrones**: Código con callbacks, var, y concatenación de strings que quieres pasar a async/await, const/let, y template literals. Parece trivial, pero en un proyecto grande esos cambios pueden introducir bugs sutiles. BTAS te cubre.

**Migrar versión mayor de lenguaje**: De Python 2 a Python 3, de PHP 5 a PHP 8, de Java 8 a Java 21. Cada salto de versión tiene cambios de comportamiento que son difíciles de detectar manualmente.

### ¿Y los proyectos viejos sin tests?

Muchos proyectos legacy no tienen tests, la documentación está obsoleta, y las personas que entendían el código ya no están. Para estos casos, BTAS necesita un paso previo: **descubrir qué hace realmente el sistema antes de tocarlo**.

¿Cómo? Observando. Instalas herramientas de monitoreo que registran todo lo que hace el sistema en producción: qué requests recibe, qué queries hace a la base de datos, qué servicios externos llama. Es como ponerle una cámara al sistema para ver cómo se comporta en su día a día.

También hablas con las personas. Los desarrolladores veteranos ("¿hay partes del código que nadie toca porque funciona y da miedo?"), los usuarios de negocio ("¿hay comportamientos raros que ya aprendieron a manejar?"), y el equipo de operaciones ("¿cada cuánto se cae y qué hacen para arreglarlo?").

Con esa información, generas lo que llamamos **tests de caracterización**: tests que documentan lo que el sistema hace hoy, sin juzgar si es correcto o no.

```typescript
it("el descuento VIP solo funciona si escribes 'VIP' en mayúsculas", async () => {
  // La interfaz muestra 'Vip', pero el código compara con 'VIP'
  // Técnicamente es un bug, pero los clientes llevan años
  // usando este comportamiento. ¿Lo arreglamos o lo mantenemos?
  const resultado = await calcularDescuento({ tipo: 'Vip', monto: 1000 })
  expect(resultado.descuento).toBe(0) // No aplica descuento
})
```

Cada hallazgo se presenta al equipo con una pregunta simple: "esto es lo que hace tu sistema. ¿Es lo que quieres que siga haciendo?" Y se marca como PRESERVAR, CORREGIR, o PENDIENTE.

Ese paso de descubrimiento toma entre 4 y 6 semanas adicionales. Pero te da algo que probablemente nunca tuviste: una descripción ejecutable de lo que tu sistema realmente hace. Y una vez que tienes eso, puedes modernizar con confianza — sea cambiando de lenguaje, de framework, o simplemente limpiando el código que llevas años queriendo arreglar.

---

## ¿Qué pasa cuando el código original cambia?

Si estás manteniendo tu sistema en JavaScript mientras la versión Rust va tomando forma, el código original va a cambiar. Un fix aquí, una feature allá. ¿Cómo se mantienen sincronizados?

Cada test generado por BTAS está vinculado al código que lo originó. Cuando alguien hace merge de un cambio en el código JavaScript, un proceso automático revisa: "¿este cambio afecta la lógica de negocio o solo es cosmético?"

Si es cosmético (renombrar una variable, reformatear), no pasa nada. Si es un cambio real (nueva regla de negocio, nuevo edge case), automáticamente se regeneran los tests afectados y luego el código Rust correspondiente. Se crea un pull request para que un humano revise antes de aplicar.

No es magia — es un proceso que corre en CI/CD como cualquier otro check automatizado.

---

## ¿Cómo sé si BTAS está funcionando bien?

Cuando aplicas BTAS a un proyecto, estas son las señales de que va bien:

| Señal                                   | Saludable     | Preocupante   |
| --------------------------------------- | ------------- | ------------- |
| Tests que pasan en el primer intento    | Más del 70%   | Menos del 50% |
| Reintentos para que todo pase           | 2-3           | Más de 10     |
| Código que necesita edición manual      | Menos del 15% | Más del 30%   |
| Bugs en producción (primer mes)         | 0-2           | Más de 5      |
| Tiempo comparado con reescritura manual | 20-40%        | Más del 80%   |

Si la mayoría de tus métricas están en la columna de "saludable", BTAS está ahorrándote tiempo real y produciendo código confiable. Si están en "preocupante", probablemente necesitas descomponer el sistema en piezas más pequeñas o mejorar la cobertura de tests del código original.

---

## Los resultados de María

Después de aplicar BTAS a PayFast:

- **Tiempo de desarrollo**: 3 semanas en lugar de los 6 meses estimados para reescritura manual
- **Servidores**: 70% menos. El mismo tráfico con menos máquinas
- **Velocidad**: Las transacciones que tomaban 450ms ahora toman 80ms
- **Confianza**: Los mismos tests que validaban el sistema viejo ahora validan el nuevo. No hay "esperemos que funcione" — lo sabemos porque los exámenes pasan
- **El equipo de Rust**: Recibió código que entienden y pueden mantener, no una traducción mecánica

---

## ¿Cuándo funciona bien BTAS y cuándo no?

### Funciona muy bien para:

- **Cambiar de lenguaje**: Tu sistema en Node.js que quieres en Rust, tu API en Python que necesitas en Go
- **Modernizar sin cambiar de lenguaje**: Actualizar frameworks, limpiar deuda técnica, migrar versiones mayores — todo dentro del mismo lenguaje
- **Sacar módulos de un monolito**: Extraer un servicio específico y reimplementarlo (en el mismo lenguaje o en otro)
- **Optimizar rendimiento**: Cuando sabes que otro lenguaje o una arquitectura más limpia serían mejor, pero no quieres empezar de cero

### Necesita cuidado extra cuando:

- El sistema no tiene ningún tipo de tests ni documentación (necesitas hacer arqueología primero)
- Hay bugs conocidos que el negocio quiere corregir, no replicar
- El código es tan confuso que ni los humanos lo entienden (la IA tampoco va a poder)

### No aplica cuando:

- Quieres cambiar la arquitectura fundamentalmente (de monolito a microservicios con comunicación asíncrona, por ejemplo)
- El valor está en los datos, no en el código (migración de base de datos pura)
- El sistema es tan pequeño que reescribirlo a mano toma menos de una semana

---

## Lo que BTAS no es

No es magia. No es "dale un botón y sale código perfecto". Es una metodología con pasos claros, métricas medibles, y limitaciones honestas.

Si los tests generados no cubren un escenario (un tipo de ataque, un edge case financiero raro), la nueva implementación puede tener huecos ahí. Por eso el mutation testing y la revisión humana son parte del proceso, no extras opcionales.

Si tu código depende de una librería muy específica de un lenguaje, la versión destino necesita un equivalente. A veces existe, a veces no.

Si tu código hace cosas aleatorias (genera IDs con `Math.random()`, depende de la hora exacta), los tests necesitan controlar esa aleatoriedad para ser reproducibles.

BTAS es una herramienta de aceleración, no de reemplazo. Reduce meses a semanas, no semanas a minutos. Y siempre necesita ojos humanos que verifiquen que el resultado tiene sentido.

---

## ¿Por qué "transpilación conductual"?

Cuando diseñé BTAS, elegí el nombre con intención. En la industria, "transpilación" significa traducir código de un lenguaje a otro preservando la estructura. BTAS no preserva la estructura — preserva el **comportamiento**. El código destino puede verse completamente diferente al original. Lo único que es idéntico es lo que hace, no cómo lo hace.

Uso el término intencionalmente. BTAS se posiciona como alternativa a los transpiladores tradicionales, no como una variante. Si un transpilador es un traductor literal, BTAS es un intérprete que entiende la intención y la expresa naturalmente en otro idioma.

---

## Trabajo que inspiró BTAS

Esta idea no salió de la nada. Combina conceptos que existen en la ingeniería de software desde hace años:

- **Test-Driven Porting** (2005): La idea de usar tests para guiar la migración de código. Pero en aquella época, los tests se escribían a mano.
- **Storytest-Driven Migration** (2009): Usar historias de usuario y tests de aceptación para migrar sistemas legacy. Similar en espíritu, pero sin IA.
- **Equivalencia conductual en porting** (2006): La formalización académica de "el sistema nuevo debe comportarse igual que el viejo". BTAS toma esto como principio central.
- **BatFix** (2024): Usa tests para encontrar y reparar errores en código transpilado por LLMs. BTAS se diferencia porque genera el código guiado por tests desde el inicio, en lugar de reparar después.

Lo que BTAS aporta de nuevo es la combinación que no existía antes: generación automática de especificación por IA + contexto triple (código, tests existentes, y estructura de base de datos) + libertad total para que la implementación destino sea idiomática. Esa combinación específica es lo que propongo como metodología con BTAS.

---

## La idea en una frase

Programa en el lenguaje donde piensas mejor. Despliega en el lenguaje que rinde mejor. Moderniza sin miedo. Y duerme tranquilo porque los mismos tests garantizan que todo sigue funcionando.
