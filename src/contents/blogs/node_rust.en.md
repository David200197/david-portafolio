---
title: 'JavaScript and Rust: Two Directions to Optimize Your Backend'
createAt: '2026-10-01'
updateAt: '2026-10-01'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['nodejs', 'rust', 'nestjs', 'performance', 'napi-rs', 'deno_core']
description: 'Discover how to integrate Rust and JavaScript/TypeScript in both directions: speed up Node.js with Rust, or add flexibility to Rust with JS/TS'
image: '/david-portafolio/blogs/rust_node.webp'
---

# JavaScript and Rust: Two Directions to Optimize Your Backend

<img src='/david-portafolio/blogs/rust_node.webp' alt="Node.js + Rust with napi-rs" class="img-blog" />

A few weeks ago I watched a video that blew my mind: [Python + Rust: The Backend Architecture That Reduces Latency 60x in Scalable SaaS](https://www.youtube.com/watch?v=KD4XsJFOxIE). The author explains how to use PyO3 to integrate Rust directly into Python, and the most interesting part: he shows that **the integration works in both directions**. Python can call Rust for heavy operations, and Rust can execute Python code for flexible business logic.

And I started wondering: can you do the same with JavaScript/TypeScript?

The answer is yes. And there are tools for both directions.

## The Real Problem

I'm sure this has happened to you: you have an application in NestJS (or Express, or Fastify) that works perfectly... until it doesn't. Suddenly there's an endpoint that takes too long. You analyze it and discover that the bottleneck is in a function that gets called millions of times, or does heavy calculations, or processes data inefficiently.

The traditional options are:

1. **Optimize the JavaScript code** - Sometimes it works, sometimes it's not enough
2. **Cache results** - Useful, but not always applicable
3. **Scale horizontally** - More servers, more money, more complexity
4. **Microservices in Rust** - Separate the heavy functionality into an independent service

This last option (microservices) is valid and many companies use it. You write a service in Rust that exposes an HTTP or gRPC API, and your Node.js application consumes it. It works, but it has costs: network latency (5-10ms minimum), JSON serialization, additional infrastructure, operational complexity.

But there's another option that few know about: **direct integration between Rust and JavaScript, without any network in between**.

## Two Directions, Two Use Cases

Depending on your situation, you can choose between two approaches:

| Scenario                                | Direction    | Tool      | Use Case                             |
| --------------------------------------- | ------------ | --------- | ------------------------------------ |
| Existing Node.js app with bottlenecks   | JS → Rust    | napi-rs   | Speed up specific functions          |
| New Rust backend that needs flexibility | Rust → JS/TS | deno_core | Plugins, configurable business rules |

Let's explore both.

---

## Direction 1: Node.js Calling Rust (napi-rs)

This is the most common case. You have a Node.js application and want to speed up specific functions without changing your architecture.

### The Philosophy: Don't Rewrite Everything

This is important and I emphasize it because it's easy to fall into the trap of wanting to rewrite everything in Rust. **Don't do it**.

The idea is simple:

- Identify the functions that are bottlenecks
- If a function gets called millions of times and is slow, that's your candidate
- Move **only that function** to Rust
- The rest of your code stays in JavaScript/TypeScript

It's like doing laser surgery instead of open-heart surgery.

### What is napi-rs?

napi-rs is the equivalent of PyO3 but for the Node.js ecosystem. It allows you to write Rust code that compiles to a native Node.js addon (a `.node` file).

The magic is that from JavaScript, you import the module like any other:

```typescript
import { myFastFunction } from './native-addon'

const result = myFastFunction(data)
```

There's no HTTP involved, no JSON serialization, no network latency. It's a direct call to native code.

### Installing napi-rs

First, you need to have Rust installed:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Then, install the napi-rs CLI globally:

```bash
npm install -g @napi-rs/cli
```

To create a new native addon project:

```bash
napi new my-addon
cd my-addon
```

The CLI will ask you a few things: package name, targets (linux, macos, windows) and if you want GitHub Actions.

The structure it generates is:

```
my-addon/
├── Cargo.toml          # Rust dependencies
├── package.json        # npm configuration
├── src/
│   └── lib.rs          # Your Rust code
├── index.js            # Auto-generated bindings
└── index.d.ts          # Auto-generated TypeScript types
```

### Your First Addon in Rust

Open `src/lib.rs`:

```rust
use napi_derive::napi;

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
    a + b
}
```

The `#[napi]` macro is the magic. It tells napi-rs to expose this function to JavaScript.

To compile:

```bash
npm run build
```

And to use it:

```typescript
import { sum } from './my-addon'

console.log(sum(2, 3)) // 5
```

### The .node File Issue

An important detail: the `.node` file that napi-rs generates is **platform-specific**. An addon compiled on macOS won't work on Linux.

napi-rs handles this by generating separate packages per platform (`@my-addon/linux-x64-gnu`, `@my-addon/darwin-arm64`, etc.) that are automatically installed according to your operating system.

---

## Direction 2: Rust Executing JavaScript/TypeScript (deno_core)

Now comes the interesting part: **the reverse direction**. What happens if your main backend is in Rust, but you want the flexibility of JavaScript for certain parts?

Typical use cases:

- **Plugin system**: Users can extend your application with JS scripts
- **Configurable business rules**: Logic that changes frequently without recompiling
- **DSL for non-programmers**: Scripting interfaces for technical users
- **Gradual migration**: Moving a Node.js backend to Rust without rewriting everything at once

### What is deno_core?

deno_core is the library that Deno uses internally to execute JavaScript. It allows you to embed the V8 engine (the same one used by Chrome and Node.js) inside a Rust application.

The best part: JS/TS code runs in a **sandbox** by default. It has no access to the filesystem or network unless you explicitly enable it through Rust operations.

### Installation

In your `Cargo.toml`:

```toml
[dependencies]
deno_core = "0.311"
tokio = { version = "1", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### Basic Example

```rust
use deno_core::{op2, JsRuntime, RuntimeOptions, Extension};

// Define a Rust operation callable from JS
#[op2(fast)]
fn op_sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    // Create extension with the operations
    let ext = Extension {
        name: "my_ops",
        ops: std::borrow::Cow::Borrowed(&[op_sum::DECL]),
        ..Default::default()
    };

    // Create runtime with the extension
    let mut runtime = JsRuntime::new(RuntimeOptions {
        extensions: vec![ext],
        ..Default::default()
    });

    // Execute JavaScript code
    runtime.execute_script("<main>", r#"
        const result = Deno.core.ops.op_sum(2, 3);
        console.log("Result:", result);
    "#).unwrap();
}
```

### Key Concept: Reuse the Runtime

**This is critical**: creating a new V8 runtime costs approximately 5.7ms. If you create a runtime for each operation, your performance will be disastrous.

```rust
// ❌ BAD: Create runtime per operation
fn process_request(data: &str) -> Result<String> {
    let mut runtime = JsRuntime::new(Default::default()); // 5.7ms each time
    runtime.execute_script("<main>", data)
}

// ✅ GOOD: Reuse the runtime
struct AppState {
    runtime: JsRuntime,
}

impl AppState {
    fn process_request(&mut self, data: &str) -> Result<String> {
        self.runtime.execute_script("<main>", data) // ~0.0007ms
    }
}
```

The difference is **8,121x** according to my benchmarks. Yes, you read that right: eight thousand times faster.

---

## Comparison: napi-rs vs deno_core vs Microservices

| Aspect             | napi-rs (JS→Rust) | deno_core (Rust→JS)     | Microservices           |
| ------------------ | ----------------- | ----------------------- | ----------------------- |
| **Latency**        | ~0.01ms           | ~0.1ms                  | ~5-10ms (network)       |
| **Complexity**     | Medium            | Medium                  | High                    |
| **Use case**       | Speed up Node.js  | Add flexibility to Rust | Scale independently     |
| **Sandbox**        | No                | Yes (by default)        | Yes (separate process)  |
| **Hot reload**     | No (recompile)    | Yes (reload modules)    | Yes (redeploy)          |
| **Infrastructure** | None additional   | None additional         | Service mesh, discovery |

---

## When to Use Each Approach

**napi-rs (JS → Rust):**

- You have an existing Node.js app
- You need to speed up specific CPU-bound functions
- The bottleneck is identified and punctual
- Your team can maintain Rust code

**deno_core (Rust → JS/TS):**

- You're building a new backend in Rust
- You need business logic that changes frequently
- You want a plugin system for users
- You need sandboxing for untrusted code

**Microservices:**

- You need to scale components independently
- Different teams maintain different parts
- You already have orchestration infrastructure (Kubernetes)
- Network latency (5-10ms) is acceptable for your use case

---

## Benchmark: Real Results

To not stay in theory, I did a complete benchmark testing both directions. The code is available on [GitHub](https://github.com/David200197/rust-javascript-bidirectional-benchmarks).

### Results with napi-rs (JS → Rust)

| Operation         | Average Improvement | Best Case |
| ----------------- | ------------------- | --------- |
| String Hashing    | **51-66x**          | 65.7x     |
| Count Primes      | **8.8-9.2x**        | 9.2x      |
| Fibonacci         | **4-6x**            | 6.0x      |
| Financial Metrics | **0.9-2.5x**        | 2.5x      |
| Sorting           | **1.3-2.4x**        | 2.4x      |

**Average Speedup: 15.1x**

### Results with deno_core (Rust → JS)

| Metric                               | Value                 |
| ------------------------------------ | --------------------- |
| V8 Initialization                    | **5.7ms** average     |
| V8 Overhead (1K elements)            | 9.3x vs pure Rust     |
| V8 Overhead (100K elements)          | 6.6x vs pure Rust     |
| **Improvement from reusing runtime** | **8,121x**            |
| Plugin JS vs Rust                    | Rust **1.4x** faster  |
| Payment throughput (Rust)            | **1.1M payments/sec** |

### Pure JavaScript Optimization

Before integrating Rust, I tried optimizing the JavaScript:

| Array Size | Basic JS | Optimized JS | Improvement |
| ---------- | -------- | ------------ | ----------- |
| 10,000     | 0.121ms  | 0.121ms      | 1.0x        |
| 100,000    | 3.155ms  | 1.424ms      | **2.2x**    |
| 1,000,000  | 34.03ms  | 6.506ms      | **5.2x**    |

**Conclusion**: Optimizing JavaScript with `Float64Array` and simple loops gives up to **5x improvement** without touching Rust.

### Key Findings

**✅ What DOES Work:**

| Technique                    | Impact     | When to use                         |
| ---------------------------- | ---------- | ----------------------------------- |
| Reuse V8 runtime             | **8,121x** | ALWAYS with deno_core               |
| String hashing in Rust       | **66x**    | Any hashing operation               |
| Prime calculation in Rust    | **9x**     | Mathematical algorithms             |
| Optimize JS first            | **5x**     | Before integrating Rust             |
| Move heavy logic to Rust ops | **1.4x**   | Plugins with intensive calculations |

**❌ What DOESN'T Work as Expected:**

| Technique                      | Result           | Why                                     |
| ------------------------------ | ---------------- | --------------------------------------- |
| Batch vs Individual (fast ops) | **0.9x** (worse) | Array serialization exceeds the benefit |
| Rust for small arrays (<10K)   | **0.9x**         | FFI overhead dominates                  |
| Microservices for performance  | **-10x**         | Network latency (5-10ms) dominates      |

### Golden Rule

1. **Optimize JavaScript first** → 5x free without complexity
2. **Reuse the V8 runtime** → 8,000x difference
3. **Rust for specific operations** → Hashing (66x), math (9x)
4. **Don't over-engineer** → 2x improvement rarely justifies Rust complexity

---

## Conclusion

The integration between Rust and JavaScript is not a one-way street. Depending on your architecture and needs, you can:

1. **Speed up Node.js with Rust** using napi-rs for critical functions
2. **Add flexibility to Rust with JS/TS** using deno_core for dynamic logic
3. **Combine both** in hybrid architectures
4. **Use microservices** when you need to scale independently (accepting the latency)

The key is choosing the right tool for each problem. Don't rewrite everything in Rust just because it's fast, and don't keep everything in JavaScript just because it's familiar.

Optimize where it matters. Keep flexibility where you need it.

---

📊 **Complete Benchmark**: [github.com/David200197/rust-javascript-bidirectional-benchmarks](https://github.com/David200197/rust-javascript-bidirectional-benchmarks)
