---
title: ""
excerpt: ""
description: ""
date: 2025-04-24
---

Use `AbortSignal`.

TL;DR - abortsignals are a standard way of cancelling async. Making a first
class entitiy in APIs will give your programs more flexibility and consistency
rather than inventing. For example, when adding DOM listeners one

```ts

```

## the problem

This is a much shorter post, but aligned with the last post. I want to cover
some lesser documented patterns that I've grown to use . Often when working
with web programming or event programming, there are callback-based APIs for
subscribitng and registering acitons in responses to events.

For example, the browser `EventTarget` serves as a standard for. Some code

```ts
function handler(event) { /* ... */ }

el.addEventListener("mousedown", handler);
el.removeEventListener("mousedown", handler);
```

This is the web-native way of doing thing, but also this is in other previous APIs like backbone:

```ts
model.on("change", handler);
model.off("change", handler);
```

However, the challenge is that there is not

## What is o


## Composition

- `AbortSignal.any()`
- `AbortSignal.timeout()`


