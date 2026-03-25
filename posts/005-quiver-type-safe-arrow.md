---
title: "quiver: type-safe Arrow, and the testing setup that made it possible"
excerpt: "How inline type snapshots unblocked a library that sat half-baked for years."
description: "How inline type snapshots unblocked a library that sat half-baked for years."
date: 2026-03-25
---

**TL;DR** I made [quiver](https://github.com/manzt/quiver). It's like
[zod](https://zod.dev) for [Apache Arrow](https://arrow.apache.org/).

## Parse, don't validate

"Parse, don't validate" is the idea that instead of checking whether data
matches a shape after the fact, you push validation to the boundary and work
with typed, known-good data from that point on.

In JavaScript, this used to be common:

```ts
const data: User = JSON.parse(raw); // unsafe!
```

Libraries like zod changed the equation. You define a _schema_, parse through
it, and on the other side you have validated data with a precise TypeScript
type, derived from the schema, not hand-written:

```ts
const User = z.object({ name: z.string(), age: z.number() });
const data = User.parse(JSON.parse(raw));
//    ^? { name: string; age: number }
```

## Arrow has the same problem

Apache Arrow is a columnar memory format backing a lot of interesting work on
the web. It's efficient to serialize, cheap to shuttle around, and zero-copy
friendly. [Flechette](https://github.com/uwdata/flechette) is an excellent
Arrow library for JavaScript.

But parsing Arrow tables has the same `JSON.parse` problem:

```ts
import * as f from "@uwdata/flechette";

const table = f.tableFromIPC(bytes);
table.at(0); // untyped
```

You _can_ cast the table type:

```ts
const table = f.tableFromIPC(bytes) as Table<{ id: Int32; name: Utf8 }>; // unsafe!
```

As I've [written about previously](/blog/be-assertive), using `as` bypasses the
type system entirely. No runtime checking, no guarantee that the data actually
matches. If the schema changes, TypeScript won't save you.

Arrow _does_ have a well-defined schema though, and TypeScript's type system is
rich enough to express it. What would be nice is to define a _contract_ of the
expected schema and then derive a precise table type from it.

Quiver does exactly that. **zod / valibot / Effect.Schema is to JSON as
quiver is to Arrow.**

```ts
import * as q from "@manzt/quiver";

const schema = q.table({
  id: q.int32(),
  name: q.utf8().nullable(),
});

const table = schema.parseIPC(bytes);
//    ^? q.Table<[Field<"id", IntType<32, true>>, Field<"name", Utf8Type>], {}>

table.at(0);
//    ^? { id: number; name: string | null }
```

Importantly, quiver doesn't replace flechette. It wraps it. A parsed quiver
table _is_ a flechette `Table` at runtime, just with richer type information.
Much like how zod wraps regular JavaScript objects, quiver enriches without
replacing:

```ts
type MyTable = q.Infer<typeof schema>;

const parsed = schema.parseIPC(bytes);
const untyped = f.tableFromIPC(bytes);

// at runtime, parsed and untyped are identical f.Table instances

function handleFlechetteTable(t: f.Table) { /* ... */ }
function handleQuiverTable(t: MyTable) { /* ... */ }

handleFlechetteTable(parsed);  // ok!
handleQuiverTable(parsed);     // ok!
handleQuiverTable(untyped);    // type error!
```

## The type system

The runtime is tiny. Almost everything in quiver is types. Arrow schemas are
recursive, and the mapping from Arrow types to JavaScript values isn't
one-to-one. It depends on the data type, whether nulls are present, and
flechette's `ExtractionOptions`. Concretely, the JavaScript types you get back are _conditional_ on these
options:

```ts
// default: int64 → number
typeof f.tableFromIPC(bytes).at(0).a === "number";

// with useBigInt: int64 → bigint
typeof f.tableFromIPC(bytes, { useBigInt: true }).at(0).a === "bigint";

// toArray() for non-nullable numerics → TypedArray
f.tableFromIPC(bytes).getChild("b").toArray() instanceof Int32Array;

// toArray() for nullable numerics → Array with nulls
f.tableFromIPC(bytes).getChild("c").toArray() instanceof Array;
```

Quiver captures all of this statically across three levels of parameterized
types (see [flechette's type mapping
table](https://idl.uw.edu/flechette/api/data-types) for the full Arrow → JS
correspondence):

- **`Table<Fields, Options>`** the full table
- **`Column<DataType, Options, Nullable>`** a single column
- **`Scalar<DataType, Options>`** what `.at(i)` returns

Each level threads options through, all the way down through nested structs,
lists, and maps.

I had this idea years ago. The [first
commit](https://github.com/manzt/quiver/commit/48a3a88) is from October 2024.
I sketched out the type system, prototyped distributed conditional types,
phantom type parameters, option propagation. It seemed promising, but I never
came back to it.

## The blocker: testing the long tail

The main thing I ran into was testing. Arrow has dozens of data types. Each has
multiple extraction options. Each can be nullable. They nest arbitrarily (lists
of structs of maps of dictionaries). The combinatorial space is huge, and the
library is <ins>only valuable if inference is correct across all of it</ins>.

How do you test that?

TypeScript will happily compile code where inference has subtly changed. No
error, no warning, just different types. And manually asserting complex
inferred types is painful. Consider a distributed union:

```ts
type Foo<A, B> = { a: A; b: B };
declare const foo: Foo<10, true> | Foo<0, false>;

foo.a; // 10 | 0
foo.b; // true | false
```

You want to verify the _container_ type is correctly distributed,
`Foo<10, true> | Foo<0, false>`, not `Foo<10 | 0, true | false>`. But
leaf-level assertions can't distinguish them (both give you `10 | 0` and
`true | false` at the leaves). You'd have to write out the full assertion on
the container, which for types like
`Column<IntType<64, true>, { readonly useBigInt: true }, true>` is tedious,
fragile, and hard to read at a glance.

I didn't know how to exhaustively test inference in a way that was
maintainable. So the project sat for over a year.

## Inline type snapshots

This time around, I wrote a [small
script](https://github.com/manzt/quiver/blob/main/scripts/snap.ts) that
queries TypeScript's language service for the inferred type at each `//^?`
caret and compares it to the snapshot text. Alongside simple runtime
assertions, every test checks both what TypeScript thinks and what JavaScript
does:

```ts
describe("int32", () => {
  const t = q.table({ a: q.int32() }).parseIPC(ipc([1], f.int32()));

  const col = t.getChild("a");
  //    ^? q.Column<IntType<32, true>, {}, false>
  const arr = col.toArray();
  //    ^? Int32Array<ArrayBufferLike>
  const val = col.at(0);
  //    ^? number

  test("toArray", () => expect(arr).toBeInstanceOf(Int32Array));
  test("at(0)", () => expect(typeof val).toBe("number"));
});
```

Updating is trivial. `deno task test:update` rewrites all the type snapshots.
Review the diff, accept or fix.

We built up ~1000 lines of these quickly. Every integer width, every float,
every string encoding. Nullable and non-nullable. With `useBigInt`, `useDate`,
`useMap`. Nested structs, lists, maps, dictionaries. The initial implementation
worked for most cases but clearly had gaps. The git log tells the story:

- [`de2c03e`](https://github.com/manzt/quiver/commit/de2c03e) Add type snapshot testing with `//^?` queries
- [`ff3099e`](https://github.com/manzt/quiver/commit/ff3099e) Expand type snapshots to 44 cases and fix caret preservation
- [`bb29516`](https://github.com/manzt/quiver/commit/bb29516) Fix `either()` to propagate child DataType union
- [`649a00a`](https://github.com/manzt/quiver/commit/649a00a) Fix list builders to propagate child DataType
- [`d5dc1f9`](https://github.com/manzt/quiver/commit/d5dc1f9) Fix `struct()` to propagate child DataTypes
- [`1534821`](https://github.com/manzt/quiver/commit/1534821) Fix `dictionary()` to propagate value DataType
- [`673d841`](https://github.com/manzt/quiver/commit/673d841) Fix `map()` to propagate key and value DataTypes
- [`a39cc64`](https://github.com/manzt/quiver/commit/a39cc64) Fix `decimal32` with `useDecimalInt` to resolve as number
- [`9d26e05`](https://github.com/manzt/quiver/commit/9d26e05) Add exhaustive vitest + type snapshot tests
- [`adb2373`](https://github.com/manzt/quiver/commit/adb2373) Fix Interval scalar to `Float64Array`, remove from `js.date()`

Add snapshots, see what's wrong, fix it, verify you didn't break what already
worked. Each fix was small and targeted because the snapshots told you exactly
what changed.

The type system ideas had been there for over a year. What was missing was a
way to exhaustively verify inference and safely iterate on the long tail.
Snapshotting gave me that. The library shipped in a day once the testing was in
place.

This kind of custom testing tool is something I never would have built years
ago, too much yak-shaving for uncertain payoff. This time I built it while
watching TV, guiding Claude through the implementation. It might be worth
spinning off as a standalone tool, but honestly I'm comfortable letting it just
live in the repo. It's ~250 lines and does exactly what I need.
