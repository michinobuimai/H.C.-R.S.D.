read the comments on how it works i was too lazy to make a proper explanation but it is quite cool ;)

EDIT

IT IS NOT A TRUE MAZE its usage is heavily centered towards procedurally generating dungeons


This uses the U shape also used in the Hiblerts filling shape to create a maze.

It is meant to be specifically used on squares.

I haven't found a nice algorithm for my usecases so i made my own that is easier to comprehend and implement (thus the lack of code and explanations).

I came up with this while i was looking for a solution to generate a dungeon inside minecraft with a limited square area.
I quite like it as this doesnt need ANY storing logic -> last cell visited bull crap and weird remembering of visited cells isnt needed for this algorithm.

All you need to do is rotate the u shapes (which is insane cause this scales infinitely).

How does it scale?

for the smalles working one its 4x4 cells that need to be connected
it uses 5 u shapes

for the next size its 8x8 cells
and uses 21 u shapes

There is a special way to make it less predictable the more you scale it
using an alternate version of this algorithm.

i dub the alternative version: FSRRM-algorithm

Fractal Square RAndom Rotation Maze Algorithm



EDIT:
Upon later realization is that this concept applies as long as the geometric truth (U-shapes always lead to connected paths) is upheld,
thus the alternative version should in theory be the "true" version.
This "true" version should work regardless of the shape aslong as its divided in the U-shape.

As such a name change to:
Hilbert-Constrained Recursive Spatial Division -> (HC)RSD algorithm
would be more fitting

If this algorithm truly is a TRUE maze is sth. i'm uncertain to proove
