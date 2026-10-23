<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Keyso

Keyso is a small language for describing finite sets of configurations. A
configuration assigns values to keys, such as a compiler and an MPI library for
a build. A Keyso document builds sets of configurations from simple choices with
set operations: product, union, intersection and difference.

```yaml
build:
  - compiler: [gcc, clang]
  - mpi: [openmpi, mpich]
  - _operation: product
```

The definition `build` denotes the four configurations obtained by combining two
compilers with two MPI libraries.

## Why set operations

Configuration sets rarely form a full grid. A typical CI matrix starts from a
grid and removes the combinations that do not apply:

```yaml
matrix:
  os: [ubuntu, macos]
  python: ["3.10", "3.11", "3.12"]
  exclude:
    - {os: macos, python: "3.10"}
    - {os: ubuntu, python: "3.12"}
```

The exclusions are a set difference written in an ad hoc form, and rule-based
alternatives hide the structure of the set behind conditions. Keyso makes the
set operations themselves the language. The same matrix is the difference of a
product and an explicit set:

```yaml
grid:
  - os: [ubuntu, macos]
  - python: ["3.10", "3.11", "3.12"]
  - _operation: product

excluded:
  - {os: macos, python: "3.10"}
  - {os: ubuntu, python: "3.12"}
  - _operation: set

matrix:
  - grid
  - excluded
  - _operation: difference
```

A description written this way is only as complex as the set it describes. Every
intermediate set has a name and can be inspected on its own.

## References and nesting

Definitions refer to one another by name. A bare name merges the other set into
the result with its own keys. A `_nested` value places the other set under a
key.

```yaml
flat_jobs:
  - system: [jedi, jupiter]
  - build
  - _operation: product

nested_jobs:
  - system: [jedi, jupiter]
  - build: {_nested: build}
  - _operation: product
```

Both definitions denote eight configurations, but of different types:

```yaml
# flat_jobs, type {system, compiler, mpi}
{system: jedi, compiler: gcc, mpi: openmpi}

# nested_jobs, type {system, build.compiler, build.mpi}
{system: jedi, build: {compiler: gcc, mpi: openmpi}}
```

Nesting prefixes every key of the nested set with the key that holds it. The
nested dictionary is how a configuration with the paths `build.compiler` and
`build.mpi` is written. [References and nesting](language/composition.md)
describes both forms in detail.

## Language words

Every word of the language begins with an underscore: `_operation`, `_nested`,
`_literal` and `_interval`. Keys never do. A language word can therefore not be
mistaken for a key, and new words can be added later without changing the
meaning of existing documents.

## Where to go next

<div class="grid cards" markdown>

-   **[Language](language/index.md)**

    Documents, operands, values and operations, with an example for every
    construct.

-   **[Formalism](formalism/index.md)**

    Keys, paths, values, configurations, types and configuration sets defined
    mathematically, and the meaning of a document in those terms.

-   **[Examples](examples.md)**

    Complete documents for common tasks, from compiler matrices to
    cross-compilation.

-   **[Design notes](design.md)**

    The reasons behind the shape of the language.

</div>

## Scope

This site specifies the Keyso language. It does not document a parser, a
command-line tool or the API of an implementation. The language is defined on a
data model of dictionaries, lists, strings, numbers, booleans and null, so any
serialization of that model can carry a Keyso document. The examples use YAML.
