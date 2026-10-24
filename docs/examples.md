<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Examples

Complete documents for common tasks. Each example is valid on its own.

## Compiler matrix

``` { .yaml .keyso title="Compiler matrix" }
compiler_matrix:
  - compiler: [gcc, clang]
  - optimization: [O0, O2, O3]
  - _operation: product
```

Six configurations of type `{compiler, optimization}`.

## HPC run matrix

``` { .yaml .keyso title="HPC run matrix" }
runs:
  - system: [jedi, jupiter]
  - nodes: [1, 2, 4]
  - cores_per_node: {_interval: {start: 16, stop: 32, step: 8}}
  - tasks_per_node: [4, 8]
  - _operation: product
```

Thirty-six configurations of type
`{system, nodes, cores_per_node, tasks_per_node}`.

## Remove unsupported combinations

``` { .yaml .keyso title="Grid without unsupported combinations" }
candidates:
  - compiler: [gcc, clang]
  - optimization: [O0, O2]
  - _operation: product

unsupported:
  - {compiler: clang, optimization: O0}
  - _operation: set

builds:
  - candidates
  - unsupported
  - _operation: difference
```

## Add a special case to a grid

``` { .yaml .keyso title="Grid with a special case" }
grid:
  - compiler: [gcc, clang]
  - optimization: [O2, O3]
  - _operation: product

special:
  - {compiler: intel, optimization: O2}
  - _operation: set

builds:
  - grid
  - special
  - _operation: union
```

## Reuse one set in several others

``` { .yaml .keyso title="One set reused in two definitions" }
compilers:
  - compiler: [gcc, clang]
  - _operation: product

debug_builds:
  - compilers
  - optimization: O0
  - _operation: product

release_builds:
  - compilers
  - optimization: [O2, O3]
  - _operation: product
```

## Build and run sections, merged

``` { .yaml .keyso title="Merged build and run sections" }
build:
  - compiler: [gcc, clang]
  - mpi: [openmpi, mpich]
  - _operation: product

run:
  - nodes: [1, 2]
  - tasks_per_node: [4, 8]
  - _operation: product

jobs:
  - system: [jedi, jupiter]
  - build
  - run
  - _operation: product
```

The type of `jobs` is `{system, compiler, mpi, nodes, tasks_per_node}`, and each
of its thirty-two configurations is flat:

``` { .yaml .result title="A configuration of jobs" }
{system: jedi, compiler: gcc, mpi: openmpi, nodes: 1, tasks_per_node: 4}
```

## Build and run sections, nested

With the same `build` and `run`:

``` { .yaml .keyso title="Nested build and run sections" }
jobs:
  - system: [jedi, jupiter]
  - build: {_nested: build}
  - run: {_nested: run}
  - _operation: product
```

The type of `jobs` is
`{system, build.compiler, build.mpi, run.nodes, run.tasks_per_node}`:

``` { .yaml .result title="A configuration of jobs" }
{system: jedi, build: {compiler: gcc, mpi: openmpi}, run: {nodes: 1, tasks_per_node: 4}}
```

## A nested section from dotted keys

A section can be built in place, without a separate definition:

``` { .yaml .keyso title="A nested section from dotted keys" }
jobs:
  - system: [jedi, jupiter]
  - run.nodes: [1, 2]
  - run.tasks_per_node: [4, 8]
  - _operation: product
```

The type of `jobs` is `{system, run.nodes, run.tasks_per_node}`.

## Cross compilation

``` { .yaml .keyso title="Cross compilation without native pairs" }
toolchain:
  - compiler: [gcc, clang]
  - _operation: product

cross:
  - host: {_nested: toolchain}
  - target: {_nested: toolchain}
  - _operation: product

native:
  - {host.compiler: gcc, target.compiler: gcc}
  - {host.compiler: clang, target.compiler: clang}
  - _operation: set

true_cross:
  - cross
  - native
  - _operation: difference
```

The same set is nested twice; referencing it twice would contribute `compiler`
twice. `true_cross` contains the two pairs whose compilers differ.

## Parameters as data

``` { .yaml .keyso title="Parameters as data" }
cases:
  - mesh: {_literal: {nx: 128, ny: 128}}
  - solver: [cg, gmres]
  - _operation: product
```

Two configurations of type `{mesh, solver}`; the value of `mesh` is the same
dictionary in both.
