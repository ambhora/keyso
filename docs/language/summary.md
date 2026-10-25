<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Summary

A compact summary of the language. The other pages of this section explain each
construct with examples.

## Structure

``` { .text .grammar title="Structure of a document" }
document       = { name: definition, ... }       zero or more definitions
definition     = [ item, ... ]                    operands and one operation item
item           = operation-item | operand
operation-item = { _operation: operation }
operation      = product | union | intersection | difference | set
operand        = reference | keyed | inline | configuration
reference      = { _ref: name }                   not under set
keyed          = { path: reference }              not under set
inline         = { path: value }                  not under set
configuration  = { path: entry, ... }             one or more entries, under set only
value          = string
               | [ string, ... ]                  zero or more elements
               | { _interval: interval }
               | { _literal: data }
interval       = { start: integer, stop: integer, step: integer }    step optional
entry          = string | [ data, ... ] | { _literal: data } | { path: entry, ... }
data           = string | [ data, ... ] | { string: data, ... }
path           = key | path.key
name           = key
key            = non-empty string, not beginning with _, without .
integer        = 0 | -? nonzero-digit digit*     an integer string
```

Every value is a string: Keyso has no numbers, booleans or null. Inside `data`,
nothing is interpreted, including keys that begin with `_`.

## Language words

| Word | Role |
| --- | --- |
| `_operation` | item key naming the operation of a definition |
| `_ref` | item key, or dictionary value: a reference to a definition |
| `_literal` | dictionary value: uninterpreted data |
| `_interval` | dictionary value: a finite range of integers |

Every dictionary key beginning with `_` is reserved for the language. String
values are never interpreted.

## Operands

| Operand | Denotes | Type |
| --- | --- | --- |
| `_ref: name` | the set of `name` | the type of `name` |
| `path: {_ref: name}` | the set of `name`, prefixed | the paths of `name`, each prefixed with `path.` |
| `path: value` | one configuration per value | `{path}` |
| `{p1: e1, ..., pn: en}` | one configuration | the paths of the entries |

## Values

| Value | Denotes |
| --- | --- |
| string | the string |
| `[a1, ..., an]` | each element; the elements are strings |
| `{_interval: {start: a, stop: b, step: s}}` | `a, a + s, a + 2·s, ...` up to `b`, as integer strings; `a ≤ b`, `s ≥ 1`, `s` defaults to `1` |
| `{_literal: data}` | `data` |
| any other dictionary | invalid |

## Operations

| Operation | Operands | Requirement | Result type |
| --- | --- | --- | --- |
| `product` | one or more | pairwise anticoherent types | union of the operand types |
| `union` | one or more | equal types | the common type |
| `intersection` | one or more | equal types | the common type |
| `difference` | exactly two | equal types | the common type |
| `set` | one or more configurations | equal types | the common type |

## References

- A reference must name a definition in the same document.
- References must not form a cycle.
- Every definition has at least one path, so a reference under a key always
  contributes that key.
- A name is not part of the type of the set it names.
- The order of definitions and the position of the `_operation` item carry no
  meaning.
