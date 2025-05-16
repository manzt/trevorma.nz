---
title: "Catch errors, carefully"
excerpt: "A utility for more precise try/catch blocks in TypeScript."
description: "A utility to improve structure and type safety in your try/catch blocks, inspired by Python's except."
date: 2025-05-15
---

**TL;DR** — [`rethrowUnless`](https://manzt.sh/rethrow-unless.js) is a little
utility I copy into various TypeScript projects. It provides a declarative
Python-like `except` for catching errors explicitly.

```ts
try {
	await createUser(userData);
} catch (error: unknown) {
	rethrowUnless(error, ValidationError, PermissionError);
	error; // ValidationError | PermissionError
}
```

-------------------

Errors are a fact of programming. Some languages with strong type systems
(e.g., Rust, Go, Haskell) treat errors as values, making failures visible to
the type system so the compiler can help ensure all outcomes are handled. I
grown to appreciate how this style of error handling forces me to think about
what _could_ go wrong — and when it's available, I prefer it.

That said, much of the code I write day-to-day is in Python and JavaScript
(TypeScript), where errors are exception-based.
[Exceptions](https://en.wikipedia.org/wiki/Exception_handling) bubble up
through the call stack, hiding from the type system. Types typically cover the
"happy path," so reasoning about failures takes extra care. Of course, one
_can_ mimic errors-as-values with libraries, but since it's not a core feature,
the are ad hoc, missing the _je ne sais quoi_ of the underlying language.

Some exception-based languages, however, offer better type saftey and structure
around errors than others. In Python, for example, all errors must derive from
[`BaseException`](https://docs.python.org/3/library/exceptions.html). A modest
constraint, but interestingly, it's enough for Python to support special syntax
for structured exception handling.

For instance, you can catch specific error types using `except` clauses:

```py
try:
    await create_user(user_input)
except ValidationError as e:
    print(f"Invalid input: {e}")
except PermissionError as e:
    print(f"Permission denied: {e}")
except (TimeoutError, ConnectionError) as e:
    print(f"Network issue: {e}")
```

Or, you can catch all standard exceptions generically:

```py
try:
    await create_user(user_input)
except Exception as e:
	print(f"Something went wrong: {e}")
```

But catching "bare execptions" like this is [generally
discouraged](https://docs.astral.sh/ruff/rules/bare-except/). Catching specific
errors makes it clear what failures the code is prepared to handle, rather than
unintentionally suppressing unexpected issues.

JavaScript, by contrast, allows <ins>_any_</ins> value to be thrown — not just
[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
objects:

```ts
throw new Error("oops");
throw "boom";
throw 42;
```

Why is this a problem?

The `try/catch` syntax in JavaScript is limited in its
<ins>_expressiveness_</ins>. There's no way to specify _which_ errors to
handle. It catches _everything_ by default, much like Python's discouraged
"bare except." Python, by contrast, is more declarative: `except` clauses make
the intended failure modes explicit, and unexpected errors bubble up
automatically.

Because of this lack of constraint, TypeScript catches errors as
[`unknown`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)
— a type that correctly reflects the uncertainty of what was thrown. Unlike
[`any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any),
an `unknown` value cannot be used until the type system is convinced of certain
properties.

```ts
try {
	await createUser(userInput);
} catch (error: unknown) {
    // handle unknown
}
```

However, in practice, I've found that while typing errors as `unknown` is
correct, it often leads TypeScript developers to give up on type safety inside
catch blocks. Many either reach for unsafe casts to satisfy the type checker or
operate on unchecked assumptions about what was thrown:

```ts
try {
	await createUser(userInput);
} catch (error: unknown) {
	console.log((error as Error).message); // not safe!!
}
```

Handling errors properly requires more ceremony, explicitly checking known
cases and remembering to rethrow anything unfamiliar:

```ts
try {
	await createUser(userInput);
} catch (error: unknown) {
	if (error instanceof ValidationError) {
		console.log(`Invalid field: ${error.field}`)
	} else if (error instanceof PermissionError) {
		console.log(`Invalid permissions for user: ${error.userId}`)
	}
	// Bubble up anything else
	throw error
}
```

This pattern works, but it's repetitive and easy to get wrong, especially if
you <ins>forget to rethrow</ins>. I've often wanted something more structured,
like Python.

## Type narrowing

One (subtle) benefit of Python's except clauses is how they automatically
_narrow_ the type of the error. Inside each block, the error is treated as a
specific type, allowing safe access to relevant properties:

```py
try:
    create_user(user_input)
except ValidationError as e:
    print(f"Invalid field: {e.field}")
except PermissionError as e:
    print(f"Permission denied for user: {e.user_id}")
```

As an aside, I find this collaboration between runtime checks and static
analysis both fascinating and useful, much like how assertions support the type
checker.

TypeScript can do something similar, though it requires more
explicit/imperative checks:

```ts
try {
	await createUser(userInput);
} catch (error: unknown) {
	if (error instanceof ValidationError) {
		error; // ValidationError
	}
	throw error
}
```

## Borrowing from Python

With just a few lines of code, we can add a bit more structure to error
handling in TypeScript, borrowing from Python's `except` clauses:

```ts
/**
 * @param error - The error to check
 * @param - Expected error type(s)
 * @throws The original error if it doesn't match expected type(s)
 */
function rethrowUnless<E extends ReadonlyArray<new (...args: any[]) => Error>>(
  error: unknown,
  ...ErrorClasses: E
): asserts error is E[number] extends new (...args: any[]) => infer R ? R
  : never {
  if (!ErrorClasses.some((ErrorClass) => error instanceof ErrorClass)) {
    throw error;
  }
}
```

[`rethrowUnless`](https://manzt.sh/rethrow-unless.js) checks whether an error
matches a specific set of types and rethrows anything that doesn't. The runtime
logic is minimal, and most of the complexity (I know it's a lot) is in the type
signature. The result is a utility that brings much more structure to exception
handling in TypeScript.

Here's how the earlier example looks with it:

```ts
try {
  await createUser(userInput);
} catch (error: unknown) {
  rethrowUnless(error, ValidationError, PermissionError);
  console.log(
    "field" in error
      ? `Invalid field: ${error.field}`
      : `Invalid permissions for user: ${error.userId}`,
  );
}
```

Like in Python, the type of error is _narrowed_ automatically based on the
clause. Notice how we also don't need to remember to _rethrow_ the error if we
don't know how to handle it.

You can also chain `catch` with async to mimic chained `except` handlers:

```ts
await createUser(userInput)
	.catch(error => {
		rethrowUnless(error, ValidationError);
		console.log(`Invalid field: ${error.field}`);
	})
	.catch(error => {
		rethrowUnless(error, PermissionError);
		console.log(`Invalid permissions for user: ${error.userId}`);
	});
```

It doesn't bring errors into the type system, but it makes `try/catch` blocks
more declarative with minimal code. I've found it worth copying between
projects — maybe you will too.
