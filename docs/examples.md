<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Examples

Complete documents for common tasks. Each example is valid on its own.

## Compiler matrix

```yaml
compiler_matrix:
  - compiler: [gcc, clang]
  - optimization: [O0, O2, O3]
  - operation: product
```

Six configurations of type `{compiler, optimization}`.

## HPC run matrix

```yaml
runs:
  - system: [jedi, jupiter]
  - nodes: [1, 2, 4]
  - cores_per_node: {interval: {start: 16, stop: 32, step: 8}}
  - tasks_per_node: [4, 8]
  - operation: product
```

Thirty-six configurations of type
`{system, nodes, cores_per_node, tasks_per_node}`.

## Remove unsupported combinations

```yaml
candidates:
  - compiler: [gcc, clang]
  - optimization: [O0, O2]
  - operation: product

unsupported:
  - {compiler: clang, optimization: O0}
  - operation: set

builds:
  - flatten: candidates
  - flatten: unsupported
  - operation: difference
```

## Add a special case to a grid

```yaml
grid:
  - compiler: [gcc, clang]
  - optimization: [O2, O3]
  - operation: product

special:
  - {compiler: intel, optimization: O2}
  - operation: set

builds:
  - flatten: grid
  - flatten: special
  - operation: union
```

## Reuse one set in several others

```yaml
compilers:
  - compiler: [gcc, clang]
  - operation: product

debug_builds:
  - flatten: compilers
  - optimization: O0
  - operation: product

release_builds:
  - flatten: compilers
  - optimization: [O2, O3]
  - operation: product
```

## Build and run sections, flattened

```yaml
build:
  - compiler: [gcc, clang]
  - mpi: [openmpi, mpich]
  - operation: product

run:
  - nodes: [1, 2]
  - tasks_per_node: [4, 8]
  - operation: product

jobs:
  - system: [jedi, jupiter]
  - flatten: build
  - flatten: run
  - operation: product
```

The type of `jobs` is `{system, compiler, mpi, nodes, tasks_per_node}`, and each
of its thirty-two configurations is flat:

```yaml
{system: jedi, compiler: gcc, mpi: openmpi, nodes: 1, tasks_per_node: 4}
```

## Build and run sections, nested

With the same `build` and `run`:

```yaml
jobs:
  - system: [jedi, jupiter]
  - build: {nested: build}
  - run: {nested: run}
  - operation: product
```

The type of `jobs` is `{system, build, run}`. Each configuration carries one
build and one run as dictionaries:

```yaml
{system: jedi, build: {compiler: gcc, mpi: openmpi}, run: {nodes: 1, tasks_per_node: 4}}
```

## Cross compilation

```yaml
toolchain:
  - compiler: [gcc, clang]
  - operation: product

cross:
  - host: {nested: toolchain}
  - target: {nested: toolchain}
  - operation: product
```

The same set appears twice and must be nested, because flattening it twice would
contribute `compiler` twice.

## Parameters as data

```yaml
cases:
  - mesh: {literal: {nx: 128, ny: 128}}
  - solver: [cg, gmres]
  - operation: product
```

Two configurations; the value of `mesh` is the same dictionary in both.
