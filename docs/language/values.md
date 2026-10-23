<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Values

The value of an inline operand determines the configurations of the operand: one
configuration per value. Scalars and lists cover the common cases. Three marked
dictionaries cover integer ranges, uninterpreted data and the configurations of
another set.

| Value | Form | Values denoted |
| --- | --- | --- |
| scalar | `gcc`, `16`, `true`, `null` | the scalar |
| list | `[gcc, clang]` | each element |
| interval | `{interval: {start: a, stop: b, step: s}}` | the integers from `a` through `b` in steps of `s` |
| literal | `{literal: data}` | `data`, uninterpreted |
| nested | `{nested: name}` | each configuration of the set named `name` |

## Scalars

A string, number, boolean or null is a scalar and denotes one value.

```yaml
- threads: 8
```

denotes the set `{threads: 8}` of one configuration.

## Lists

A list of scalars denotes each of its elements.

```yaml
- compiler: [gcc, clang]
```

The elements must be scalars. A list that should be kept as one value is wrapped
in `literal`. Duplicate elements denote the same value once, and an empty list
denotes the empty set of type `{compiler}`.

## Interval

`interval` denotes a finite range of integers. It is compact syntax for a list.

```yaml
- cores: {interval: {start: 16, stop: 32, step: 8}}
```

is equivalent to:

```yaml
- cores: [16, 24, 32]
```

| Field | Required | Meaning |
| --- | --- | --- |
| `start` | yes | first integer |
| `stop` | yes | inclusive upper bound, reached only when a step lands on it |
| `step` | no | positive integer increment; defaults to `1` |

`start` must not exceed `stop`. The values are `start`, `start + step`,
`start + 2·step` and so on, up to and including `stop` if a step reaches it
exactly. An interval with `start` equal to `stop` denotes one value.

## Literal

`literal` marks its content as data. The content is any value of the data model,
including lists and dictionaries, and is not interpreted as Keyso. A literal
always denotes exactly one value.

```yaml
- params: {literal: {nx: 128, ny: 128, solver: [cg, gmres]}}
```

denotes the set of the single configuration:

```yaml
{params: {nx: 128, ny: 128, solver: [cg, gmres]}}
```

## Nested

`nested` names another definition of the same document. Each configuration of
that set becomes one value of the key.

```yaml
builds:
  - compiler: [gcc, clang]
  - optimization: [O2, O3]
  - operation: product

matrix:
  - build: {nested: builds}
  - operation: product
```

denotes:

```yaml
- {build: {compiler: gcc, optimization: O2}}
- {build: {compiler: gcc, optimization: O3}}
- {build: {compiler: clang, optimization: O2}}
- {build: {compiler: clang, optimization: O3}}
```

The type of `matrix` is `{build}`. The keys of `builds` are not part of it. To
merge those keys into the result instead, use a [flatten
operand](operands.md#flatten-operand); [Flatten and nested](composition.md)
compares the two.

## Plain dictionaries are invalid

An unmarked dictionary is ambiguous: it could be data or a construct. This is
invalid:

```yaml
- params: {nx: 128, ny: 128}
```

A dictionary value must have exactly one key, and that key must be `interval`,
`literal` or `nested`.

## Values in configuration operands

Under `set`, each operand is a complete configuration whose values are data. No
value construct is interpreted there: lists and dictionaries are kept verbatim,
and `interval`, `literal` and `nested` have no special meaning.
