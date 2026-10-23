<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Reference

A compact summary of the language. The other pages of this section explain each
construct with examples.

## Structure

```text
document       = { name: definition, ... }       one or more definitions
definition     = [ item, ... ]                    operands and one operation item
item           = operation-item | operand
operation-item = { operation: product | union | intersection | difference | set }
operand        = inline | flatten | configuration
inline         = { key: value }                   not under set
flatten        = { flatten: name }                not under set
configuration  = { key: data, ... }               under set only
value          = scalar
               | [ scalar, ... ]
               | { interval: { start: int, stop: int, step: int } }
               | { literal: data }
               | { nested: name }
```

A `key` is any string except `operation` and `flatten`. A `name` is the name of
a definition in the same document. `data` is any value of the data model.

## Reserved words

| Word | Role |
| --- | --- |
| `operation` | item key naming the operation of a definition |
| `flatten` | item key: use the set of a definition with its own keys |
| `interval` | dictionary value: a finite range of integers |
| `literal` | dictionary value: uninterpreted data |
| `nested` | dictionary value: the configurations of a definition as values |
| `product` | operation: product of anticoherent sets |
| `union` | operation: union of coherent sets |
| `intersection` | operation: intersection of coherent sets |
| `difference` | operation: difference of two coherent sets |
| `set` | operation: an explicit set of configurations |

## Operands

| Operand | Denotes | Type |
| --- | --- | --- |
| `key: value` | one configuration per value | `{key}` |
| `flatten: name` | the set of `name` | the type of `name` |
| `{k1: d1, ..., kn: dn}` | one configuration | `{k1, ..., kn}` |

## Values

| Value | Denotes |
| --- | --- |
| scalar | the scalar |
| `[a1, ..., an]` | each element; the elements are scalars |
| `{interval: {start: a, stop: b, step: s}}` | `a, a + s, a + 2·s, ...` up to `b`; `a ≤ b`, `s ≥ 1`, `s` defaults to `1` |
| `{literal: data}` | `data` |
| `{nested: name}` | each configuration of `name` |
| any other dictionary | invalid |

## Operations

| Operation | Operands | Requirement | Result type |
| --- | --- | --- | --- |
| `product` | one or more | pairwise disjoint types | union of the operand types |
| `union` | one or more | equal types | the common type |
| `intersection` | one or more | equal types | the common type |
| `difference` | exactly two | equal types | the common type |
| `set` | one or more configurations | equal types | the common type |

## References

- A `flatten` operand or a `nested` value must name a definition in the same
  document.
- References must not form a cycle.
- A name is not part of the type of the set it names.
- The order of definitions and the position of the `operation` item carry no
  meaning.
