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
operation-item = { _operation: operation }
operation      = product | union | intersection | difference | set
operand        = reference | inline | configuration
reference      = name                             not under set
inline         = { path: value }                  not under set
configuration  = { path: entry, ... }             under set only
value          = scalar
               | [ scalar, ... ]
               | { _interval: { start: integer, stop: integer, step: integer } }
               | { _literal: data }
               | { _nested: name }
entry          = scalar | [ data, ... ] | { _literal: data } | { path: entry, ... }
path           = key | path.key
name           = key
key            = non-empty string, not beginning with _, without .
scalar         = string | number | boolean
```

`data` is any value of the data model, null included. A scalar written directly
is never null.

## Language words

| Word | Role |
| --- | --- |
| `_operation` | item key naming the operation of a definition |
| `_nested` | dictionary value: another definition under the path of the operand |
| `_literal` | dictionary value: uninterpreted data |
| `_interval` | dictionary value: a finite range of integers |

Every string beginning with `_` is reserved for the language.

## Operands

| Operand | Denotes | Type |
| --- | --- | --- |
| `name` | the set of `name` | the type of `name` |
| `path: value` | one configuration per value | `{path}` |
| `path: {_nested: name}` | the set of `name`, prefixed | the paths of `name`, each prefixed with `path.` |
| `{p1: e1, ..., pn: en}` | one configuration | the paths of the entries |

## Values

| Value | Denotes |
| --- | --- |
| scalar | the scalar |
| `[a1, ..., an]` | each element; the elements are scalars |
| `{_interval: {start: a, stop: b, step: s}}` | `a, a + s, a + 2·s, ...` up to `b`; `a ≤ b`, `s ≥ 1`, `s` defaults to `1` |
| `{_literal: data}` | `data` |
| `{_nested: name}` | each configuration of `name`, under the path of the operand |
| null, or any other dictionary | invalid |

## Operations

| Operation | Operands | Requirement | Result type |
| --- | --- | --- | --- |
| `product` | one or more | pairwise anticoherent types | union of the operand types |
| `union` | one or more | equal types | the common type |
| `intersection` | one or more | equal types | the common type |
| `difference` | exactly two | equal types | the common type |
| `set` | one or more configurations | equal types | the common type |

## References

- A reference operand or a `_nested` value must name a definition in the same
  document.
- A definition named by `_nested` must have at least one path.
- References must not form a cycle.
- A name is not part of the type of the set it names.
- The order of definitions and the position of the `_operation` item carry no
  meaning.
