<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Operations

The `operation` item of a definition names one of five operations. Four combine
sets; `set` enumerates one.

| Operation | Operands | Type requirement |
| --- | --- | --- |
| `product` | one or more | pairwise disjoint types |
| `union` | one or more | equal types |
| `intersection` | one or more | equal types |
| `difference` | exactly two | equal types |
| `set` | one or more configurations | equal types |

Two sets with equal types are **coherent**; two sets with disjoint types are
**anticoherent**. The [algebra](../formalism/algebra.md#coherence) defines both
terms.

## Product

`product` combines anticoherent sets. Each configuration of the result joins one
configuration of every operand.

```yaml
compiler_matrix:
  - compiler: [gcc, clang]
  - optimization: [O0, O2]
  - operation: product
```

denotes:

```yaml
- {compiler: gcc, optimization: O0}
- {compiler: gcc, optimization: O2}
- {compiler: clang, optimization: O0}
- {compiler: clang, optimization: O2}
```

The type of the result is the union of the operand types. The product of a
single operand is that operand. The operand types must be pairwise disjoint,
including the keys contributed by flatten operands. This is invalid, because
both operands contain `compiler`:

```yaml
invalid:
  - compiler: [gcc, clang]
  - compiler: [gcc, intel]
  - operation: product
```

## Union

`union` combines coherent sets. The result contains every configuration of every
operand.

```yaml
compilers:
  - compiler: [gcc, clang]
  - compiler: [clang, intel]
  - operation: union
```

denotes:

```yaml
- {compiler: gcc}
- {compiler: clang}
- {compiler: intel}
```

## Intersection

`intersection` combines coherent sets. The result contains the configurations
present in every operand.

```yaml
common:
  - compiler: [gcc, clang]
  - compiler: [clang, intel]
  - operation: intersection
```

denotes:

```yaml
- {compiler: clang}
```

## Difference

`difference` takes exactly two coherent operands and removes the configurations
of the second from the first. The order of the operands is significant: the
first is the minuend and the second the subtrahend.

```yaml
remaining:
  - compiler: [gcc, clang, intel]
  - compiler: [clang]
  - operation: difference
```

denotes:

```yaml
- {compiler: gcc}
- {compiler: intel}
```

To subtract several sets, define their union and use it as the subtrahend.

## Set

`set` enumerates a configuration set explicitly. Its operands are [configuration
operands](operands.md#configuration-operand), and all of them must have the same
type.

```yaml
supported:
  - {compiler: gcc, optimization: O2}
  - {compiler: clang, optimization: O3}
  - operation: set
```

The operands are written as a list because that is the ordinary way to serialize
a collection of dictionaries. The result is a set: a configuration listed twice
is contained once.

This is invalid, because the two configurations have different types:

```yaml
mixed:
  - {compiler: gcc}
  - {compiler: clang, optimization: O2}
  - operation: set
```

## Empty sets

An operation may produce an empty set. The empty set still has a type:

```yaml
none:
  - compiler: [gcc]
  - compiler: [gcc]
  - operation: difference
```

denotes the empty set of type `{compiler}`. Its type takes part in the type
requirements of later operations like the type of any other set.
