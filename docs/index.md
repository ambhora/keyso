<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Keyso

Keyso is a small language for describing finite sets of configurations. A
configuration assigns values to keys, such as a compiler and an MPI library for
a build. A Keyso document builds sets of configurations from simple choices with
set operations: product, union, intersection and difference.

``` { .yaml .keyso title="A first definition" }
build:
  - compiler: [gcc, clang]
  - mpi: [openmpi, mpich]
  - _operation: product
```

The definition `build` denotes the four configurations obtained by combining two
compilers with two MPI libraries.

Every code block on this site carries a label and a caption. **Keyso** marks
documents and fragments of documents, **Configurations** marks the
configurations a definition denotes, **Invalid** marks counterexamples, and
**Not Keyso** marks other formats shown for comparison.

## Why set operations

Configuration sets rarely form a full grid. A typical CI matrix, here a GitHub
Actions workflow, starts from a grid and removes the combinations that do not
apply:

``` { .yaml .foreign title="GitHub Actions workflow matrix" }
strategy:
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

``` { .yaml .keyso title="The same matrix in Keyso" }
grid:
  - os: [ubuntu, macos]
  - python: ["3.10", "3.11", "3.12"]
  - _operation: product

excluded:
  - {os: macos, python: "3.10"}
  - {os: ubuntu, python: "3.12"}
  - _operation: set

matrix:
  - $grid
  - $excluded
  - _operation: difference
```

A description written this way is only as complex as the set it describes. Every
intermediate set has a name and can be inspected on its own.

## References

Definitions refer to one another with `$` and a name. Where a reference is
written decides what it denotes. As an operand of its own, `- $build` merges the
set of `build` into the result with its own keys. As the value of a key,
`- build: $build` places the set under that key.

``` { .yaml .keyso title="A set referenced and nested" }
flat_jobs:
  - system: [jedi, jupiter]
  - $build
  - _operation: product

nested_jobs:
  - system: [jedi, jupiter]
  - build: $build
  - _operation: product
```

Both definitions denote eight configurations, but of different types:

``` { .yaml .result title="One configuration of each" }
# flat_jobs, type {system, compiler, mpi}
{system: jedi, compiler: gcc, mpi: openmpi}

# nested_jobs, type {system, build.compiler, build.mpi}
{system: jedi, build: {compiler: gcc, mpi: openmpi}}
```

Placing a set under a key prefixes each of its keys with that key. The nested
dictionary is how a configuration with the paths `build.compiler` and
`build.mpi` is written. [References](language/references.md) describes both
positions in detail.

## Two prefixes

Two prefixes keep the parts of a document apart. Every word of the language
begins with `_`: `_operation`, `_literal` and `_interval`. Every reference to a
definition begins with `$`. Keys never begin with either, so neither a language
word nor a reference can be mistaken for a key. New words can be added later
without changing the meaning of existing documents.

## Scope

This site specifies the Keyso language. It does not document a parser, a
command-line tool or the API of an implementation. The language is defined on a
data model of dictionaries, lists, strings, numbers, booleans and null, so any
serialization of that model can carry a Keyso document. The examples use YAML.
