<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Values

The value of an inline operand determines the configurations of the operand: one
configuration per value. Scalars and lists cover the common cases. Three marked
dictionaries cover integer ranges, uninterpreted data and the configurations of
another definition.

| Value | Form | Denotes |
| --- | --- | --- |
| scalar | `gcc`, `16`, `true` | the scalar |
| list | `[gcc, clang]` | each element |
| interval | `{_interval: {start: a, stop: b, step: s}}` | the integers from `a` through `b` in steps of `s` |
| literal | `{_literal: data}` | `data`, uninterpreted |
| nested | `{_nested: name}` | each configuration of `name`, under the path of the operand |

## Scalars

A string, number or boolean is a scalar and denotes one value.

``` { .yaml .keyso title="A scalar value" }
- threads: 8
```

denotes the set `{threads: 8}` of one configuration. Null is not written
directly; see [Null](#null).

## Lists

A list of scalars denotes each of its elements.

``` { .yaml .keyso title="A list value" }
- compiler: [gcc, clang]
```

The elements must be scalars other than null. A list that should be kept as one
value is wrapped in `_literal`. Duplicate elements denote the same value once,
and an empty list denotes the empty set of type `{compiler}`.

## Interval

`_interval` denotes a finite range of integers. It is compact syntax for a list.

``` { .yaml .keyso title="An interval" }
- cores: {_interval: {start: 16, stop: 32, step: 8}}
```

is equivalent to:

``` { .yaml .keyso title="The equivalent list" }
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

`_literal` marks its content as data. The content is any value of the data
model, including lists, dictionaries and null, and is not interpreted as Keyso.
A literal always denotes exactly one value.

``` { .yaml .keyso title="A literal" }
- params: {_literal: {nx: 128, ny: 128, solver: [cg, gmres]}}
```

denotes the set of the single configuration:

``` { .yaml .result title="Configuration of the operand" }
{params: {_literal: {nx: 128, ny: 128, solver: [cg, gmres]}}}
```

Its type is `{params}`: the keys inside the literal are data, not paths. The
configuration keeps the `_literal` marker when written out, so that it is not
mistaken for one with the paths `params.nx`, `params.ny` and `params.solver`.

## Nested

`_nested` names another definition of the same document. The operand denotes
that set with every path prefixed by the path of the operand.

``` { .yaml .keyso title="A nested value" }
builds:
  - compiler: [gcc, clang]
  - optimization: [O2, O3]
  - _operation: product

matrix:
  - build: {_nested: builds}
  - _operation: product
```

denotes:

``` { .yaml .result title="Configurations of matrix" }
- {build: {compiler: gcc, optimization: O2}}
- {build: {compiler: gcc, optimization: O3}}
- {build: {compiler: clang, optimization: O2}}
- {build: {compiler: clang, optimization: O3}}
```

The type of `matrix` is `{build.compiler, build.optimization}`. The named set
must have at least one path, so that the key of the operand appears in the
result. To merge the set into the result without a prefix, use a [reference
operand](operands.md#reference-operand); [References and
nesting](composition.md) compares the two.

## Null

Null is written `{_literal: null}`:

``` { .yaml .keyso title="A literal null" }
- toolchain_file: {_literal: null}
```

A null value written directly is invalid. In YAML, a key with nothing after its
colon is null, so this rule turns a stray colon into an error rather than a
configuration with a null value.

## Plain dictionaries are invalid

An unmarked dictionary is ambiguous: it could be data or a construct. This is
invalid:

``` { .yaml .invalid title="A plain dictionary value" }
- params: {nx: 128, ny: 128}
```

A dictionary value must have exactly one key, and that key must be `_interval`,
`_literal` or `_nested`. To assign values to the paths `params.nx` and
`params.ny`, use two inline operands with dotted keys, or a configuration
operand under `set`.
