---
title: ""
excerpt: ""
description: ""
date: 2025-04-24
---

TL;DR - Use `AbortSignal`.


`AbortSignal` are the Web standard way of cancelling async. They have been
around for a bit and there is a good content written on them already with
regard to cancelling `fetch` requests:

```ts
// example
```

or un subscribing to event listeners with `React.useEffect`:


```ts
// example
```

In this post, I want to take a slightly different angle not only encouraging
you to use `AbortController` but to make your async APIs _abortable_. Embracing
AbortSignal enables a lot more flexibility and simpifies, as well as makes your
API familiar. IN this post I want to highlight how using AbortSignals
_delegates_ to the caller, simplifying APIs and making them more familiar to
other developers.


## the problem

I think a lot about APIs. They are the <somethign short and concise about what
they are abstractly, like the entyr to useing software>, specifically in
falling into the pit of success. One of the biggest challenges with APIs is
when different approaches solve the same problem with different designs. 

Many approaches are valid, and proably equally so, but I'd argue that many ways
to do similar things that aren't solved my the language lead to differnt
solutnos which incur various amounts of friction on end users. That is, many
APIs doing the "same" thing puts the onurous on the API design to 1.) choose
how to encapsolate that "thing" and 2.) the end develper to learn and
understand how to interface that API with thier own.

One kind of apttern that is pretty prevelant is to delegate to some function to
"do some stuff", and then defer to the caller with an API to "undo" that stuff.

For example, take react

```ts
import * as React from "react";
import * as ReactDOM from "react-dom/client";

let root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
// later
root.unmount();
```

Or, for example, the browser `EventTarget` when adding and remvoing an event
listener:

```ts
function handler(event) { /* ... */ }

el.addEventListener("mousedown", handler);
// later
el.removeEventListener("mousedown", handler);
```

Or similarly in backbone:

```ts
model.on("change", handler);
// later
model.off("change", handler);
```

Notice how all these are pretty similar, in taht there is some action and then
another thing to "cancel" or "undo" the work accomplished in the original
function. In the latter two examples, you might end up wrapping and API for
yourselft o give someting nice to the caller:

```ts
function render(el) {
	function handler(event) { /* ... */ };
	el.appendChild(/* ... */);
	el.addEventListener(el, handler);
	return () => {
		el.removeEventListener(handler);
		el.replaceChilden();
	}
}

let destroy = render(document.querySelector("#root"));
// later
destory();
```

## A standard

The `AbortController` and it's `AbortSignal` have lately

## What is o


## Composition

- `AbortSignal.any()`
- `AbortSignal.timeout()`


