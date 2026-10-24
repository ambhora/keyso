<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Keyso

Keyso is a small language for describing finite sets of configurations. A
document maps names to definitions, and every definition combines simple choices
with one set operation: product, union, intersection, difference or an explicit
set.

```yaml
build:
  - compiler: [gcc, clang]
  - mpi: [openmpi, mpich]
  - _operation: product

flat_jobs:
  - system: [jedi, jupiter]
  - $build
  - _operation: product

nested_jobs:
  - system: [jedi, jupiter]
  - build: $build
  - _operation: product
```

`flat_jobs` has type `{system, compiler, mpi}`; `nested_jobs` has type
`{system, build.compiler, build.mpi}`, written with each build as a nested
dictionary.

This repository holds the language specification, published at
<https://ambhora.github.io/keyso/>. It documents the language only and is
separate from any implementation.

## Building the site

The site is built with [ProperDocs](https://pypi.org/project/properdocs/) and
driven by [uv](https://docs.astral.sh/uv/):

```bash
uv run properdocs serve
uv run properdocs build --strict
```

The second command writes the site to `build/site`.

## Licence

Apache-2.0. The repository follows the [REUSE](https://reuse.software)
specification.
