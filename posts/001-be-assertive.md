---
title: "Be assertive"
excerpt: "Assertions aren’t just runtime checks — they’re a way to collaborate with the type checker and write more robust programs."
description: "Assertions aren’t just runtime checks — they’re a way to collaborate with the type checker and write more robust programs."
date: 2025-04-08
---

Some time back, I set up my website to [host common scripts and
configs](https://www.youtube.com/watch?v=a1A8EYqqQs8):

```sh
$ curl -sL manzt.sh/assert.js | pbcopy # copy snippet to clipboard
```

It's my way of keeping "little useful things" at hand. Of all these snippets,
the one I reach for the most is [`assert`](https://manzt.sh/assert.js):

```ts
function assert(expr: unknown, msg = ""): asserts expr {
	if (!expr) throw new Error(msg);
}
```

TypeScript introduced [assertion
functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
back in version 3.7, and at this point, I basically drop these three lines of
code into every project.

This post explains _why_. It's about assertions — not just as runtime checks,
but as a way to _collaborate_ with the type checker to write more robust
programs. The next time you're tempted to silence a <ins class="decoration-wavy
	decoration-red-500">type error</ins> with `as` or `typing.cast`, try
asserting what you know to be "true" instead.

## What's an assertion anyway?

Assertions are runtime checks that verify assumptions made <ins>by the
	programmer</ins>. They enforce some
[_invariant_](https://en.wikipedia.org/wiki/Invariant_(mathematics)#Invariants_in_computer_science)
— a property that must always hold true for the program to behave correctly.

Here's a simple example asserting that `x` must be positive:

```ts
assert(x > 0, "x must be positive");
```

It marks a part of the program that reflects the programmer's deeper
understanding or assumptions — things they believe to be true but that aren't
easily expressed with (or visible to) the type system.

After the line above runs, we _know_ for certain that `x` is positive. If it
weren't, the assertion would fail and the program would error immediately.
This kind of check can simplify the code that follows and make it easier to
reason about, both for humans and for static analysis tools.

The [TigerBeetle style
guide](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)
puts it bluntly:

> Assertions detect programmer errors. Unlike operating errors, which are
> expected and which must be handled, assertion failures are unexpected.  The
> only correct way to handle corrupt code is to crash.

A little intense, but TigerBeetle is a serious piece of software.

My view is a bit softer: <ins>writing assertions shows humility</ins>. They're
meant for things that should never happen — so in theory, we shouldn't need them
at all. But bugs _do_ happen. Assertions surface the moment when reality breaks
our expectations, giving us a chance to revise our understanding. Making those
assumptions explicit helps clarify intent and strengthen the code (far better
than a comment).

Assertions are not unique to TypeScript. Many languages provide dedicated
syntax or elevated constructs for writing them, rather than relying on a custom
utility.

For example, Python has [assertion
statements](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement):

```py
assert x > 0, "x must be positive"
```

Rust has the [assert!
macro](https://doc.rust-lang.org/std/macro.assert.html) for the same purpose:

```rust
assert!(x > 0, "x must be positive");
```

It's interesting how many languages have some mechanism to fail fast and
loudly, even with very different designs and philosophies. But _when_ and
_where_ you should `assert` depends on the language.

In Rust, for example, the type system is closely tied to both memory and
control flow. With an expressive type system capable of ["zero-cost
abstractions,"](https://without.boats/blog/zero-cost-abstractions/) many checks
that would require runtime validation in other languages can instead be
"lifted" into type system, turning them into compile-time guarantees or
[recoverable
errors](https://doc.rust-lang.org/book/ch09-00-error-handling.html). Assertions
don't necessarily go away, but they are often pushed to the edges of the
system.

While I appreciate the kind of static guarantees you get in a language like
Rust, I spend a lot of time in TypeScript and Python, where type systems are
layered onto _extremely_ dynamic foundations.

These type systems are
["unsound"](https://www.executeprogram.com/courses/everyday-typescript/lessons/type-soundness):
they sometimes accept programs that violate their own type annotations. That
leniency isn't a bug, but a deliberate trade-off reflecting the [core
values](https://www.youtube.com/watch?v=Xhx970_JKX4) of the language. In order
for TypeScript to support the full range of quirks found in JavaScript, it
makes compromises that favor ecosystem compatibility over strict soundness. No
one writing TypeScript or Python probably _likes_ that their type systems are
unsound, but in the words of [Anders
Hejlsberg](https://en.wikipedia.org/wiki/Anders_Hejlsberg): _"Damn is it
useful."_

The dynamic nature of these languages means you don't have full control over
types and memory, so compile-time guarantees can only go so far. Assertions let
us state and enforce assumptions beyond the type system's reach. In some cases,
a well-placed assertion can even help the type checker reason more precisely.

## Layers of confidence

The line between compile-time and runtime checks isn’t absolute. While they
offer different types of guarantees, they are complementary, and understanding
how they work together can help you determine how to use them effectively.

In this section, we'll look at how assertions and types play different roles
using a simple `add(a, b)` function that evolves through a few versions. Note
that while the examples are in TypeScript, many of these concepts also apply to
Python.

Pay attention to _what_ we're verifying in each case, and _when_ the check
happens. If an assumption is expressed in TypeScript, it's checked at <ins
	class="decoration-wavy decoration-red-500">compile time</ins>. If it's
in an `assert`, it's only checked when running the program.

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

Now if something unexpected slips through, the program fails loudly instead of
returning bad data. That said, I probably wouldn't write this kind of assertion
in practice — with or without type system. This kind of check is exactly what
static types are built for.

In TypeScript, we can "lift" the assumption that `a` and `b` are numbers into
the type system:

```typescript
function add(a: number, b: number): number {
	return a + b;
}
```

Our function no longer has a runtime check, but that doesn't mean the check
disappears. We're placing our trust in TypeScript to ensure `a` and `b` are
numbers whenever `add` is called. This shift simplifies the function body but
delegates the responsibility of verifying `a` and `b` to another part of the
system. We'll need to prove to TypeScript elsewhere, possibly with another
runtime check, that `a` and `b` are indeed numbers. Otherwise, you'll see a
<ins class="decoration-wavy decoration-red-500">red squiggle</ins> in your
editor, and the compiler will refuse to proceed.

This scenario is a classic example where static types are clearly preferred
because it's easily expressible via the TypeScript type system. `a` and `b` are
JavaScript
[primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive), so
verifying they are numbers is straightforward. In this case, TypeScript can
easily ensure the values are numbers, and the code can be typed with
confidence.

Other cases aren't as straightforward. What if we need more from `a` and `b`?
Numbers are primitives in JavaScript, but we may want to refine the
requirements — for example, ensuring add only accepts integers. In these
situations, it's not always clear which approach is best, and often it`s a
trade-off between using the type system or relying on runtime checks.

```typescript
function add(a: number, b: number): number {
	assert(Number.isInteger(a), "'a' must be an integer");
	assert(Number.isInteger(b), "'b' must be an integer");
	return a + b;
}
```

Here, we combine type checks with runtime assertions. TypeScript enforces what
it can at compile time (ensuring `number`), but the final check for what
TypeScript can't "see" — refining it to an integer — is left to runtime. This
means the function has the potential to fail, but it will do so loudly,
allowing us to catch issues early and fix them.

An alternative is to move all our assumptions to the type level using [branded
types](https://www.learningtypescript.com/articles/branded-types):

```typescript
type Integer = number & { __brand: "integer" };

function add(a: Integer, b: Integer): Integer {
	return (a + b) as Integer;
}
```

There are no runtime checks in the function body anymore, but that's because
we've again shifted the responsibility elsewhere. Branding is a kind of
type-level trick — a way of tagging a value in the type system without changing
the underlying value itself. It lets us reuse a regular `number`, but mark it
in a way that gives the type checker more context. When we write `as Integer`,
we're telling TypeScript, "trust me, this number also satisfies `{ __brand:
"integer" }`" even though there's clearly no runtime evidence to support that.
We have to verify, somewhere else in the program, that a `number` is actually
an integer before branding it. That's what makes this pattern safe, but also
what makes it easy to misuse, since it depends on "lying" to the type system.

It's kind of a marvel that TypeScript supports these type-level gymnastics at
all. This flexibility often makes TypeScript codebases _feel_ very different
depending on how much they lean into patterns like branding and other advanced
type-level features. Some projects stay close to "typed JavaScript," while
others start to resemble something [entirely new](https://effect.website/).
Personally, I find branding to be overkill in most cases, though I see the
value.

Some expectations are hard to capture in the type system without reaching for
advanced patterns. In those cases, an assertion can strike a middle ground,
though it provides a different kind of guarantee. It really depends on the
context and expectations around the code.

## Collaborating with the type checker

Types and runtime checks might seem like separate concerns, but interestingly,
<ins>**assertions can also participate in static analysis**</ins>. It took me
some time to fully appreciate how an assertion can actually improve the type
checker's understanding of the code.

[Type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
is when the compiler learns more about a variable's type based on _runtime
checks_. It's especially useful in languages with [**union
types**](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types),
like TypeScript and Python, where a variable could be one of several possible
types.

For example, in TypeScript:

```typescript
function handleInput(value: number | string) {
	if (typeof value === "number") {
		value // number
	} else {
		value // string
	}
}
```

or similarly in Python:

```python
def handle_input(value: int | str):
	if isinstance(value, int):
		value # int
	else:
		value # str
```

In each branch, the type checker <ins>refines its understanding of
	`value`</ins> based on the condition. Once you've ruled out the other
possibilities, the compiler allows you to treat `value` as a specific type.

I like to think of narrowing as a way to _collaborate_ with the type checker.
You're giving it evidence it can use to make stronger guarantees. If the check
is vague or unhelpful, the type system won't do much with it. But with a
meaningful condition, you can prove that a certain operation is safe.

Narrowing is different from telling the type checker to trust you. TypeScript
provides several escape hatches for doing that (e.g., `as`, `!`), but they all
involve opting out of the type system. Narrowing works in the opposite
direction — you're giving the type checker enough information to reason more
precisely, not turning it off.

**Assertions hook directly into this narrowing mechanism**. Instead of writing
a conditional to check and branch, we can `assert` the condition and let the
type checker update its understanding accordingly:

```typescript
function handleInput(value: number | string) {
	assert(typeof value === "number", "'value' must be a number");
	value // number
}
```

After the assertion, not only do _we_ know that `value` is a `number` —
TypeScript does too. The type is narrowed to `number`, and we can safely use it
without further checks.

Moreover, narrowing _composes_. Each `assert` adds to what TypeScript knows,
building up a clearer picture of the data. For example, we can safely narrow an
`unknown` value into a `User` type:

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
function isUser(x: unknown): x is User {
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
clear _just_ how far you can get with this tiny utility. Assertions aren't just
for runtime checks. Used well, they can clarify intent and give the type
checker just enough information to reason more precisely.

## When to assert

So far, this post has focused on how assertions work and how they interact with
the type system. To close, I want to share a few practical examples where I
think an `assert` is the right tool.

### Type assertions

For beginners, the value of "strong types" can feel abstract. In practice,
using TypeScript often feels like the main goal is just getting rid of <ins
	class="decoration-wavy decoration-red-500">red squiggles</ins>.

One of the easiest ways eliminate a <ins class="decoration-wavy
	decoration-red-500">red squiggle</ins> is with a [type
assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions):

```typescript
let user = {} as User;
```

The as keyword tells TypeScript to treat a value as a specific type — <ins>even
	if there's no evidence to support it</ins>. Like type annotations, type
assertions are stripped out at compile time. There's <ins>no check</ins>, just:
"trust me, I know what I'm doing."

Personally, I think `as` is misleading. It looks routine, even idiomatic, but
it's doing something _extremely_ risky by bypassing the type system entirely.
It's this combination of unassuming syntax and effectivness at eliminating <ins
	class="decoration-wavy decoration-red-500">red squiggles</ins> that
makes it so easy to misuse. I wish there were more ceremony around it —
something like Rust's `unsafe`, or even a keyword like `unsafeAssume` to at
least signal the risk more clearly.

If you're thinking of reaching for `as`, consider just _actually_ asserting
instead:

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

In cases like this, an assertion is almost always the right choice. If your
code expects person to be a `User`, and it isn't, that's a bug. The right
behavior is to crash and surface the mismatch. A type assertion silently
assumes everything is fine, even when it's not. An assert makes that assumption
explicit and fail-safe.

### Non-null assertions

Similar to type assertions, TypeScript has another unfortunately unassuming
feature: the [non-null assertion
operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator)
(`!`).

The `!` tells TypeScript, once again, to "just trust me" and assume a value
isn't `null` or `undefined`. Like `as`, it's stripped out at compile time, and
there's <ins>no check</ins> to verify that assumption.

If you're thinking of reaching for `!`, consider just _actually_ asserting
it's not `null` or `undefined`:

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

If a value really should never be `null` or `undefined`, then just check it.
It's cheap, and if you're wrong, you'll want the failure to be loud.

### Work in progress code

When prototyping or building out a new feature, I often use `assert` as a way
to stay focused. Maybe you're only supporting one case out of several, or still
wiring things together.

Instead of bending the code to satisfy the type checker prematurely, an `assert`
lets you mark what's currently supported — and fail loudly if something
unexpected slips through.

```ts
type Shape =
	| { kind: "circle"; radius: number }
	| { kind: "square"; side: number }
	| { kind: "triangle"; base: number; height: number };

function render(shape: Shape) {
	assert(shape.kind === "circle", "only circles supported for now");
	drawCircle(shape.radius);
}
```

This approach keeps TypeScript happy while clearly communicating the boundaries
of what your code currently handles. As the implementation matures, those
assertions can be replaced with real logic, like scaffolding that's removed
once the structure is in place.

### It's "just JavaScript"

This isn't really a scenario, but it's something that often goes
underappreciated: `assert` is just a function. Because it's plain JavaScript,
it works exactly the same in type-checked `.js` (i.e., TypeScript [via
JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html))
as it does in `.ts`. 

This is how I author many [anywidgets](https://anywidget.dev/en/community/): no
build step, but still strongly typed.

```javascript
// @ts-check

/**
 * @param {unknown} expression - The expression to test.
 * @param {string=} msg - The optional message to display if the assertion fails.
 * @returns {asserts expression}
 */
function assert(expression, msg = "") {
	if (!expression) throw new Error(msg);
}

let el = document.querySelector("#root");
assert(el, "no element found");
el.innerHTML = "Hello, world!";
```

Interestingly, this approach ends up being both safer and more concise than the
(unsafe) TypeScript alternatives. A JSDoc-style type assertion, for example,
requires more ceremony and offers less safety:

```javascript
let el = /** @type {HTMLElement} */ (document.querySelector("#root");
```

## Conclusion

Assertions aren't just runtime checks; they're a means to collaborate with the
type checker and write more robust code. While type systems and assertions
serve different purposes and offer different guarantees, they complement each
other well. In many cases, an `assert` is a better choice than escape hatches
like `as` in TypeScript or `typing.cast` in Python. Hopefully this gives you a
good mental model for when and why to reach for an assert - and maybe you'll
even copy [the utility](https://manzt.sh/assert.js) into your own projects.

Happy coding.
