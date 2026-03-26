---
title: "quiver: type-safe Arrow, and the testing setup that made it possible"
excerpt: "How inline type snapshots unblocked a library that sat half-baked for years."
description: "How inline type snapshots unblocked a library that sat half-baked for years."
date: 2026-03-25
---

**TL;DR** I made [quiver](https://github.com/manzt/quiver), a small schema
library for [Apache Arrow](https://arrow.apache.org/). Define table schemas in
TypeScript, parse IPC against them, and get back fully typed tables.

## Parse, don't validate

"[Parse, don't
validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)"
is the idea that instead of checking whether data matches a shape and
discarding the result, you _parse_ it into a richer type that carries the proof
forward. This approach has become extremely popular in the JavaScript ecosystem
over the last few years for JSON data.

Consider the following code:

```ts
type User = { id: string; name: string };

const user = JSON.parse(raw);
```

What is the type of `user`? It's `any` — TypeScript has no idea what's inside
that string. (It should be `unknown`, but I'll save that for another day.)

In practice, I see a lot of code in the wild — especially AI-generated code —
that slaps on a type assertion to make the squiggly lines go away:

```ts
const user = JSON.parse(raw) as User;
```

A type assertion tells the type checker "I know something you don't" — in this
case, that `user` is a `User`. But we haven't actually proven anything. As I've
[written about previously](/blog/be-assertive), `as` bypasses the type system
entirely. No check runs, and TypeScript will happily believe us. This is how
unverified data enters the system, and once it does, the guarantees we get from
static typing are gone.

One option is to write a type guard that _narrows_ the type:

```ts
function isUser(x: unknown): x is User {
  return (
    typeof x === "object" && x !== null &&
    "id" in x && typeof x.id === "string" &&
    "name" in x && typeof x.name === "string"
  );
}

const user = JSON.parse(raw);
assert(isUser(user));
user; // User
```

This is safer. But type guard bodies are largely unchecked by TypeScript —
there's nothing statically ensuring the checks inside `isUser` actually cover
all the fields. Worse, if you add a field to `User`, the guard _should_ change,
but nothing tells you it needs to. You end up maintaining both a type and a
validator as two separate artifacts, with nothing keeping them in sync.

Libraries like [zod](https://zod.dev) solve this by collapsing both into a
single _schema_ that serves as both a runtime parser and a TypeScript type:

```ts
import * as z from "zod";

const User = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof User>;

const user = User.parse(JSON.parse(raw));
//    ^? { id: string; name: string }
```

Notice we don't define `User` with a TypeScript `type` keyword and then
separately write a parser for it. The type is _derived_ from the schema. Add a
field, and both the type and the parsing logic update together.

Importantly, the parsed `user` isn't some special wrapper or class — it's a
plain JavaScript object. We perform one check at the boundary of our
application, and from that point on we have confidence that our assumptions
about the data are grounded in reality. Otherwise, what's the point of types?

## Arrow has the same problem

[Apache Arrow](https://arrow.apache.org/) is a columnar memory format backing a
lot of interesting work on the web. It's efficient to serialize, cheap to
shuttle around, and zero-copy friendly. There are two Arrow libraries for
JavaScript — [apache-arrow](https://github.com/apache/arrow/tree/main/js) and
[flechette](https://github.com/uwdata/flechette) — and both have good typing.
Their table types are parameterized: a `Table<T>` gives you fully typed row
access, typed columns, typed iteration.

But Arrow data arrives as bytes — an opaque binary encoding, not human-readable
like JSON. You can't glance at a `Uint8Array` and know what's in it. The same
gap applies:

```ts
import * as f from "@uwdata/flechette";

const table = f.tableFromIPC(bytes);
table.at(0); // untyped
```

`tableFromIPC` is the `JSON.parse` of Arrow. You get a table back, but
TypeScript doesn't know its schema. You're left with the same options — an
unsafe cast, or a hand-written type guard that drifts when the schema changes:

```ts
const table = f.tableFromIPC(bytes) as f.Table<{ id: f.Int32; name: f.Utf8 }>; // unsafe!
```

**Quiver is to `tableFromIPC` as zod is to `JSON.parse`.**

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

Quiver doesn't replace flechette — it overlays richer types on top. A parsed
quiver table _is_ a flechette `Table` at runtime. The only difference is at the
type level, where quiver's generics carry schema information that flechette's
types don't:

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

The runtime is tiny. Almost everything in quiver is types. Arrow schemas
are recursive, and the mapping from Arrow types to JavaScript values isn't
one-to-one. It depends on the data type, whether nulls are present, and
flechette's `ExtractionOptions`. Concretely, the JavaScript types you get back
are _conditional_ on these options:

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
commit](https://github.com/manzt/quiver/commit/48a3a88) is from October 2024. I
sketched out the type system — distributed conditional types, phantom type
parameters, option propagation — and it was promising. But the interplay of
schemas with parser options created a huge surface area, and I couldn't find a
testing setup that made me confident I'd gotten it right. After all, the only
thing worse than _no types_ are _incorrect types_.

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

You want to verify the _container_ type is correctly distributed:

`Foo<10, true> | Foo<0, false>`

not collapsed:

`Foo<10 | 0, true | false>`

But leaf-level assertions can't distinguish them — both give you `10 | 0` and
`true | false` at the leaves. You'd have to write out the full assertion on
the container, which for quiver's types gets unwieldy fast:

`Column<IntType<64, true>, { readonly useBigInt: true }, true>`

I didn't know how to exhaustively test inference in a way that was
maintainable. So the project sat for over a year.

## Snapshot testing for types

I'm a fan of snapshot testing. In many projects I'll design a snapshot format
that lets me _see_ where things are wrong at a glance. For example, in marimo
we have logic for [reactive reference
highlighting](https://github.com/marimo-team/marimo/blob/main/frontend/src/core/codemirror/reactive-references/__tests__/analyzer.test.ts)
— the editor highlights variables in a cell that come from other cells so you
can see reactive dependencies as you type. Under the hood this is a lexical
analysis pass that returns ranges: `[{ line, start, end }, ...]`. Not exactly
easy to eyeball for correctness. Instead, I wrote a formatter that renders the
result as carets under the source text:

```ts
expect(
  runHighlight(["threshold", "global_list"], `
(x + threshold for x in global_list)
`),
).toMatchInlineSnapshot(`
  "
  (x + threshold for x in global_list)
       ^^^^^^^^^          ^^^^^^^^^^^
  "
`);
```

You can immediately see which variables are highlighted. And if the logic is
off — say, an off-by-one error shifts a range — the snapshot makes it obvious:

```diff
  (x + threshold for x in global_list)
-      ^^^^^^^^^          ^^^^^^^^^^^
+       ^^^^^^^^           ^^^^^^^^^^
```

You don't need to mentally decode `{ line: 1, start: 5, end: 14 }`. You just
look.

I'd long thought this approach would be ideal for type inference. In a system
like quiver, where TypeScript widens to `any` when inference fails, testing
types is surprisingly tricky. Consider:

```ts
const user: User = table.at(0); // any
```

TypeScript is perfectly happy — `any` satisfies `User`. But that's a bug. The
whole point of quiver is that `table.at(0)` should return something precise,
not `any`. And from my earlier attempts I knew we'd hit edge cases with
recursive types and option propagation. What I wanted was snapshot testing for
types — but it didn't exist.

## Building a custom tool

One thing I've found with coding tools getting more capable is that things that
used to feel like too much yak-shaving now feel worth trying. I knew TypeScript
had a JavaScript API — I'd never used it — but I wondered: how hard could it be
to snapshot inferred types?

The idea: TypeScript has a convention called
[twoslash](https://www.typescriptlang.org/dev/twoslash/) where `//^?` queries
the inferred type at a position (you can see this in the TypeScript playground).
What if I annotated test files with these queries, and a script could snapshot
whatever TypeScript _thinks_ the type is? That would immediately surface cases
where inference bails out to `any`, or where a conditional type distributes
wrong.

I wrote out this plan, and in a few minutes Claude had a [working
prototype](https://github.com/manzt/quiver/blob/main/scripts/snap.ts) that we
refined into something solid. This was genuinely a moment where the tooling
unlocked the project. The cool thing is that `//^?` comments don't affect
runtime behavior — they can be added to any file and run as an additional layer
of assertions alongside normal tests.

## Putting it all together

With this harness I quickly built up ~1000 lines of tests, checking all three
levels of quiver's generics — `Table`, `Column`, `Scalar` — alongside real
runtime values. A quiver test looks like this:

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

Every integer width, every float, every string encoding. Nullable and
non-nullable. With `useBigInt`, `useDate`, `useMap`. Nested structs, lists,
maps, dictionaries. Updating is trivial — `deno task test:update` rewrites all
the type snapshots. Review the diff, accept or fix.

Once I had snapshots, I could review them and see where things looked off. As
expected, there were bugs. But the workflow was simple: fix the inference for
one case, re-run, and make sure nothing else regressed. The git log tells the
story:

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

Each fix was small and targeted because the snapshots told you exactly what
changed. The type system ideas had been there for over a year. What was missing
was a way to exhaustively verify inference and safely iterate on the long tail.
Snapshotting gave me that — the library shipped in a day once the testing was
in place.
