<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Flatten and nested

A definition can use the set of another definition in two ways. Both name the
other definition explicitly; they differ in the type of the result.

| Form | Written as | Contributes |
| --- | --- | --- |
| flatten | `- flatten: build` | every key of `build` |
| nested | `- key: {nested: build}` | the single key `key`, whose values are configurations of `build` |

## One set, two shapes

The running example has a set of builds:

```yaml
build:
  - compiler: [gcc, clang]
  - mpi: [openmpi, mpich]
  - operation: product
```

**Flattened** into a product, `build` contributes its keys:

```yaml
run:
  - system: [jedi, jupiter]
  - flatten: build
  - operation: product
```

The type of `run` is `{system, compiler, mpi}`, and its eight configurations are
flat:

```yaml
- {system: jedi, compiler: gcc, mpi: openmpi}
- {system: jedi, compiler: gcc, mpi: mpich}
- ...
```

**Nested** under a key, `build` contributes one key whose values are its
configurations:

```yaml
run:
  - system: [jedi, jupiter]
  - build: {nested: build}
  - operation: product
```

The type of `run` is `{system, build}`, and each of its eight configurations
carries one build as a dictionary:

```yaml
- {system: jedi, build: {compiler: gcc, mpi: openmpi}}
- {system: jedi, build: {compiler: gcc, mpi: mpich}}
- ...
```

The key and the definition need not share a name; `- toolchain: {nested: build}`
is equally valid.

## Same configurations, different types

The two forms carry the same information. Each flat configuration of `run`
corresponds to exactly one nested configuration and back, so both sets have the
same number of elements. The
[algebra](../formalism/algebra.md#nesting-and-flattening) states this as a
proposition.

They differ in the type requirements they impose. Under `product`, the keys of a
flattened set must be disjoint from the keys of every other operand. The keys of
a nested set are hidden behind the key that holds them and may coincide with
keys elsewhere. Only the holding key must be distinct.

A cross-compilation matrix uses the same toolchain set twice and therefore has
to nest it:

```yaml
toolchain:
  - compiler: [gcc, clang]
  - operation: product

cross:
  - host: {nested: toolchain}
  - target: {nested: toolchain}
  - operation: product
```

The type of `cross` is `{host, target}`. Flattening `toolchain` twice is
invalid, because both operands would contribute `compiler`.

## Mixing the forms

A definition may flatten some sets and nest others, and the same set may be
flattened in one definition and nested in another:

```yaml
resources:
  - nodes: [1, 2]
  - tasks_per_node: [4, 8]
  - operation: product

job:
  - flatten: resources
  - build: {nested: build}
  - operation: product
```

The type of `job` is `{nodes, tasks_per_node, build}`.

## Choosing between them

Flatten a set when its keys are dimensions of the result in their own right:
they are compared, filtered or combined with keys of other sets, and a consumer
reads them directly. Nest a set when its configurations form a unit that is
passed on as a whole, or when its keys would collide with keys of other
operands.
