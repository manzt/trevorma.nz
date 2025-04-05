---
title: "Be assertive!"
excerpt: ""
description: ""
date: 2025-04-06
---

Some time back, I set up my website to host common scripts and config files for
[quick access](https://www.youtube.com/watch?v=a1A8EYqqQs8):

```sh
$ curl -sL manzt.sh/assert.js | pbcopy # copy snippet to clipboard
```

It's my way of keeping these things within arm's reach. In the past, I might've
grabbed a dependency or even published a library. But lately, I've gotten more
comfortable letting go of some
["DRY"](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) and just
copy-pasting small utilities like this (with attribution). Maybe a post on that
later.

Of all these snippets, the one I reach for the most (_by far_) is a tiny
[`assert`](https://manzt.sh/assert.js) utility:

```ts
function assert(expr: unknown, msg = ""): asserts expr {
	if (!expr) throw new Error(msg);
}
```

TypeScript introduced [assertion
functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
back in version 3.7, and at this point, I basically drop these three lines of
code into every project.

This post is about assertions and the subtle (but useful) ways they can shape
how a type checker "sees" your code.

## What's an assertion anyway?

Assertions are runtime checks that verify assumptions made by the programmer.
They enforce some
[_invariant_](https://en.wikipedia.org/wiki/Invariant_(mathematics)#Invariants_in_computer_science)—a
property that must always hold true for the program to behave correctly.

Here's a simple example:

```ts
assert(x > 0, "x must be positive");
```

I like to think of assertions as guardrails for deeper assumptions—things the
programmer knows (or believes) to be true at the time of writing, but that
aren't always easily expressed in (or visible to) a type system.

After the line above runs, we _know_ for certain that `x` is positive. If it
weren't, the assertion would fail and the program would error immediately.
Ensuring this kind of invariant can simplify the code that follows—not just for
us humans, but potentially in ways that affect how the code is analyzed
statically. (More on that later.)

Assertions differ from error handling in one important way. Unlike operational
errors, like missing files or network timeouts, which should be expected and
handled gracefully, assertion failures point to bugs in our code: unexpected
states that should never occur.

The [TigerBeetle style
guide](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)
puts it more bluntly:

> Assertions detect programmer errors. The only correct way to handle corrupt
> code is to crash.

A little intense, but TigerBeetle is built for fault tolerance and financial
correctness. My own view is softer: writing assertions shows humility. Bugs
happen. Making our "this should never happen" assumptions explicit with an
`assert` serves a dual role: enforcing behavior and documenting those
assumptions for future readers. Much better than a comment.

Assertions aren't unique to TypeScript. Many languages provide built-in
support. Python has an `assert` keyword to create [assertion
statements](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement):

```py
assert x > 0, "x must be positive"
```

Rust includes a [built-in
macro](https://doc.rust-lang.org/std/macro.assert.html) for the same purpose:

```rust
assert!(x > 0, "x must be positive");
```

The specifics of assertion behavior can vary slightly across languages. In some
cases—like Python's `-O` flag or Rust's release mode—assertions may be stripped
out in optimized builds. This isn't true for all assertion utilities, but it's
important to understand how they behave in your environment.

Still, the core idea holds: assertions are a readable, low-friction way to
document and enforce what you assume to be true in your program.

In a perfect world—or with a much stronger type system—you might express those
assumptions directly and skip the assertion entirely (say, with a `PositiveInt`
type). But in real-world codebases, those kinds of type-level changes aren't
always practical.

### The cool part: assertions + the type system

The examples above enforce invariants that aren't captured by the type
system. But in languages like TypeScript and Python, assertions can
actually inform the type system, too.

Here's what I mean:

```typescript
function add2(value: number | string): number {
	assert(typeof value === "number", "must be a number");
	return value + 2
}
```

Or in Python:

```python
def add2(value: int | str) -> int:
	assert isinstance(value, int), "must be a number"
	return value + 2
```

Yes, we could clean this up by changing the function signature. But what’s
interesting here is that the `assert` doesn't just check at runtime—it
also _narrows the type_.

After the `assert`, the type checker _knows_ that value must be a number. The
string case is ruled out, so it lets us treat value as a number without further
checks.

This is possible because these languages support **union types**. When you
assert that value is a number, the type system updates its understanding and
drops the other possibilities.

That's the subtle "superpower" here: with a tiny runtime check, you improve
your static typing. The equivalent in Rust looks a bit different:

```rust
enum Value {
	Number(u32),
	String(String),
}

fn add2(value: Value) -> u32 {
	match value {
		Value::Number(n) => n + 2,
		Value::String(_) => panic!("must be a number"),
	}
}
```

Rust does not have union types in the same sense—it uses enums and pattern
matching. You can still "narrow" the type, but it's more explicit and requires
matching every variant.

I much prefer this explicit modeling type system, but as languages that have
but

Assertions in Rust are more about guarding against
impossible states than refining the type of a variable mid-function.

## Senarios

## Work in progress

if you have a function that needs to implement to but you're in progress.
Assertions can hlep to capture both the "TODO" state both in code but also.
It's a totally legitable implementation.

```ts
type Data = {
	kind: "number";
	value: 
} | {
	kind: "foo";
	value: string;
}

function handleData(data: Data) {
	assert(data.kind === "number", "only support numbers for now.");
	console.log(data.value + 10)
}
```

## non-empty lists

This can be changed with a compiler flag (flag name), but prior to indexing an
arrary either cehck the length or assert the value isn't undefined:

```sh


### 1. Better alternative to type casting (`as`)

The TypeScript `as` keyword quietly overrides the type checker. It's
convenient—but dangerously silent:

```ts
let numOrStr: number | string = 10;
let str = numOrStr as string;  // no runtime guarantee
```

By contrast, assertions offer clear runtime checks:

```ts
assert(typeof numOrStr === "string", "Expected a string");
numOrStr;  // type: string, guaranteed at runtime
```

### 2. Safer alternative to non-null assertions (`!`)

The non-null assertion operator (`!`) similarly silences TypeScript without a
runtime check:

```ts
let input = document.querySelector("input")!;
input.value = "Hello";  // silently fails if input isn't there
```

An explicit `assert` clearly surfaces problems early:

```ts
let input = document.querySelector("input");
assert(input, "Expected input element");
input.value = "Hello";
```

### 3. Works nicely with plain JavaScript files

Because assertions are regular JavaScript functions (no special TS syntax),
they're equally useful in plain JavaScript codebases. If you're using
TypeScript to type-check JavaScript, assertions help clarify your intentions
with fewer workarounds or syntax tricks.

Interestingly, TypeScript's special syntax (like `as` or `!`) is cumbersome in
plain JavaScript files, but runtime assertions remain natural and concise.

