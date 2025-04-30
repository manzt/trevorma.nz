---
title: "Catch and carry"
excerpt: "A small utility for writing more type-safe try/catch blocks in TypeScript."
description: "Exception-based languages like Python and TypeScript hide errors from the type system. This post shares a utility (inspired by Python) for narrowing error types in try/catch blocks, rather than giving up on type safety."
date: 2025-04-20
---

In the last post, I wrote about how assertions can help you work with the type
checker to write more robust code. This one shares a small utility I use —
inspired by Python — for writing safer `try/catch` blocks in TypeScript.

Errors happen. In many languages, they’re returned as values and made visible
to the type system. In others, like Python and JavaScript, they’re raised as
exceptions — and invisible to the type system by default.

This isn’t about choosing one model over another. It's about what to do when
exceptions are part of the language and you still want type safety.

There’s no built-in way in Python or TypeScript to know what a function might
throw. You can document it, follow conventions, or just guess. But once you’re
inside a `try/catch`, you _can_ use the type system to check what you've
caught.

TypeScript forces you to type the error as `unknown` — a good default, given
that JavaScript allows anything to be thrown:

```ts
try {
	await someFunction();
} catch (error: unknown) {
	console.error((error as Error).message); // unsafe
}
```

This cast silences the type checker without proving anything. There’s no
guarantee error is an Error, or that it has a message at all.

In Python, there's a small but important difference: all exceptions must
inherit from `BaseException`. That means the language can support more precise
error handling.

You can catch specific exceptions and get narrowing for free:

```py
try:
	func()
except ValueError as err:
	handle_value_error(err)
```

You can also stack multiple blocks:

```py
try:
	func()
except ValueError as err:
	handle_value_error(err)
except AssertionError as err:
	handle_assertion_error(err)
```

or group them:

```py
try:
	func()
except (ValueError, AssertionError) as err:
	handle_expected_errors(err)
```

This isn’t tracked in the function signature either, but it lets you be
explicit about what you’re handling — and within the block, `err` is narrowed
to those types.

Inspired by that, I use a utility in TypeScript to do something similar:

```ts
function rethrowUnless<E extends ReadonlyArray<ErrorConstructor>>(
	error: unknown,
	...errors: E
): asserts error is InstanceType<E[number]> {
	if (!errors.some((ErrorClass) => error instanceof ErrorClass)) {
		throw error;
	}
}
```

It checks the runtime type and rethrows anything unexpected. What’s left is narrowed:


```ts
try {
	await someFunction();
} catch (error: unknown) {
	rethrowUnless(error, Error);
	console.error(error.message); // safe
}
```

or more specific:

```ts
class DatabaseError extends Error {}
class NetworkError extends Error {}

try {
	await db.query();
} catch (error: unknown) {
	rethrowUnless(error, DatabaseError, NetworkError);
	// error: DatabaseError | NetworkError
}
```

You can even chain handlers to mimic Python’s multiple `except` blocks:

```ts
await db.query()
	.catch((error) => {
		rethrowUnless(error, DatabaseError);
		handleDatabaseError(error);
	})
	.catch((error) => {
		rethrowUnless(error, NetworkError);
		handleNetworkError(error);
	})
	.catch((error) => {
		rethrowUnless(error, Error);
		console.error("Unknown error:", error);
	});
```

There are libraries that fully model errors as values in TypeScript and Python
— and you should check them out. But this post isn’t about rewriting how errors
work. It’s just one way to keep working with the type checker, even when using
exceptions.
