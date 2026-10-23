<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Language

A Keyso document describes configuration sets. This section specifies the
language construct by construct; the [formalism](../formalism/index.md) gives
the same rules in mathematical form.

## Documents

A document is a dictionary. Its keys are **names** and its values are
**definitions**. Every definition denotes one configuration set.

```yaml
<name>:
  - <operand>
  - <operand>
  - _operation: <operation>
```

A definition is a list of items: one or more operands and exactly one
`_operation` item. The `_operation` item is written last by convention; its
position in the list carries no meaning.

Names are unique, because the document is a dictionary, and the order of
definitions carries no meaning. A name is not a key: it never appears in the
configurations of the set it names.

## Keys and paths

A **key** is a non-empty string that does not begin with `_` and contains no
`.`. Names follow the same rule.

A **path** joins one or more keys with `.`, such as `compiler` or
`build.compiler`. A configuration assigns values to paths, and its **type** is
its set of paths. Within a type, no path is a prefix of another: a configuration
cannot assign a value both to `build` and to `build.compiler`.

A configuration is written as a dictionary in which a path is either spelled out
or nested. The dictionaries

```yaml
{system: jedi, build: {compiler: gcc, mpi: openmpi}}
{system: jedi, build.compiler: gcc, build.mpi: openmpi}
```

are the same configuration, of type `{system, build.compiler, build.mpi}`.

## Items

| Item | Form | Meaning |
| --- | --- | --- |
| operation item | `_operation: <operation>` | the operation that combines the operands |
| reference operand | `name` | the set defined under `name`, with its own paths |
| inline operand | `path: value` | a set of type `{path}`, one configuration per value |
| nested operand | `path: {_nested: name}` | the set defined under `name`, every path prefixed with `path.` |
| configuration operand | `{path: entry, ...}` | one configuration, under `_operation: set` only |

[Operands](operands.md) describes the operand forms, [Values](values.md) the
values of an inline operand and [Operations](operations.md) the five operations.

## Rules

- **One operation per definition.** A set that needs several operations is
  written as several definitions that refer to one another.
- **No nested definitions.** A definition never appears inside another
  definition. Another set is used by its name: merged as a reference operand, or
  placed under a key with `_nested`.
- **No cycles.** The references between definitions must not form a cycle.
- **Language words begin with `_`.** Every string beginning with `_` is reserved
  for the language, including strings not yet in use. A key or a name beginning
  with `_` is invalid.
- **Marked dictionaries.** A dictionary used as the value of an inline operand
  must be marked as `_interval`, `_literal` or `_nested`.
- **No bare null.** Null is written `{_literal: null}`. A null value written
  directly is invalid.

## Language words

| Word | Position |
| --- | --- |
| `_operation` | item key naming the operation of a definition |
| `_nested` | single key of a dictionary value: the configurations of another definition, under a key |
| `_literal` | single key of a dictionary value: uninterpreted data |
| `_interval` | single key of a dictionary value: a finite range of integers |

The operation names `product`, `union`, `intersection`, `difference` and `set`
are values of `_operation`. They are not reserved and may be used as keys.
