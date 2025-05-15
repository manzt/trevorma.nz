---
title: "Catch TypeScript Errors (Carefully)"
excerpt: "A small utility for writing more type-safe try/catch blocks in TypeScript."
description: "Exception-based languages like Python and TypeScript hide errors from the type system. This post shares a small utility (inspired by Python) for narrowing error types in try/catch blocks, rather than giving up on type safety."
date: 2025-04-20
---

**TL;DR** — `rethrowUnless` is a little utility I copy into various TypeScript
projects. It provides a declarative Python-like `except` mechanism for catching
errors explicitly.

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
(e.g., Rust, Go, Haskell) treat errors as values, making failure modes explicit
and part of the normal flow of the program. I really appreciate how this style
of error handling forces me to think about what _could_ go wrong—and when it's
available, I prefer it.

That said, much of the code I write day-to-day is in Python and JavaScript
(TypeScript), where errors are exception-based. Exceptions bubble up through
the call stack, and without help from the type system, it's easy to overlook
possible failures. These languages require a bit more care to reason about what
could go wrong.

Within exception-based languages, some offer better typesaftey and structure
around errors than others. Sepcifically, in Python, for example, all errors
must derive from
[`BaseException`](https://docs.python.org/3/library/exceptions.html). This
contraint might seem simple, but it affords the ability for capturing errors in
a wayrich syntax with try/except to capture specific errors:

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

Catching all exceptions is also possible:

```py
try:
    await create_user(user_input)
except Exception as e:
	print(f"Something went wrong: {e}")
```

but it's [generally
discouraged](https://docs.astral.sh/ruff/rules/bare-except/). Catching specific
errors makes it clear what failures the code is prepared to handle, rather than
unintentionally suppressing unexpected issues.

JavaScript, by contrast, allows <ins>_any_</ins> value to be thrown — not just
`Error` objects:

```ts
throw new Error("oops");
throw "boom";
throw 42;
```

Why is this a problem? In JavaScript, `try/catch` cannot express which errors
it intends to handle. It can only catch _everything_. The syntax itself is less
expressive compared Python, where an `except` blocks make it clear which
failures are expected, automatically bubbling up anything else.

```ts
try {
	await createUser(userInput);
} catch (error: unknown) {
    // handle unknown
}
```

Thus, TypeScript types caught errors as
[`unknown`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)
— a type that correctly reflects the uncertainty of what was thrown. Unlike
[`any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any),
an `unknown` value cannot be used until the type system is convinced of certain
properties.

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

Handling errors properly requires more ceremony — explicitly checking known
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
