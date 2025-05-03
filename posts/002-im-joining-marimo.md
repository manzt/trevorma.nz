---
title: "I'm joining marimo"
date: 2025-05-03
description: "I'm joining marimo to build better Python notebooks and keep growing the open communities I care about."
excerpt: "Building better notebooks and workflows in Python."
---

Today was my last day at Harvard Medical School. I've signed an offer with <a
	href="https://marimo.io" class="decoration-wavy
	decoration-emerald-800">marimo</a> to help **build the best place to work
with data in Python** — and to continue growing the open communities I care most
about. I'll be focusing on ecosystem compatibility, reactivity, and, of course,
some [anywidget](https://github.com/manzt/anywidget).

This post shares a bit of context on why I’m making this move and where I hope
to go next.


------------

The change is bittersweet, but for those who have followed my work, it likely
won't be a surprise. I've spent the past few years in the [HIDIVE
Lab](https://hidivelab.org) at the intersection of biology, machine learning,
and interactive data visualization — making access to data, and programming
with data, more accessible and empowering. I'm proud of what <a
	href="https://hidivelab.org/publications/">we built</a> and grateful for
the <a
	href="https://scholar.google.com/citations?user=Lo7nJd0AAAAJ&hl=en">collaborations</a>
and the freedom the lab gave me to grow as a scientist and engineer. (I didn't
know what Python <ins>_was_</ins> when I joined.)

At the same time, I want to focus more broadly on tools for reproducible
science, open source, and better ways to work with data. I've often felt a
tension between the software I'm drawn to and the projects that align with
academic career expectations. Maybe more on that another time, but empowering
domain experts with better tools to ask questions, explore ideas, and
communicate with data remains what I'm most passionate about. The academic job
market also isn't especially promising, but more I'm ready for an environment
where I can push these ideas further — bringing my perspective and advocating
for the needs of a community I've learned so much from.

## Why marimo

I first connected with the marimo team in early 2024, when they standardized on
[anywidget](https://github.com/manzt/anywidget) as their third-party plugin
API. We wrote a [blog post](https://marimo.io/blog/anywidget) together.

At the time, anywidget focused primarily on Jupyter-like environments. We'd
written about broader [cross-platform
possibilities](https://github.com/manzt/anywidget#citation), but they were
mostly unproven. marimo was the first to validate the idea, and their early
adoption pushed us to [formalize a
specification](https://anywidget.dev/en/afm/). When people ask how to support
anywidget today, I often point them to marimo's source code as an example of a
"native" [host platform](https://anywidget.dev/en/afm/#host-platform).

It's hard to estimate the impact, but marimo's early adoption was real
validation. Without at least _one_ non-Jupyter host platform, I doubt
[others](https://anywidget.dev/en/community/#integrations) would have had the
same confidence to support the specification. The growth of the ecosystem has
helped crystallize what it means to be a "widget": developers now have a
clearer target for building tools, and users can `pip install` (or `uv add`)
with more confidence.

For the visualization research community, I think this growth offers something
valuable: a concrete model for packaging shared, reusable interactive
components for notebooks. Rather than building monolithic tools, it encourages
unbundling specialized pieces that <ins>_compose_</ins> naturally with the
broader Python ecosystem.

**I'm a strong believer in using whatever tool works best for you**. That said,
there are still small _paper cuts_ when developing and using widgets across
environments — issues we can't fully solve from anywidget alone. These gaps
keep the ecosystem from feeling as simple as "pip install and go," like most
other Python libraries. It's been frustrating at times not being able to fully
recommend or help the experience to beginners, since I haven't been in a
position to shape the environment itself. Joining marimo is a chance to go
further — to improve how widgets are installed, developed, and composed in an
environment where interactivity is a first-class feature.

Beyond that, I think this next step will be <ins>_fun_</ins>. My interactions
with the team have always been thoughtful and energizing. It's rare to find a
group that has thought so deeply about the _environment_ for working with data
— and is in a position to make those ideas a reality for a lot of people. The
team has a strong history with open source, and I'm excited to work with folks
who share a commitment to open, reproducible science and community building.
I've also known [Vincent](https://koaning.io/) through the anywidget community
— we even chatted on his [podcast](https://www.youtube.com/watch?v=goaBFxGhp6Y)
before marimo was really on our radar.

## Why notebooks

What really excites me about this next step is the focus: notebooks. I've spent
[a lot of
time](https://www.proquest.com/openview/bd04a06bf52b8601aa232fb8c1fd8b4f/1?cbl=18750&diss=y&pq-origsite=gscholar)
thinking about primitives for interactive computing — but primitives can only
take you so far.

A rough analogy from the web ecosystem might help (apologies to the Python
crowd): frameworks like React, Svelte, and Vue offer powerful models for
building UIs, but that is only part of the puzzle. For years, users had to
stitch together their own solutions for routing, authentication, and deployment
to build real-world web applications. Over time, more opinionated
meta-frameworks like Next.js (for React) and SvelteKit (for Svelte) emerged —
not because users could not solve these problems, but because doing so
repeatedly was tedious and often distracted from their actual goals.

Meta-frameworks had the advantage of observing real-world patterns and
distilled them into reusable foundations. They also offer something deeper:
foundations shaped by experts who have observed the ways websites are
hand-rolled in practice, and who designed primitives carefully enough to
anticipate future needs without getting in your way.

I think about notebooks the same way. Jupyter is synonymous with notebooks and
has always emphasized flexibility and extensibility at every layer, including
support for any programming language or tool configuration. That openness has
been a real strength, but it has also led to fragmented user experiences.
Different setups, subtle environment differences, and a patchwork of tools can
make common workflows complicated.

While that philosophy (maximum flexibility) is something I _personally_ value
as a software engineer, working closely with scientists, analysts, and students
has given me perspective: I am more the exception than the rule. Many care far
more about understanding their data and advancing their work than configuring
kernels or stitching together a "perfect" environment. Extensibility matters,
but mainly where it directly supports their analysis or communication.

Because Jupyter aims to support all languages with its low-level primitives, it
also faces design constraints that make it challenging to fully address the
needs of Python-specific workflows. By narrowing the focus, marimo trades
breadth for depth and creates an opportunity to **build the best place for
working with data <ins>in Python</ins>**.

That is what excites me most: the chance to rethink primitives based on how
notebooks are used in practice. With a narrower focus, we can revisit the
environment itself as well as the individual pieces — designing for real
workflows, helping users move faster, and addressing the [core
values](https://www.youtube.com/watch?v=Xhx970_JKX4) that matter to folks
working with data _in Python_ (e.g., reproducibility, communication, and
collaboration).

I'm also excited to continue iterating on the _primitives_ — reactivity,
widgets, and developer experience — with a perspective shaped by the broader
Jupyter ecosystem. Strengthening marimo's compatibility with existing tools is
important to me, especially finding ways to meet users where they already work,
like better integrations with IDEs/editors.

## Building for the community

Open-source work remains incredibly important to me, and continuing to improve
the notebook ecosystem _as a whole_ is still a core value of mine. One of my
biggest concerns in leaving academia was making sure I could keep supporting
the communities I've been a part of — and continue contributing to the broader
open-source ecosystem around notebooks.

I'll be stepping back from leading some of the biomedical tools I worked on in
the HIDIVE Lab, but a major priority — and something I discussed at length with
the marimo team — was ensuring that anywidget remains independent, open, and
broadly usable across environments like marimo, Jupyter, and beyond. Their
early support and adoption of the anywidget standard shows we share a
commitment to open standards.

Joining marimo isn't a departure — I truly believe it's the best opportunity
for me to keep building toward the goals we've shared. It gives me a stronger
foundation to make anywidget more sustainable and to keep pursuing bigger ideas
for the community.

Projects like [juv](https://github.com/manzt/juv), inspired by marimo's
approach to dependency management, show how good ideas can flow back to the
broader Jupyter and Python communities. I'm committed to continuing that spirit
in my free time, and those projects will remain independent.

I wouldn't have taken this step if I didn’t believe strongly in the alignment
between marimo's values and the work we've been building together. I’m excited
— and more committed than ever — to keep improving interactive computing for
everyone.

## I'm excited!

That's the (very long-winded) update! I'm not starting until next month, so
I've got a few weeks to enjoy some time off. I'll be at PyCon soon with the
marimo team — if you're there, come say hi! In the meantime, I’ll be traveling,
writing a few blog posts, and working on some open source.

I'm genuinely excited for this next step — not just a new role, but a chance to
keep working in the open, stay close to communities I care about, and help
shape a tool where user experience really matters. I feel incredibly lucky to
get to keep building toward the kind of ecosystem I want to see.
