<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# References

A definition uses the set of another definition through a reference: `$`
followed by the name of the definition. Where the reference is written decides
where the paths of the referenced set end up.

| Position | Written as | Paths of the result |
| --- | --- | --- |
| as an operand | `- $build` | the paths of `build`, unchanged |
| as the value of a key | `- key: $build` | the paths of `build`, each prefixed with `key.` |

## One set, two shapes

The running example has a set of builds:

``` { .yaml .keyso title="The running example" }
build:
  - compiler: [gcc, clang]
  - mpi: [openmpi, mpich]
  - _operation: product
```

**As an operand**, `$build` contributes the paths of `build` unchanged:

``` { .yaml .keyso title="build as an operand" }
run:
  - system: [jedi, jupiter]
  - $build
  - _operation: product
```

The type of `run` is `{system, compiler, mpi}`:

``` { .yaml .result title="Configurations of run" }
- {system: jedi, compiler: gcc, mpi: openmpi}
- {system: jedi, compiler: gcc, mpi: mpich}
- ...
```

**As the value of a key**, `$build` contributes the paths of `build` below that
key:

``` { .yaml .keyso title="build under a key" }
run:
  - system: [jedi, jupiter]
  - build: $build
  - _operation: product
```

The type of `run` is `{system, build.compiler, build.mpi}`:

``` { .yaml .result title="Configurations of run" }
- {system: jedi, build: {compiler: gcc, mpi: openmpi}}
- {system: jedi, build: {compiler: gcc, mpi: mpich}}
- ...
```

The key and the definition need not share a name; `- toolchain: $build` is
equally valid, and so is a dotted key such as `- stage.build: $build`. The
referenced set must have at least one path, so that the key appears in the
result.

## Nesting is prefixing

A reference under a key does not store configurations inside configurations. It
prefixes paths. The second `run` above is the same set as

``` { .yaml .keyso title="The nested run with dotted keys" }
run:
  - system: [jedi, jupiter]
  - build.compiler: [gcc, clang]
  - build.mpi: [openmpi, mpich]
  - _operation: product
```

because prefixing commutes with the set operations: prefixing a product is the
product of the prefixed operands. The [algebra](../formalism/algebra.md#nesting)
proves this. A reference operand is the same operation with an empty prefix:
every reference nests the referenced set under the path where it is written, and
an operand is written at the empty path. One construct therefore covers both
positions.

The nested dictionary `{build: {compiler: gcc}}` and the dotted
`{build.compiler: gcc}` are two spellings of the same configuration.
Configurations are written nested by default; a dotted path is useful where it
is shorter.

## Type requirements

Under `product`, the paths of all operands must be anticoherent: no path may
equal another or be a prefix of it. Prefixing keeps nested paths apart, so the
same set can be nested twice under different keys:

``` { .yaml .keyso title="One set nested twice" }
toolchain:
  - compiler: [gcc, clang]
  - _operation: product

cross:
  - host: $toolchain
  - target: $toolchain
  - _operation: product
```

The type of `cross` is `{host.compiler, target.compiler}`. Using `$toolchain`
twice as an operand of a product is invalid, because both operands would
contribute `compiler`.

## Addressing nested paths

A dotted key reaches into a nested position. This keeps set operations on nested
sets short. The cross-compilation pairs without the native ones are:

``` { .yaml .keyso title="Native pairs removed with dotted keys" }
native:
  - {host.compiler: gcc, target.compiler: gcc}
  - {host.compiler: clang, target.compiler: clang}
  - _operation: set

true_cross:
  - $cross
  - $native
  - _operation: difference
```

Both operands of the difference have the type
`{host.compiler, target.compiler}`, and `true_cross` contains the two
configurations whose host and target compilers differ.

## Mixing the positions

A definition may merge some sets and place others under keys, and the same set
may be merged in one definition and placed under a key in another:

``` { .yaml .keyso title="Both positions together" }
resources:
  - nodes: [1, 2]
  - tasks_per_node: [4, 8]
  - _operation: product

job:
  - $resources
  - build: $build
  - _operation: product
```

The type of `job` is `{nodes, tasks_per_node, build.compiler, build.mpi}`.

## Choosing between them

Merge a set when its keys are dimensions of the result in their own right and a
consumer reads them at the top level. Place it under a key when its
configurations form a unit that is passed on as a whole, or when its keys would
collide with the keys of other operands.

## Strings beginning with `$`

A string beginning with `$` is a reference only where a reference is allowed: as
an operand, or as the value of an entry in an operand. Anywhere else a value is
written directly, in a list, in a configuration operand or as an interval field,
such a string is invalid. Data that begins with `$` is written with `_literal`,
as described under [Values](values.md#strings-beginning-with). A reference names
a whole definition; Keyso has no interpolation.
