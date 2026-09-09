# Recursive Cross Maze Generator

A canvas-based maze generator that builds mazes through recursive dyadic
subdivision, rather than the classic randomized-DFS/backtracking approach.
It's implemented as a step function (`nextStep()`), so the maze can be drawn
incrementally, paused, resumed, or fast-forwarded to completion at any point.

## How it works

The maze grid size is derived from a depth parameter `n`:

```
size = 2^(n+1) - 2
```

Generation proceeds in `n` depth levels. At each depth `d`, a "step" distance
is computed:

```
pos_shift = floor(size / 2^d)
```

This value both determines where crosses are placed on the grid, and the
maximum arm length of each cross at that depth. Starting at
`(pos_shift, pos_shift)`, the generator walks in a grid pattern across the
canvas, incrementing `x` by `step = pos_shift + 1` until it reaches the far
edge, then resetting `x` and incrementing `y` the same way — placing one
cross at every intersection point for that depth. Once a full depth level is
covered, `d` increments, `pos_shift` halves (roughly), and a finer grid of
smaller crosses is layered on top.

### Cross placement

Each cross has four arms (up/down/left/right), each with length up to
`pos_shift` for that depth. One of the four directions is chosen at random
and left fully open (no gap), which is what guarantees connectivity — every
cross has at least one unobstructed path out. The other three arms are each
split at a random *odd* offset (`random_uneven`), leaving a one-cell gap
partway along the arm. That gap is the "passage" through the wall; the two
filled segments on either side of it are the wall itself.

Because `pos_shift` roughly halves every depth level, later passes add
progressively finer detail nested inside the coarser structure from earlier
passes — the maze is self-similar across depths rather than built cell-by-cell.

## Why this approach

Most common maze algorithms (randomized DFS/backtracker, Prim's, Kruskal's)
require carrying state that scales with the maze itself: a visited-cell set,
a stack or frontier of candidate edges, or a union-find structure. To resume
generation after a pause, or to figure out "what's the next cell to visit,"
you need that accumulated history — there's no way to jump into the middle
of the process without reconstructing it.

This algorithm doesn't need any of that. The entire generation state fits in
five numbers: `x`, `y`, `depth`, `step`, `pos_shift`. Given those, `nextStep()`
can compute exactly what to draw next with no memory of *how it got there* —
it never needs to backtrack to a previous divergence point, because there's
no concept of "get stuck, back up, try another branch." Every cross is placed
independently based on its coordinates and the current depth.

That property is useful in a few concrete situations:

- **Streaming / incremental rendering** — the maze can be drawn progressively
  at any speed, or jumped straight to completion, without changing the
  algorithm (this is exactly what the play/step/reset controls in this repo
  do).
- **Constant memory regardless of maze size** — memory usage doesn't grow
  with `n`, unlike a backtracker's visited/stack structures, which makes this
  a reasonable fit for very large grids or constrained environments.
- **Trivial resumability** — the five state values can be serialized and
  restored at any point mid-generation; there's no call stack or history to
  reconstruct.
- **Depth-parallelism** — since crosses within the same depth level don't
  depend on each other (only on the previous depth's structure), that level
  could in principle be generated concurrently.

The trade-off is that the structure is inherently self-similar and grid-aligned
by powers of two — it doesn't have the organic, irregular passage lengths you
get from a true randomized backtracker, and grid sizes are constrained to
`2^(n+1) - 2`.

## Files

- `maze.js` — `MazeGenerator` class: grid sizing, step logic, and cross drawing.
- `script.js` — canvas setup, UI controls (play/pause/step/reset/speed), and
  the animation loop that drives `nextStep()`.

## Controls

- **n slider** — sets maze depth (and therefore grid size and detail level).
- **Speed slider** — controls delay between steps when playing; at max speed,
  generation completes instantly rather than animating step by step.
- **Play/Pause** — runs `nextStep()` on a timer until the maze is complete.
- **Step** — advances generation by exactly one cross.
- **Reset** — starts a new maze at the current `n`.
