<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Operands

An operand is an item of a definition other than the `_operation` item. Keyso
has four forms of operand.

| Operand | Form | Permitted under |
| --- | --- | --- |
| reference operand | `$name` | `product`, `union`, `intersection`, `difference` |
| keyed reference | `path: $name` | `product`, `union`, `intersection`, `difference` |
| inline operand | `path: value` | `product`, `union`, `intersection`, `difference` |
| configuration operand | `{path: entry, ...}` | `set` |

## Reference operand

A reference operand is a string made of `$` and the name of another definition
in the same document. It denotes the set of that definition unchanged, with the
same type and the same configurations. Within the enclosing operation, the paths
of the referenced set stand beside the paths of the other operands.

``` { .yaml .keyso title="A reference operand" }
builds:
  - compiler: [gcc, clang]
  - optimization: [O2, O3]
  - _operation: product

matrix:
  - $builds
  - system: [jedi, jupiter]
  - _operation: product
```

The type of `matrix` is `{compiler, optimization, system}`.

Named sets are combined with reference operands under every operation:

``` { .yaml .keyso title="Union of named sets" }
special:
  - {compiler: intel, optimization: O2}
  - _operation: set

all_builds:
  - $builds
  - $special
  - _operation: union
```

## Keyed reference

A keyed reference is a dictionary with exactly one entry whose value is a
reference. It denotes the set of the referenced definition with every path
prefixed by the key of the entry.

``` { .yaml .keyso title="A keyed reference" }
matrix:
  - build: $builds
  - system: [jedi, jupiter]
  - _operation: product
```

The type of `matrix` is `{build.compiler, build.optimization, system}`. The
referenced set must have at least one path, so that the key appears in the
result. [References](references.md) compares the two positions of a reference.

## Inline operand

An inline operand is a dictionary with exactly one entry whose value is not a
reference. Its key is a path and its value determines the configurations; see
[Values](values.md). The operand denotes a set whose type is that path, with one
configuration per value.

``` { .yaml .keyso title="An inline operand" }
- compiler: [gcc, clang]
```

denotes the set:

``` { .yaml .result title="Configurations of the operand" }
- {compiler: gcc}
- {compiler: clang}
```

The key may be a dotted path. This addresses a nested position directly:

``` { .yaml .keyso title="An inline operand with a dotted key" }
- run.nodes: [1, 2]
```

denotes the set of type `{run.nodes}`:

``` { .yaml .result title="Configurations of the operand" }
- {run: {nodes: 1}}
- {run: {nodes: 2}}
```

## Configuration operand

A configuration operand is a dictionary with one or more entries and is
permitted only under `set`. It denotes one configuration. Its keys are paths,
and each entry is read as follows:

| Entry | Read as |
| --- | --- |
| scalar other than null and not beginning with `$` | the value of the path |
| list | the value of the path, taken verbatim |
| `{_literal: data}` | the value of the path, `data` taken verbatim |
| dictionary with one or more entries | further paths below the path |

``` { .yaml .keyso title="Configuration operands with list values" }
supported:
  - {compiler: gcc, flags: [-O2, -g]}
  - {compiler: clang, flags: [-O3]}
  - _operation: set
```

The type of `supported` is `{compiler, flags}`; each list is one value.

A dictionary inside a configuration operand describes paths, so nested and
dotted entries can be mixed:

``` { .yaml .keyso title="Nested and dotted entries" }
pairs:
  - {host: {compiler: gcc}, target: {compiler: clang}}
  - {host.compiler: clang, target.compiler: gcc}
  - _operation: set
```

Both configurations have the type `{host.compiler, target.compiler}`. A
dictionary that is a value in its own right is marked with `_literal`, and so is
a string that begins with `$`:

``` { .yaml .keyso title="Values marked as data" }
installs:
  - {mesh: {_literal: {nx: 128, ny: 128}}, prefix: {_literal: $SCRATCH/install}}
  - _operation: set
```

The type of `installs` is `{mesh, prefix}`. A configuration operand denotes
exactly one configuration, so references and `_interval` are invalid in it.

## Invalid operands

Under any operation other than `set`, a dictionary item with more than one entry
is invalid:

``` { .yaml .invalid title="Two entries in an inline operand" }
matrix:
  - {compiler: gcc, optimization: O2}
  - system: [jedi, jupiter]
  - _operation: product
```

A reference operand written with a trailing colon is invalid as well:

``` { .yaml .invalid title="A reference with a trailing colon" }
matrix:
  - $builds:
  - system: [jedi, jupiter]
  - _operation: product
```

`- $builds:` is a dictionary with the key `$builds` and a null value. A key
cannot begin with `$`, and null must be written `{_literal: null}`, so the slip
is reported instead of silently denoting a different set.
