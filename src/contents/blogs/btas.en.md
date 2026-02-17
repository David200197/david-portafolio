---
title: 'BTAS: Code in JavaScript, Deploy in Rust'
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
description: 'BTAS (Behavioral Transpilation with Auto-Specification) is a methodology for migrating code between languages — or modernizing within the same one — while preserving behavior verified by automated tests'
image: '/david-portafolio/blogs/btas.webp'
---

# BTAS: Code in JavaScript, Deploy in Rust

<img src='/david-portafolio/blogs/btas.webp' alt="BTAS" class="img-blog" />

## The idea that started it all

BTAS stands for **Behavioral Transpilation with Auto-Specification**. It's a methodology I created because I had a frustration you probably know well: JavaScript is great for thinking, prototyping, and building fast. But when your application grows, it starts to sweat. Servers multiply, latency climbs, and you end up paying a fortune in infrastructure for something that would run on half the resources in another language.

So I thought: **what if I could write my code in JavaScript, but have it run in Rust in production?**

I'm not talking about a wrapper or calling Rust functions from Node.js. I'm talking about my business logic — the stuff I comfortably wrote in TypeScript, with the entire npm ecosystem at my fingertips — becoming a real Rust program. One that a Rust engineer would look at and say "this is well written."

The problem is obvious: how do you make sure the Rust version does exactly the same thing as the JavaScript version? Because translating line by line doesn't work. JavaScript and Rust think differently. Node's event loop is not tokio's runtime. `null` and `undefined` are not `Option<T>`. If you just "translate," you end up with code that looks like Rust but behaves like JavaScript in a bad disguise.

BTAS was born from that question. And the answer is simpler than it seems: **don't translate the code, translate the behavior**.

---

## What does "translating behavior" mean?

Imagine you have a star employee who's leaving the company. You need someone new to do their job. You have two ways to train the replacement:

**Option A**: You record a video of everything the current employee does — every click, every keyboard shortcut, every tab they open — and tell the new person "do exactly this." The problem is the new person uses a Mac while the previous one used Windows, or uses a different browser, or organizes their desktop differently. Step-by-step instructions don't work because the context is different.

**Option B**: You tell the new person "these are the results I need: the customer must receive their refund within 3 days, the sales report must match billing, and when a payment fails, the store must get a notification." You let them use their own tools and their own style. What matters isn't that they make the same clicks, but that the results are the same.

BTAS is Option B for code. Instead of translating instructions, we define what results the system must produce (through automated tests), give it the original code as reference for context, and let the AI write the best possible version in the target language. The only non-negotiable thing is that the results are identical — that the tests pass.

---

## A real case to understand it

María has spent a year and a half building **PayFast**, a payment gateway for mid-sized online stores. Node.js, Express, PostgreSQL, Redis. Everything works... until it doesn't.

Last Black Friday, the system collapsed. María had to pay $40,000 for extra servers she only used for two days. Every transaction consumes too much memory. And to top it off, a new competitor is processing payments five times faster using Rust, and María's clients are starting to ask "don't you have something more modern?"

María knows Rust would solve her problems. But rewriting everything by hand means six months with two senior engineers — over $150,000 in salaries. And while they rewrite, they have to maintain two versions of the system. A single error in the new code could mean lost payments, customer money disappearing into limbo. This isn't like rewriting a blog; it's code that moves real money.

Using an automated transpiler doesn't work either. Those tools translate syntax, not intent. The result is Rust code that thinks like JavaScript — it doesn't take advantage of any of Rust's strengths.

María needs a third option.

---

## How BTAS works, step by step

### Step 1: Your code running (the current truth)

Nothing changes yet. María's system keeps running on Node.js, processing payments in production. This is the starting point — the reference for "this is how it works today."

Here's the core of her payment system, simplified:

```typescript
async function processPayment(input) {
  // Is the data valid?
  if (input.amount <= 0 || !input.cardToken) {
    throw new Error('Invalid payment data')
  }

  // Is the merchant active and within daily limit?
  const merchant = await findMerchant(input.merchantId)
  if (!merchant.active) throw new Error('Inactive merchant')

  const spentToday = await checkDailyLimit(input.merchantId, input.amount)
  if (spentToday > merchant.dailyLimit) {
    throw new Error('Daily limit exceeded')
  }

  // Charge through Stripe
  const charge = await stripe.charges.create({
    amount: input.amount * 100, // Stripe uses cents
    currency: input.currency,
    source: input.cardToken,
  })

  if (charge.status !== 'succeeded') {
    throw new Error('Payment declined')
  }

  // Calculate fee and save to database
  const fee = input.amount * merchant.feeRate
  const transaction = await saveTransaction({
    merchantId: input.merchantId,
    amount: input.amount,
    fee: fee,
    status: 'completed',
    stripeId: charge.id,
  })

  // Notify the store that the payment was processed
  await sendWebhook(merchant.webhookUrl, {
    type: 'payment_completed',
    transactionId: transaction.id,
    amount: input.amount,
    fee: fee,
  })

  return { transactionId: transaction.id, status: 'successful' }
}
```

Read that code and think: what actually matters here? It doesn't matter that it uses JavaScript's `async/await` or that `stripe.charges.create` is a specific function from Stripe's Node library. What matters is:

- If the data is invalid, reject the payment
- If the merchant is inactive, reject the payment
- If the merchant has already hit their daily limit, reject the payment
- If everything's fine, charge, calculate the fee, save to the database, and notify the store

**That's** the behavior. And that's what BTAS preserves.

### Step 2: The AI creates the exams (Auto-Specification)

Now it gets interesting. We give the AI three things so it understands the full system:

**The code** — so it understands the logic, the patterns, the design decisions.

**The tests María's team already has** — so it knows what the team considers important. If María wrote a test for "concurrent payments must not exceed the limit," the AI knows concurrency is critical.

**The database schema** — and this is key. Because code can change languages, but the database usually doesn't. If the transactions table has an `amount` column with type `DECIMAL(12,2)`, the AI needs to know that to avoid using floating-point numbers that lose precision (imagine losing pennies on every transaction — in a system processing thousands per day, that adds up).

Why the database? A quick example: in María's transactions table there's a `net_amount` column that the database calculates automatically (`amount - fee`). If the AI doesn't know this, it might try to insert that value manually and the database would throw an error. There's also a constraint saying the status can only be 'pending', 'completed', 'failed', or 'refunded'. Without knowing this constraint, the AI might generate code that tries to save 'successful' as status and fail in production.

With these three sources, the AI generates exhaustive tests. Not code tests (that test individual functions), but behavior tests (that test what the user experiences):

```typescript
// These tests are generated by the AI, not María's team
describe('PayFast - Behavioral Specification', () => {
  it('processes a valid payment and calculates the fee correctly', async () => {
    // A merchant with a 3% fee processes a $200 payment
    const result = await processPayment({
      amount: 200.0,
      merchantId: 'ana_store',
      cardToken: 'tok_visa',
    })

    // The payment should be successful
    expect(result.status).toBe('successful')

    // Verify it was saved correctly to the database
    const tx = await findTransaction(result.transactionId)
    expect(tx.amount).toBe(200.0)
    expect(tx.fee).toBe(6.0) // 3% of 200
    expect(tx.netAmount).toBe(194.0) // 200 - 6, calculated by the DB
    expect(tx.status).toBe('completed')
  })

  it('rejects a payment if the merchant has already hit their daily limit', async () => {
    // The merchant has a $10,000 limit and has already spent $9,900
    // A $200 payment would push them over the limit
    await expect(
      processPayment({
        amount: 200,
        merchantId: 'almost_full_store',
      })
    ).rejects.toThrow('Daily limit exceeded')
  })

  it('if two payments arrive simultaneously, only one passes the limit', async () => {
    // This is crucial: if the limit is $1,000 and two $600 payments
    // arrive at the same time, only one should go through
    const [pay1, pay2] = await Promise.allSettled([
      processPayment({ amount: 600, merchantId: 'concurrent_store' }),
      processPayment({ amount: 600, merchantId: 'concurrent_store' }),
    ])

    const succeeded = [pay1, pay2].filter((r) => r.status === 'fulfilled')
    expect(succeeded.length).toBe(1) // Only one should have gone through
  })

  it('notifies the store after saving the payment', async () => {
    const capturedWebhooks = captureWebhooks()

    await processPayment({
      amount: 300,
      merchantId: 'ana_store',
      cardToken: 'tok_visa',
    })

    // The store should receive a notification with the correct data
    const notification = capturedWebhooks.last()
    expect(notification.type).toBe('payment_completed')
    expect(notification.amount).toBe(300)
    expect(notification.fee).toBe(9.0)
  })
})
```

Notice something important: these tests say nothing about JavaScript, Node.js, or any specific technology. They say "when someone pays $200, it should be recorded with a $6 fee." That's true regardless of whether the code is in JavaScript, Rust, Go, or written on napkins.

### Step 3: Verify the exams are correct

Before moving on, we run those tests against María's already-working system. If any test fails, there are two possibilities: either the AI generated an incorrect test (we regenerate it), or we discovered a bug in the current system (we document it).

We only move forward when all tests pass against the original implementation. If the tests don't accurately describe what the system does, the rest of the process is useless.

Here we also measure how complete the tests are. Not just that they pass, but that they truly cover everything important. We use three techniques:

**Code coverage**: What percentage of the original code's lines are executed when the tests run? We aim for 85% or higher.

**Mutation testing**: We change something small in the original code (for example, change a `>` to `>=`) and verify that at least one test fails. If you change the logic and no test notices, there's a hole in the specification.

**Direct comparison**: We generate thousands of random payments and compare the responses from the original system with the new one. If any differ, we investigate.

### Step 4: The AI writes the Rust version

Now we're ready. The AI has the tests (telling it what to do), the original code (telling it how it was done before), and the database schema (telling it what data it works with). With all of that, it writes a Rust implementation from scratch.

The important thing is that the AI has **total design freedom**. It doesn't translate line by line. It can reorganize, use different patterns, take advantage of Rust's strengths. The only thing it can't change is the final result: the same tests must pass.

```rust
// This is generated by the AI — it's idiomatic Rust, not JavaScript in disguise

use rust_decimal::Decimal;  // Financial precision, because the DB uses DECIMAL(12,2)

pub async fn process_payment(
    &self, input: PaymentInput
) -> Result<PaymentResult, PaymentError> {

    // Validation
    if input.amount <= Decimal::ZERO || input.card_token.is_empty() {
        return Err(PaymentError::Validation("Invalid payment data".into()));
    }

    // Find merchant
    let merchant = sqlx::query_as!(Merchant,
        "SELECT id, fee_rate, daily_limit, webhook_url, active
         FROM merchants WHERE id = $1", input.merchant_id
    ).fetch_optional(&self.db).await?
     .ok_or(PaymentError::InactiveMerchant)?;

    if !merchant.active {
        return Err(PaymentError::InactiveMerchant);
    }

    // Check daily limit (Redis, same key pattern that Node.js uses)
    let today = Utc::now().format("%Y-%m-%d").to_string();
    let key = format!("limit:{}:{}", input.merchant_id, today);
    // ... atomic check with Redis ...

    // Charge with Stripe
    let charge = self.stripe.charge(&input).await?;

    // Calculate fee
    let fee = input.amount * merchant.fee_rate;

    // Save (note: net_amount is a generated column, don't insert it)
    sqlx::query!(
        "INSERT INTO transactions
         (id, merchant_id, amount, currency, status, stripe_charge_id, fee)
         VALUES ($1, $2, $3, $4, 'completed', $5, $6)",
        Uuid::new_v4(), input.merchant_id, input.amount,
        input.currency, charge.id, fee
    ).execute(&self.db).await?;

    // Notify the store (without blocking the response)
    tokio::spawn(async move {
        send_webhook(&merchant.webhook_url, &data).await;
    });

    Ok(PaymentResult { /* ... */ })
}
```

See the differences? The Rust code:

- Uses `Decimal` instead of floating-point numbers (because the database uses `DECIMAL(12,2)` — the AI knows this from the schema)
- Doesn't try to insert into the `net_amount` column (because the schema says it's auto-calculated)
- Uses `tokio::spawn` to send the webhook without blocking (more efficient than Node.js's `await` for this case)
- Handles errors with `Result<>` instead of exceptions (idiomatic in Rust)

But what matters is: **it passes exactly the same tests**. The $200 payment still results in a $6 fee. The daily limit still works. Concurrent payments are still safe. The webhook still arrives.

---

## BTAS isn't just for switching languages

So far we've talked about JavaScript to Rust, but there's something I discovered while developing the methodology: BTAS works just as well **within the same language**.

Think about it. How many times have you inherited a Node.js project that's 3 years old, uses Express 4, has callbacks everywhere, and an architecture nobody planned? You know you want to modernize it — switch to Fastify, use clean async/await, reorganize into coherent modules — but rewriting is scary because you don't know if you'll break something.

That's the exact same problem as switching from JavaScript to Rust: **how do I guarantee the new system does the same thing as the old one?**

The answer is the same: tests as a contract.

### Examples where this fits perfectly

**Updating a framework**: Your API is on Express 4 and you want to move to Fastify, Hono, or Express 5. BTAS generates behavioral tests for your current API, then the AI rewrites it using the new framework. The tests guarantee all endpoints respond the same way.

**Cleaning up technical debt**: You have a 3,000-line file with tangled business logic. You want to split it into modules with clear responsibilities. BTAS captures the current behavior, and the AI generates the reorganized version. If the tests pass, the refactoring is safe.

**Modernizing syntax and patterns**: Code with callbacks, var, and string concatenation that you want to convert to async/await, const/let, and template literals. Seems trivial, but in a large project those changes can introduce subtle bugs. BTAS has you covered.

**Major language version migration**: From Python 2 to Python 3, PHP 5 to PHP 8, Java 8 to Java 21. Every major version jump has behavioral changes that are hard to catch manually.

### What about old projects with no tests?

Many legacy projects have no tests, the documentation is outdated, and the people who understood the code are long gone. For these cases, BTAS needs a prior step: **discovering what the system actually does before touching it**.

How? By observing. You install monitoring tools that record everything the system does in production: what requests it receives, what queries it makes to the database, what external services it calls. It's like putting a camera on the system to see how it behaves day to day.

You also talk to people. The veteran developers ("are there parts of the code nobody touches because it works and it's scary?"), the business users ("are there weird behaviors you've learned to work around?"), and the operations team ("how often does it crash and what do you do to fix it?").

With that information, you generate what we call **characterization tests**: tests that document what the system does today, without judging whether it's correct or not.

```typescript
it("VIP discount only works if you type 'VIP' in uppercase", async () => {
  // The UI shows 'Vip', but the code compares against 'VIP'
  // Technically a bug, but customers have been relying on
  // this behavior for years. Do we fix it or keep it?
  const result = await calculateDiscount({ type: 'Vip', amount: 1000 })
  expect(result.discount).toBe(0) // Discount doesn't apply
})
```

Each finding is presented to the team with a simple question: "this is what your system does. Is that what you want it to keep doing?" And it's marked as PRESERVE, FIX, or PENDING.

That discovery step takes an additional 4 to 6 weeks. But it gives you something you probably never had: an executable description of what your system actually does. And once you have that, you can modernize with confidence — whether changing languages, frameworks, or simply cleaning up the code you've been wanting to fix for years.

---

## What happens when the original code changes?

If you're maintaining your JavaScript system while the Rust version takes shape, the original code is going to change. A fix here, a feature there. How do they stay in sync?

Every test generated by BTAS is linked to the code that originated it. When someone merges a change to the JavaScript code, an automated process checks: "does this change affect business logic or is it just cosmetic?"

If it's cosmetic (renaming a variable, reformatting), nothing happens. If it's a real change (new business rule, new edge case), the affected tests are automatically regenerated, then the corresponding Rust code. A pull request is created so a human reviews before applying.

It's not magic — it's a process that runs in CI/CD like any other automated check.

---

## How do I know if BTAS is working well?

When you apply BTAS to a project, these are the signs it's going well:

| Signal                           | Healthy   | Concerning   |
| -------------------------------- | --------- | ------------ |
| Tests passing on first attempt   | Over 70%  | Under 50%    |
| Retries until everything passes  | 2-3       | More than 10 |
| Code needing manual editing      | Under 15% | Over 30%     |
| Bugs in production (first month) | 0-2       | More than 5  |
| Time compared to manual rewrite  | 20-40%    | Over 80%     |

If most of your metrics are in the "healthy" column, BTAS is saving you real time and producing reliable code. If they're in "concerning," you probably need to decompose the system into smaller pieces or improve test coverage on the original code.

---

## María's results

After applying BTAS to PayFast:

- **Development time**: 3 weeks instead of the 6 months estimated for a manual rewrite
- **Servers**: 70% fewer. Same traffic with fewer machines
- **Speed**: Transactions that took 450ms now take 80ms
- **Confidence**: The same tests that validated the old system now validate the new one. There's no "let's hope it works" — we know because the exams pass
- **The Rust team**: Received code they understand and can maintain, not a mechanical translation

---

## When does BTAS work well and when doesn't it?

### Works great for:

- **Switching languages**: Your Node.js system that you want in Rust, your Python API that needs to be in Go
- **Modernizing without switching languages**: Updating frameworks, cleaning up technical debt, migrating major versions — all within the same language
- **Extracting modules from a monolith**: Pulling out a specific service and reimplementing it (in the same language or a different one)
- **Optimizing performance**: When you know another language or a cleaner architecture would be better, but you don't want to start from scratch

### Needs extra care when:

- The system has no tests or documentation whatsoever (you need to do discovery first)
- There are known bugs the business wants to fix, not replicate
- The code is so confusing that not even humans understand it (the AI won't be able to either)

### Doesn't apply when:

- You want to fundamentally change the architecture (from monolith to microservices with async communication, for example)
- The value is in the data, not the code (pure database migration)
- The system is small enough that rewriting by hand takes less than a week

---

## What BTAS is not

It's not magic. It's not "press a button and get perfect code." It's a methodology with clear steps, measurable metrics, and honest limitations.

If the generated tests don't cover a scenario (a type of attack, a rare financial edge case), the new implementation may have gaps there. That's why mutation testing and human review are part of the process, not optional extras.

If your code depends on a very language-specific library, the target version needs an equivalent. Sometimes one exists, sometimes it doesn't.

If your code does random things (generates IDs with `Math.random()`, depends on the exact time), the tests need to control that randomness to be reproducible.

BTAS is an acceleration tool, not a replacement. It reduces months to weeks, not weeks to minutes. And it always needs human eyes to verify the result makes sense.

---

## Why "behavioral transpilation"?

When I designed BTAS, I chose the name with intention. In the industry, "transpilation" means translating code from one language to another while preserving structure. BTAS doesn't preserve structure — it preserves **behavior**. The target code can look completely different from the original. The only thing that's identical is what it does, not how it does it.

I use the term intentionally. BTAS positions itself as an alternative to traditional transpilers, not a variant. If a transpiler is a literal translator, BTAS is an interpreter that understands the intent and expresses it naturally in another language.

---

## Work that inspired BTAS

This idea didn't come from nowhere. It combines concepts that have existed in software engineering for years:

- **Test-Driven Porting** (2005): The idea of using tests to guide code migration. But back then, tests were written by hand.
- **Storytest-Driven Migration** (2009): Using user stories and acceptance tests to migrate legacy systems. Similar in spirit, but without AI.
- **Behavioral equivalence in porting** (2006): The academic formalization of "the new system must behave the same as the old one." BTAS takes this as its core principle.
- **BatFix** (2024): Uses tests to find and repair errors in LLM-transpiled code. BTAS differs because it generates code guided by tests from the start, instead of repairing afterward.

What BTAS brings that's new is the combination that didn't exist before: automatic specification generation by AI + triple context (code, existing tests, and database schema) + total freedom for the target implementation to be idiomatic. That specific combination is what I propose as a methodology with BTAS.

---

## The idea in one sentence

Code in the language where you think best. Deploy in the language that performs best. Modernize without fear. And sleep well because the same tests guarantee everything still works.
