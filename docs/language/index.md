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
  - operation: <operation>
```

A definition is a list of items: one or more operands and exactly one
`operation` item. The `operation` item is written last by convention; its
position in the list carries no meaning.

Names are strings and are unique, because the document is a dictionary. The
order of definitions carries no meaning. A name is not a key: it never appears
in the configurations of the set it names.

## Items

| Item | Form | Meaning |
| --- | --- | --- |
| operation item | `operation: <operation>` | the operation that combines the operands |
| inline operand | `key: value` | a set of type `{key}`, one configuration per value |
| flatten operand | `flatten: name` | the set defined under `name`, with its own keys |
| configuration operand | `{key1: data1, key2: data2, ...}` | one configuration, under `set` only |

[Operands](operands.md) describes the three operand forms, [Values](values.md)
the values of an inline operand and [Operations](operations.md) the five
operations.

## Rules

- **One operation per definition.** A set that needs several operations is
  written as several definitions that refer to one another.
- **No nested definitions.** A definition never appears inside another
  definition. Another set is used by its name, with `flatten` as an operand or
  with `nested` as a value.
- **No cycles.** The references between definitions must not form a cycle.
- **Marked dictionaries.** A dictionary used as the value of an inline operand
  must be marked as `interval`, `literal` or `nested`.

## Reserved words

| Word | Reserved as |
| --- | --- |
| `operation` | item key |
| `flatten` | item key |
| `interval`, `literal`, `nested` | the single key of a dictionary value |
| `product`, `union`, `intersection`, `difference`, `set` | operation names |

`operation` and `flatten` cannot be keys of a configuration. The words
`interval`, `literal` and `nested` are reserved only as the single key of a
dictionary value and may otherwise be used as keys.
