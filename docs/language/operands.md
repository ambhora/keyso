<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Operands

An operand is an item of a definition other than the `operation` item. Keyso has
three forms of operand.

| Operand | Form | Permitted under |
| --- | --- | --- |
| inline operand | `key: value` | `product`, `union`, `intersection`, `difference` |
| flatten operand | `flatten: name` | `product`, `union`, `intersection`, `difference` |
| configuration operand | `{key1: data1, key2: data2, ...}` | `set` |

## Inline operand

An inline operand is a dictionary with exactly one key, which is not a reserved
item key. It denotes a set whose type is that key, with one configuration per
value. The value construct determines the values; see [Values](values.md).

```yaml
- compiler: [gcc, clang]
```

denotes the set:

```yaml
- {compiler: gcc}
- {compiler: clang}
```

## Flatten operand

A flatten operand is a dictionary with the single key `flatten` whose value is
the name of another definition in the same document. It denotes the set of that
definition unchanged: the same type and the same configurations. Within the
enclosing operation, the keys of the flattened set stand beside the keys of the
other operands.

```yaml
builds:
  - compiler: [gcc, clang]
  - optimization: [O2, O3]
  - operation: product

matrix:
  - flatten: builds
  - system: [jedi, jupiter]
  - operation: product
```

The type of `matrix` is `{compiler, optimization, system}`.

`flatten` is the only way to use another definition as an operand, under every
operation. Named sets are combined with it:

```yaml
special:
  - {compiler: intel, optimization: O2}
  - operation: set

all_builds:
  - flatten: builds
  - flatten: special
  - operation: union
```

To use the configurations of another set as the values of one key instead, use a
[`nested` value](values.md#nested). [Flatten and nested](composition.md)
compares the two.

## Configuration operand

A configuration operand is a dictionary with one or more keys and is permitted
only under `set`. It denotes one configuration. Every value in a configuration
operand is data: scalars, lists and dictionaries are taken verbatim and nothing
is expanded.

```yaml
supported:
  - {compiler: gcc, optimization: O2}
  - {compiler: clang, optimization: O3}
  - operation: set
```

Configuration keys follow the same rule as inline operand keys: `operation` and
`flatten` cannot be used.

## Invalid operands

A bare name is not an operand, because every reference must state whether the
other set is flattened or nested. This definition is invalid:

```yaml
matrix:
  - builds
  - system: [jedi, jupiter]
  - operation: product
```

Under any operation other than `set`, a dictionary item with more than one key
is invalid. This definition is invalid as well:

```yaml
matrix:
  - {compiler: gcc, optimization: O2}
  - system: [jedi, jupiter]
  - operation: product
```
