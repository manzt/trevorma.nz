---
title: ""
excerpt: ""
description: ""
date: 2025-04-20
---


Error handling is ... and many modern languages don't have exceptions and
instead use but rather treat errors as values (e.g., Rust, Go, Zig). Its'
possible to enumate errors as values in many langauges with excpeionts,
however, fundementally since execeptins excits this kind of error handling and
exceptions can bubble up regardless.

The way that exeptions work is that they short circuit a program, halting
execution f the current... and bubbling up until some other code can "catch"
the exception and choose what to do with it.

After working in a language withut exceptions, I think the biggest frustration
to me is no so much the "clunkiness" of catching captions (e.g., the try/catch
blocks) but moreover that the possible enumerations of what _could_ go wrong
when calling a function are captured by the type system.

That is:

```py
say_hello("Trevor")
```

if we look at the signature of `say_hello`, it looks something like this:

```py
def say_hello(name: str) -> None:
	...
```

In languages with exceptions, you can typically throw many different values:

```py
if x < 0:
	raise "boom"
```

but to the caller that "bubbling" up of potential errors is completely hidden
to the caller when invoking the funtion, and there is no. There are alternative
like Effect which do capture expected errors in the typescytem, but like in the
other post writing code in Effect in my opinion ends up subjectively feeling a
lot less like "JavaScript with types" and entiresly something else.

Because that information is hidden in TypeScript, the type in try/catch blocks
is `unknown` - a catch all type. 

```ts
try {
	await someFunction()
} catch (error: unknown) {
	/* handle error */
}
```

JavaScript doesn't guarantee thrown objects to be instances of its built-in
`Error` class. Therefore, the type must be `unknown` to capture the truly
"unknown" and untracked asepct of the type. Because TypeScript doesn't have
error annotations and does track this info, I think this is a good default.
(especially in comparison to typing of JSON.parse or `response.json()` which
are `any` and siglently give false confiendese).

However, in practice, i see a lot of code in the wild that gives up on trying
to keep any kind of type safety in try/catch blocks. Instead, I see a lot of
code that reaches for one of typescripts easiset to use and most silently
insidious features: type assertions.

```ts
try {
	await someFunction()
} catch (error: unknown) {
	console.error((error as Error).message)
}
```

Take a moment to think why this isn't ok. There is no gaurentee that error is
an `Error` and has the property `message`. Typescript is _trying_ to help us,
but instead we are igoring that strictness. 

have a look a the same kind of pattern in Python. Python doesn't have
try/catch, but rather try/except. One important aspect of Python is that all
thrwon objects must derive from `BaseException`. This may seem like an obiou,
but it allows for a subtle language design feature that benefits from all
thrown values being `Exception`. Rather than a blanket try/catch a try/except
allows you to declare what kindso f excepts you want to catch:

```py
try:
	func()
except ValueError as err:
	...
```

and you can ...:

```py
try:
	func()
except ValueError as err:
	...
except AssertionError as err:
	...
```

or nicely capture one block:

```py
try:
	func()
except (ValueError, AssertionError) as err:
	...
```

Similar the post on assertions, try/except this way is a runtime way that hooks
into the type-cehckers understanding and narrowing of the code. Within the
block, the error type is _narrowed_ to `ValueError` or `AssertionError`, which
means that we can safely access different properties and .

```
example
```

Like TypeScript, the type system doesn't capture what "could throw", but the
declarative nature makes it expecitive whay we expect and the code reads clearly.

takcing iinspriation, I wanted to emulate thispattern in a similar langauge
(TypeScript) despite. Again there are frameworks/libraries that emuatle return
types but for a lot of things, I'd rather have a couple small utilities that
I can copy around to get a lot of the benefits with ....

The utility I use that is smilar i call `rethrowUnless`:

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

It's not super important that you unedetand how this is implementd but the idea
os that it provides a runtime check to . We can declare specific `Error` that
we expect to ... and then the _narrows_ the type. Otherwise, it "bubbles" up if
it doesn't match. Take for example our example from before, we can be explicit
that we only want to handle errors by bassing `Error`:


```ts
try {
	await someFunction()
} catch (error: unknown) {
	rethrowUnless(error, Error);
	console.error(error.message);
}
```

See how this "hooks" into the type system, _narrowing_ the. However, we can get
more specific:

```ts
class DatabaseError extends Error {}
class NetworkError extends Error {}

try {
	await db.query();
} catch (error) {
	rethrowUnless(error, DatabaseError, NetworkError);
	error; // DatabaseError | NetworkError
}
```

With a promise chain, we can also get mor esimliarly the multple blocks:

```ts
await db.query()
	.catch(error => {
		rethrowUnless(error, DatabaseError);
		handleDatabaseError(error);
	})
	.catch(error => {
		rethrowUnless(error, NetworkError);
		handleNetworkError(error);
	})
	.catch(error => {
		rethrowUnless(error, Error);
		console.error("UnknownError: ", error);
	});
```

Errors happen in programs, and having them visible to the type system os
useful. However, not all languages traeat errros ars values and not visble to
the system, the two most precomenat being the two most popular languaes in the
world. Rather than giving up on tpe safety, i ... to and work with the type
checker to write better programs. Cheers.


