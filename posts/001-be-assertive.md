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
comfortable with copy-pasting (with attribution), especially for small
utilities like this. Maybe a post on that later.

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

This post explains _why_. It's about assertions and the subtle (but useful)
ways they can shape how a type checker "sees" your code.

## What's an assertion anyway?

Assertions are runtime checks that verify assumptions made <ins>by the
	programmer</ins>. They enforce some
[_invariant_](https://en.wikipedia.org/wiki/Invariant_(mathematics)#Invariants_in_computer_science)—a
property that must always hold true for the program to behave correctly.

Here's a simple example asserting that `x` must be positive:

```ts
assert(x > 0, "x must be positive");
```

I think of assertions as a way to mark off parts of how the programmer
understands the world—things they believe to be true when writing the program,
but that aren't easily expressed with (or visible to) a type system.

After the line above runs, we _know_ for certain that `x` is positive. If it
weren't, the assertion would fail and the program would error immediately.
This kind of check can simplify the code that follows and make it easier to
reason about, both for humans and for static analysis tools. (More on that
later.)

The [TigerBeetle style
guide](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)
puts it bluntly:

> Assertions detect programmer errors. Unlike operating errors, which are
> expected and which must be handled, assertion failures are unexpected.  The
> only correct way to handle corrupt code is to crash.

A little intense, but TigerBeetle is built for fault tolerance and financial
correctness.

My view is a bit softer: <ins>writing assertions shows humility</ins>. They're
meant for things that should never happen—so in theory, we shouldn't need them
at all. But bugs happen. Assertions surface the moment when reality breaks our
expectations, giving us a chance to revise our understanding. Making those
assumptions explicit helps clarify intent and strengthen the code (much better
than a comment).

Assertions are not unique to TypeScript. Many languages provide dedicated
syntax or elevated constructs for writing them, rather than relying on a custom
utility. Python has [assertion
statements](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement):

```py
assert x > 0, "x must be positive"
```

Rust includes a [top-level
macro](https://doc.rust-lang.org/std/macro.assert.html) for the same purpose:

```rust
assert!(x > 0, "x must be positive");
```

It's interesting how many languages have some mechanism to fail fast and
loudly, even with very different designs and philosophies. But _when_ and
_where_ you should `assert` depends on the language. In Rust, for example, the
type system is closely tied to memory, control flow, and runtime behavior. It
doesn't have traditional exceptions, but instead distinguishes between
[_recoverable_ and _unrecoverable_
errors](https://doc.rust-lang.org/book/ch09-00-error-handling.html). With an
expressive type system capable of ["zero-cost
abstractions,"](https://without.boats/blog/zero-cost-abstractions/) many
properties that would require runtime checks in other languages can instead be
handled in the type system, turning them into compile-time guarantees or
recoverable errors. Assertions don't necessarily go away, but they are often
pushed to the edges of the system.

While I appreciate the kind of static guarantees you get in a language like
Rust, I spend a lot of time in TypeScript and Python, where type systems are
layered onto _extremely_ dynamic foundations.

These type systems are
["unsound"](https://www.executeprogram.com/courses/everyday-typescript/lessons/type-soundness):
they sometimes accept programs that violate their own type annotations. That
leniency isn't a bug, but a deliberate trade-off. For example, in order for
TypeScript to support the full range of quirks found in JavaScript, it makes
compromises that favor ecosystem compatibility over strict soundness. No one
writing TypeScript or Python probably _likes_ that their type systems are
unsound, but in the words of [Anders
Hejlsberg](https://en.wikipedia.org/wiki/Anders_Hejlsberg): _"damn is it
useful."_

The dynamic nature of these languages means there are places the type checker
can't reach. That's where assertions become especially useful. They let us
state and enforce assumptions the type system can't express. In some cases, a
well-placed assertion can even _help_ the type checker reason more precisely.

In the rest of this post, I want to share a few examples of using assertions
with types and demonstrate the interplay between these tools. The examples are
specific to TypeScript, but many of the broader patterns apply to Python as
well and might be interesting if you spend time in both worlds.

### Layers of confidence

Let's walk through a simple example and see how assertions and types play
different roles. We'll use a basic `add(a, b)` function and evolve it through a
few versions.

Pay attention to _what_ we're verifying in each case, and _when_ the check
happens. If an assumption is expressed in TypeScript, it's checked at <ins
	class="decoration-wavy decoration-red-500">compile time</ins>. If it’s in
an `assert`, it's only checked when running the program.

We'll start with plain JavaScript:

```javascript
function add(a, b) {
	return a + b;
}
```

This works for numbers, but also strings, or anything else that can be coerced.
It won't crash, but it can easily return garbage.

```typescript
add(2, 3);      // 5
add("2", 3);    // "23"
add({}, []);    // "[object Object]"
```

Let's add a runtime check to be more defensive:

```javascript
function add(a, b) {
	assert(typeof a === "number", "'a' must be a number");
	assert(typeof b === "number", "'b' must be a number");
	return a + b;
}
```

Now we catch mistakes immediately. If something unexpected slips through, the
program fails loudly instead of returning bad data. That said, I probably
wouldn’t write this kind of assertion in practice—with or without a type
system. This kind of check is exactly what static types are built for.

Using TypeScript, we can move that check into the type system:

```typescript
function add(a: number, b: number): number {
	return a + b;
}
```

There's no runtime check anymore. In theory, one _could_ call this function
from plain JavaScript and bypass the type system entirely. But with TypeScript,
incorrect usage will be caught before the code runs. You'll see a <ins
	class="decoration-wavy decoration-red-500">red squiggle</ins> in your
editor, and the compiler will refuse to proceed.

We can keep going. What if `add` should only accept integers? TypeScript's
built-in types (i.e., [JavaScript
primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)) don't
distinguish between integers and floats, so we need to enforce that constraint
ourselves.

```typescript
function add(a: number, b: number): number {
	assert(Number.isInteger(a), "'a' must be an integer");
	assert(Number.isInteger(b), "'b' must be an integer");
	return a + b;
}
```

Here, we combine types with runtime assertions. The type system catches what it
can, and the assertions handle the rest. This kind of hybrid is often a sweet
spot: expectations are clear, both to the type checker and at runtime.

An alternative is to move all our assumptions to the type-level using [branded
types](https://www.learningtypescript.com/articles/branded-types):

```typescript
type Integer = number & { __brand: "integer" };

function add(a: Integer, b: Integer): Integer {
	return (a + b) as Integer;
}
```

There are no runtime checks in the body of this function anymore, but that's
because we've shifted the responsibility elsewhere. Branding is a type-only
construct; it changes how the type checker "sees" a value, not how the code
runs. Just as we "lie" to TypeScript with `as Integer` in the return, we rely
on something elsewhere in the system to verify and provide valid branded
inputs.

It's kind of a marvel that TypeScript supports this at all, but that
flexibility also means codebases can _feel_ very different. Some stick close to
"typed JavaScript," while others start to resemble something [entirely
new](https://effect.website/). Personally, I find branding to be overkill in
most cases, though I see the value. It really depends on the context and
expectations around the code.

The point of these examples is to show how the burden shifts. Sometimes we rely
on the type system, sometimes on runtime checks, and often the most practical
solution is a mix. Whether you enforce something statically or dynamically
depends on what you're building and what _kind_ of confidence makes sense.


### Guiding the type checker

Types and runtime checks might seem like separate concerns, but interestingly,
<ins>**assertions can also participate in static analysis**</ins>. Perhaps this
property is obvious to some, but it took me a while to fully appreciate how
assertions can actually improve the type checker's understanding of the code.

[Type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
is when the compiler learns more about a variable's type as your code executes
specific checks _at runtime_. It's most useful in languages with [**union
types**](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types),
like TypeScript and Python, where a variable could be one of several possible
types. For example,

```typescript
function handleInput(value: number | string) {
	if (typeof value === "number") {
		value // number
	} else {
		value // string
	}
}
```

This works similarly in Python:

```python
def handle_input(value: int | str):
	if isinstance(value, int):
		value # int
	else:
		value # str
```

In each branch, <ins>the type checker refines its understanding of `value`
	based on the condition</ins>. Once you've ruled out the other
possibilities, the compiler allows you to treat the value as a specific type.

I like to think of narrowing as a way to _collaborate_ with the type checker.
You're giving it evidence it can use to make stronger guarantees. If the check
is vague or unhelpful, the type system won't do much with it. But with a
meaningful condition, you can prove that a certain operation is safe.

Narrowing is different from simply telling the type checker to trust you.
TypeScript provides several escape hatches for doing that, but they all involve
opting out of the type system. Narrowing works in the opposite direction—you're
giving the type checker enough information to reason more precisely, not
turning it off.

What makes this type inference so powerful is that **assertions hook directly
into that same narrowing mechanism**. Instead of writing a conditional to check
and branch, we can assert the condition and let the type system update its
understanding accordingly:

```typescript
function handleInput(value: number | string) {
	assert(typeof value === "number", "'value' must be a number");
	value // number
}
```

After the assertion, not only do _we_ know that `value` is a
`number`—TypeScript does too. The type has been narrowed to `number`, and we
can safely use it without further checks.

Moreover, it _composes_. With multiple assertions, each one builds on
TypeScript's current understanding, providing more evidence about the shape of
the data. For example, we can safely narrow an `unknown` value into an expected
`User` type:

```typescript
type User = { id: string, name: string };
function processUser(user: User) { /* ... */ }

let user: unknown = await fetch("/api/user").then((res) => res.json());

assert(typeof user === "object" && user !== null, "must be an object");
assert("id" in user && typeof user.id === "string", "must have an id");
assert("name" in user && typeof user.name === "string", "must have a name");

processUser(user); // no errors!
```

For even better readability, we could extract this logic into a custom [type
guard](https://blog.logrocket.com/how-to-use-type-guards-typescript/) and
assert against that:

```typescript
function isUser(x: unknown): x is { id: string; name: string } {
	return (
		typeof x === "object" && x !== null &&
		"id" in x && typeof x.id === "string" &&
		"name" in x && typeof x.name === "string"
	);
}

let user: unknown = await fetch("/api/user").then((res) => res.json());
assert(isUser(user), "invalid user");

processUser(user); // no errors!
```

There are certainly more robust options for data validation, but I hope it's
clear _just_ how far you can get with this tiny utility—and why I end up
copying it into almost every project.

## When to assert

So far, this post has focused on how assertions work and how they interact with
the type system. To close, I want to share a few practical examples where I
think an `assert` should be used. If you've made it this far, hopefully you'll
come away with a few practical guidelines for when it’s worth reaching for one.

TypeScript is often pitched as a way to write type-safe code. But for
beginners, "type-safe" can feel too abstract to be a concrete goal. In
practice, it often feels like the real task is just getting rid of the <ins
	class="decoration-wavy decoration-red-500">red squiggles</ins>. And for
that, there are two features in particular that I think completely undermine
the value proposition of TypeScript. They're easy to reach for, they're
convenient, and they make the errors go away—which makes them tempting, and
often overused.

But they do so at a cost. These features can quietly erase TypeScript’s
guarantees, introduce subtle bugs, and give a false sense of correctness.
Worse, they're rarely framed this way. A beginner discovers one, sees the
squiggle disappear, and keeps reaching for it—without realizing the long-term
consequences.

In many of these cases, an assert would be clearer, safer, and a better
reflection of what the developer actually meant.

### Non null assertions

The `!` operator tells TypeScript to assume something is not `null` or
`undefined`, even when the type system says it might be. It's easy to reach
for, but it discards one of TypeScript's most helpful checks.


```typescript
function getUsers(): Array<User> { /* ... */ }

let users = getUsers();
let user = users.find(user => user.id === "foo");

// ❌ bad
processUser(user!);

// ✅ better
assert(user, "no user found");
processUser(user);
```

The assert version is clearer, safer, and communicates the assumption
directly—both to the compiler and to future readers.

### Type assertions

The `as` keyword is even more common. It tells the type checker to just treat a
value as a given type, no matter what. There’s no check, no validation, just
blind trust.

```typescript
type User = { id: string; name: string };
type Admin = { id: string; level: number };

function getPerson(): User | Admin { /* ... */ }

let person = getPerson();

// ❌ bad
processUser(person as User);

// ✅ better
assert("name" in person, "not a user");
processUser(person);
```

TODO: explain

### Work in progress

Finally

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

### 3. Works nicely with plain JavaScript files

Because assertions are regular JavaScript functions (no special TS syntax),
they're equally useful in plain JavaScript codebases. If you're using
TypeScript to type-check JavaScript, assertions help clarify your intentions
with fewer workarounds or syntax tricks.

Interestingly, TypeScript's special syntax (like `as` or `!`) is cumbersome in
plain JavaScript files, but runtime assertions remain natural and concise.


```rust
enum Value {
    Int(i32),
    String(String),
}

fn handle_input(value: Value) {
    match value {
        Value::Int(n) => { /* n is i32 */ },
        Value::String(s) => { /* s is String */ },
    }
}
```

