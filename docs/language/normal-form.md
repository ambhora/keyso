<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Normal form

Every definition denotes a configuration set. When that set is not empty, it can
be written as an explicit `set` of its configurations. This is the **normal
form** of the definition.

```yaml
compiler_matrix:
  - compiler: [gcc, clang]
  - optimization: [O0, O2]
  - operation: product
```

has the normal form:

```yaml
compiler_matrix:
  - {compiler: gcc, optimization: O0}
  - {compiler: gcc, optimization: O2}
  - {compiler: clang, optimization: O0}
  - {compiler: clang, optimization: O2}
  - operation: set
```

The order of the configurations carries no meaning, and each configuration
appears once.

## Value constructs

Value constructs are expanded in normal form. An interval becomes its integers,
a list its elements and a literal its content:

```yaml
cores:
  - cores: {interval: {start: 16, stop: 32, step: 8}}
  - operation: product
```

has the normal form:

```yaml
cores:
  - {cores: 16}
  - {cores: 24}
  - {cores: 32}
  - operation: set
```

## References

A normal form mentions no other definition. Flatten operands contribute their
keys directly; nested values become dictionaries.

```yaml
build:
  - compiler: [gcc, clang]
  - operation: product

flat:
  - flatten: build
  - system: [jedi, jupiter]
  - operation: product

nested:
  - build: {nested: build}
  - system: [jedi, jupiter]
  - operation: product
```

has the normal form:

```yaml
build:
  - {compiler: gcc}
  - {compiler: clang}
  - operation: set

flat:
  - {compiler: gcc, system: jedi}
  - {compiler: gcc, system: jupiter}
  - {compiler: clang, system: jedi}
  - {compiler: clang, system: jupiter}
  - operation: set

nested:
  - {build: {compiler: gcc}, system: jedi}
  - {build: {compiler: gcc}, system: jupiter}
  - {build: {compiler: clang}, system: jedi}
  - {build: {compiler: clang}, system: jupiter}
  - operation: set
```

The dictionaries under `build` are data, as every value in a configuration
operand is. The normal form of a document replaces every definition by its
normal form. Because references form no cycle, it is always well defined.

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
