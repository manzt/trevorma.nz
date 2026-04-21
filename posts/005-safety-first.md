---
title: "// SAFETY: first"
excerpt: ""
description: ""
date: 2026-04-21
---

Code is being produced faster than ever. As an open-source maintainer, I
have been thinking about how to keep up: building systems that enforce
more of the invariants I care about, so I can hold less in my head and
focus on what actually matters. The practice is not new, but at this
volume it feels more pressing than ever.

I like that strict types are boring. They are pedantic about one thing:
whether the types line up. A function with typed arguments cannot be
called with the wrong shape. A renamed field fails to compile everywhere
it is used until the caller is updated. An optional value cannot be
accessed without checking that it is there. Each of those is one less
thing I have to hold in my head when a PR lands.

The more invariants I push into the types, the more the check carries.
But the check is only as strong as what gets pushed in. TypeScript and
Python both give you a way to push less: a few characters (`as SomeType`,
`typing.cast(x, Any)`, `!`) that tell the type system you know better.
Nothing verifies the claim. Every one is a hole in the chain.

It is not so much that these hatches are wrong; they are challenging to
get correct, and rarely needed in application code. An `as` or
`typing.cast` is a "trust me" without a check behind it. I have [written
before](/blog/be-assertive) about the safer alternatives. My issue is the
casualness. Both languages are ubiquitous, and the pattern has bled into
the models' training data: out of the box, coding agents will drop an
`any` or `typing.cast(x, Any)` to silence a red squiggle because the
practice is that common in what they learned from.

So how do we push back?

## Lints are not a silver bullet

I can already hear it: _just enable a lint rule_. You should. For type
assertions, oxlint and ESLint offer the right rules:

```json
"typescript/no-unsafe-type-assertion": "error",
"typescript/no-non-null-assertion": "error"
```

Turn both on. But listening to a linter is still social discipline. It adds
friction, but how seriously it gets taken (or disabled) varies. In every
codebase I have worked in, some lint is disabled without a comment. Nothing
structural stops it. A rule is only as strong as the practice around it. It
falls to the language, ecosystem, and team to teach that practice rather
than assume it.

## Build the friction

Rust does something different. [The Rust
Book](https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html) frames
`unsafe` the way I would like to frame type assertions:

> Using `unsafe` to use one of the five superpowers just discussed isn't
> wrong or even frowned upon, but it is trickier to get unsafe code correct
> because the compiler can't help uphold memory safety.

Same posture. Not wrong, just trickier. But something has stuck around
`unsafe` that has not stuck around `as`. Most application code never
reaches for it. Libraries wrap unsafe primitives, expose safe APIs, and
document _why_ the unsafe is sound. The
[Rustonomicon](https://doc.rust-lang.org/nomicon/), the advanced manual on
unsafe Rust, opens with:

> Should you wish a long and happy career of writing Rust programs, you
> should turn back now and forget you ever saw this book. It is not
> necessary.

When you do need it, the idiom is documented:

> Whenever we perform an unsafe operation, it is idiomatic to write a comment
> starting with `SAFETY` to explain how the safety rules are upheld.

Clippy has [a
lint](https://rust-lang.github.io/rust-clippy/master/#undocumented_unsafe_blocks)
that enforces it.

```rust
// SAFETY: we just bounds-checked `i < slice.len()` on the line above,
// so indexing is in-range.
unsafe { *slice.get_unchecked(i) }
```

If you are reaching for `unsafe` in application code, that is a signal:
either of a missing safe abstraction, or that Rust is not the right tool
for the job. The posture comes from documentation, reviewer scrutiny, and
lints working together.

## Discipline that scales

The Rust model works because the discipline is not personal. It is shared.
The `SAFETY` lint is as disable-able as any TypeScript lint, but I have
never seen an agent write `unsafe` in Rust the way they write `as any` in
TypeScript. The difference is not the tool; the norm has buy-in.

The same shape applies to type assertions. They belong inside libraries
where the invariants are understood, tested, and documented.
[zarrita](https://github.com/manzt/zarrita.js) and
[quiver](https://github.com/manzt/quiver) lean on them to give callers
overloads and inference the type system cannot derive otherwise. In
application code, they should be the exception. On
[marimo-lsp](https://github.com/marimo-team/marimo-lsp) I have been trying
the Rust convention:

```ts
// SAFETY: routeOperation only forwards cell-op messages whose cellId
// is present in `executions`; we guard the lookup on line 84.
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const execution = executions.get(cellId) as NotebookCellExecution;
```

No comment, no assertion.

I do not know how to manufacture a community norm. But the smaller move is
within reach: a little ceremony every time we write `as`. If the word does
not make us pause, the comment can.
