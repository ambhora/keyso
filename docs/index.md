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
  - operation: product
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
  - operation: product

excluded:
  - {os: macos, python: "3.10"}
  - {os: ubuntu, python: "3.12"}
  - operation: set

matrix:
  - flatten: grid
  - flatten: excluded
  - operation: difference
```

A description written this way is only as complex as the set it describes. Every
intermediate set has a name and can be inspected on its own.

## Flatten and nested

Definitions refer to one another by name, and every reference states how the
other set is used. A `flatten` operand merges the keys of the other set into the
result. A `nested` value keeps each configuration of the other set whole, as the
value of a single key.

```yaml
flat_jobs:
  - system: [jedi, jupiter]
  - flatten: build
  - operation: product

nested_jobs:
  - system: [jedi, jupiter]
  - build: {nested: build}
  - operation: product
```

Both definitions denote eight configurations, but of different types:

```yaml
# flat_jobs, type {system, compiler, mpi}
{system: jedi, compiler: gcc, mpi: openmpi}

# nested_jobs, type {system, build}
{system: jedi, build: {compiler: gcc, mpi: openmpi}}
```

[Flatten and nested](language/composition.md) compares the two forms in detail.

## Where to go next

<div class="grid cards" markdown>

-   **[Language](language/index.md)**

    Documents, operands, values and operations, with an example for every
    construct.

-   **[Formalism](formalism/index.md)**

    Keys, values, configurations, types and configuration sets defined
    mathematically, and the meaning of a document in those terms.

-   **[Examples](examples.md)**

    Complete documents for common tasks, from compiler matrices to build and run
    sections.

-   **[Design notes](design.md)**

    The reasons behind the shape of the language.

</div>

## Scope

This site specifies the Keyso language. It does not document a parser, a
command-line tool or the API of an implementation. The language is defined on a
data model of dictionaries, lists, strings, numbers, booleans and null, so any
serialization of that model can carry a Keyso document. The examples use YAML.
