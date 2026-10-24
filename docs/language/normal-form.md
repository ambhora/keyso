<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Normal form

Every definition denotes a configuration set. When that set is not empty, it can
be written as an explicit `set` of its configurations. This is the **normal
form** of the definition.

``` { .yaml .keyso title="A definition" }
compiler_matrix:
  - compiler: [gcc, clang]
  - optimization: [O0, O2]
  - _operation: product
```

has the normal form:

``` { .yaml .keyso title="Its normal form" }
compiler_matrix:
  - {compiler: gcc, optimization: O0}
  - {compiler: gcc, optimization: O2}
  - {compiler: clang, optimization: O0}
  - {compiler: clang, optimization: O2}
  - _operation: set
```

The order of the configurations carries no meaning, and each configuration
appears once.

## Writing configurations

In a normal form, every configuration is written as a configuration operand:

- paths are written nested, one dictionary level per key;
- a value that is a list, or a scalar other than null that does not begin with
  `$`, is written as it is;
- every other value, a dictionary, null or a string beginning with `$`, is
  written as `{_literal: value}`.

The `_literal` marker keeps a dictionary value apart from the nested paths it
would otherwise be read as, and a string beginning with `$` apart from a
reference. Read back as a configuration operand, the written
form gives the same configuration.

## Value constructs

Value constructs are expanded in normal form. An interval becomes its integers
and a list its elements:

``` { .yaml .keyso title="A definition with an interval" }
cores:
  - cores: {_interval: {start: 16, stop: 32, step: 8}}
  - _operation: product
```

has the normal form:

``` { .yaml .keyso title="Its normal form" }
cores:
  - {cores: 16}
  - {cores: 24}
  - {cores: 32}
  - _operation: set
```

## References

A normal form mentions no other definition. Reference operands contribute their
paths directly; references under a key contribute prefixed paths.

``` { .yaml .keyso title="Definitions with references" }
build:
  - compiler: [gcc, clang]
  - _operation: product

flat:
  - $build
  - system: [jedi, jupiter]
  - _operation: product

nested:
  - build: $build
  - system: [jedi, jupiter]
  - _operation: product
```

has the normal form:

``` { .yaml .keyso title="Their normal forms" }
build:
  - {compiler: gcc}
  - {compiler: clang}
  - _operation: set

flat:
  - {compiler: gcc, system: jedi}
  - {compiler: gcc, system: jupiter}
  - {compiler: clang, system: jedi}
  - {compiler: clang, system: jupiter}
  - _operation: set

nested:
  - {build: {compiler: gcc}, system: jedi}
  - {build: {compiler: gcc}, system: jupiter}
  - {build: {compiler: clang}, system: jedi}
  - {build: {compiler: clang}, system: jupiter}
  - _operation: set
```

The normal form of a document replaces every definition by its normal form.
Because references form no cycle, it is always well defined.

## Equivalence

Two definitions are **equivalent** when they denote the same set: the same type
and the same configurations. Two non-empty definitions are equivalent exactly
when their normal forms contain the same configurations. Normal forms are
therefore the basis for comparing documents, inspecting the configurations a
document generates, and serializing the result of the set operations.

## Empty sets

An empty set has a type but no configurations, and a `set` needs at least one
configuration to determine its type. An empty set therefore has no normal form.
An implementation that serializes normal forms represents an empty set together
with its type by other means.
