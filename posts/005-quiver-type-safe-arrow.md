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

What is the type of `user`? It's `any` (should be `unknown` but I'll leave that
for another day). In other words, TypeScript has no idea what's inside that
string. In such cases i see a lot of code in the wild (especially from AI) that
are willing to slap on a type assertion to make the squiggly lines go away:

```ts
const user = JSON.parse(raw) as User;
```

This type assertion tells the type checker "i know something you don't" and
sspeicially in this case that **i know** user is a `User`. However, note that
we haven't actually proven anything about `user`. As I've [written about
previously](/blog/be-assertive), there is _nothing_ safe about this since We
haven't proven that `user` (beyon that its) and TypeScript will happily believe
us. These kind of ruin all the benefits of having a type system. It is in these
instances where unknown data like and let unkown data into the system... And
than all gaurdntees to have from static typing (or understanindg of the code
are thrown out).

One option is to write a custom type gaurd, that can be used to _narrow_ the
type.

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

This is safer, but can also be tedious and error-prone (dont say this i say it
alog). The bodies can be complicated to write and also type guard bodies are
largely unchecked by TypeScript. Ther eis nothing statically to help me conine
the checks in `isUser` correctly check all fields. In fact, (and maybe even
worse)if you add a field to `User`, the guard _should_ change, but nothing
tells you it needs to.

In other words to have to keep both a type and a validator as two separate l...
which can drift.

Libraries like [zod](https://zod.dev) solve this by letting you define a
together in as _schema_ that serves as both a runtime parser and a TypeScript
type:

```ts
import * as z from "zod";

const User = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof User>;

const user = User.parse(JSON.parse(raw));
//    ^? { id: string; name: string }
```

Notice how we don't define `User` using TypeScript `type` but instead _derive_
the the from the `UserSchema`. The schema is the single source of truth. Add a
field, and both the type and the validation update together. At the boundary of
your app you _parse_ the data, and from that point on you work with typed,
known-good values.

Imporantly the actual runtime User isn't some special class or type but just a
regular JavaScript object. Just by hooking into the type styem we can perfom
one check at the boundary of our application and then have confidance that our
assumptions about the system are gounrded. OTehrrwhise what tis the point of
types?

## Arrow has the same problem

[Apache Arrow](https://arrow.apache.org/) is a columnar memory format backing a
lot of interesting work on the web. It's efficient to serialize, cheap to
shuttle around, and zero-copy friendly. There are two Arrow libraries for
JavaScript — [apache-arrow](https://github.com/apache/arrow/tree/main/js) and
[flechette](https://github.com/uwdata/flechette) — and both have good typing.
Their table types are parameterized: a `Table<T>` gives you fully typed row
access, typed columns, typed iteration.

But Arrow data arrives as bytes. The same gap applies as in JSON:

```ts
import * as f from "@uwdata/flechette";

const table = f.tableFromIPC(bytes);
table.at(0); // any
```

mention?<opaque? use acutall tehcnial language but then explain lik ethe thing is opaque - <espalin>
`tableFromIPC` is the `JSON.parse` of Arrow. You get a table back, but
TypeScript doesn't know its schema. You're left with the same options — an
unsafe cast, or a hand-written validator that drifts when the schema changes.

```js
// snippet
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

<edit>I would fram this as we are enriching or overling richer types on the flechette types shate carry information bu>
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

<edit>
  I don't love this.

  i kind of liked perices of this from the readme but it just didn't fit

  Flechette parses Arrow IPC into JavaScript values, but the mapping from Arrow
  types to JS types depends on the data type, the extraction options, and whether
  nulls are present. Quiver captures all of this statically. See
  [flechette's type mapping table](https://idl.uw.edu/flechette/api/data-types)
  for the full Arrow → JS correspondence.

  Builders return phantom schema entries — no runtime data, just match criteria
  and a type-level generic. `parseIPC` calls flechette's `tableFromIPC`, validates
  the Arrow schema against your declared types, and returns the flechette table
  with quiver's generics overlaid.
</edit>
The runtime is tiny. Almost everything in **quiver** is types. Arrow schemas
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


<edit>It's not that i never got back to it... but just like i had somethign
promising but there that interplay of schema with parser options was just a
huge surface area and i couldnt' find a testing setup that would help me feel
confident i got it right. after all the only thing worse than **no types** are
**incorrect types**.</edit>
I had this idea years ago. The [first
commit](https://github.com/manzt/quiver/commit/48a3a88) is from October 2024. I
sketched out the type system, prototyped distributed conditional types, phantom
type parameters, option propagation. It seemed promising, but I never came back
to it.

## The blocker: testing the long tail

<edit>
    So primising but no way to test and we need to be exhastive. ALso there is
    an impporant proerty we need is that type-infererence.I just don't really
    love this section. I'm trying to give conteext to my decision to do this...
</edit>
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

<edit>
  maybe we without so much code in the text block and add some tpe blocks just to sapce hti out.
</edit>
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

<edit>
  maybe introduce the idea of snapshotting. I love snapshot testing. In many
  projectss, i'll take the time to come up with a good napshot so i can
  visually undrestnad   hwere thigns are wrong. FOr example, in marimo i
  i'mplemented reactive reference highlighitng and rendered the prediced using
  snapshots so we could ficxually confirm and degub  thing whttat wer ging o nt
  that (find ths nn the marimo repo and add as link.

  I love snpahost testing with vitest, example... 

  I've thought this framework would be great for type inference because you
  could snapshot various dsenaaties and and then visuall confirm. espeically in
  a project like this... icould get the base types working, snapshot, adn then
  update the others and sikll make sure i didn't break anhin but one thing is
  that we don't have a snapshot testing kit for type inference.

  hoevwer with coding tools getting so good i decided we coudl impleemnt a
  custom.... that way... this was a huge unlock...

  in a little bit slaude was able to urn
</edit>



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
