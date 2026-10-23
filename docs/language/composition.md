<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# References and nesting

A definition uses the set of another definition in one of two ways. Both name
the other definition; they differ in where its paths end up.

| Form | Written as | Paths of the result |
| --- | --- | --- |
| reference | `- build` | the paths of `build`, unchanged |
| nested | `- key: {_nested: build}` | the paths of `build`, each prefixed with `key.` |

## One set, two shapes

The running example has a set of builds:

```yaml
build:
  - compiler: [gcc, clang]
  - mpi: [openmpi, mpich]
  - _operation: product
```

**Referenced** in a product, `build` contributes its paths unchanged:

```yaml
run:
  - system: [jedi, jupiter]
  - build
  - _operation: product
```

The type of `run` is `{system, compiler, mpi}`:

```yaml
- {system: jedi, compiler: gcc, mpi: openmpi}
- {system: jedi, compiler: gcc, mpi: mpich}
- ...
```

**Nested** under a key, `build` contributes its paths below that key:

```yaml
run:
  - system: [jedi, jupiter]
  - build: {_nested: build}
  - _operation: product
```

The type of `run` is `{system, build.compiler, build.mpi}`:

```yaml
- {system: jedi, build: {compiler: gcc, mpi: openmpi}}
- {system: jedi, build: {compiler: gcc, mpi: mpich}}
- ...
```

The key and the definition need not share a name;
`- toolchain: {_nested: build}` is equally valid, and so is a dotted key such as
`- stage.build: {_nested: build}`.

## Nesting is prefixing

A nested value does not store configurations inside configurations. It prefixes
paths. The nested `run` above is the same set as

```yaml
run:
  - system: [jedi, jupiter]
  - build.compiler: [gcc, clang]
  - build.mpi: [openmpi, mpich]
  - _operation: product
```

because prefixing commutes with the set operations: prefixing a product is the
product of the prefixed operands. The [algebra](../formalism/algebra.md#nesting)
proves this. A reference operand is the same operation with an empty prefix,
which is why the language needs no separate word for it.

The nested dictionary `{build: {compiler: gcc}}` and the dotted
`{build.compiler: gcc}` are two spellings of the same configuration.
Configurations are written nested by default; a dotted path is useful where it
is shorter.

## Type requirements

Under `product`, the paths of all operands must be anticoherent: no path may
equal another or be a prefix of it. Prefixing keeps nested paths apart, so the
same set can be nested twice under different keys:

```yaml
toolchain:
  - compiler: [gcc, clang]
  - _operation: product

cross:
  - host: {_nested: toolchain}
  - target: {_nested: toolchain}
  - _operation: product
```

The type of `cross` is `{host.compiler, target.compiler}`. Referencing
`toolchain` twice in a product is invalid, because both operands would
contribute `compiler`.

## Addressing nested paths

A dotted key reaches into a nested position. This keeps set operations on nested
sets short. The cross-compilation pairs without the native ones are:

```yaml
native:
  - {host.compiler: gcc, target.compiler: gcc}
  - {host.compiler: clang, target.compiler: clang}
  - _operation: set

true_cross:
  - cross
  - native
  - _operation: difference
```

Both operands of the difference have the type
`{host.compiler, target.compiler}`, and `true_cross` contains the two
configurations whose host and target compilers differ.

## Mixing the forms

A definition may reference some sets and nest others, and the same set may be
referenced in one definition and nested in another:

```yaml
resources:
  - nodes: [1, 2]
  - tasks_per_node: [4, 8]
  - _operation: product

job:
  - resources
  - build: {_nested: build}
  - _operation: product
```

The type of `job` is `{nodes, tasks_per_node, build.compiler, build.mpi}`.

## Choosing between them

Reference a set when its keys are dimensions of the result in their own right
and a consumer reads them at the top level. Nest a set when its configurations
form a unit that is passed on as a whole, or when its keys would collide with
the keys of other operands.
