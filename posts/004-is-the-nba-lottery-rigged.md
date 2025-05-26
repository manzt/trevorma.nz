---
title: "Is the NBA lottery rigged?"
excerpt: "How unlikely is the actual draft history?"
description: "A simulation-based look at the NBA lottery odds."
date: 2025-05-23
---
I don't follow professional sports too closely, but a friend recently sent a
question that caught my interest:

> If I get you the data, can you tell me how likely the historical NBA draft
> lottery \[winner\] results are? I feel like what's happened is statistically
> impossible.

I wasn't familiar with the [NBA
draft](https://en.wikipedia.org/wiki/NBA_draft), but here's the basic idea:
each year, the teams that miss the playoffs enter a weighted lottery. Teams
with worse records get better odds, but only the top four picks are randomized.
The rest follow the standings.

Since each year's winner is a low-probability random draw, _any_ full sequence
of lottery winners is technically unlikely. What matters is whether the
observed sequence is more unlikely than we'd expect under the rules.

To answer that, we need to understand the space of possible outcomes. That's
hard to model analytically — the odds and structure change year to year — but
it's relatively simple to simulate using the published pre-lottery odds. By
running simulations, we can define what counts as "especially unlikely" in
statistical terms.

## Simulate it!

To test whether the historical lottery results are unusually unlikely, we treat
the full sequence of outcomes as a **test statistic**. Under a "null" model,
where each year's result is drawn using the official pre-lottery odds, we
simulate many alternate histories and compute the same statistic for each one.

Let's use the **log-likelihood** of the sequence as our test statistic:

```
log(P(outcome)) = log(p₁) + log(p₂) + ... + log(pₙ)
```

Each `pᵢ` is the probability that the actual winning team in year `i` was
selected, according to the published odds for that year. We sum the logs of
these probabilities to get a single number for the whole sequence.

Using the log-likelihood (instead of multiplying the raw probabilities) avoids
numerical underflow and is easier to interpret: more negative means less
likely.

For example, here's a subset of the observed outcomes:

| Year | Winner            | Probability |
|------|-------------------|-------------|
| 2025 | Dallas Mavericks  | 0.018       |
| 2024 | Atlanta Hawks     | 0.030       |
| 2023 | San Antonio Spurs | 0.140       |
| 2022 | Orlando Magic     | 0.140       |
| ...  | ...               | ...         |


Summing across all years gives the log-likelihood of the real sequence.
<ins>**-91.95**</ins>.

By comparing that to the distribution of log-likelihoods from simulated
histories, we can ask: how surprising is it, _really_?

## It it rigged?

The log-likelihood of the actual lottery results (**-91.95**) gives us a single
number summarizing how likely the observed sequence is under the official
rules. To put that number in context, I pulled lottery odds from 1986 to 2025
using [RealGM](https://basketball.realgm.com/nba/draft/lottery_results) and
wrote a
[script](https://github.com/manzt/nba-lottery-odds/blob/main/download.py) to
collect them into a [single
dataset](https://github.com/manzt/nba-lottery-odds/blob/main/data.csv).

I ran [1,000
simulations](https://github.com/manzt/nba-lottery-odds/blob/main/sim.ipynb) of
the draft lottery, computing the log-likelihood each time. That gives a
_distribution_ of possible values under the lottery model — plotted with my
favorite (and criminally underrated alternative to a histogram): the
[eCDF](https://en.wikipedia.org/wiki/Empirical_distribution_function).

![ECDF plot showing the distribution of simulated log-likelihoods from 10,000
runs of the NBA lottery model. A vertical red line marks the log-likelihood of
the actual historical outcome, which falls near the 12th
percentile.](/nba-plot.svg)

The observed log-likelihood (orange line) falls well within the distribution:
about **12% of simulated outcomes were less likely than the real one** under
the null model.

In other words, the actual sequence is unusual, but well within what we’d
expect by chance. So no, I (sadly) don't think the league is rigged. Would have
made a fun story.

## Note

The code to reproduce this analysis is available in a [marimo
notebook](https://github.com/manzt/nba-lottery-odds/).

If you're curious, the statistical approach used in this post is largely based
on the idea that [there's only one
test](https://allendowney.blogspot.com/2016/06/there-is-still-only-one-test.html),
as explained by Allen Downey: define a test statistic, simulate under a null
model, and see where the real outcome lands.

**Update (2025-05-26)**: Sent this to my friend. His reply - "Try crunching the numbers
again."

