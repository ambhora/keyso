<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Values

The value of an inline operand determines the configurations of the operand: one
configuration per value. Scalars and lists cover the common cases. Two marked
dictionaries cover integer ranges and uninterpreted data.

| Value | Form | Denotes |
| --- | --- | --- |
| scalar | `gcc`, `16`, `true` | the string |
| list | `[gcc, clang]` | each element |
| interval | `{_interval: {start: a, stop: b, step: s}}` | the integers from `a` through `b` in steps of `s`, as strings |
| literal | `{_literal: data}` | `data`, uninterpreted |

A reference `{_ref: name}` is not a value. As the value of an entry it makes the
operand a [keyed reference](operands.md#keyed-reference), which denotes the
configurations of another definition rather than values.

## Scalars

A scalar is a string and denotes one value.

``` { .yaml .keyso title="A scalar value" }
- threads: 8
```

denotes the set of the single configuration `{threads: 8}`, whose value is the
string `8`. Keyso assigns no numeric, boolean or null types: `8`, `true` and
`null` are strings, and two values are equal when they are the same string, so
`8` and `08` are different values. Strings are not interpreted in any other way
either:

``` { .yaml .keyso title="A string with a dollar sign" }
- prefix: $SCRATCH/install
```

denotes the set of the single configuration `{prefix: $SCRATCH/install}`. Keyso
does not expand variables; the string is kept as it is. The empty string is
written `""` and is a value like any other.

## Lists

A list of scalars denotes each of its elements.

``` { .yaml .keyso title="A list value" }
- compiler: [gcc, clang]
```

The elements must be scalars. A list that should be kept as one value is
wrapped in `_literal`. Duplicate
elements denote the same value once, and an empty list denotes the empty set of
type `{compiler}`.

## Interval

`_interval` denotes a finite range of integers, each written as a string. It is
compact syntax for a list.

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

The fields are **integer strings**: the decimal notation of an integer, `0` or
an optional `-` followed by digits without a leading zero, such as `16`, `-4` or
`0`. Strings such as `016`, `+4`, `-0` or `1e3` are invalid. `start` must not
exceed `stop`. The values are `start`, `start + step`, `start + 2·step` and so
on, up to and including `stop` if a step reaches it exactly, each written as an
integer string. An interval with `start` equal to `stop` denotes one value.

## Literal

`_literal` marks its content as data. The content is any value of the data
model, a string, a list or a dictionary, and is not interpreted as Keyso:
a `_ref` or `_interval` inside a literal is data. A literal always denotes
exactly one value.

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

## Plain dictionaries are invalid

An unmarked dictionary is ambiguous: it could be data or a construct. This is
invalid:

``` { .yaml .invalid title="A plain dictionary value" }
- params: {nx: 128, ny: 128}
```

A dictionary value must have exactly one key, and that key must be `_interval`
or `_literal`; with the key `_ref`, the operand is a keyed reference. To assign
values to the paths `params.nx` and `params.ny`, use
two inline operands with dotted keys, a keyed reference to a definition with the
keys `nx` and `ny`, or a configuration operand under `set`.
